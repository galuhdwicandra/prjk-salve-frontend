import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import ProductGallery from '../../components/pos/ProductGallery';
import CartPanel, { type CartItem } from '../../components/pos/CartPanel';
import QrisPreview from '../../components/pos/QrisPreview';
import CustomerPicker from '../../components/customers/CustomerPicker';
import Toast from '../../components/Toast';
import { createOrder, getOrder, createOrderPayment } from '../../api/orders';
import { createCustomer } from '../../api/customers';
import { uploadOrderPhotos } from '../../api/orderPhotos';
import { applyVoucherToOrder, previewVoucher } from '../../api/vouchers';
import { getLoyaltySummary } from '../../api/loyalty';
import { normalizeApiError, type FieldErrors, type ApiEnvelope } from '../../api/client';
import { useActivePaymentMethods } from '../../hooks/useActivePaymentMethods';
import { useCustomerLabels } from '../../hooks/useCustomerLabels';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../store/useAuth';
import { useActiveBranchId } from '../../store/useBranch';
import {
  enqueueOrder,
  getPendingCount,
  getFailedCount,
  subscribeQueue,
} from '../../utils/offline-queue';
import { toIDR } from '../../utils/money';
import { fmtDate, todayLocalYMD } from '../../utils/date';
import type { OrderCreatePayload } from '../../types/orders';
import type { PaymentCreatePayload, PaymentMethod } from '../../types/payments';
import type { Customer, SingleResponse as CustomerSingleResponse } from '../../types/customers';
import type { LoyaltySummary } from '../../types/loyalty';

type PayMode = 'PENDING' | 'DP' | 'FULL';

const PAY_MODE_LABEL: Record<PayMode, string> = {
  PENDING: 'PENDING — bayar nanti',
  DP: 'DP — bayar sebagian di depan',
  FULL: 'FULL — dibayar lunas di depan',
};

const PAY_MODE_SHORT: Record<PayMode, string> = {
  PENDING: 'PENDING (bayar nanti)',
  DP: 'DP (sebagian di depan)',
  FULL: 'FULL (lunas di depan)',
};

const ERROR_FIELD_ID: Record<string, string> = {
  customer_id: 'customer_id',
  received_at: 'order_date_button',
  dp_amount: 'cash_received',
  payment: 'payment_mode',
  items: 'pos_cart',
  voucher_code: 'voucher_code',
};

