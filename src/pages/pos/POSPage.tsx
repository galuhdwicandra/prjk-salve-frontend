// src/pages/pos/POSPage.tsx
import React, { useEffect, useMemo, useState, useRef, useSyncExternalStore } from 'react';
import ProductSearch from '../../components/pos/ProductSearch';
import CartPanel, { type CartItem } from '../../components/pos/CartPanel';
import { createOrder, getOrder, createOrderPayment } from '../../api/orders';
import type { OrderCreatePayload } from '../../types/orders';
import type { PaymentCreatePayload, PaymentMethod } from '../../types/payments';
import {
  normalizeApiError,
  type FieldErrors,
  type RoleName,
  type MeUser,
  type ApiEnvelope,
} from '../../api/client';
import CustomerPicker from '../../components/customers/CustomerPicker';
import { createCustomer } from '../../api/customers';
import type { Customer, SingleResponse as CustomerSingleResponse } from '../../types/customers';
import { uploadOrderPhotos } from '../../api/orderPhotos';
import { applyVoucherToOrder } from '../../api/vouchers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { toIDR } from '../../utils/money';
import { getLoyaltySummary } from '../../api/loyalty';
import type { LoyaltySummary } from '../../types/loyalty';
import { getBranch } from '../../api/branches';
import type { Branch } from '../../types/branches';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

type PosFieldKey =
  | 'branch_id'
  | 'customer_id'
  | 'items'
  | 'discount'
  | 'received_at'
  | 'ready_at'
  | 'voucher_code'
  | 'payment'
  | 'dp_amount';

function getUserBranchId(user: MeUser | null): string {
  if (!user) return '';
  if (user.branch_id != null) return String(user.branch_id);
  if (user.branch?.id != null) return String(user.branch.id);
  return '';
}

function getUserBranchCode(user: MeUser | null): string | null {
  if (!user) return null;
  return user.branch?.code ?? null;
}

const CUSTOMER_TAG_OPTIONS = [
  "VIP",
  "Langganan",
  "Corporate",
  "Member",
  "Prioritas",
  "Outlet",
  "Komplain",
  "Blacklist",
] as const;

const TAG_STYLES: Record<string, string> = {
  VIP: "border-amber-200 bg-amber-50 text-amber-700",
  Langganan: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Corporate: "border-blue-200 bg-blue-50 text-blue-700",
  Member: "border-violet-200 bg-violet-50 text-violet-700",
  Prioritas: "border-rose-200 bg-rose-50 text-rose-700",
  Outlet: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Komplain: "border-orange-200 bg-orange-50 text-orange-700",
  Blacklist: "border-red-200 bg-red-50 text-red-700",
};

function customerTagClass(tag: string): string {
  return TAG_STYLES[tag] ?? "border-slate-200 bg-slate-50 text-slate-700";
}

function focusFirstErrorField(errors: FieldErrors) {
  const firstKey = Object.keys(errors)[0] as PosFieldKey | undefined;
  if (!firstKey) return;

  const idMap: Record<PosFieldKey, string> = {
    branch_id: 'branch_id',
    customer_id: 'customer_id',
    items: 'product-search',
    discount: 'discount',
    received_at: 'received_at',
    ready_at: 'ready_at',
    voucher_code: 'voucher_code',
    payment: 'payment_mode',
    dp_amount: 'dp_amount',
  };

  const targetId = idMap[firstKey];
  const el = document.getElementById(targetId) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLButtonElement
    | HTMLDivElement
    | null;

  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => {
    if ('focus' in el) el.focus();
  }, 150);
}

const dlog = (...args: unknown[]) => {
  if (import.meta.env?.DEV) console.log('[POSPage]', ...args);
};

/* ------------------------
   Small UI helpers
------------------------ */

