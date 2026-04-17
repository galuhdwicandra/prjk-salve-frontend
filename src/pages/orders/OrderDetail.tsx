// src/pages/orders/OrderDetail.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { buildWhatsAppLink } from '../../utils/wa';
import { buildReceiptMessage } from '../../utils/receipt-wa';
import { useHasRole } from '../../store/useAuth';
import { createDelivery, listDeliveries } from '../../api/deliveries';
import type { Delivery, DeliveryType } from '../../types/deliveries';
import { normalizeApiError, type FieldErrors } from '../../api/client';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

type ShareLinkResponse = {
  share_url?: string;
  url?: string;
};

type OrderWithOptionalPhone = Order & {
  customer?: (Order['customer'] & { phone?: string | null }) | null;
};

type CreateDeliveryPayloadLocal = {
  order_id: string;
  type: DeliveryType;
  fee: number;
  zone_id: string | null;
};

type CreateDeliveryResponseLocal = {
  data?: {
    delivery?: Delivery;
    id?: string;
  } | Delivery | null;
};

function toDateInputValue(v?: string | null): string {
  if (!v) return '';
  return String(v).slice(0, 10);
}

function fromDateInputValue(v: string): string | null {
  const s = v.trim();
  return s ? s : null;
}

function parseConsumerGoodsNotes(notes?: string | null): string[] {
  if (!notes || !notes.trim()) return [''];

  const rows = notes
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^\d+\.\s*/, '').trim());

  return rows.length > 0 ? rows : [''];
}

function buildConsumerGoodsNotes(rows: string[]): string | null {
  const cleaned = rows
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  if (cleaned.length === 0) return null;

  return cleaned.map((row, index) => `${index + 1}. ${row}`).join('\n');
}

