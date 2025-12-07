// src/pages/orders/OrderDetail.tsx
import { useCallback, useEffect, useState } from 'react';
import {
  getOrder,
  updateOrderStatus,
  getOrderReceiptHtml,
  openOrderReceipt,
} from '../../api/orders';
import { updateOrder } from '../../api/orders';
import { createOrderShareLink } from '../../api/orders';
import type { OrderUpdatePayload } from '../../types/orders';
import CustomerPicker from '../../components/customers/CustomerPicker';
import ProductSearch from '../../components/pos/ProductSearch';
import ReceiptPreview from '../../components/ReceiptPreview';
import type { Order, OrderBackendStatus } from '../../types/orders';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import OrderPhotosGallery from '../../components/orders/OrderPhotosGallery';
import OrderPhotosUpload from '../../components/orders/OrderPhotosUpload';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllowedNext } from '../../utils/order-status';
import { isAxiosError } from 'axios';
import { buildWhatsAppLink } from '../../utils/wa';
import { buildReceiptMessage } from '../../utils/receipt-wa';
import { useHasRole } from '../../store/useAuth';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

// Helpers konversi datetime-local <-> ISO string
function toLocalInputValue(v?: string | null): string {
  if (!v) return '';
  const s = String(v).trim();
  // Terima "YYYY-MM-DD HH:mm[:ss]" atau "YYYY-MM-DDTHH:mm[:ss][Z]"
  if (s.includes('T')) {
    // Buang 'Z' bila ada, pangkas ke menit untuk <input type="datetime-local">
    return s.replace('Z', '').slice(0, 16);
  }
  // Spasi → 'T', pangkas ke menit
  return s.replace(' ', 'T').slice(0, 16);
}
function fromLocalInputValue(v: string): string | null {
  if (!v) return null;
  // Kirim sebagai string lokal "naif": "YYYY-MM-DD HH:mm:ss"
  const s = v.trim(); // format input selalu "YYYY-MM-DDTHH:mm"
  return s.replace('T', ' ') + ':00';
}
export default function OrderDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [row, setRow] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const canEdit = useHasRole(['Superadmin', 'Admin Cabang']);

  type DraftItem = {
    id?: string;              // jika ada
    service_id: string;
    service_name?: string;    // untuk UI
    price?: number;           // untuk hitung preview subtotal
    qty: number;
    note?: string | null;
  };
  type Draft = {
    customer_id: string | null;
    notes: string | null;
    discount?: number;
    items: DraftItem[];
    received_at?: string | null;
    ready_at?: string | null;
  };
  const [draft, setDraft] = useState<Draft>({ customer_id: null, notes: null, items: [] });

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

  useEffect(() => {
    if (!row) return;
    setDraft({
      customer_id: row.customer?.id ?? row.customer_id ?? null,
      notes: row.notes ?? null,
      received_at: row.received_at ?? null,
      ready_at: row.ready_at ?? null,
      items: (row.items ?? []).map(it => ({
        id: it.id,
        service_id: it.service_id,
        service_name: it.service?.name,
        price: Number(it.price),
        qty: Number(it.qty),
        note: it.note ?? null,
      })),
      // discount: row.discount ?? 0, // aktifkan jika rule backend sdh mendukung
    });
  }, [row]);

  const changeQty = useCallback((serviceId: string, qty: number) => {
    setDraft(d => ({ ...d, items: d.items.map(it => it.service_id === serviceId ? { ...it, qty: Math.max(1, qty) } : it) }));
  }, []);
  const changeNote = useCallback((serviceId: string, note: string) => {
    setDraft(d => ({ ...d, items: d.items.map(it => it.service_id === serviceId ? { ...it, note } : it) }));
  }, []);
  const removeItem = useCallback((serviceId: string) => {
    setDraft(d => ({ ...d, items: d.items.filter(it => it.service_id !== serviceId) }));
  }, []);
  const addItemFromSearch = useCallback((svc: { id: string; name: string; unit: string; price_effective: number }) => {
    setDraft(d => {
      const found = d.items.find(it => it.service_id === svc.id);
      if (found) {
        return {
          ...d,
          items: d.items.map(it => it.service_id === svc.id ? { ...it, qty: it.qty + 1, price: svc.price_effective } : it),
        };
      }
      return {
        ...d,
        items: [...d.items, { service_id: svc.id, service_name: svc.name, price: svc.price_effective, qty: 1, note: null }],
      };
    });
  }, []);

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

  const onSendWA = useCallback(async () => {
    if (!row) return;
    const wa =
      (row as any)?.customer?.whatsapp ||
      (row as any)?.customer?.phone ||
      '';
    if (!wa) {
      alert('Nomor WhatsApp pelanggan belum tersedia.');
      return;
    }
    try {
      const link = await createOrderShareLink(row.id);
      const shareUrl =
        typeof link === 'string' ? link : (link as any)?.share_url || (link as any)?.url || '';
      if (!shareUrl) {
        alert('Gagal menghasilkan tautan kwitansi.');
        return;
      }
      const msg = buildReceiptMessage(row as unknown as Order, shareUrl);
      const url = buildWhatsAppLink(wa, msg);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      alert('Gagal menyiapkan pesan WhatsApp.');
    }
  }, [row]);

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
              {!isEditing && canEdit && (
                <button
                  type="button"
                  className="btn-outline px-3 py-1.5 text-xs"
                  onClick={() => setIsEditing(true)}
                  title="Edit order"
                >
                  Edit
                </button>
              )}
              {isEditing && canEdit && (
                <>
                  <button
                    type="button"
                    className="btn-outline px-3 py-1.5 text-xs"
                    onClick={() => { setIsEditing(false); setFieldErr({}); /* reset draft -> useEffect(row) sudah cover */ }}
                    title="Batalkan perubahan"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn-primary px-3 py-1.5 text-xs text-[color:var(--color-brand-on)] disabled:opacity-50"
                    onClick={async () => {
                      if (!id) return;
                      setSaving(true); setFieldErr({});
                      try {
                        // Siapkan payload — kirim seluruh items (lihat catatan hapus-tulis ulang)【13:Backend_Docs.md†L41-L47】
                        const payload: OrderUpdatePayload = {
                          customer_id: draft.customer_id ?? null,
                          notes: (draft.notes ?? '') || null,
                          items: draft.items.map(it => ({
                            service_id: it.service_id,
                            qty: it.qty,
                            note: (it.note ?? '') || null,
                          })),
                          received_at: draft.received_at ?? null,
                          ready_at: draft.ready_at ?? null,
                          // discount: draft.discount ?? 0, // aktifkan bila rule backend sdh mendukung
                        };
                        await updateOrder(id, payload);
                        await refresh();
                        setIsEditing(false);
                      } catch (e: unknown) {
                        let msg = 'Gagal menyimpan';
                        if (isAxiosError<ApiErrorResponse>(e)) {
                          const api = e.response?.data;
                          msg = api?.message ?? msg;
                          // petakan error field sederhana ke state fieldErr
                          const map: Record<string, string> = {};
                          const errMap = api?.errors;
                          if (errMap) {
                            Object.entries(errMap).forEach(([k, v]) => {
                              map[k] = Array.isArray(v) ? String(v[0]) : String(v ?? '');
                            });
                            setFieldErr(map);
                          }
                        }
                        alert(msg);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving || (draft.items.length === 0)}
                    title="Simpan perubahan"
                  >
                    {saving ? 'Menyimpan…' : 'Simpan'}
                  </button>
                </>
              )}
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

              {/* Kirim WhatsApp */}
              <button
                type="button"
                className="btn-outline px-3 py-1.5 text-xs"
                onClick={onSendWA}
                title="Kirim kwitansi via WhatsApp"
              >
                Kirim WA
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

          {isEditing && (
            <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium mb-1">Pelanggan</div>
                  <CustomerPicker
                    value={draft.customer_id ?? ''}
                    onChange={(id) => setDraft(d => ({ ...d, customer_id: id || null }))}
                  />
                  {fieldErr['customer_id'] && <div className="text-[11px] text-red-600 mt-1">{fieldErr['customer_id']}</div>}
                </div>
                <div>
                  <div className="text-xs font-medium mb-1">Catatan</div>
                  <textarea
                    className="input w-full px-2 py-2 text-sm"
                    placeholder="Catatan order (opsional)"
                    value={draft.notes ?? ''}
                    onChange={(e) => setDraft(d => ({ ...d, notes: e.target.value }))}
                    disabled={!canEdit}
                  />
                  {fieldErr['notes'] && <div className="text-[11px] text-red-600 mt-1">{fieldErr['notes']}</div>}
                </div>
                <div>
                  <div className="text-xs font-medium mb-1">Tanggal Masuk</div>
                  <input
                    type="datetime-local"
                    className="input w-full px-2 py-2 text-sm"
                    value={toLocalInputValue(draft.received_at ?? null)}
                    onChange={(e) => setDraft(d => ({ ...d, received_at: fromLocalInputValue(e.target.value) }))}
                    disabled={!canEdit}
                  />
                  {fieldErr['received_at'] && <div className="text-[11px] text-red-600 mt-1">{fieldErr['received_at']}</div>}
                </div>
                <div>
                  <div className="text-xs font-medium mb-1">Tanggal Selesai</div>
                  <input
                    type="datetime-local"
                    className="input w-full px-2 py-2 text-sm"
                    value={toLocalInputValue(draft.ready_at ?? null)}
                    onChange={(e) => setDraft(d => ({ ...d, ready_at: fromLocalInputValue(e.target.value) }))}
                    disabled={!canEdit}
                  />
                  {fieldErr['ready_at'] && <div className="text-[11px] text-red-600 mt-1">{fieldErr['ready_at']}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Items table */}
          {isEditing && canEdit && (
            <>
              {/* Ringkasan tanggal masuk/selesai (read-only) */}
              <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 text-sm">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <span className="text-gray-600">Tgl Masuk</span>{' '}
                    <b>{row.received_at ? row.received_at.replace('T', ' ').slice(0, 16) : '—'}</b>
                  </div>
                  <div>
                    <span className="text-gray-600">Tgl Selesai</span>{' '}
                    <b>{row.ready_at ? row.ready_at.replace('T', ' ').slice(0, 16) : '—'}</b>
                  </div>
                </div>
              </div>
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
                          <Td>{Number(it.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Td>
                          <Td>{Number(it.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Totals read-only */}
                <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 p-3 border-t border-[color:var(--color-border)] text-sm">
                  <div><span className="text-gray-600">Subtotal</span> <b>{Number(row.subtotal).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                  <div><span className="text-gray-600">Diskon</span> <b>{Number(row.discount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                  <div><span className="text-gray-600">Grand</span> <b>{Number(row.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                  <div><span className="text-gray-600">Sisa</span> <b>{Number(row.due_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                </div>
              </div>
            </>
          )}

          {isEditing && canEdit && (
            <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
              {/* Tambah layanan */}
              <div className="p-3">
                <ProductSearch onPick={addItemFromSearch} />
                {fieldErr['items'] && <div className="text-[11px] text-red-600 mt-1">{fieldErr['items']}</div>}
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
                    <tr className="divide-x divide-[color:var(--color-border)]">
                      <Th>Layanan</Th>
                      <Th>Qty</Th>
                      <Th>Harga</Th>
                      <Th>Total</Th>
                      <Th>Aksi</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--color-border)]">
                    {draft.items.length === 0 && (
                      <tr>
                        <Td colSpan={5} >
                          <span className="text-xs text-gray-600">Belum ada item. Tambahkan layanan di atas.</span>
                        </Td>
                      </tr>
                    )}
                    {draft.items.map((it) => {
                      const harga = Number(
                        it.price ??
                        (row.items ?? []).find(r => r.service_id === it.service_id)?.price ??
                        0
                      );
                      const total = harga * Number(it.qty || 0);
                      return (
                        <tr key={it.service_id} className="hover:bg-black/5 transition-colors">
                          <Td>
                            <div className="font-medium">{it.service_name ?? it.service_id}</div>
                            <input
                              className="input mt-1 px-2 py-1 text-xs w-full"
                              placeholder="Catatan item (opsional)"
                              value={it.note ?? ''}
                              onChange={(e) => changeNote(it.service_id, e.target.value)}
                              disabled={!canEdit}

                            />
                            {fieldErr[`items.${it.service_id}.note`] && (
                              <div className="text-[11px] text-red-600 mt-1">{fieldErr[`items.${it.service_id}.note`]}</div>
                            )}
                          </Td>
                          <Td>
                            <input
                              type="number"
                              min={1}
                              className="input w-24 px-2 py-1 text-xs"
                              value={it.qty}
                              onChange={(e) => changeQty(it.service_id, Number(e.target.value || 1))}
                              disabled={!canEdit}
                            />
                          </Td>
                          <Td>{harga ? harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '—'}</Td>
                          <Td>{(total || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Td>
                          <Td>
                            <button
                              type="button"
                              className="btn-outline px-2 py-1 text-xs"
                              onClick={() => removeItem(it.service_id)}
                              title="Hapus baris"
                              disabled={!canEdit}
                            >
                              Hapus
                            </button>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Preview total lokal (informasi; total final dihitung backend) */}
              <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 p-3 border-t border-[color:var(--color-border)] text-sm">
                <div>
                  <span className="text-gray-600">Subtotal (preview)</span>{' '}
                  <b>{
                    draft.items
                      .reduce((s, it) => {
                        const harga = Number(
                          it.price ??
                          (row.items ?? []).find(r => r.service_id === it.service_id)?.price ??
                          0
                        );
                        return s + Number(it.qty || 0) * harga;
                      }, 0)
                      .toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                  }</b>
                </div>
              </div>
            </div>
          )}

          {/* Photos */}
          <OrderPhotosGallery
            key={`${row.id}:${row.photos?.length ?? 0}`}
            photos={row.photos ?? []}
          />
          {canEdit && (
            <div className="mt-3">
              <OrderPhotosUpload
                orderId={row.id}
                onUploaded={async () => { await refresh(); }}
              />
            </div>
          )}

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

type ThProps = React.ThHTMLAttributes<HTMLTableHeaderCellElement>;
function Th({ children, className, ...rest }: ThProps) {
  return (
    <th
      className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wide ${className ?? ''}`}
      {...rest}
    >
      {children}
    </th>
  );
}

type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;
function Td({ children, className, ...rest }: TdProps) {
  return (
    <td
      className={`px-3 py-2 align-middle ${className ?? ''}`}
      {...rest}
    >
      {children}
    </td>
  );
}