function Card({
  title,
  subtitle,
  right,
  children,
  className = '',
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        'rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-35px_rgba(0,0,0,.35)]',
        className,
      ].join(' ')}
    >
      {(title || subtitle || right) && (
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            {title && <div className="text-sm font-semibold text-slate-900">{title}</div>}
            {subtitle && <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'brand';
}) {
  const cls =
    tone === 'good'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : tone === 'warn'
        ? 'bg-amber-50 text-amber-700 ring-amber-100'
        : tone === 'bad'
          ? 'bg-red-50 text-red-700 ring-red-100'
          : tone === 'brand'
            ? 'bg-slate-900 text-white ring-slate-900/10'
            : 'bg-slate-50 text-slate-700 ring-slate-100';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${cls}`}>
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white',
        'hover:bg-slate-800 active:bg-slate-950',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function OutlineButton({
  children,
  disabled,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900',
        'hover:bg-slate-50 active:bg-slate-100',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900',
        'placeholder:text-slate-400',
        'focus:border-slate-900 focus:outline-none',
        'disabled:opacity-70',
        className,
      ].join(' ')}
    />
  );
}

function Textarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900',
        'placeholder:text-slate-400',
        'focus:border-slate-900 focus:outline-none',
        'disabled:opacity-70',
        className,
      ].join(' ')}
    />
  );
}

export default function POSPage() {
  const nav = useNavigate();
  const user = useSyncExternalStore(
    useAuth.subscribe,
    () => useAuth.user as MeUser | null,
    () => useAuth.user as MeUser | null
  );

  const branchId = getUserBranchId(user);

  useEffect(() => {
    if (import.meta.env?.DEV) console.log('[POSPage] user:', user, 'branchId:', branchId);
  }, [user, branchId]);

  const [branchCode, setBranchCode] = useState<string | null>(null);
  const branchCodeFromUser = getUserBranchCode(user);

  // cart & form states
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { toast, showSuccess, showError, hideToast } = useToast();

  const PAY_ROLES: RoleName[] = ['Superadmin', 'Admin Cabang', 'Kasir'];

  const canPay = useAuth.hasRole(PAY_ROLES);

  // photos
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles] = useState<File[]>([]);
  const beforeRef = useRef<HTMLInputElement>(null);

  // device / UI
  const isMobile = useMemo(() => /android|iphone|ipad|ipod/i.test(navigator.userAgent), []);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // payment
  type PayMode = 'PENDING' | 'DP' | 'FULL';
  const [mode, setMode] = useState<PayMode>('PENDING');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [dpAmount, setDpAmount] = useState<number>(0);
  const [modePickerOpen, setModePickerOpen] = useState(false);

  // voucher
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  // branch name (display)
  useEffect(() => {
    if (!branchId) {
      setBranchCode(null);
      return;
    }

    // isi dulu dari payload user jika ada (lebih cepat & tidak tergantung permission getBranch)
    setBranchCode(branchCodeFromUser);

    let alive = true;
    (async () => {
      try {
        const res = await getBranch(branchId);
        const branch: Branch | null = res.data ?? null;
        const code = branch?.code ?? null;
        if (alive) setBranchCode(code ?? branchCodeFromUser ?? null);
      } catch {
        if (alive) setBranchCode(branchCodeFromUser ?? null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [branchId, branchCodeFromUser]);

  // quick add customer (POS)
  const [openCustomerCreate, setOpenCustomerCreate] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerWa, setNewCustomerWa] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerTags, setNewCustomerTags] = useState<string[]>([]);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Loyalty (preview stamp)
  const [loyRefreshKey, setLoyRefreshKey] = useState(0);
  const [loy, setLoy] = useState<LoyaltySummary | null>(null);
  useEffect(() => {
    if (!customerId) {
      setLoy(null);
      return;
    }

    getLoyaltySummary(customerId, branchId)
      .then((res: ApiEnvelope<LoyaltySummary, null>) => {
        setLoy(res.data);
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

  function toLocalInputValue(v?: string | null): string {
    if (!v) return '';
    const s = String(v).trim();
    if (s.includes('T')) return s.replace('Z', '').slice(0, 16);
    return s.replace(' ', 'T').slice(0, 16);
  }
  function fromLocalInputValue(v: string): string | null {
    if (!v) return null;
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
    const t = s.includes('T') ? s : s.replace(' ', 'T');
    return Date.parse(t);
  };
  const dateErr = useMemo(() => {
    if (!readyAt) return null;
    return parseForCompare(readyAt) >= parseForCompare(receivedAt) ? null : 'Tanggal selesai harus ≥ tanggal masuk.';
  }, [receivedAt, readyAt]);

  // logs
  useEffect(() => {
    dlog('mount');
    return () => dlog('unmount');
  }, []);
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

  function validatePosForm(): FieldErrors {
    const errors: FieldErrors = {};

    if (items.length === 0) {
      errors.items = ['Keranjang kosong. Tambahkan minimal satu layanan.'];
    }

    if (useAuth.hasRole(['Kasir', 'Admin Cabang']) && !branchId) {
      errors.branch_id = ['Akun Anda belum terikat ke cabang.'];
    }

    if (!customerId) {
      errors.customer_id = ['Pelanggan wajib dipilih.'];
    }

    if (dateErr) {
      errors.ready_at = [dateErr];
    }

    if (mode === 'DP' && (payableNow <= 0 || payableNow > total)) {
      errors.dp_amount = ['Nominal DP tidak valid.'];
    }

    if (mode === 'FULL' && payableNow <= 0) {
      errors.payment = ['Nominal pembayaran harus lebih dari 0 untuk mode FULL.'];
    }

    return errors;
  }

  // submit (LOGIC UNCHANGED)
  async function onSubmit() {
    dlog('onSubmit start');

    setFieldErrors({});
    setError(null);

    const clientErrors = validatePosForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setError('Masih ada data POS yang belum benar. Silakan periksa kembali.');
      showError('Masih ada data POS yang belum benar. Silakan periksa kembali.');
      focusFirstErrorField(clientErrors);
      return;
    }

    setLoading(true);
    try {
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

      if (voucherCode.trim()) {
        try {
          setVoucherMsg(null);
          await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
          const refreshed = await getOrder(String(order.id));
          order = refreshed.data!;
          setVoucherMsg('Voucher berhasil diterapkan.');
        } catch (ex: unknown) {
          const e = normalizeApiError(ex);
          const voucherErrors = e.errors ?? {};

          setVoucherMsg(e.message || 'Gagal menerapkan voucher');

          if (Object.keys(voucherErrors).length > 0) {
            setFieldErrors((prev) => ({ ...prev, ...voucherErrors }));
          } else {
            setFieldErrors((prev) => ({
              ...prev,
              voucher_code: [e.message || 'Gagal menerapkan voucher'],
            }));
          }
        }
      }

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
      showSuccess('Transaksi berhasil disimpan.');
      window.setTimeout(() => {
        nav(`/orders/${order.id}/receipt`, { replace: true });
      }, 400);
    } catch (err: unknown) {
      dlog('createOrder error', err);

      const e = normalizeApiError(err);
      const serverErrors = e.errors ?? {};

      setFieldErrors(serverErrors);
      setError(e.message || 'Gagal menyimpan transaksi');
      showError(e.message || 'Gagal menyimpan transaksi');

      if (Object.keys(serverErrors).length > 0) {
        focusFirstErrorField(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  }

  const itemsCount = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);

  return (
    <>
      <Toast
        show={toast.open}
        kind={toast.kind}
        message={toast.message}
        onClose={hideToast}
      />
      <div className="min-h-dvh bg-slate-100 text-slate-900">
        <div className="mx-auto max-w-[1280px] px-3 py-4 sm:px-6 sm:py-6">
          {/* Header */}
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold">Point of Sale</h1>
                <Badge tone={branchId ? 'brand' : 'warn'}>
                  {branchId
                    ? `Cabang: ${branchCode ?? branchCodeFromUser ?? `#${branchId}`}`
                    : 'Cabang belum terikat'}
                </Badge>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Alur cepat: pilih customer → cari layanan → set pembayaran → simpan & cetak.
              </div>
              {fieldErrors.branch_id?.[0] && (
                <div className="mt-1 text-xs text-red-600">
                  {fieldErrors.branch_id[0]}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <OutlineButton
                onClick={() => {
                  dlog('cancel/back clicked');
                  history.back();
                }}
              >
                Kembali
              </OutlineButton>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid gap-4 lg:grid-cols-[1fr_440px]">
            {/* LEFT */}
            <section className="space-y-4">
              {/* 1) DETAIL ORDER (dipindah ke atas) */}
              <Card
                title="Detail Order"
                subtitle="Customer wajib dipilih. Voucher diterapkan saat simpan."
                right={
                  <PrimaryButton
                    onClick={() => {
                      setCustomerError(null);
                      setOpenCustomerCreate(true);
                    }}
                  >
                    + Customer
                  </PrimaryButton>
                }
              >
                <div className="space-y-4">
                  {/* Customer */}
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">
                      Pelanggan <span className="text-red-600">*</span>
                    </label>
                    <div id="customer_id">
                      <CustomerPicker
                        value={customerId}
                        onChange={setCustomerId}
                        placeholder="Ketik nama/WA/alamat pelanggan…"
                        requiredText="Pelanggan wajib dipilih dari data terdaftar."
                      />
                    </div>
                    {fieldErrors.customer_id?.[0] && (
                      <div className="text-xs text-red-600 mt-1">
                        {fieldErrors.customer_id[0]}
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                      <label className="text-xs font-medium text-slate-700">Tanggal Masuk</label>
                      <Input
                        id="received_at"
                        type="datetime-local"
                        value={toLocalInputValue(receivedAt)}
                        onChange={(e) => setReceivedAt(fromLocalInputValue(e.target.value) || nowLocal())}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs font-medium text-slate-700">Tanggal Selesai (opsional)</label>
                      <Input
                        id="ready_at"
                        type="datetime-local"
                        value={toLocalInputValue(readyAt)}
                        onChange={(e) => setReadyAt(fromLocalInputValue(e.target.value))}
                      />
                      {dateErr && <div className="text-[11px] text-red-600">{dateErr}</div>}
                      {fieldErrors.ready_at?.[0] && !dateErr && (
                        <div className="text-[11px] text-red-600">{fieldErrors.ready_at[0]}</div>
                      )}
                    </div>
                  </div>

                  {/* Voucher */}
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">Kode Voucher</label>
                    <Input
                      id="voucher_code"
                      placeholder="MASUKKAN-KODE"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    />
                    <div className="text-[11px] text-slate-500">Voucher diproses saat “Simpan & Cetak”.</div>
                    {fieldErrors.voucher_code?.[0] && (
                      <div className="text-xs text-red-600 mt-1">
                        {fieldErrors.voucher_code[0]}
                      </div>
                    )}
                    {voucherMsg && (
                      <div className="text-xs text-slate-700">
                        <Badge tone={voucherMsg.toLowerCase().includes('berhasil') ? 'good' : 'warn'}>{voucherMsg}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Discount + notes */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                      <label className="text-xs font-medium text-slate-700">Diskon (Rp)</label>
                      <Input
                        id="discount"
                        type="number"
                        min={0}
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs font-medium text-slate-700">Catatan (opsional)</label>
                      <Input
                        placeholder="Mis. warna, kondisi, permintaan khusus…"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">Catatan Tambahan (lebih panjang)</label>
                    <Textarea
                      className="min-h-[92px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tulis catatan detail jika diperlukan…"
                    />
                  </div>
                </div>
              </Card>

              {/* 2) CARI LAYANAN (dipindah ke tengah) + icon keranjang di kanan */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <span>Cari Layanan</span>
                    <Badge tone="neutral">{itemsCount} item</Badge>
                  </div>
                }
                subtitle="Gunakan pencarian untuk menambah item ke keranjang."
                right={
                  <button
                    type="button"
                    onClick={() => setMobileCartOpen(true)}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100"
                    aria-label="Buka keranjang"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 6H21L20 13H7L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M7 13L6.5 16H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 20a1 1 0 100-2 1 1 0 000 2Z" fill="currentColor" />
                      <path d="M18 20a1 1 0 100-2 1 1 0 000 2Z" fill="currentColor" />
                    </svg>

                    {itemsCount > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[11px] font-bold text-white">
                        {itemsCount}
                      </span>
                    )}
                  </button>
                }
              >
                <ProductSearch onPick={addItem} />
                {fieldErrors.items?.[0] && (
                  <div className="mt-2 text-xs text-red-600">
                    {fieldErrors.items[0]}
                  </div>
                )}
              </Card>

              {/* 3) FOTO PESANAN (dipindah ke bawah Cari Layanan) */}
              <Card
                title="Foto Pesanan"
                subtitle="Opsional. Drop file di desktop, atau buka kamera di mobile."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <UploadBox
                    title="Before"
                    isMobile={isMobile}
                    inputRef={beforeRef}
                    files={beforeFiles}
                    onFiles={(f) => setBeforeFiles((prev) => [...prev, ...f])}
                  />
                  {/* <UploadBox
                  title="After"
                  isMobile={isMobile}
                  inputRef={afterRef}
                  files={afterFiles}
                  onFiles={(f) => setAfterFiles((prev) => [...prev, ...f])}
                /> */}
                </div>
              </Card>

              {/* Customer modal */}
              {openCustomerCreate && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
                  role="dialog"
                  aria-modal="true"
                  onClick={() => {
                    if (!savingCustomer) {
                      setOpenCustomerCreate(false);
                      setCustomerError(null);
                      setNewCustomerName('');
                      setNewCustomerWa('');
                      setNewCustomerAddress('');
                      setNewCustomerTags([]);
                    }
                  }}
                >
                  <div
                    className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-[0_28px_70px_-40px_rgba(0,0,0,.5)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
                      <div>
                        <div className="text-base font-semibold">Tambah Customer</div>
                        <div className="text-xs text-slate-500">Tanpa keluar dari POS</div>
                      </div>
                      <OutlineButton
                        disabled={savingCustomer}
                        onClick={() => {
                          setOpenCustomerCreate(false);
                          setCustomerError(null);
                          setNewCustomerName('');
                          setNewCustomerWa('');
                          setNewCustomerAddress('');
                          setNewCustomerTags([]);
                        }}
                        className="px-3 py-2"
                      >
                        Tutup
                      </OutlineButton>
                    </div>

                    <div className="px-4 py-4">
                      {customerError && (
                        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          {customerError}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="grid gap-1">
                          <label className="text-xs font-medium text-slate-700">
                            Nama <span className="text-red-600">*</span>
                          </label>
                          <Input
                            value={newCustomerName}
                            onChange={(e) => setNewCustomerName(e.target.value)}
                            placeholder="Nama pelanggan"
                            disabled={savingCustomer}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-xs font-medium text-slate-700">
                            WhatsApp <span className="text-red-600">*</span>
                          </label>
                          <Input
                            value={newCustomerWa}
                            onChange={(e) => setNewCustomerWa(e.target.value)}
                            placeholder="08123456789"
                            inputMode="numeric"
                            disabled={savingCustomer}
                          />
                        </div>

                        <div className="grid gap-1">
                          <label className="text-xs font-medium text-slate-700">Alamat (opsional)</label>
                          <Textarea
                            className="min-h-[84px]"
                            value={newCustomerAddress}
                            onChange={(e) => setNewCustomerAddress(e.target.value)}
                            placeholder="Alamat pelanggan"
                            disabled={savingCustomer}
                          />
                        </div>
                        <div className="grid gap-1">
                          <label className="text-xs font-medium text-slate-700">Tags / Label</label>

                          <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                            value=""
                            disabled={savingCustomer}
                            onChange={(e) => {
                              const selected = e.target.value;
                              if (!selected) return;

                              setNewCustomerTags((prev) => {
                                if (prev.includes(selected)) return prev;
                                return [...prev, selected].slice(0, 10);
                              });

                              e.currentTarget.value = "";
                            }}
                          >
                            <option value="">Pilih tag customer</option>
                            {CUSTOMER_TAG_OPTIONS.map((tag) => (
                              <option
                                key={tag}
                                value={tag}
                                disabled={newCustomerTags.includes(tag)}
                              >
                                {tag}
                              </option>
                            ))}
                          </select>

                          <span className="text-[11px] text-slate-500">
                            Pilih dari daftar agar label customer konsisten.
                          </span>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {newCustomerTags.length > 0 ? (
                              newCustomerTags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${customerTagClass(tag)}`}
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    className="text-current/80 hover:text-current"
                                    onClick={() =>
                                      setNewCustomerTags((prev) => prev.filter((t) => t !== tag))
                                    }
                                    disabled={savingCustomer}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400">Belum ada tag dipilih.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <OutlineButton
                          disabled={savingCustomer}
                          onClick={() => {
                            setOpenCustomerCreate(false);
                            setCustomerError(null);
                            setNewCustomerName('');
                            setNewCustomerWa('');
                            setNewCustomerAddress('');
                            setNewCustomerTags([]);
                          }}
                        >
                          Batal
                        </OutlineButton>
                        <PrimaryButton
                          disabled={savingCustomer}
                          onClick={async () => {
                            if (!newCustomerName.trim() || !newCustomerWa.trim()) {
                              setCustomerError('Nama dan WhatsApp wajib diisi.');
                              return;
                            }
                            if (useAuth.hasRole(['Kasir', 'Admin Cabang']) && !branchId) {
                              setCustomerError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
                              return;
                            }

                            try {
                              setSavingCustomer(true);
                              setCustomerError(null);

                              const res: CustomerSingleResponse<Customer> = await createCustomer({
                                name: newCustomerName.trim(),
                                whatsapp: normalizeWa(newCustomerWa),
                                address: newCustomerAddress.trim() ? newCustomerAddress.trim() : null,
                                notes: null,
                                tags: newCustomerTags,
                              });

                              const created = res.data;
                              if (!created?.id) {
                                setCustomerError('Gagal: server tidak mengembalikan data customer (id kosong).');
                                return;
                              }
                              setCustomerId(String(created.id));

                              setNewCustomerName('');
                              setNewCustomerWa('');
                              setNewCustomerAddress('');
                              setNewCustomerTags([]);

                              setOpenCustomerCreate(false);
                            } catch (err: unknown) {
                              const e = normalizeApiError(err);
                              setCustomerError(e.message || 'Gagal menambahkan customer.');
                            } finally {
                              setSavingCustomer(false);
                            }
                          }}
                        >
                          {savingCustomer ? 'Menyimpan…' : 'Simpan'}
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* RIGHT */}
            <aside className="space-y-4 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:overflow-auto">
              <Card
                title="Checkout"
                subtitle="Ringkasan total dan pembayaran."
                right={<Badge tone={canPay ? 'good' : 'warn'}>{canPay ? 'Bisa bayar' : 'Tidak bisa bayar'}</Badge>}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">Subtotal</div>
                    <div className="text-sm font-semibold">{toIDR(subtotal)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">Diskon</div>
                    <div className="text-sm font-semibold">{toIDR(discount || 0)}</div>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Grand Total</div>
                    <div className="text-lg font-extrabold tracking-tight">{toIDR(grand)}</div>
                  </div>

                  {!!(loyaltyPreview.discount > 0) && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Perkiraan setelah loyalti</span>
                        <span className="font-semibold text-slate-900">{toIDR(predictedGrand)}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {loyaltyPreview.reward === 'DISC25' && 'Reward next: diskon 25%'}
                        {loyaltyPreview.reward === 'FREE100' && 'Reward next: gratis 100%'}
                        {loyaltyPreview.reward === 'NONE' && 'Reward next: -'}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card
                title="Stamp Loyalty"
                subtitle={loy ? `Stamp ${loy.stamps}/10 · Next ${loy.next}` : 'Pilih customer untuk melihat stamp.'}
                right={<Badge tone={loy ? 'neutral' : 'warn'}>{loy ? 'Aktif' : 'Belum dipilih'}</Badge>}
              >
                <div className="grid grid-cols-10 gap-1" aria-label="Loyalty stamps">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-full ${loy && i < loy.stamps ? 'bg-slate-900' : 'bg-slate-200'}`}
                      title={`Stamp ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-slate-600">
                  {loyaltyPreview.reward === 'DISC25' && 'Transaksi berikutnya mendapat diskon 25%.'}
                  {loyaltyPreview.reward === 'FREE100' && 'Transaksi berikutnya GRATIS (100%).'}
                  {loyaltyPreview.reward === 'NONE' && 'Belum ada benefit pada transaksi berikutnya.'}
                </div>
              </Card>

              <Card title="Pembayaran" subtitle="Pilih mode pembayaran (Pending/DP/Full).">
                <div className="space-y-3">
                  {/* Mode (ringkas -> buka popup) */}
                  <div>
                    <div className="mb-1 text-xs font-semibold text-slate-700">Mode Pembayaran</div>
                    <button
                      id="payment_mode"
                      type="button"
                      onClick={() => setModePickerOpen(true)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <span>{mode}</span>
                        <span className="text-xs text-slate-500">Ubah</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        {mode === 'PENDING' && 'Order disimpan tanpa pembayaran.'}
                        {mode === 'DP' && 'Bayar sebagian (DP) sekarang.'}
                        {mode === 'FULL' && 'Bayar lunas dengan metode Cash/QRIS/Transfer.'}
                      </div>
                    </button>
                    {fieldErrors.payment?.[0] && (
                      <div className="mt-1 text-xs text-red-600">
                        {fieldErrors.payment[0]}
                      </div>
                    )}
                  </div>

                  {mode === 'FULL' && (
                    <div>
                      <div className="mb-1 text-xs font-semibold text-slate-700">Metode</div>
                      <div className="flex flex-wrap gap-2">
                        {(['CASH', 'QRIS', 'TRANSFER'] as PaymentMethod[]).map((pm) => {
                          const active = method === pm;
                          return (
                            <button
                              key={pm}
                              onClick={() => setMethod(pm)}
                              className={[
                                'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                                active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50',
                              ].join(' ')}
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
                      <div className="mb-1 text-xs font-semibold text-slate-700">Nominal DP</div>
                      <Input
                        id="dp_amount"
                        type="number"
                        min={0}
                        max={total}
                        value={dpAmount}
                        onChange={(e) => setDpAmount(Number(e.target.value) || 0)}
                        placeholder="Masukkan nominal DP"
                      />
                      <div className="mt-1 text-xs text-slate-600">
                        Dibayar sekarang: <span className="font-semibold text-slate-900">{toIDR(payableNow)}</span>
                      </div>
                      {fieldErrors.dp_amount?.[0] && (
                        <div className="mt-1 text-xs text-red-600">
                          {fieldErrors.dp_amount[0]}
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2">
                    <PrimaryButton disabled={loading || !canSubmit} onClick={() => void onSubmit()}>
                      {loading ? 'Menyimpan…' : 'Simpan & Cetak'}
                    </PrimaryButton>
                    <OutlineButton
                      disabled={loading}
                      onClick={() => {
                        dlog('cancel/back clicked');
                        history.back();
                      }}
                    >
                      Batal
                    </OutlineButton>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </div>

        {/* Popup Keranjang (via icon) */}
        {mobileCartOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3"
            onClick={() => setMobileCartOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Keranjang</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {itemsCount} item · Subtotal {toIDR(subtotal)} · Grand {toIDR(grand)}
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                  onClick={() => setMobileCartOpen(false)}
                >
                  Tutup
                </button>
              </div>

              <div className="max-h-[70dvh] overflow-auto p-4">
                <CartPanel
                  items={items}
                  onChangeQty={onChangeQty}
                  onChangeNote={onChangeNote}
                  onRemove={onRemove}
                />
              </div>
            </div>
          </div>
        )}

        {/* Popup pilih mode pembayaran */}
        {modePickerOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3"
            onClick={() => setModePickerOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200">
                <div className="text-sm font-semibold text-slate-900">Pilih Mode Pembayaran</div>
                <div className="text-xs text-slate-500 mt-0.5">Mode akan mengatur alur DP/Full saat checkout.</div>
              </div>

              <div className="p-3 space-y-2">
                {(['PENDING', 'DP', 'FULL'] as const).map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        if (m !== 'DP') setDpAmount(0);
                        if (m === 'FULL') setMethod('CASH');
                        setModePickerOpen(false);
                      }}
                      className={[
                        'w-full rounded-xl border px-3 py-2 text-left transition-colors',
                        active
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{m}</span>
                        {active && <span className="text-xs opacity-90">Aktif</span>}
                      </div>
                      <div className={['mt-0.5 text-[11px]', active ? 'text-white/80' : 'text-slate-500'].join(' ')}>
                        {m === 'PENDING' && 'Simpan order tanpa pembayaran sekarang.'}
                        {m === 'DP' && 'Bayar sebagian sekarang, sisanya jadi piutang/sisa tagihan.'}
                        {m === 'FULL' && 'Bayar lunas sekarang (Cash/QRIS/Transfer).'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                  onClick={() => setModePickerOpen(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------
   Subcomponents (UI) - unchanged logic
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
  inputRef: React.RefObject<HTMLInputElement> | React.MutableRefObject<HTMLInputElement | null>;
  files: File[];
  onFiles: (f: File[]) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-800">{title}</div>
        <Badge tone={files.length ? 'good' : 'neutral'}>{files.length ? `${files.length} file` : 'Kosong'}</Badge>
      </div>

      <div
        className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onFiles(dropped);
        }}
      >
        {isMobile ? (
          <PrimaryButton onClick={() => inputRef.current?.click()} className="w-full">
            Buka Kamera
          </PrimaryButton>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-slate-600">Drop file ke sini atau pilih file.</div>
            <OutlineButton onClick={() => inputRef.current?.click()} className="w-full">
              Pilih File
            </OutlineButton>
          </div>
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
        <ul className="mt-3 space-y-1 text-xs text-slate-700">
          {files.slice(0, 4).map((f, i) => (
            <li key={i} className="truncate">
              • {f.name}
            </li>
          ))}
          {files.length > 4 && <li className="text-slate-500">+{files.length - 4} file lainnya…</li>}
        </ul>
      )}
    </div>
  );
}

