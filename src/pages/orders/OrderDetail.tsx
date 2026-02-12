// src/pages/orders/OrderDetail.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  getOrder,
  updateOrderStatus,
  getOrderReceiptHtml,
  openOrderReceipt,
  updateOrder,
  createOrderShareLink,
} from '../../api/orders';
import type { OrderUpdatePayload } from '../../types/orders';
import CustomerPicker from '../../components/customers/CustomerPicker';
import ProductSearch from '../../components/pos/ProductSearch';
import ReceiptPreview from '../../components/ReceiptPreview';
import type { Order, OrderBackendStatus } from '../../types/orders';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import OrderPhotosGallery from '../../components/orders/OrderPhotosGallery';
import OrderPhotosUpload from '../../components/orders/OrderPhotosUpload';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAllowedNext } from '../../utils/order-status';
import { isAxiosError } from 'axios';
import { buildWhatsAppLink } from '../../utils/wa';
import { buildReceiptMessage } from '../../utils/receipt-wa';
import { useHasRole } from '../../store/useAuth';
import { createDelivery, listDeliveries } from '../../api/deliveries';
import type { DeliveryType } from '../../types/deliveries';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

// Helpers konversi datetime-local <-> ISO string
function toLocalInputValue(v?: string | null): string {
  if (!v) return '';
  const s = String(v).trim();
  if (s.includes('T')) return s.replace('Z', '').slice(0, 16);
  return s.replace(' ', 'T').slice(0, 16);
}
function fromLocalInputValue(v: string): string | null {
  if (!v) return null;
  const s = v.trim();
  return s.replace('T', ' ') + ':00';
}