function focusFirstErrorField(errors: FieldErrors) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;

  const targetIdMap: Record<string, string> = {
    next: 'order-status-select',
    status: 'order-status-select',
    order: 'order-status-select',
  };

  const targetId = targetIdMap[firstKey] ?? firstKey;
  const el = document.getElementById(targetId) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | HTMLButtonElement
    | null;

  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => el.focus?.(), 120);
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
  const [statusFieldErrors, setStatusFieldErrors] = useState<FieldErrors>({});
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const canEdit = useHasRole(['Superadmin', 'Admin Cabang']);
  const canCreateDelivery = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);

  const [draft, setDraft] = useState<Draft>({ customer_id: null, notes: null, items: [] });
  const [noteRows, setNoteRows] = useState<string[]>(['']);

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
        const latest: Delivery | null = res.data && res.data.length > 0 ? res.data[0] : null;
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

    setNoteRows(parseConsumerGoodsNotes(row.notes));
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

  const onChangeNoteRow = useCallback((index: number, value: string) => {
    setNoteRows((prev) => prev.map((row, i) => (i === index ? value : row)));
  }, []);

  const onAddNoteRow = useCallback(() => {
    setNoteRows((prev) => [...prev, '']);
  }, []);

  const onRemoveNoteRow = useCallback((index: number) => {
    setNoteRows((prev) => {
      if (prev.length === 1) return [''];
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const consumerGoodsPreview = useMemo(() => {
    return buildConsumerGoodsNotes(noteRows);
  }, [noteRows]);

  const onTransit = useCallback(async (next: OrderBackendStatus) => {
    if (!id) return;

    setStatusSubmitting(true);
    setStatusFieldErrors({});

    try {
      const res = await updateOrderStatus(id, next);
      await refresh();

      showSuccess(
        res.message?.trim() || `Status order berhasil diubah menjadi ${next}.`
      );
    } catch (e: unknown) {
      const normalized = normalizeApiError(e);
      const nextErrors = normalized.errors ?? {};

      setStatusFieldErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        focusFirstErrorField(nextErrors);
      }

      showError(normalized.message || 'Gagal ubah status');
    } finally {
      setStatusSubmitting(false);
    }
  }, [id, refresh, showSuccess, showError]);

  const onSendWA = useCallback(async () => {
    if (!row) return;
    const orderRow = row as OrderWithOptionalPhone;
    const wa =
      orderRow.customer?.whatsapp ||
      orderRow.customer?.phone ||
      '';
    if (!wa) {
      alert('Nomor WhatsApp pelanggan belum tersedia.');
      return;
    }
    try {
      const link = await createOrderShareLink(row.id);
      const sharePayload = link as ShareLinkResponse;
      const shareUrl =
        typeof link === 'string' ? link : sharePayload.share_url || sharePayload.url || '';
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
    <>
      <Toast
        show={toast.open}
        kind={toast.kind}
        message={toast.message}
        onClose={hideToast}
      />
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
                      const payload: CreateDeliveryPayloadLocal = {
                        order_id: row.id,
                        type: deliveryType,
                        fee: Math.max(0, Number(deliveryFee || 0)),
                        zone_id: deliveryZoneId.trim() ? deliveryZoneId.trim() : null,
                      };

                      // Backend store() mengembalikan: { data: { delivery: ... }, meta: { idempotent } }
                      const res = await createDelivery(payload);
                      const deliveryRes = res as CreateDeliveryResponseLocal;
                      const created =
                        deliveryRes.data && !Array.isArray(deliveryRes.data) && 'delivery' in deliveryRes.data
                          ? deliveryRes.data.delivery ?? null
                          : (deliveryRes.data as Delivery | null);

                      const did = created?.id;
                      if (!did) throw new Error('Delivery tidak terbaca dari response.');

                      setExistingDeliveryId(did);
                      setDeliveryOpen(false);
                      showSuccess('Pengiriman berhasil dibuat.');
                      navigate(`/deliveries/${encodeURIComponent(did)}`);
                    } catch (e: unknown) {
                      const normalized = normalizeApiError(e);
                      setDeliveryErr(normalized.message || 'Gagal membuat pengiriman');
                      showError(normalized.message || 'Gagal membuat pengiriman');
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
                      onClick={() => {
                        setIsEditing(false);
                        setFieldErr({});
                        setNoteRows(parseConsumerGoodsNotes(row?.notes ?? null));
                      }}
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
                            notes: buildConsumerGoodsNotes(noteRows),
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
                          showSuccess('Order berhasil diperbarui.');
                        } catch (e: unknown) {
                          const normalized = normalizeApiError(e);
                          const serverErrors = normalized.errors ?? {};

                          const mapped: Record<string, string> = {};
                          Object.entries(serverErrors).forEach(([key, value]) => {
                            mapped[key] = Array.isArray(value) ? String(value[0] ?? '') : '';
                          });

                          setFieldErr(mapped);
                          showError(normalized.message || 'Gagal menyimpan');
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

            {/* Catatan barang konsumen */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
              <div className="text-sm font-semibold text-slate-900">Catatan Barang Konsumen</div>
              <div className="mt-1 text-xs text-slate-500">
                Daftar barang atau atribut milik konsumen yang dicatat saat order dibuat.
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 whitespace-pre-line">
                {row.notes && row.notes.trim() !== '' ? row.notes : '-'}
              </div>
            </section>

            {/* Main layout */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left column */}
              <div className="space-y-4 lg:col-span-8">
                {/* Editing fields */}
                {isEditing && (
                  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">Edit Order</div>
                      <div className="text-xs text-slate-500">
                        Perubahan data order, termasuk catatan barang konsumen, akan disimpan setelah klik “Simpan”.
                      </div>
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

                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-semibold text-slate-600">
                            Catatan Barang Konsumen
                          </label>

                          <button
                            type="button"
                            onClick={onAddNoteRow}
                            disabled={!canEdit}
                            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            + Tambah Catatan
                          </button>
                        </div>

                        <div className="mt-2 space-y-2">
                          {noteRows.map((noteRow, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                                {index + 1}
                              </div>

                              <input
                                type="text"
                                value={noteRow}
                                onChange={(e) => onChangeNoteRow(index, e.target.value)}
                                placeholder={`Isi catatan barang #${index + 1}`}
                                disabled={!canEdit}
                                className="
            h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900
            placeholder:text-slate-400 focus:border-slate-900 focus:outline-none
            disabled:cursor-not-allowed disabled:bg-slate-50
          "
                              />

                              <button
                                type="button"
                                onClick={() => onRemoveNoteRow(index)}
                                disabled={!canEdit || (noteRows.length === 1 && !noteRows[0].trim())}
                                className="inline-flex h-10 shrink-0 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                title="Hapus catatan"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 text-[11px] text-slate-500">
                          Setiap catatan akan otomatis diberi nomor saat order disimpan, sama seperti di modul POS.
                        </div>

                        {fieldErr['notes'] && (
                          <div className="mt-1 text-[11px] text-red-600">{fieldErr['notes']}</div>
                        )}

                        <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Preview tersimpan
                          </div>
                          <div className="mt-1 whitespace-pre-line text-sm text-slate-700">
                            {consumerGoodsPreview ?? '-'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-600">
                          Tanggal Masuk <span className="text-red-600">*</span>
                        </div>
                        <input
                          id="received_at"
                          type="date"
                          className="
                            mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                            focus:border-slate-900 focus:outline-none
                          "
                          value={toDateInputValue(draft.received_at ?? null)}
                          onChange={(e) => setDraft(d => ({ ...d, received_at: fromDateInputValue(e.target.value) }))}
                          disabled={!canEdit}
                          required
                        />
                        {fieldErr['received_at'] && (
                          <div className="mt-1 text-[11px] text-red-600">{fieldErr['received_at']}</div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-600">
                          Tanggal Selesai <span className="text-red-600">*</span>
                        </div>
                        <input
                          id="ready_at"
                          type="date"
                          className="
      mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
      focus:border-slate-900 focus:outline-none
    "
                          value={toDateInputValue(draft.ready_at ?? null)}
                          onChange={(e) => setDraft(d => ({ ...d, ready_at: fromDateInputValue(e.target.value) }))}
                          disabled={!canEdit}
                          required
                        />
                        {fieldErr['ready_at'] && (
                          <div className="mt-1 text-[11px] text-red-600">{fieldErr['ready_at']}</div>
                        )}
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
                    <RowLine label="Dibayar" value={money(row.paid_amount ?? 0)} />
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

                  <div className="mt-2 text-xs text-slate-500">
                    Status saat ini: <span className="font-semibold text-slate-700">{row.status}</span>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start">
                    <div className="w-full sm:max-w-xs">
                      <select
                        id="order-status-select"
                        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none ${statusFieldErrors.next?.[0]
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-slate-300 focus:border-slate-500'
                          }`}
                        defaultValue=""
                        disabled={statusSubmitting}
                        aria-invalid={Boolean(statusFieldErrors.next?.[0])}
                        aria-describedby={statusFieldErrors.next?.[0] ? 'order-status-select-error' : undefined}
                        onChange={(e) => {
                          const value = e.target.value as OrderBackendStatus | '';
                          if (!value) return;

                          void onTransit(value);
                          e.currentTarget.value = '';
                        }}
                      >
                        <option value="">
                          {statusSubmitting ? 'Memproses...' : '-- Pilih status --'}
                        </option>

                        {getAllowedNext(row.status).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      {statusFieldErrors.next?.[0] && (
                        <p id="order-status-select-error" className="mt-2 text-xs text-red-600">
                          {statusFieldErrors.next[0]}
                        </p>
                      )}
                    </div>
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
    </>
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