function focusFirstErrorField(errors: FieldErrors) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;

  const el = document.getElementById(ERROR_FIELD_ID[firstKey] ?? firstKey);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  window.setTimeout(() => {
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      el.focus();
      return;
    }

    const focusable = el.querySelector(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement | null;

    focusable?.focus();
  }, 150);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function nowLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseMoneyInput(value: string): number {
  const normalized = value.replace(/[^\d]/g, '');
  if (normalized === '') return 0;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeWa(input: string): string {
  return (input || '').replace(/[^\d]/g, '');
}

function PosSection({
  id,
  title,
  openId,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  openId: string;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const open = openId === id;

  return (
    <div className={open ? 'posec open' : 'posec'} data-sec={id}>
      <button type="button" className="posec-head" aria-expanded={open} onClick={() => onToggle(id)}>
        <span>{title}</span>
        <span className="posec-chev">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div className="posec-body">{children}</div>
    </div>
  );
}

function PendingPhotoThumbnail({
  file,
  index,
  onRemove,
}: {
  file: File;
  index: number;
  onRemove: () => void;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const previewUrl = URL.createObjectURL(file);

    if (imageRef.current) {
      imageRef.current.src = previewUrl;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [file]);

  return (
    <div
      className="photo-thumb"
      style={{ width: 64, height: 64 }}
    >
      <img
        ref={imageRef}
        alt={`Foto before ${index + 1}`}
      />

      <button
        type="button"
        className="photo-x"
        aria-label={`Hapus foto ${file.name}`}
        onClick={onRemove}
      >
        {'\u2715'}
      </button>
    </div>
  );
}

export default function POSPage() {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branchId = useActiveBranchId();
  const branchCode = (user?.branches ?? []).find((b) => b.id === branchId)?.code ?? '';
  const canEditPrice = user?.custom_price === true;

  const pendingSync = useSyncExternalStore(subscribeQueue, getPendingCount, getPendingCount);
  const failedSync = useSyncExternalStore(subscribeQueue, getFailedCount, getFailedCount);

  const [openSec, setOpenSec] = useState('cust');
  const toggleSec = (id: string) => setOpenSec((current) => (current === id ? '' : id));

  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [orderDate, setOrderDate] = useState<string>(todayLocalYMD);
  const [note, setNote] = useState('');
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);

  const [mode, setMode] = useState<PayMode>('FULL');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [cashReceived, setCashReceived] = useState('');

  const [useDiscount, setUseDiscount] = useState(false);
  const [discount, setDiscount] = useState('');
  const [useVoucher, setUseVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);
  const [voucherAmount, setVoucherAmount] = useState(0);
  const [voucherBusy, setVoucherBusy] = useState(false);

  const [dateOpen, setDateOpen] = useState(false);
  const [dateDraft, setDateDraft] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submitLockRef = useRef(false);
  const clientRefRef = useRef<string>(crypto.randomUUID());
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const paymentMethods = useActivePaymentMethods();
  const { labels: customerLabels, chipClass: customerTagClass } = useCustomerLabels();

  const [openCustomerCreate, setOpenCustomerCreate] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerWa, setNewCustomerWa] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerTags, setNewCustomerTags] = useState<string[]>([]);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  const [loy, setLoy] = useState<LoyaltySummary | null>(null);

  useEffect(() => {
    setCustomerId('');
    setCustomerName('');
    setCustomerWhatsapp('');
    setLoy(null);
    setItems([]);
  }, [branchId]);

  useEffect(() => {
    if (paymentMethods.length === 0) return;
    if (paymentMethods.some((pm) => pm.code === method)) return;
    setMethod(paymentMethods[0].code);
  }, [paymentMethods, method]);

  useEffect(() => {
    if (!customerId) {
      setLoy(null);
      return;
    }

    setLoy(null);
    let alive = true;

    getLoyaltySummary(customerId, branchId)
      .then((res: ApiEnvelope<LoyaltySummary, null>) => {
        if (alive) setLoy(res.data);
      })
      .catch(() => {
        if (alive) setLoy(null);
      });

    return () => {
      alive = false;
    };
  }, [customerId, branchId]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const discountValue = useMemo(() => (useDiscount ? parseMoneyInput(discount) : 0), [useDiscount, discount]);
  const receivedValue = useMemo(() => parseMoneyInput(cashReceived), [cashReceived]);

  const loyaltyDiscount = useMemo(() => {
    if (!loy || subtotal <= 0) return 0;
    if (loy.next === 5) return subtotal * 0.25;
    if (loy.next === 10) return subtotal;
    return 0;
  }, [loy, subtotal]);

  const total = useMemo(
    () => Math.max(0, subtotal - discountValue - loyaltyDiscount - voucherAmount),
    [subtotal, discountValue, loyaltyDiscount, voucherAmount],
  );

  const payableNow = useMemo(() => {
    if (mode === 'PENDING') return 0;
    if (mode === 'DP') return Math.max(0, Math.min(receivedValue, total));
    return total;
  }, [mode, receivedValue, total]);

  const change = useMemo(
    () => (mode === 'FULL' ? Math.max(0, receivedValue - total) : 0),
    [mode, receivedValue, total],
  );

  const dueNow = useMemo(() => Math.max(0, total - payableNow), [total, payableNow]);

  const methodLabel = paymentMethods.find((pm) => pm.code === method)?.name ?? method;
  const isQris = /qris/i.test(method) || /qris/i.test(methodLabel);
  const qrisAmount = isQris ? payableNow : 0;
  const showCashReceived = !(isQris && mode === 'FULL');

  const maxSla = useMemo(() => items.reduce((max, it) => Math.max(max, it.sla_days ?? 0), 0), [items]);
  const readyAt = useMemo(() => addDays(orderDate, maxSla), [orderDate, maxSla]);

  const canSubmit = items.length > 0 && !!customerId && !loading;

  function addItem(svc: { id: string; name: string; unit: string; price_effective: number; sla_days: number }) {
    const existing = items.find((p) => p.service_id === svc.id);
    setItems((prev) => {
      const found = prev.find((p) => p.service_id === svc.id);

      if (found) {
        return prev.map((p) => (p.service_id === svc.id ? { ...p, qty: p.qty + 1 } : p));
      }

      return [
        ...prev,
        {
          service_id: svc.id,
          name: svc.name,
          unit: svc.unit,
          price: svc.price_effective,
          qty: 1,
          sla_days: svc.sla_days,
        },
      ];
    });

    showSuccess(
      existing
        ? `${svc.name} \u2014 jumlah jadi ${existing.qty + 1}.`
        : `${svc.name} masuk keranjang.`,
    );
  }

  const onChangeQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((p) => (p.service_id === id ? { ...p, qty } : p)));

  const onChangePrice = (id: string, price: number) =>
    setItems((prev) => prev.map((p) => (p.service_id === id ? { ...p, price } : p)));

  const onRemove = (id: string) => setItems((prev) => prev.filter((p) => p.service_id !== id));

  function resetForm() {
    setOpenSec('cust');
    setItems([]);
    setCustomerId('');
    setCustomerName('');
    setCustomerWhatsapp('');
    setLoy(null);
    setNote('');
    setBeforeFiles([]);
    setMode('FULL');
    setMethod(paymentMethods[0]?.code ?? 'CASH');
    setUseDiscount(false);
    setDiscount('');
    setUseVoucher(false);
    setVoucherCode('');
    setVoucherMsg(null);
    setVoucherAmount(0);
    setCashReceived('');
    setOrderDate(todayLocalYMD());
    setError(null);
    setFieldErrors({});
    clientRefRef.current = crypto.randomUUID();
  }

  function acceptPhotos(list: File[]) {
    const good = list.filter((f) => f.type.startsWith('image/') && f.size <= 4 * 1024 * 1024);
    const rejected = list.length - good.length;

    if (good.length > 0) setBeforeFiles((prev) => [...prev, ...good]);
    if (rejected > 0) showError(`${rejected} file ditolak (bukan gambar atau lebih dari 4 MB).`);
  }

  function handlePhotoInput(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.currentTarget.files
      ? Array.from(event.currentTarget.files)
      : [];

    acceptPhotos(files);
    event.currentTarget.value = '';
  }

  function validatePosForm(): FieldErrors {
    const errors: FieldErrors = {};

    if (items.length === 0) errors.items = ['Keranjang kosong. Tambahkan minimal satu produk.'];
    if (!branchId) errors.branch_id = ['Akun Anda belum terikat ke outlet.'];
    if (!customerId) errors.customer_id = ['Pelanggan wajib dipilih.'];
    if (!orderDate) errors.received_at = ['Tanggal order wajib diisi.'];

    if (mode === 'DP' && payableNow <= 0) {
      errors.dp_amount = ['Uang diterima wajib diisi dan lebih dari 0.'];
    }

    if (mode === 'FULL' && total <= 0) {
      errors.payment = ['Total harus lebih dari 0 untuk pembayaran lunas.'];
    }

    return errors;
  }

  async function applyVoucher() {
    const code = voucherCode.trim().toUpperCase();

    if (!code) {
      setVoucherMsg('Kode voucher wajib diisi.');
      return;
    }

    setVoucherBusy(true);

    try {
      const res = await previewVoucher({
        code,
        subtotal,
        branch_id: branchId || null,
        customer_id: customerId || null,
      });

      const amount = Number(res.data?.amount ?? 0);

      setVoucherAmount(amount);
      setVoucherMsg(`Voucher ${code} diterapkan, potongan ${toIDR(amount)}.`);
    } catch (ex: unknown) {
      const e = normalizeApiError(ex);

      setVoucherAmount(0);
      setVoucherMsg(e.message || 'Voucher tidak valid.');
    } finally {
      setVoucherBusy(false);
    }
  }

  function buildPayload(): OrderCreatePayload {
    return {
      branch_id: branchId || undefined,
      customer_id: customerId,
      items: items.map((it) => ({
        service_id: it.service_id,
        qty: it.qty,
        note: null,
        ...(canEditPrice ? { price: it.price } : {}),
      })),
      discount_type: 'NOMINAL',
      discount_value: discountValue,
      notes: note.trim() ? note.trim() : null,
      received_at: orderDate,
      ready_at: readyAt,
      client_ref: clientRefRef.current,
    };
  }

  async function saveOffline(payload: OrderCreatePayload, payment: PaymentCreatePayload | null) {
    await enqueueOrder({
      payload,
      payment,
      voucherCode: useVoucher && voucherCode.trim() ? voucherCode.trim().toUpperCase() : null,
      beforeFiles,
    });

    resetForm();
    showSuccess('Jaringan offline. Order masuk antrean dan terkirim otomatis saat online.');
  }

  async function onSubmit() {
    if (submitLockRef.current || loading) return;

    submitLockRef.current = true;
    setLoading(true);
    setFieldErrors({});
    setError(null);

    const clientErrors = validatePosForm();

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setError('Masih ada data order yang belum benar. Silakan periksa kembali.');
      showError('Masih ada data order yang belum benar. Silakan periksa kembali.');
      focusFirstErrorField(clientErrors);
      submitLockRef.current = false;
      setLoading(false);
      return;
    }

    const payload = buildPayload();

    const offlinePayment: PaymentCreatePayload | null =
      mode !== 'PENDING'
        ? { method: mode === 'DP' ? 'DP' : method, amount: payableNow, paid_at: nowLocal() }
        : null;

    try {
      if (!navigator.onLine) {
        await saveOffline(payload, offlinePayment);
        return;
      }

      const res = await createOrder(payload);
      let order = res.data!;

      if (useVoucher && voucherCode.trim()) {
        try {
          setVoucherMsg(null);
          await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
          const refreshed = await getOrder(String(order.id));
          order = refreshed.data!;
          setVoucherMsg('Voucher berhasil diterapkan.');
        } catch (ex: unknown) {
          const e = normalizeApiError(ex);
          setVoucherMsg(e.message || 'Gagal menerapkan voucher');
          setFieldErrors((prev) => ({
            ...prev,
            ...(e.errors ?? { voucher_code: [e.message || 'Gagal menerapkan voucher'] }),
          }));
        }
      }

      if (mode !== 'PENDING') {
        const amount = Math.min(payableNow, Number(order?.grand_total ?? payableNow));

        const payPayload: PaymentCreatePayload = {
          method: mode === 'DP' ? 'DP' : method,
          amount,
          paid_at: nowLocal(),
        };

        const payRes = await createOrderPayment(order.id, payPayload);
        order = payRes.order;
      }

      let photoUploadError: string | null = null;

      if (beforeFiles.length > 0) {
        try {
          await uploadOrderPhotos(order.id, beforeFiles, []);
        } catch (err: unknown) {
          photoUploadError = normalizeApiError(err).message;
        }
      }

      const orderReference = order.invoice_no ?? order.number;
      const successMessage = orderReference
        ? `Order ${orderReference} berhasil dibuat.`
        : 'Order berhasil dibuat.';

      resetForm();

      if (photoUploadError) {
        showError(
          `${successMessage} Namun, foto gagal diunggah: ${photoUploadError}. Ulangi upload melalui Receipt List.`,
        );
      } else {
        showSuccess(successMessage);
      }
    } catch (err: unknown) {
      const e = normalizeApiError(err);

      if (e.isNetworkError) {
        await saveOffline(payload, offlinePayment);
        return;
      }

      const serverErrors = e.errors ?? {};

      setFieldErrors(serverErrors);
      setError(e.message || 'Gagal menyimpan order');
      showError(e.message || 'Gagal menyimpan order');

      if (Object.keys(serverErrors).length > 0) focusFirstErrorField(serverErrors);
    } finally {
      submitLockRef.current = false;
      setLoading(false);
    }
  }

  function closeCustomerModal() {
    setOpenCustomerCreate(false);
    setCustomerError(null);
    setNewCustomerName('');
    setNewCustomerWa('');
    setNewCustomerAddress('');
    setNewCustomerTags([]);
  }

  async function saveCustomer() {
    if (!newCustomerName.trim() || !newCustomerWa.trim()) {
      setCustomerError('Nama dan Nomor WA wajib diisi.');
      return;
    }

    if (!branchId) {
      setCustomerError('Akun Anda belum terikat ke outlet. Hubungi admin pusat.');
      return;
    }

    try {
      setSavingCustomer(true);
      setCustomerError(null);

      const res: CustomerSingleResponse<Customer> = await createCustomer({
        branch_id: branchId,
        name: newCustomerName.trim(),
        whatsapp: normalizeWa(newCustomerWa),
        address: newCustomerAddress.trim() ? newCustomerAddress.trim() : null,
        notes: null,
        tags: newCustomerTags,
      });

      const created = res.data;

      if (!created?.id) {
        setCustomerError('Gagal: server tidak mengembalikan data pelanggan.');
        return;
      }

      setCustomerId(String(created.id));
      setCustomerName(created.name)
      setCustomerWhatsapp(created.whatsapp ?? '');;
      closeCustomerModal();
    } catch (err: unknown) {
      const e = normalizeApiError(err);
      setCustomerError(e.message || 'Gagal menambahkan pelanggan.');
    } finally {
      setSavingCustomer(false);
    }
  }

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      {pendingSync > 0 || failedSync > 0 ? (
        <div className="toolbar" style={{ marginBottom: 12 }}>
          {pendingSync > 0 ? <span className="chip c-dp">{pendingSync} order menunggu sinkron</span> : null}
          {failedSync > 0 ? <span className="chip c-belum">{failedSync} order gagal sinkron</span> : null}
        </div>
      ) : null}

      {fieldErrors.branch_id?.[0] ? <div className="login-err">{fieldErrors.branch_id[0]}</div> : null}

      <div className="pos-wrap">
        <div className="pos-main">
          <ProductGallery onPick={addItem} branchId={branchId} />
        </div>

        <aside className="pos-order">
          <div className="po-head">
            <span>Order Saat Ini</span>
          </div>

          <div className="po-body">
            <PosSection id="cust" title="Data Pelanggan" openId={openSec} onToggle={toggleSec}>
              <div className="field">
                <label htmlFor="customer_id">Pelanggan</label>
                <div id="customer_id">
                  <CustomerPicker
                    value={customerId}
                    onChange={(id) => {
                      setCustomerId(id);

                      if (!id) {
                        setCustomerName('');
                        setCustomerWhatsapp('');
                        setLoy(null);
                      }
                    }}
                    onPicked={(customer) => {
                      setCustomerName(customer.name);
                      setCustomerWhatsapp(customer.whatsapp ?? '');
                    }}
                    onCreateNew={(name) => {
                      setNewCustomerName(name);
                      setCustomerError(null);
                      setOpenCustomerCreate(true);
                    }}
                    branchId={branchId}
                    placeholder="Cari nama / no. WA, atau ketik data baru"
                  />
                </div>
                {customerId ? (
                  <>
                    <div className="picked" style={{ marginTop: 8 }}>
                      <span>
                        <b>{customerName}</b>{' '}
                        <span className="mini">{customerWhatsapp || '—'}</span>
                      </span>

                      <button
                        type="button"
                        className="link"
                        onClick={() => {
                          setCustomerId('');
                          setCustomerName('');
                          setCustomerWhatsapp('');
                          setLoy(null);
                        }}
                      >
                        ganti
                      </button>
                    </div>

                    {loy ? (
                      <div className="loyalty">
                        <div className="loy-h">
                          <span>Loyalty Stamp</span>
                          <b>
                            {loy.stamps}/{loy.cycle}
                          </b>
                        </div>

                        <div
                          className="stamp-bar"
                          aria-label={`Loyalty stamp ${loy.stamps} dari ${loy.cycle}`}
                        >
                          {Array.from(
                            { length: loy.cycle },
                            (_, index) => index + 1,
                          ).map((stamp) => (
                            <span
                              key={stamp}
                              className={stamp <= loy.stamps ? 'stamp on' : 'stamp'}
                            >
                              {stamp}
                            </span>
                          ))}
                        </div>

                        <div className="mini" style={{ marginTop: 5 }}>
                          Aturan stamp menyusul — sementara mengikuti jumlah
                          kunjungan.
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}
                {fieldErrors.customer_id?.[0] ? (
                  <div className="mini" style={{ color: 'var(--danger)', marginTop: 6 }}>
                    {fieldErrors.customer_id[0]}
                  </div>
                ) : null}
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label>Tanggal Order</label>
                <button
                  type="button"
                  id="order_date_button"
                  className="drp-btn"
                  onClick={() => {
                    setDateDraft(orderDate);
                    setDateOpen(true);
                  }}
                >
                  <span className="drp-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </span>
                  {fmtDate(orderDate)}
                </button>
                {fieldErrors.received_at?.[0] ? (
                  <div className="mini" style={{ color: 'var(--danger)', marginTop: 6 }}>
                    {fieldErrors.received_at[0]}
                  </div>
                ) : null}
              </div>
            </PosSection>

            <PosSection id="cart" title="Keranjang" openId={openSec} onToggle={toggleSec}>
              <div id="pos_cart">
                <CartPanel
                  items={items}
                  editablePrice={canEditPrice}
                  onChangeQty={onChangeQty}
                  onChangePrice={onChangePrice}
                  onRemove={onRemove}
                  onClear={() => setItems([])}
                />
              </div>
              {fieldErrors.items?.[0] ? (
                <div className="mini" style={{ color: 'var(--danger)', marginTop: 6 }}>
                  {fieldErrors.items[0]}
                </div>
              ) : null}
            </PosSection>

            <PosSection id="pay" title="Check Out" openId={openSec} onToggle={toggleSec}>
              <div className="field">
                <label htmlFor="payment_mode">Ketentuan Pembayaran</label>
                <select
                  id="payment_mode"
                  value={mode}
                  onChange={(e) => {
                    const next = e.target.value as PayMode;
                    setMode(next);
                    if (next === 'PENDING') setCashReceived('');
                  }}
                >
                  {(['FULL', 'DP', 'PENDING'] as const).map((item) => (
                    <option key={item} value={item}>
                      {PAY_MODE_LABEL[item]}
                    </option>
                  ))}
                </select>
                {fieldErrors.payment?.[0] ? (
                  <div className="mini" style={{ color: 'var(--danger)', marginTop: 6 }}>
                    {fieldErrors.payment[0]}
                  </div>
                ) : null}
              </div>

              {mode !== 'PENDING' ? (
                <>
                  <div className="field">
                    <label htmlFor="payment_method">Metode</label>
                    <select id="payment_method" value={method} onChange={(e) => setMethod(e.target.value)}>
                      {paymentMethods.map((pm) => (
                        <option key={pm.id} value={pm.code}>
                          {pm.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {showCashReceived ? (
                    <div className="field">
                      <label htmlFor="cash_received">
                        {mode === 'DP' ? 'Nominal DP (Rp)' : 'Uang Diterima (Rp)'}
                      </label>
                      <input
                        id="cash_received"
                        type="text"
                        inputMode="numeric"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value.replace(/[^\d]/g, ''))}
                        placeholder="0"
                      />
                      {change > 0 ? (
                        <div className="mini" style={{ marginTop: 6 }}>
                          Kembalian: <b>{toIDR(change)}</b>
                        </div>
                      ) : null}
                      {fieldErrors.dp_amount?.[0] ? (
                        <div className="mini" style={{ color: 'var(--danger)', marginTop: 6 }}>
                          {fieldErrors.dp_amount[0]}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}

              <div className="row" style={{ marginBottom: 14 }}>
                <label className="switch-row">
                  <span className="switch">
                    <input
                      type="checkbox"
                      checked={useDiscount}
                      onChange={(e) => {
                        setUseDiscount(e.target.checked);
                        if (!e.target.checked) setDiscount('');
                      }}
                    />
                    <span className="slider" />
                  </span>
                  Diskon
                </label>

                <label className="switch-row">
                  <span className="switch">
                    <input
                      type="checkbox"
                      checked={useVoucher}
                      onChange={(e) => {
                        setUseVoucher(e.target.checked);
                        if (!e.target.checked) {
                          setVoucherCode('');
                          setVoucherMsg(null);
                          setVoucherAmount(0);
                        }
                      }}
                    />
                    <span className="slider" />
                  </span>
                  Voucher
                </label>
              </div>

              {useDiscount ? (
                <div className="field">
                  <label htmlFor="discount">Nominal Diskon (Rp)</label>
                  <input
                    id="discount"
                    type="text"
                    inputMode="numeric"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="0"
                  />
                </div>
              ) : null}

              {useVoucher ? (
                <div className="field">
                  <div className="toolbar">
                    <input
                      id="voucher_code"
                      value={voucherCode}
                      onChange={(e) => {
                        setVoucherCode(e.target.value.toUpperCase());
                        setVoucherAmount(0);
                        setVoucherMsg(null);
                      }}
                      placeholder="masukkan kode"
                    />
                    <button
                      type="button"
                      className="btn ghost sm"
                      disabled={voucherBusy || subtotal <= 0}
                      onClick={() => void applyVoucher()}
                    >
                      {voucherBusy ? 'Memeriksa\u2026' : 'Pakai Voucher'}
                    </button>
                  </div>
                  {fieldErrors.voucher_code?.[0] ? (
                    <div className="mini" style={{ color: 'var(--danger)', marginTop: 6 }}>
                      {fieldErrors.voucher_code[0]}
                    </div>
                  ) : null}
                  {voucherMsg ? (
                    <div className="mini" style={{ marginTop: 6 }}>
                      {voucherMsg}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {error ? <div className="login-err">{error}</div> : null}

              <div className="totals" style={{ marginBottom: 0 }}>
                <div className="l">
                  <span>Subtotal</span>
                  <span className="mono">{toIDR(subtotal)}</span>
                </div>
                <div className="l">
                  <span>Diskon</span>
                  <span className="mono">{toIDR(discountValue)}</span>
                </div>
                {loyaltyDiscount > 0 ? (
                  <div className="l">
                    <span>Loyalti</span>
                    <span className="mono">{toIDR(loyaltyDiscount)}</span>
                  </div>
                ) : null}
                {voucherAmount > 0 ? (
                  <div className="l">
                    <span>Voucher</span>
                    <span className="mono">{toIDR(voucherAmount)}</span>
                  </div>
                ) : null}
                <div className="l grand">
                  <span>Total</span>
                  <span className="mono">{toIDR(total)}</span>
                </div>
              </div>
            </PosSection>

            <PosSection id="memo" title="Foto & Memo" openId={openSec} onToggle={toggleSec}>
              <div className="field">
                <label>
                  Foto Before <span className="mini">(opsional)</span>
                </label>

                <div className="photo-btns">
                  <button type="button" className="btn ghost sm" onClick={() => cameraRef.current?.click()}>
                    Kamera
                  </button>
                  <button type="button" className="btn ghost sm" onClick={() => galleryRef.current?.click()}>
                    Galeri
                  </button>
                </div>

                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handlePhotoInput}
                />
                <input
                  ref={galleryRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handlePhotoInput}
                />

                {beforeFiles.length > 0 ? (
                  <div className="photo-grid" style={{ marginBottom: 10 }}>
                    {beforeFiles.map((file, index) => (
                      <PendingPhotoThumbnail
                        key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                        file={file}
                        index={index}
                        onRemove={() => {
                          setBeforeFiles((previous) =>
                            previous.filter(
                              (_, fileIndex) => fileIndex !== index,
                            ),
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : null}

                <div className="mini">
                  Foto kondisi awal sepatu. Bisa juga ditambahkan nanti lewat menu Receipt List.
                </div>

              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="order_note">
                  Catatan <span className="mini">(opsional)</span>
                </label>
                <textarea
                  id="order_note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="mis. sol lepas kiri, warna kusam…"
                />
              </div>
            </PosSection>

            <PosSection id="prev" title="Preview" openId={openSec} onToggle={toggleSec}>
              <div className="mini" style={{ marginBottom: 10 }}>
                Cek pesanan &amp; pembayaran sebelum simpan.
              </div>

              <div className="po-prev">
                <div style={{ fontWeight: 800 }}>{customerName || '(pelanggan belum dipilih)'}</div>
                <div className="mini" style={{ marginBottom: 8 }}>
                  {fmtDate(orderDate)}
                  {branchCode ? ` · ${branchCode}` : ''}
                </div>

                {items.map((item) => (
                  <div className="kv" key={item.service_id}>
                    <span>{`${item.name} ×${item.qty}`}</span>
                    <span className="mono">{toIDR(item.price * item.qty)}</span>
                  </div>
                ))}

                <div className="kv">
                  <span className="muted">Subtotal</span>
                  <span className="mono">{toIDR(subtotal)}</span>
                </div>
                <div className="kv">
                  <b>Total</b>
                  <b className="mono">{toIDR(total)}</b>
                </div>
                <div className="kv">
                  <span className="muted">Ketentuan</span>
                  <span>{PAY_MODE_SHORT[mode]}</span>
                </div>
                {mode !== 'PENDING' ? (
                  <div className="kv">
                    <span className="muted">Metode</span>
                    <span>{methodLabel}</span>
                  </div>
                ) : null}
                <div className="kv">
                  <span className="muted">Dibayar</span>
                  <span className="mono">{toIDR(payableNow)}</span>
                </div>
                {dueNow > 0 ? (
                  <div className="kv">
                    <span className="muted">Sisa Tagihan</span>
                    <span className="mono">{toIDR(dueNow)}</span>
                  </div>
                ) : null}
                <div className="kv">
                  <span className="muted">Estimasi Selesai</span>
                  <span>{fmtDate(readyAt)}</span>
                </div>
                {qrisAmount > 0 ? (
                  <QrisPreview amount={qrisAmount} />
                ) : null}
              </div>
            </PosSection>
          </div>

          <button
            type="button"
            id="save_order"
            className="btn dark block po-save"
            disabled={!canSubmit}
            onClick={() => void onSubmit()}
            style={!canSubmit ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
          >
            {loading ? 'Menyimpan…' : 'Simpan Order'}
          </button>
        </aside>
      </div>

      {dateOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-labelledby="date_title">
          <div className="box">
            <div className="modal-head">
              <h3 id="date_title">Ubah Tanggal Order</h3>
              <button type="button" className="mclose" onClick={() => setDateOpen(false)} aria-label="Tutup">
                {'\u2715'}
              </button>
            </div>

            <div className="mini" style={{ marginBottom: 14 }}>
              Default tanggal order adalah hari ini. Ubah hanya bila perlu (mis. input order yang terlewat / backdate).
            </div>

            <div className="field">
              <label htmlFor="order_date">Tanggal Order</label>
              <input
                id="order_date"
                type="date"
                value={dateDraft}
                onChange={(e) => setDateDraft(e.target.value)}
              />
            </div>

            <div className="modal-foot">
              <button type="button" className="btn ghost" onClick={() => setDateOpen(false)}>
                Batal
              </button>
              <span style={{ flex: 1 }} />
              <button
                type="button"
                className="btn dark"
                disabled={!dateDraft}
                onClick={() => {
                  setOrderDate(dateDraft);
                  setDateOpen(false);
                }}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {openCustomerCreate ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-labelledby="cust_title">
          <div className="box box-cust">
            <div className="modal-head">
              <h3 id="cust_title">Tambah Pelanggan</h3>
              <button
                type="button"
                className="mclose"
                disabled={savingCustomer}
                onClick={closeCustomerModal}
                aria-label="Tutup"
              >
                {'\u2715'}
              </button>
            </div>

            {customerError ? <div className="login-err">{customerError}</div> : null}

            <div className="row">
              <div className="field">
                <label htmlFor="cust_name">
                  Nama <span className="req">*</span>
                </label>
                <input
                  id="cust_name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  disabled={savingCustomer}
                />
              </div>

              <div className="field">
                <label htmlFor="cust_wa">
                  Nomor WA <span className="req">*</span>
                </label>
                <input
                  id="cust_wa"
                  value={newCustomerWa}
                  onChange={(e) => setNewCustomerWa(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  inputMode="numeric"
                  disabled={savingCustomer}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="cust_address">
                Alamat <span className="mini">(opsional)</span>
              </label>
              <textarea
                id="cust_address"
                value={newCustomerAddress}
                onChange={(e) => setNewCustomerAddress(e.target.value)}
                placeholder="alamat pelanggan"
                disabled={savingCustomer}
              />
            </div>

            <div className="field">
              <label htmlFor="cust_labels">
                Label Customer <span className="mini">(opsional, bisa lebih dari satu)</span>
              </label>
              <select
                id="cust_labels"
                value=""
                disabled={savingCustomer}
                onChange={(e) => {
                  const selected = e.target.value;
                  if (!selected) return;

                  setNewCustomerTags((prev) =>
                    prev.includes(selected) ? prev : [...prev, selected].slice(0, 10),
                  );
                }}
              >
                <option value="">pilih label…</option>
                {customerLabels.map((label) => (
                  <option key={label.id} value={label.name} disabled={newCustomerTags.includes(label.name)}>
                    {label.name}
                  </option>
                ))}
              </select>

              {newCustomerTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {newCustomerTags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${customerTagClass(tag)}`}
                    >
                      {tag}
                      <button
                        type="button"
                        disabled={savingCustomer}
                        onClick={() => setNewCustomerTags((prev) => prev.filter((t) => t !== tag))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="modal-foot">
              <span style={{ flex: 1 }} />
              <button
                type="button"
                className="btn"
                disabled={savingCustomer}
                onClick={() => void saveCustomer()}
              >
                {savingCustomer ? 'Menyimpan…' : 'Simpan Pelanggan'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