type DraftItem = {
  id?: string;
  service_id: string;
  service_name?: string;
  price?: number;
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

function money(v: unknown): string {
  const n = Number(v ?? 0);
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

function statusBadgeClass(status: OrderBackendStatus): string {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset';
  const cls =
    status === 'CANCELED'
      ? 'bg-red-50 text-red-700 ring-red-200'
      : status === 'READY'
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        : status === 'PICKED_UP'
          ? 'bg-slate-900 text-white ring-slate-900'
          : status === 'DELIVERING'
            ? 'bg-blue-50 text-blue-700 ring-blue-200'
            : status === 'WASHING' || status === 'DRYING' || status === 'IRONING'
              ? 'bg-amber-50 text-amber-700 ring-amber-200'
              : 'bg-slate-50 text-slate-700 ring-slate-200';
  return `${base} ${cls}`;
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
  const canCreateDelivery = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);

  const [draft, setDraft] = useState<Draft>({ customer_id: null, notes: null, items: [] });

  // Delivery UI
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliverySaving, setDeliverySaving] = useState(false);
  const [deliveryErr, setDeliveryErr] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryZoneId, setDeliveryZoneId] = useState<string>('');
  const [existingDeliveryId, setExistingDeliveryId] = useState<string | null>(null);

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
    const orderId = row?.id;
    if (!orderId) return;
    let alive = true;
    (async () => {
      try {
        const res = await listDeliveries({ q: orderId, per_page: 1 });
        const latest = (res.data && res.data.length > 0) ? (res.data[0] as any) : null;
        if (!alive) return;
        setExistingDeliveryId(latest?.id ?? null);
      } catch {
        if (!alive) return;
        setExistingDeliveryId(null);
      }
    })();
    return () => { alive = false; };
  }, [row?.id]);

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
    });
  }, [row]);

  const changeQty = useCallback((serviceId: string, qty: number) => {
    setDraft(d => ({
      ...d,
      items: d.items.map(it => it.service_id === serviceId ? { ...it, qty: Math.max(1, qty) } : it),
    }));
  }, []);
  const changeNote = useCallback((serviceId: string, note: string) => {
    setDraft(d => ({
      ...d,
      items: d.items.map(it => it.service_id === serviceId ? { ...it, note } : it),
    }));
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

  const previewSubtotal = row
    ? draft.items.reduce((s, it) => {
      const harga = Number(
        it.price ??
        (row.items ?? []).find(r => r.service_id === it.service_id)?.price ??
        0
      );
      return s + Number(it.qty || 0) * harga;
    }, 0)
    : 0;

  return (
    <div className="space-y-4">
      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Memuat…
        </div>
      )}

      {err && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {!loading && !row && !err && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
          <div className="text-sm font-medium text-slate-900">Tidak ditemukan</div>
          <div className="mt-1 text-sm text-slate-500">Order tidak tersedia atau sudah dihapus.</div>
          <div className="mt-4">
            <Link to="/orders" className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Kembali
            </Link>
          </div>
        </div>
      )}

      {/* Create Delivery Modal */}
      {row && deliveryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
          onClick={() => { if (!deliverySaving) setDeliveryOpen(false); }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-sm font-semibold text-slate-900">Buat Pengiriman</div>
              <div className="mt-0.5 text-xs text-slate-500">
                Order: {row.invoice_no ?? row.number}
              </div>
            </div>

            <div className="space-y-3 px-4 py-4">
              {deliveryErr && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {deliveryErr}
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-slate-600">Tipe</div>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                  disabled={deliverySaving}
                >
                  <option value="delivery">delivery</option>
                  <option value="pickup">pickup</option>
                  <option value="return">return</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold text-slate-600">Ongkir (fee)</div>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    value={Number.isFinite(deliveryFee) ? deliveryFee : 0}
                    onChange={(e) => setDeliveryFee(Number(e.target.value || 0))}
                    disabled={deliverySaving}
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600">Zone ID (opsional)</div>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                    placeholder="UUID zone (jika dipakai)"
                    value={deliveryZoneId}
                    onChange={(e) => setDeliveryZoneId(e.target.value)}
                    disabled={deliverySaving}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                onClick={() => setDeliveryOpen(false)}
                disabled={deliverySaving}
              >
                Batal
              </button>

              <button
                type="button"
                className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60"
                disabled={deliverySaving}
                onClick={async () => {
                  if (!row?.id) return;
                  setDeliverySaving(true);
                  setDeliveryErr(null);
                  try {
                    const payload: any = {
                      order_id: row.id,
                      type: deliveryType,
                      fee: Math.max(0, Number(deliveryFee || 0)),
                      zone_id: deliveryZoneId.trim() ? deliveryZoneId.trim() : null,
                    };

                    // Backend store() mengembalikan: { data: { delivery: ... }, meta: { idempotent } }
                    const res = await createDelivery(payload as any);
                    const created = (res as any)?.data?.delivery ?? (res as any)?.data ?? null;
                    const did = created?.id as string | undefined;
                    if (!did) throw new Error('Delivery tidak terbaca dari response.');

                    setExistingDeliveryId(did);
                    setDeliveryOpen(false);
                    navigate(`/deliveries/${encodeURIComponent(did)}`);
                  } catch (e: unknown) {
                    let msg = 'Gagal membuat pengiriman';
                    if (isAxiosError<ApiErrorResponse>(e)) {
                      const api = e.response?.data;
                      const errMap = api?.errors;
                      const firstKey = errMap ? Object.keys(errMap)[0] : null;
                      const firstVal = firstKey ? errMap?.[firstKey] : null;
                      const detail =
                        typeof firstVal === 'string' ? firstVal :
                          Array.isArray(firstVal) ? firstVal[0] :
                            undefined;
                      msg = api?.message ?? detail ?? msg;
                    } else if (e instanceof Error && e.message) {
                      msg = e.message;
                    }
                    setDeliveryErr(msg);
                  } finally {
                    setDeliverySaving(false);
                  }
                }}
              >
                {deliverySaving ? 'Membuat…' : 'Buat'}
              </button>
            </div>
          </div>
        </div>
      )}


      {row && (
        <>
          {/* Top header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">
                  Order {row.invoice_no ?? row.number}
                </h1>
                <span className={statusBadgeClass(row.status)}>{row.status}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Customer: <span className="font-medium text-slate-900">{row.customer?.name ?? '-'}</span>
              </div>
              <div className="mt-2">
                <OrderStatusStepper backendStatus={row.status} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {canCreateDelivery && (
                <>
                  {typeof existingDeliveryId === 'string' && existingDeliveryId.length > 0 ? (
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => navigate(`/deliveries/${encodeURIComponent(existingDeliveryId)}`)}
                      title="Lihat pengiriman yang sudah dibuat"
                    >
                      Lihat Pengiriman
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => { setDeliveryErr(null); setDeliveryOpen(true); }}
                      title="Buat pengiriman untuk order ini"
                    >
                      Buat Pengiriman
                    </button>
                  )}
                </>
              )}
              {!isEditing && canEdit && (
                <button
                  type="button"
                  className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
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
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => { setIsEditing(false); setFieldErr({}); }}
                    title="Batalkan perubahan"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60"
                    onClick={async () => {
                      if (!id) return;
                      setSaving(true); setFieldErr({});
                      try {
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
                        };
                        await updateOrder(id, payload);
                        await refresh();
                        setIsEditing(false);
                      } catch (e: unknown) {
                        let msg = 'Gagal menyimpan';
                        if (isAxiosError<ApiErrorResponse>(e)) {
                          const api = e.response?.data;
                          msg = api?.message ?? msg;
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

              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => openOrderReceipt(row.id)}
                title="Buka struk di tab baru"
              >
                Receipt
              </button>

              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={async () => {
                  setReceiptOpen(true);
                  if (!receiptHtml) await loadReceipt();
                }}
                title="Preview struk"
              >
                Preview
              </button>

              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={onSendWA}
                title="Kirim kwitansi via WhatsApp"
              >
                Kirim WA
              </button>

              {(row.due_amount ?? 0) > 0 && (
                <button
                  type="button"
                  className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                  onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? row.number ?? '')}`)}
                  title="Menuju halaman Piutang untuk pelunasan"
                >
                  Pelunasan
                </button>
              )}
            </div>
          </div>

          {/* Main layout */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left column */}
            <div className="space-y-4 lg:col-span-8">
              {/* Editing fields */}
              {isEditing && (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Edit Order</div>
                    <div className="text-xs text-slate-500">Perubahan akan disimpan setelah klik “Simpan”.</div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-600">Pelanggan</div>
                      <div className="mt-1">
                        <CustomerPicker
                          value={draft.customer_id ?? ''}
                          onChange={(cid) => setDraft(d => ({ ...d, customer_id: cid || null }))}
                        />
                      </div>
                      {fieldErr['customer_id'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['customer_id']}</div>}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600">Catatan</div>
                      <textarea
                        className="
                          mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          placeholder:text-slate-400 focus:border-slate-900 focus:outline-none
                        "
                        placeholder="Catatan order (opsional)"
                        value={draft.notes ?? ''}
                        onChange={(e) => setDraft(d => ({ ...d, notes: e.target.value }))}
                        disabled={!canEdit}
                      />
                      {fieldErr['notes'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['notes']}</div>}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600">Tanggal Masuk</div>
                      <input
                        type="datetime-local"
                        className="
                          mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          focus:border-slate-900 focus:outline-none
                        "
                        value={toLocalInputValue(draft.received_at ?? null)}
                        onChange={(e) => setDraft(d => ({ ...d, received_at: fromLocalInputValue(e.target.value) }))}
                        disabled={!canEdit}
                      />
                      {fieldErr['received_at'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['received_at']}</div>}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600">Tanggal Selesai</div>
                      <input
                        type="datetime-local"
                        className="
                          mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          focus:border-slate-900 focus:outline-none
                        "
                        value={toLocalInputValue(draft.ready_at ?? null)}
                        onChange={(e) => setDraft(d => ({ ...d, ready_at: fromLocalInputValue(e.target.value) }))}
                        disabled={!canEdit}
                      />
                      {fieldErr['ready_at'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['ready_at']}</div>}
                    </div>
                  </div>
                </section>
              )}

              {/* Items (read-only view when not editing) */}
              {!isEditing && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Items</div>
                      <div className="text-xs text-slate-500">Rincian layanan pada order ini.</div>
                    </div>
                  </div>

                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                        <tr className="border-b border-slate-200">
                          <Th>Layanan</Th>
                          <Th>Qty</Th>
                          <Th>Harga</Th>
                          <Th className="text-right">Total</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(row.items ?? []).map((it) => (
                          <tr key={it.id} className="hover:bg-slate-50/60 transition-colors">
                            <Td className="font-medium text-slate-900">{it.service?.name ?? it.service_id}</Td>
                            <Td className="text-slate-700">{it.qty}</Td>
                            <Td className="text-slate-700">{money(it.price)}</Td>
                            <Td className="text-right font-medium text-slate-900">{money(it.total)}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-slate-200 px-4 py-3">
                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <Kpi label="Subtotal" value={money(row.subtotal)} />
                      <Kpi label="Diskon" value={money(row.discount)} />
                      <Kpi label="Grand Total" value={money(row.grand_total)} strong />
                      <Kpi label="Sisa" value={money(row.due_amount)} strong />
                    </div>
                  </div>
                </section>
              )}

              {/* Items editor */}
              {isEditing && canEdit && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                  <div className="px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">Edit Items</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Tambahkan layanan, ubah qty/catatan, atau hapus item. Total final tetap dihitung backend.
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <ProductSearch onPick={addItemFromSearch} />
                    {fieldErr['items'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['items']}</div>}
                  </div>

                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                        <tr className="border-b border-slate-200">
                          <Th>Layanan</Th>
                          <Th className="w-[140px]">Qty</Th>
                          <Th>Harga</Th>
                          <Th className="text-right">Total</Th>
                          <Th className="text-right">Aksi</Th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {draft.items.length === 0 && (
                          <tr>
                            <td className="px-4 py-5 text-sm text-slate-500" colSpan={5}>
                              Belum ada item. Tambahkan layanan di atas.
                            </td>
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
                            <tr key={it.service_id} className="hover:bg-slate-50/60 transition-colors">
                              <Td className="align-top">
                                <div className="font-medium text-slate-900">{it.service_name ?? it.service_id}</div>
                                <input
                                  className="
                                    mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900
                                    placeholder:text-slate-400 focus:border-slate-900 focus:outline-none
                                  "
                                  placeholder="Catatan item (opsional)"
                                  value={it.note ?? ''}
                                  onChange={(e) => changeNote(it.service_id, e.target.value)}
                                  disabled={!canEdit}
                                />
                              </Td>

                              <Td className="align-top">
                                <input
                                  type="number"
                                  min={1}
                                  className="
                                    w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                                    focus:border-slate-900 focus:outline-none
                                  "
                                  value={it.qty}
                                  onChange={(e) => changeQty(it.service_id, Number(e.target.value || 1))}
                                  disabled={!canEdit}
                                />
                              </Td>

                              <Td className="align-top text-slate-700">{harga ? money(harga) : '—'}</Td>

                              <Td className="align-top text-right font-medium text-slate-900">{money(total)}</Td>

                              <Td className="align-top text-right">
                                <button
                                  type="button"
                                  className="
                                    inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                                    hover:bg-slate-50 disabled:opacity-60
                                  "
                                  onClick={() => removeItem(it.service_id)}
                                  title="Hapus item"
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

                  <div className="border-t border-slate-200 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
                      <div className="text-slate-600">
                        Subtotal (preview): <span className="font-semibold text-slate-900">{money(previewSubtotal)}</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Photos */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Foto Order</div>
                    <div className="text-xs text-slate-500">Dokumentasi sebelum/sesudah proses.</div>
                  </div>
                </div>

                <div className="mt-3">
                  <OrderPhotosGallery
                    key={`${row.id}:${row.photos?.length ?? 0}`}
                    photos={row.photos ?? []}
                  />
                </div>

                {canEdit && (
                  <div className="mt-4">
                    <OrderPhotosUpload
                      orderId={row.id}
                      onUploaded={async () => { await refresh(); }}
                    />
                  </div>
                )}
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-4 lg:col-span-4">
              {/* Summary */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                <div className="text-sm font-semibold text-slate-900">Ringkasan</div>

                <div className="mt-3 grid gap-2 text-sm">
                  <RowLine label="Nomor" value={row.invoice_no ?? row.number ?? '-'} />
                  <RowLine label="Customer" value={row.customer?.name ?? '-'} />
                  <RowLine label="Total" value={money(row.grand_total)} strong />
                  <RowLine label="Dibayar" value={money((row as any)?.paid_amount ?? 0)} />
                  <RowLine label="Sisa" value={money(row.due_amount)} strong />
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <RowLine label="Tanggal Masuk" value={row.received_at ? String(row.received_at).replace('T', ' ').slice(0, 16) : '—'} />
                  <RowLine label="Tanggal Selesai" value={row.ready_at ? String(row.ready_at).replace('T', ' ').slice(0, 16) : '—'} />
                </div>

                {(row.due_amount ?? 0) > 0 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? row.number ?? '')}`)}
                    >
                      Proses Pelunasan
                    </button>
                  </div>
                )}
              </section>

              {/* Status transitions */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                <div className="text-sm font-semibold text-slate-900">Ubah Status</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getAllowedNext(row.status).map((s) => (
                    <button
                      key={s}
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                      onClick={() => void onTransit(s)}
                      title={`Set status ke ${s}`}
                    >
                      Set {s}
                    </button>
                  ))}

                  {getAllowedNext(row.status).length === 0 && (
                    <span className="text-xs text-slate-500">
                      Status terminal — tidak ada transisi.
                    </span>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Receipt Preview Modal */}
          {receiptOpen && (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
              onClick={() => setReceiptOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">Receipt Preview</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                      onClick={loadReceipt}
                      disabled={receiptLoading}
                      title="Muat ulang HTML struk"
                    >
                      {receiptLoading ? 'Memuat…' : 'Reload'}
                    </button>

                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => openOrderReceipt(row.id, true)}
                      title="Buka & print"
                    >
                      Open & Print
                    </button>

                    <button
                      type="button"
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                      onClick={() => setReceiptOpen(false)}
                      title="Tutup"
                    >
                      Tutup
                    </button>
                  </div>
                </div>

                {receiptErr && (
                  <div className="px-4 py-3 text-sm text-red-700">
                    {receiptErr}
                  </div>
                )}

                {!receiptErr && receiptLoading && (
                  <div className="px-4 py-3 text-sm text-slate-600">
                    Memuat struk…
                  </div>
                )}

                {!receiptErr && !receiptLoading && !receiptHtml && (
                  <div className="px-4 py-3 text-sm text-slate-600">
                    Belum ada HTML struk.
                  </div>
                )}

                {!receiptErr && !!receiptHtml && (
                  <div className="p-4">
                    <ReceiptPreview html={receiptHtml} height="70vh" />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------
   Presentational helpers (UI-only)
------------------------- */

function Th({
  children,
  className = '',
  ...rest
}: React.ComponentProps<'th'>) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
  ...rest
}: React.ComponentProps<'td'>) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`} {...rest}>
      {children}
    </td>
  );
}

function Kpi({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-0.5 text-sm ${strong ? 'font-semibold text-slate-900' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}

function RowLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-slate-500">{label}</div>
      <div className={`text-right ${strong ? 'font-semibold text-slate-900' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}
