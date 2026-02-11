// src/pages/pos/POSPage.tsx
import { useEffect, useMemo, useState, useRef } from 'react';
import ProductSearch from '../../components/pos/ProductSearch';
import CartPanel, { type CartItem } from '../../components/pos/CartPanel';
import { createOrder, getOrder, createOrderPayment } from '../../api/orders';
import type { OrderCreatePayload } from '../../types/orders';
import type { PaymentCreatePayload, PaymentMethod } from '../../types/payments';
import type { RoleName } from '../../api/client';
import CustomerPicker from '../../components/customers/CustomerPicker';
import { createCustomer } from '../../api/customers';
import { uploadOrderPhotos } from '../../api/orderPhotos';
import { applyVoucherToOrder } from '../../api/vouchers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { toIDR } from '../../utils/money';
import { getLoyaltySummary } from '../../api/loyalty';
import type { LoyaltySummary } from '../../types/loyalty';

type HttpError = { response?: { status?: number; data?: unknown } };

function extractServerMessage(data: unknown): string | null {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as Record<string, unknown>).message;
    return typeof m === 'string' ? m : null;
  }
  return null;
}

const dlog = (...args: unknown[]) => {
  if (import.meta.env?.DEV) console.log('[POSPage]', ...args);
};

export default function POSPage() {
  const nav = useNavigate();
  const { user, hasRole } = useAuth;
  const branchId = user?.branch_id ? String(user.branch_id) : '';

  // cart & form states
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PAY_ROLES: RoleName[] = ['Superadmin', 'Admin Cabang', 'Kasir'];
  const canPay = hasRole(PAY_ROLES);

  // photos
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  // device / UI
  const isMobile = useMemo(() => /android|iphone|ipad|ipod/i.test(navigator.userAgent), []);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // payment
  type PayMode = 'PENDING' | 'DP' | 'FULL';
  const [mode, setMode] = useState<PayMode>('PENDING');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [dpAmount, setDpAmount] = useState<number>(0);

  // voucher
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  // quick add customer (POS)
  const [openCustomerCreate, setOpenCustomerCreate] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerWa, setNewCustomerWa] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Loyalty (preview stamp)
  const [loyRefreshKey, setLoyRefreshKey] = useState(0);
  const [loy, setLoy] = useState<LoyaltySummary | null>(null);
  useEffect(() => {
    if (!customerId) { setLoy(null); return; }
    getLoyaltySummary(customerId, branchId)
      .then((r: any) => {
        // fungsi API bisa mengembalikan envelope { data } atau object langsung
        const data: LoyaltySummary = 'data' in r ? r.data : r;
        setLoy(data);
      })
      .catch(() => setLoy(null));
  }, [customerId, branchId, loyRefreshKey]);

  // Tanggal masuk & selesai
  const pad = (n: number) => String(n).padStart(2, '0');
  const nowLocal = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };
  const [receivedAt, setReceivedAt] = useState<string>(() => nowLocal());
  const [readyAt, setReadyAt] = useState<string | null>(null);

  // Helper konversi untuk input[type=datetime-local]
  function toLocalInputValue(v?: string | null): string {
    if (!v) return '';
    const s = String(v).trim();
    // Terima "YYYY-MM-DD HH:mm[:ss]" atau "YYYY-MM-DDTHH:mm[:ss][Z]"
    if (s.includes('T')) return s.replace('Z', '').slice(0, 16); // "YYYY-MM-DDTHH:mm"
    return s.replace(' ', 'T').slice(0, 16);
  }
  function fromLocalInputValue(v: string): string | null {
    if (!v) return null;
    // Kembalikan sebagai "YYYY-MM-DD HH:mm:ss" (lokal-naif)
    return v.trim().replace('T', ' ') + ':00';
  }

  const normalizeWa = (input: string) => (input || '').replace(/[^\d]/g, '');

  // totals
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
  const payableNow = useMemo(() => {
    if (mode === 'PENDING') return 0;
    if (mode === 'DP') return Math.max(0, Math.min(dpAmount, total));
    return total;
  }, [mode, dpAmount, total]);
  const grand = useMemo(() => Math.max(0, subtotal - (discount || 0)), [subtotal, discount]);
  // Preview loyalti (berdasarkan stamp saat ini & subtotal saat ini)
  const loyaltyPreview = useMemo(() => {
    if (!loy || subtotal <= 0) return { reward: 'NONE' as 'NONE' | 'DISC25' | 'FREE100', discount: 0, next: 1, stamps: 0 };
    const next = loy.next;
    let disc = 0;
    if (next === 5) disc = subtotal * 0.25;
    if (next === 10) disc = subtotal;
    return { reward: next === 5 ? 'DISC25' : next === 10 ? 'FREE100' : 'NONE', discount: disc, next, stamps: loy.stamps };
  }, [loy, subtotal]);
  const predictedGrand = useMemo(
    () => Math.max(0, subtotal - (discount || 0) - (loyaltyPreview.discount || 0)),
    [subtotal, discount, loyaltyPreview.discount]
  );
  const canSubmit = useMemo(() => items.length > 0 && !!customerId && !loading, [items.length, customerId, loading]);
  const parseForCompare = (s?: string | null) => {
    if (!s) return NaN;
    const t = s.includes('T') ? s : s.replace(' ', 'T'); // jadikan ISO-like untuk parsing JS
    return Date.parse(t);
  };
  const dateErr = useMemo(() => {
    if (!readyAt) return null;
    return parseForCompare(readyAt) >= parseForCompare(receivedAt)
      ? null
      : 'Tanggal selesai harus ≥ tanggal masuk.';
  }, [receivedAt, readyAt]);

  // logs
  useEffect(() => { dlog('mount'); return () => dlog('unmount'); }, []);
  useEffect(() => { dlog('items changed', items); }, [items]);
  useEffect(() => { dlog('discount changed', discount); }, [discount]);
  useEffect(() => { dlog('notes changed', notes); }, [notes]);
  useEffect(() => { dlog('totals', { subtotal, grand }); }, [subtotal, grand]);

  // cart ops
  function addItem(svc: { id: string; name: string; unit: string; price_effective: number }) {
    dlog('addItem clicked', svc);
    setItems((prev) => {
      const found = prev.find((p) => p.service_id === svc.id);
      if (found) {
        const next = prev.map((p) => (p.service_id === svc.id ? { ...p, qty: p.qty + 1 } : p));
        dlog('increment qty', { service_id: svc.id, nextQty: found.qty + 1 });
        return next;
      }
      const next = [...prev, { service_id: svc.id, name: svc.name, unit: svc.unit, price: svc.price_effective, qty: 1 }];
      dlog('push new cart item', next[next.length - 1]);
      return next;
    });
  }
  const onChangeQty = (id: string, qty: number) => setItems((prev) => prev.map((p) => (p.service_id === id ? { ...p, qty } : p)));
  const onChangeNote = (id: string, note: string) => setItems((prev) => prev.map((p) => (p.service_id === id ? { ...p, note } : p)));
  const onRemove = (id: string) => setItems((prev) => prev.filter((p) => p.service_id !== id));

  // submit
  async function onSubmit() {
    dlog('onSubmit start');
    if (items.length === 0) return setError('Keranjang kosong');
    if (hasRole(['Kasir', 'Admin Cabang']) && !branchId) return setError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
    if (!customerId) return setError('Pelanggan wajib dipilih.');
    if (dateErr) return setError(dateErr);
    if (mode === 'DP' && (payableNow <= 0 || payableNow > total)) return setError('Nominal DP tidak valid (≤ 0 atau melebihi grand total).');
    if (mode === 'FULL' && payableNow <= 0) return setError('Nominal pembayaran harus > 0 untuk mode FULL.');

    setLoading(true); setError(null);
    try {
      // 1) create order — JANGAN kirim branch_id; backend auto pakai cabang user
      const payload: OrderCreatePayload = {
        customer_id: customerId,
        items: items.map((it) => ({ service_id: it.service_id, qty: it.qty, note: it.note ?? null })),
        discount: discount || 0,
        notes: notes || null,
        received_at: receivedAt || null,
        ready_at: readyAt || null,
      };
      dlog('createOrder payload', payload);
      const res = await createOrder(payload);
      let order = res.data!;

      // 2) apply voucher (optional)
      if (voucherCode.trim()) {
        try {
          setVoucherMsg(null);
          await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
          const refreshed = await getOrder(String(order.id)); // sync totals
          order = refreshed.data!;
          setVoucherMsg('Voucher berhasil diterapkan.');
        } catch (ex: unknown) {
          const ax = ex as HttpError;
          const msg =
            extractServerMessage(ax.response?.data) ??
            (ax.response?.status === 422
              ? 'Voucher tidak valid / syarat tidak terpenuhi'
              : ax.response?.status === 404
                ? 'Kode voucher tidak ditemukan'
                : 'Gagal menerapkan voucher');
          setVoucherMsg(msg);
        }
      }

      // 3) payment (if allowed & not pending)
      const adjustedPayNow = Math.min(payableNow, Number(order?.grand_total ?? payableNow));
      if (canPay && mode !== 'PENDING') {
        const payPayload: PaymentCreatePayload =
          mode === 'DP'
            ? { method: 'DP', amount: adjustedPayNow, paid_at: nowLocal() }
            : { method, amount: adjustedPayNow, paid_at: nowLocal() };

        dlog('createOrderPayment payload', payPayload);
        const payRes = await createOrderPayment(order.id, payPayload);
        order = payRes.order;
      }

      // 4) upload photos (best-effort)
      try {
        if (beforeFiles.length || afterFiles.length) {
          dlog('uploadOrderPhotos start', { before: beforeFiles.length, after: afterFiles.length });
          await uploadOrderPhotos(order.id, beforeFiles, afterFiles);
          dlog('uploadOrderPhotos done');
        }
      } catch (e) {
        console.warn('[POSPage] upload photos failed', e);
      }

      setLoyRefreshKey((v) => v + 1);
      alert('Transaksi tersimpan');
      nav(`/orders/${order.id}/receipt`, { replace: true });
    } catch (e: unknown) {
      dlog('createOrder error', e);
      const ax = e as HttpError;
      if (ax.response?.status === 403) {
        const msg = extractServerMessage(ax.response.data) ?? 'Forbidden: Anda tidak diizinkan melakukan pembayaran untuk order ini.';
        setError(msg);
      } else if (ax.response?.status === 422) {
        const data = ax.response.data as { message?: string; errors?: Record<string, string[]> } | undefined;
        console.error('[POSPage] 422 detail:', data?.errors);
        setError(data?.message ?? 'Validasi gagal (422)');
      } else {
        setError((e as Error)?.message ?? 'Gagal menyimpan transaksi');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_minmax(420px,480px)]">
      {/* LEFT: katalog & pencarian */}
      <section className="space-y-3">
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold">Cari Layanan</h1>
            <span className="text-[10px] text-gray-500">Ctrl+K · Enter tambah · Del hapus</span>
          </div>
          <div className="mt-2">
            <ProductSearch onPick={addItem} />
          </div>
        </div>

        {/* Order Photos */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-3">
          <div className="text-sm font-semibold">Foto Pesanan</div>
          <div className="grid gap-3 md:grid-cols-2">
            {/* BEFORE */}
            <UploadBox
              title="Before"
              isMobile={isMobile}
              inputRef={beforeRef}
              files={beforeFiles}
              onFiles={(f) => setBeforeFiles((prev) => [...prev, ...f])}
            />
            {/* AFTER */}
            <UploadBox
              title="After"
              isMobile={isMobile}
              inputRef={afterRef}
              files={afterFiles}
              onFiles={(f) => setAfterFiles((prev) => [...prev, ...f])}
            />
          </div>
        </div>

        {/* Form ringkas (pelanggan, voucher, diskon, catatan) */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-3">
          <div className="grid gap-1">
            <label className="text-xs">
              Pelanggan <span className="text-red-600">*</span>
            </label>
            <div className="flex items-start gap-2">
              <div className="grow">
                <CustomerPicker
                  value={customerId}
                  onChange={setCustomerId}
                  placeholder="Ketik nama/WA/alamat pelanggan…"
                  requiredText="Pelanggan wajib dipilih dari data terdaftar."
                />
              </div>
              <button
                type="button"
                className="btn-primary whitespace-nowrap"
                onClick={() => {
                  setCustomerError(null);
                  setOpenCustomerCreate(true);
                }}
              >
                + Customer
              </button>
            </div>
          </div>

          {/* Tanggal Masuk & Selesai */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1">
              <label className="text-xs">Tanggal Masuk</label>
              <input
                type="datetime-local"
                className="input px-3 py-2"
                value={toLocalInputValue(receivedAt)}
                onChange={(e) => setReceivedAt(fromLocalInputValue(e.target.value) || nowLocal())}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs">Tanggal Selesai (opsional)</label>
              <input
                type="datetime-local"
                className="input px-3 py-2"
                value={toLocalInputValue(readyAt)}
                onChange={(e) => setReadyAt(fromLocalInputValue(e.target.value))}
              />
              {dateErr && <div className="text-[11px] text-red-600 mt-1">{dateErr}</div>}
            </div>
          </div>

          <div className="grid gap-1">
            <label className="text-xs">Kode Voucher</label>
            <div className="flex gap-2">
              <input
                className="input px-3 py-2 flex-1"
                placeholder="MASUKKAN-KODE"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              />
              <span className="self-center text-[10px] text-gray-500">Voucher diterapkan saat “Simpan & Cetak”</span>
            </div>
            {voucherMsg && <div className="text-xs text-gray-600">{voucherMsg}</div>}
          </div>

          <div className="grid gap-1">
            <label className="text-xs">Diskon</label>
            <input
              type="number"
              min={0}
              className="input px-3 py-2"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs">Catatan</label>
            <textarea
              className="input px-3 py-2 min-h-[84px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        {openCustomerCreate && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3"
            role="dialog"
            aria-modal="true"
            onClick={() => { if (!savingCustomer) setOpenCustomerCreate(false); }}
          >
            <div
              className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <div className="text-base font-semibold">Tambah Customer</div>
                  <div className="text-xs text-gray-500">Tanpa keluar dari POS</div>
                </div>
                <button
                  type="button"
                  className="btn-outline px-2 py-1"
                  disabled={savingCustomer}
                  onClick={() => setOpenCustomerCreate(false)}
                >
                  Tutup
                </button>
              </div>

              {customerError && (
                <div className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2 mb-3">
                  {customerError}
                </div>
              )}

              <div className="space-y-2">
                <div className="grid gap-1">
                  <label className="text-xs">Nama <span className="text-red-600">*</span></label>
                  <input
                    className="input px-3 py-2 w-full"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Nama pelanggan"
                    disabled={savingCustomer}
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-xs">WhatsApp <span className="text-red-600">*</span></label>
                  <input
                    className="input px-3 py-2 w-full"
                    value={newCustomerWa}
                    onChange={(e) => setNewCustomerWa(e.target.value)}
                    placeholder="08123456789"
                    inputMode="numeric"
                    disabled={savingCustomer}
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-xs">Alamat (opsional)</label>
                  <textarea
                    className="input px-3 py-2 w-full min-h-[84px]"
                    value={newCustomerAddress}
                    onChange={(e) => setNewCustomerAddress(e.target.value)}
                    placeholder="Alamat pelanggan"
                    disabled={savingCustomer}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn-outline"
                  disabled={savingCustomer}
                  onClick={() => setOpenCustomerCreate(false)}
                >
                  Batal
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  disabled={savingCustomer}
                  onClick={async () => {
                    if (!newCustomerName.trim() || !newCustomerWa.trim()) {
                      setCustomerError('Nama dan WhatsApp wajib diisi.');
                      return;
                    }
                    if (hasRole(['Kasir', 'Admin Cabang']) && !branchId) {
                      setCustomerError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
                      return;
                    }

                    try {
                      setSavingCustomer(true);
                      setCustomerError(null);

                      const res = await createCustomer({
                        name: newCustomerName.trim(),
                        whatsapp: normalizeWa(newCustomerWa),
                        address: newCustomerAddress.trim() ? newCustomerAddress.trim() : null,
                        notes: null,
                      });

                      // auto pilih customer baru
                      const created = (res as any)?.data?.data ?? (res as any)?.data ?? null;
                      if (!created || !created.id) {
                        setCustomerError('Gagal: server tidak mengembalikan data customer (id kosong).');
                        return;
                      }
                      setCustomerId(String(created.id));

                      // reset form
                      setNewCustomerName('');
                      setNewCustomerWa('');
                      setNewCustomerAddress('');

                      setOpenCustomerCreate(false);
                    } catch (err: any) {
                      setCustomerError(
                        err?.response?.data?.message || 'Gagal menambahkan customer.'
                      );
                    } finally {
                      setSavingCustomer(false);
                    }
                  }}
                >
                  {savingCustomer ? 'Menyimpan…' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* RIGHT: cart & pembayaran */}
      <aside className="md:sticky md:top-4 md:h-[calc(100dvh-2rem)] md:overflow-auto space-y-3">
        {/* Info cabang */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3">
          <div className="text-xs text-gray-600">Cabang</div>
          <div className="text-sm font-semibold">{branchId || '-'}</div>
        </div>

        {/* Stamp Loyalty (preview) */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Stamp Loyalty</div>
            <div className="text-[11px] text-gray-600">
              {loy ? `Stamp ${loy.stamps}/10 · Next ${loy.next}` : '-'}
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1" aria-label="Loyalty stamps">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded ${loy && i < loy.stamps ? 'bg-black/70' : 'bg-black/10'}`}
                title={`Stamp ${i + 1}`}
              />
            ))}
          </div>
          <div className="text-[11px] text-gray-700">
            {loyaltyPreview.reward === 'DISC25' && 'Transaksi berikutnya mendapat diskon 25%.'}
            {loyaltyPreview.reward === 'FREE100' && 'Transaksi berikutnya GRATIS (100%).'}
            {loyaltyPreview.reward === 'NONE' && 'Belum ada benefit pada transaksi berikutnya.'}
          </div>
        </div>

        {/* Desktop cart */}
        <div className="hidden md:block">
          <CartPanel items={items} onChangeQty={onChangeQty} onChangeNote={onChangeNote} onRemove={onRemove} />
        </div>

        {/* Mobile bottom bar summary */}
        <MobileCartBar
          open={mobileCartOpen}
          setOpen={setMobileCartOpen}
          itemsCount={items.reduce((n, it) => n + it.qty, 0)}
          total={grand}
        >
          {/* Cart content inside bottom sheet */}
          <CartPanel items={items} onChangeQty={onChangeQty} onChangeNote={onChangeNote} onRemove={onRemove} />
        </MobileCartBar>

        {/* Payment & actions */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Grand Total</span>
            <span className="font-semibold">{toIDR(grand)}</span>
          </div>

          {!!(loyaltyPreview.discount > 0) && (
            <div className="flex justify-between text-[12px] text-gray-700">
              <span>Perkiraan setelah loyalti</span>
              <span className="font-medium">{toIDR(predictedGrand)}</span>
            </div>
          )}

          {/* Mode Pembayaran */}
          <div className="space-y-2">
            <div className="text-xs font-medium">Mode Pembayaran</div>
            <div className="inline-flex rounded-lg border border-[color:var(--color-border)] overflow-hidden">
              {(['PENDING', 'DP', 'FULL'] as const).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 text-sm transition-colors ${active
                      ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)]'
                      : 'bg-white text-[color:var(--color-text-default)] hover:bg-black/5'
                      }`}
                    aria-pressed={active}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            {mode === 'FULL' && (
              <div>
                <div className="text-xs font-medium mb-1">Metode</div>
                <div className="flex flex-wrap gap-2">
                  {(['CASH', 'QRIS', 'TRANSFER'] as PaymentMethod[]).map((pm) => {
                    const active = method === pm;
                    return (
                      <button
                        key={pm}
                        onClick={() => setMethod(pm)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${active
                          ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)]'
                          : 'bg-white hover:bg-black/5'
                          }`}
                        aria-pressed={active}
                      >
                        {pm}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === 'DP' && (
              <div>
                <div className="text-xs font-medium mb-1">Nominal DP</div>
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={dpAmount}
                  onChange={(e) => setDpAmount(Number(e.target.value) || 0)}
                  className="input px-3 py-2 w-full"
                  placeholder="Masukkan nominal DP"
                />
                <div className="text-xs mt-1">
                  Dibayar sekarang: <b>{toIDR(payableNow)}</b>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              disabled={loading || !canSubmit}
              className="btn-primary disabled:opacity-60"
              onClick={() => void onSubmit()}
            >
              {loading ? 'Menyimpan…' : 'Simpan & Cetak'}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                dlog('cancel/back clicked');
                history.back();
              }}
            >
              Batal
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------
   Subcomponents (UI)
------------------------ */

function UploadBox({
  title,
  isMobile,
  inputRef,
  files,
  onFiles,
}: {
  title: string;
  isMobile: boolean;
  inputRef:
  | React.RefObject<HTMLInputElement>
  | React.MutableRefObject<HTMLInputElement | null>;
  files: File[];
  onFiles: (f: File[]) => void;
}) {
  return (
    <div className="border border-[color:var(--color-border)] rounded-lg p-3">
      <div className="text-xs font-medium mb-2">{title}</div>
      <div
        className="border border-dashed border-[color:var(--color-border)] rounded-lg p-4 text-center text-xs bg-white/70"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onFiles(dropped);
        }}
      >
        {isMobile ? (
          <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()}>
            Buka Kamera
          </button>
        ) : (
          <>
            <div className="mb-2 text-gray-600">Drop file ke sini atau</div>
            <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()}>
              Pilih File
            </button>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={isMobile ? 'environment' : undefined}
        multiple
        className="hidden"
        onChange={(e) => {
          const list = e.target.files ? Array.from(e.target.files) : [];
          onFiles(list);
        }}
      />
      {files.length > 0 && (
        <ul className="mt-2 text-xs list-disc pl-5">
          {files.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MobileCartBar({
  open,
  setOpen,
  itemsCount,
  total,
  children,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  itemsCount: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* sticky bottom bar on mobile */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-[1200px] px-3 pb-[env(safe-area-inset-bottom)]">
          <div className="rounded-t-xl border border-[color:var(--color-border)] bg-[var(--color-surface)] shadow-elev-2 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <div className="font-medium">{itemsCount} item</div>
                <div className="text-gray-600">Total {toIDR(total)}</div>
              </div>
              <button className="btn-primary" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-cart-sheet">
                Buka Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* bottom sheet */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-cart-title"
          onClick={() => setOpen(false)}
        >
          <div
            id="mobile-cart-sheet"
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-[var(--color-surface)] shadow-elev-2 border border-[color:var(--color-border)] p-3 max-h-[80dvh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[color:var(--color-border)]">
              <div id="mobile-cart-title" className="text-sm font-semibold">
                Keranjang
              </div>
              <button className="btn-outline px-2 py-1" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <div className="pt-2">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
