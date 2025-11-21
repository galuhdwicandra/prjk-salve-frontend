// src/pages/orders/OrderDetail.tsx
import { useCallback, useEffect, useState } from 'react';
import {
  getOrder,
  updateOrderStatus,
  getOrderReceiptHtml,
  openOrderReceipt,
} from '../../api/orders';
import ReceiptPreview from '../../components/ReceiptPreview';
import type { Order, OrderBackendStatus } from '../../types/orders';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import OrderPhotosGallery from '../../components/orders/OrderPhotosGallery';
import OrderPhotosUpload from '../../components/orders/OrderPhotosUpload';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllowedNext } from '../../utils/order-status';
import { isAxiosError } from 'axios';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export default function OrderDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [row, setRow] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptHtml, setReceiptHtml] = useState<string>('');
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptErr, setReceiptErr] = useState<string | null>(null);

  const loadReceipt = useCallback(async () => {
    if (!id) return;
    setReceiptLoading(true);
    setReceiptErr(null);
    try {
      const html = await getOrderReceiptHtml(id);
      setReceiptHtml(html);
    } catch {
      setReceiptErr('Gagal memuat struk');
    } finally {
      setReceiptLoading(false);
    }
  }, [id]);

  const refresh = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await getOrder(id);
      setRow(res.data);
    } catch {
      setErr('Gagal memuat detail');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void refresh(); }, [refresh]);

  const onTransit = useCallback(async (next: OrderBackendStatus) => {
    if (!id) return;
    try {
      await updateOrderStatus(id, next);
      await refresh();
    } catch (e: unknown) {
      let msg = 'Gagal ubah status';
      if (isAxiosError<ApiErrorResponse>(e)) {
        const api = e.response?.data;
        const errMap = api?.errors;

        const nextVal = errMap?.['next'];
        let detail: string | undefined;
        if (typeof nextVal === 'string') detail = nextVal;
        else if (Array.isArray(nextVal)) detail = nextVal[0];
        else if (errMap) {
          const v = Object.values(errMap)[0];
          detail = Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
        }

        msg = api?.message ?? detail ?? msg;
      }
      alert(msg);
    }
  }, [id, refresh]);

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-gray-600">Memuat…</div>}
      {err && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {err}
        </div>
      )}
      {!loading && !row && !err && (
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-6 text-sm text-gray-500">
          Tidak ditemukan
        </div>
      )}

      {row && (
        <>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold tracking-tight">Order {row.invoice_no ?? row.number}</div>
              <div className="text-xs text-gray-600">{row.customer?.name ?? '-'}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Buka struk tab baru */}
              <button
                type="button"
                className="btn-outline px-3 py-1.5 text-xs"
                onClick={() => openOrderReceipt(row.id)}
                title="Buka struk di tab baru"
              >
                Receipt
              </button>

              {/* Toggle preview di halaman */}
              <button
                type="button"
                className="btn-outline px-3 py-1.5 text-xs"
                onClick={async () => {
                  const next = !receiptOpen;
                  setReceiptOpen(next);
                  if (next && !receiptHtml) {
                    await loadReceipt();
                  }
                }}
                title="Tampilkan/sembunyikan preview struk"
              >
                {receiptOpen ? 'Tutup Preview' : 'Preview Receipt'}
              </button>

              {/* Shortcut pelunasan bila masih ada sisa */}
              {(row.due_amount ?? 0) > 0 && (
                <button
                  type="button"
                  className="btn-primary px-3 py-1.5 text-xs text-[color:var(--color-brand-on)]"
                  onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? row.number ?? '')}`)}
                  title="Menuju halaman Piutang untuk pelunasan"
                >
                  Pelunasan
                </button>
              )}

              {/* Stepper status (komponen existing) */}
              <OrderStatusStepper backendStatus={row.status} />
            </div>
          </div>

          {/* Items table */}
          <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
                  <tr className="divide-x divide-[color:var(--color-border)]">
                    <Th>Layanan</Th>
                    <Th>Qty</Th>
                    <Th>Harga</Th>
                    <Th>Total</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)]">
                  {(row.items ?? []).map((it) => (
                    <tr key={it.id} className="hover:bg-black/5 transition-colors">
                      <Td>{it.service?.name ?? it.service_id}</Td>
                      <Td>{it.qty}</Td>
                      <Td>
                        {Number(it.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </Td>
                      <Td>
                        {Number(it.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 p-3 border-t border-[color:var(--color-border)] text-sm">
              <div>
                <span className="text-gray-600">Subtotal</span>{' '}
                <b>{Number(row.subtotal).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
              <div>
                <span className="text-gray-600">Diskon</span>{' '}
                <b>{Number(row.discount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
              <div>
                <span className="text-gray-600">Grand</span>{' '}
                <b>{Number(row.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
              <div>
                <span className="text-gray-600">Sisa</span>{' '}
                <b>{Number(row.due_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
            </div>
          </div>

          {/* Photos */}
          <OrderPhotosGallery
            key={`${row.id}:${row.photos?.length ?? 0}`}
            photos={row.photos ?? []}
          />
          <div className="mt-3">
            <OrderPhotosUpload
              orderId={row.id}
              onUploaded={async () => { await refresh(); }}
            />
          </div>

          {/* Receipt Preview */}
          {receiptOpen && (
            <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[color:var(--color-border)]">
                <div className="text-sm font-semibold">Receipt Preview</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn-outline px-3 py-1.5 text-xs disabled:opacity-50"
                    onClick={loadReceipt}
                    disabled={receiptLoading}
                    title="Muat ulang HTML struk"
                  >
                    {receiptLoading ? 'Memuat…' : 'Reload'}
                  </button>
                  <button
                    type="button"
                    className="btn-outline px-3 py-1.5 text-xs"
                    onClick={() => openOrderReceipt(row.id, true)}
                    title="Buka & print"
                  >
                    Open & Print
                  </button>
                </div>
              </div>

              {receiptErr && <div className="p-3 text-xs text-red-600">{receiptErr}</div>}
              {!receiptErr && receiptLoading && (
                <div className="p-3 text-xs text-gray-600">Memuat struk…</div>
              )}
              {!receiptErr && !receiptLoading && !receiptHtml && (
                <div className="p-3 text-xs text-gray-600">Belum ada HTML struk.</div>
              )}
              {!receiptErr && !!receiptHtml && (
                <ReceiptPreview html={receiptHtml} height="70vh" />
              )}
            </div>
          )}

          {/* Status transitions */}
          <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 flex flex-wrap gap-2">
            {getAllowedNext(row.status).map((s) => (
              <button
                key={s}
                className="btn-outline px-2 py-1 text-xs"
                onClick={() => void onTransit(s)}
                title={`Set status ke ${s}`}
              >
                Set {s}
              </button>
            ))}

            {getAllowedNext(row.status).length === 0 && (
              <span className="text-xs text-gray-600">
                Status terminal — tidak ada transisi.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------
   Sub-komponen presentasional (UI-only)
------------------------- */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-middle">{children}</td>;
}
