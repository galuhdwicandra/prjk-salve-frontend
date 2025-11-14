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

    if (loading) return <div className="p-4">Memuat struk…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    const onPrint = () => window.print();

    const onSendWA = () => {
        if (!waPhone) return;

        // Default message kalau order belum kebaca (harusnya jarang terjadi)
        let message = 'Halo, berikut struk transaksi Anda. Terima kasih 🙏';

        if (order) {
            const name = order.customer?.name ?? 'Pelanggan';
            const nomor = order.invoice_no ?? order.number;
            const total = toIDR(order.grand_total);
            const sisa = order.due_amount;

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
        <div className="p-3 space-y-3">
            <div className="flex items-center gap-2 print:hidden">
                <button className="px-3 py-2 rounded border" onClick={onPrint}>Print</button>
                <input
                    type="tel"
                    placeholder="No. WA (62…/08…)"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    className="px-3 py-2 rounded border"
                />
                <button
                    className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
                    onClick={onSendWA}
                    disabled={!waPhone}
                >
                    Kirim WhatsApp
                </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
