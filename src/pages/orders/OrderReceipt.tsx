// src/pages/orders/OrderReceipt.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderReceiptHtml, getOrder } from '../../api/orders';
import { buildWhatsAppLink } from '../../utils/wa';
import type { Order } from '../../types/orders';
import { toIDR } from '../../utils/money';

export default function OrderReceipt(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const h = await getOrderReceiptHtml(id);
        setHtml(h);

        try {
          const orderRes = await getOrder(id);
          const ord = orderRes?.data ?? null;
          if (ord) {
            setOrder(ord);
            const wa = ord.customer?.whatsapp ?? '';
            if (wa) setWaPhone(wa);
          }
        } catch {
          // Biarkan tetap jalan meski gagal ambil order (struk tetap tampil)
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Gagal memuat struk');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
          <div className="h-4 w-40 rounded bg-black/10 animate-pulse mb-3" />
          <div className="h-3 w-full rounded bg-black/10 animate-pulse mb-2" />
          <div className="h-3 w-5/6 rounded bg-black/10 animate-pulse mb-2" />
          <div className="h-3 w-4/6 rounded bg-black/10 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      </div>
    );
  }

  const onPrint = () => {
    const prev = document.title;
    const nomor = order?.invoice_no ?? order?.number ?? 'Receipt';
    document.title = `Receipt ${nomor}`;
    window.print();
    document.title = prev;
  };

  const onSendWA = () => {
    if (!waPhone) return;

    // Default message kalau order belum kebaca (harusnya jarang terjadi)
    let message = 'Halo, berikut struk transaksi Anda. Terima kasih 🙏';

    if (order) {
      const name = order.customer?.name ?? 'Pelanggan';
      const nomor = order.invoice_no ?? order.number;
      const total = toIDR(order.grand_total);
      const sisa = Number(order.due_amount ?? 0);

      if (sisa > 0) {
        // MODE TAGIHAN / JATUH TEMPO
        message = [
          `Halo ${name},`,
          `Ini tagihan laundry Anda dengan nomor ${nomor}.`,
          `Total: ${total}.`,
          `Sisa tagihan: ${toIDR(sisa)}.`,
          `Mohon melakukan pelunasan sebelum jatuh tempo. Terima kasih 🙏`,
        ].join('\n');
      } else {
        // MODE KUITANSI (SUDAH LUNAS)
        message = [
          `Halo ${name},`,
          `Ini kuitansi pelunasan transaksi laundry Anda dengan nomor ${nomor}.`,
          `Total dibayar: ${total}.`,
          `Terima kasih telah menggunakan layanan kami 🙏`,
        ].join('\n');
      }
    }

    const url = buildWhatsAppLink(waPhone, message);
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-3">
      {/* Toolbar (print hidden) */}
      <div className="print:hidden sticky top-0 z-10">
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-3 bg-[var(--color-surface)]">
          <div className="flex flex-col md:flex-row md:items-end gap-2">
            <div className="flex gap-2">
              <button
                className="btn-outline px-3 py-2"
                onClick={onPrint}
                aria-label="Cetak struk"
                title="Cetak struk"
              >
                Print
              </button>
            </div>

            <div className="flex-1 md:ml-2">
              <label className="grid gap-1 text-sm">
                <span className="text-[color:var(--color-text-default)]">Nomor WhatsApp</span>
                <input
                  type="tel"
                  placeholder="No. WA (62…/08…)"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  className="input px-3 py-2"
                  aria-label="Nomor WhatsApp"
                />
              </label>
            </div>

            <div className="flex gap-2 md:ml-auto">
              <button
                className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
                onClick={onSendWA}
                disabled={!waPhone}
                aria-label="Kirim struk via WhatsApp"
                title="Kirim WhatsApp"
              >
                Kirim WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info ringkas sebelum preview (membantu kasir) */}
      {order && (
        <div className="print:hidden text-xs text-gray-700">
          <b>No:</b> {order.invoice_no ?? order.number}{' '}
          &middot; <b>Customer:</b> {order.customer?.name ?? '-'}
        </div>
      )}

      {/* Preview struk */}
      <div
        className="bg-white rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 print:shadow-none print:border-0 print:p-0"
        role="document"
        aria-label="Pratinjau struk"
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
