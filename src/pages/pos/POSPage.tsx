// src/pages/pos/POSPage.tsx
import { useEffect, useMemo, useState, useRef } from 'react';
import ProductSearch from '../../components/pos/ProductSearch';
import CartPanel, { type CartItem } from '../../components/pos/CartPanel';
import { createOrder } from '../../api/orders';
import type { OrderCreatePayload } from '../../types/orders';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import type { RoleName } from '../../api/client';
import { createOrderPayment } from '../../api/orders';
import type { PaymentCreatePayload, PaymentMethod } from '../../types/payments';
import CustomerPicker from "../../components/customers/CustomerPicker";
import { uploadOrderPhotos } from "../../api/orderPhotos";
import { toIDR } from '../../utils/money';
import { getOrder } from '../../api/orders';
import { applyVoucherToOrder } from '../../api/vouchers';

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

export default function POSPage(): React.ReactElement {
  const nav = useNavigate();
  const { user, hasRole } = useAuth;
  const branchId = user?.branch_id ? String(user.branch_id) : '';
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PAY_ROLES: RoleName[] = ['Superadmin', 'Admin Cabang', 'Kasir'];
  const canPay = hasRole(PAY_ROLES);

  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const isMobile = useMemo(() => /android|iphone|ipad|ipod/i.test(navigator.userAgent), []);

  type PayMode = 'PENDING' | 'DP' | 'FULL';
  const [mode, setMode] = useState<PayMode>('PENDING');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [dpAmount, setDpAmount] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.price * it.qty), 0), [items]);
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
  const payableNow = useMemo(() => {
    if (mode === 'PENDING') return 0;
    if (mode === 'DP') return Math.max(0, Math.min(dpAmount, total));
    return total;
  }, [mode, dpAmount, total]);
  const grand = useMemo(() => Math.max(0, subtotal - (discount || 0)), [subtotal, discount]);
  const canSubmit = useMemo(() => {
    return items.length > 0 && !!customerId && !loading;
  }, [items.length, customerId, loading]);

  useEffect(() => { dlog('mount'); return () => dlog('unmount'); }, []);
  useEffect(() => { dlog('items changed', items); }, [items]);
  useEffect(() => { dlog('discount changed', discount); }, [discount]);
  useEffect(() => { dlog('notes changed', notes); }, [notes]);
  useEffect(() => { dlog('totals', { subtotal, grand }); }, [subtotal, grand]);

  function addItem(svc: { id: string; name: string; unit: string; price_effective: number }) {
    dlog('addItem clicked', svc);
    setItems((prev) => {
      const found = prev.find((p) => p.service_id === svc.id);
      if (found) {
        const next = prev.map((p) => p.service_id === svc.id ? { ...p, qty: p.qty + 1 } : p);
        dlog('increment qty', { service_id: svc.id, nextQty: (found.qty + 1) });
        return next;
      }
      const next = [...prev, { service_id: svc.id, name: svc.name, unit: svc.unit, price: svc.price_effective, qty: 1 }];
      dlog('push new cart item', next[next.length - 1]);
      return next;
    });
  }

  const onChangeQty = (id: string, qty: number) => {
    dlog('onChangeQty', { id, qty });
    setItems((prev) => prev.map((p) => p.service_id === id ? { ...p, qty } : p));
  };

  const onChangeNote = (id: string, note: string) => {
    dlog('onChangeNote', { id, note });
    setItems((prev) => prev.map((p) => p.service_id === id ? { ...p, note } : p));
  };

  const onRemove = (id: string) => {
    dlog('onRemove', { id });
    setItems((prev) => prev.filter((p) => p.service_id !== id));
  };

  async function onSubmit() {
    dlog('onSubmit start');
    if (items.length === 0) {
      setError('Keranjang kosong');
      dlog('onSubmit blocked: empty cart');
      return;
    }
    if (hasRole(['Kasir', 'Admin Cabang']) && !branchId) {
      setError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
      dlog('onSubmit blocked: no branch_id for Kasir');
      return;
    }
    if (!customerId) {
      setError('Pelanggan wajib dipilih.');
      return;
    }
    if (mode === 'DP') {
      if (payableNow <= 0 || payableNow > total) {
        setError('Nominal DP tidak valid (≤ 0 atau melebihi grand total).');
        return;
      }
    }
    if (mode === 'FULL' && payableNow <= 0) {
      setError('Nominal pembayaran harus > 0 untuk mode FULL.');
      return;
    }

    setLoading(true); setError(null);
    try {
      const payload: OrderCreatePayload = {
        branch_id: branchId || undefined,
        customer_id: customerId,
        items: items.map((it) => ({
          service_id: it.service_id,
          qty: it.qty,
          note: it.note ?? null
        })),
        discount: discount || 0,
        notes: notes || null,
      };
      dlog('createOrder payload', payload);

      const res = await createOrder(payload);
      dlog('createOrder response', res);
      let order = res.data!;

      if (voucherCode.trim()) {
        try {
          setVoucherMsg(null);
          await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });

          // Ambil ulang order agar total/discount sinkron dengan backend
          const refreshed = await getOrder(String(order.id));
          order = refreshed.data!;
          setVoucherMsg('Voucher berhasil diterapkan.');
        } catch (ex: unknown) {
          const ax = ex as HttpError;
          const msg = extractServerMessage(ax.response?.data)
            ?? (ax.response?.status === 422
              ? 'Voucher tidak valid / syarat tidak terpenuhi'
              : ax.response?.status === 404
                ? 'Kode voucher tidak ditemukan'
                : 'Gagal menerapkan voucher');
          setVoucherMsg(msg);
        }
      }

      const adjustedPayNow = Math.min(
        payableNow,
        Number((order)?.grand_total ?? payableNow)
      );

      if (canPay && mode !== 'PENDING') {
        const payPayload: PaymentCreatePayload =
          mode === 'DP'
            ? { method: 'DP', amount: adjustedPayNow, paid_at: new Date().toISOString() }
            : { method, amount: adjustedPayNow, paid_at: new Date().toISOString() };

        dlog('createOrderPayment payload', payPayload);
        const payRes = await createOrderPayment(order.id, payPayload);
        dlog('createOrderPayment response', payRes);
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

      alert('Transaksi tersimpan');
      dlog('navigate to receipt', { orderId: order.id });
      nav(`/orders/${order.id}/receipt`, { replace: true });
    } catch (e: unknown) {
      dlog('createOrder error', e);
      const ax = e as HttpError;
      if (ax.response?.status === 403) {
        const msg = extractServerMessage(ax.response.data)
          ?? 'Forbidden: Anda tidak diizinkan melakukan pembayaran untuk order ini.';
        setError(msg);
      } else if (ax.response?.status === 422) {
        // tampilkan pesan + rincian field dari server
        const data = ax.response.data as { message?: string; errors?: Record<string, string[]> } | undefined;
        const msg = data?.message ?? 'Validasi gagal (422)';
        console.error('[POSPage] 422 detail:', data?.errors);
        setError(msg);
      } else {
        const msg = (e as Error)?.message ?? 'Gagal menyimpan transaksi';
        setError(msg);
      }
    } finally {
      setLoading(false);
      dlog('onSubmit finally: loading=false');
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <ProductSearch onPick={addItem} />
      </div>

      <div className="space-y-3">
        {/* Info cabang (read-only) agar kasir paham kontek transaksi */}
        <div className="rounded-2xl border p-3">
          <div className="text-xs text-muted-foreground">Cabang</div>
          <div className="text-sm font-semibold">{branchId || '-'}</div>
        </div>

        <CartPanel
          items={items}
          onChangeQty={onChangeQty}
          onChangeNote={onChangeNote}
          onRemove={onRemove}
        />

        {/* Order Photos */}
        <div className="rounded-2xl border p-3 space-y-3">
          <div className="text-sm font-semibold">Order Photos</div>
          <div className="grid gap-3 md:grid-cols-2">
            {/* BEFORE */}
            <div className="border rounded-xl p-3">
              <div className="text-xs font-medium mb-2">Before</div>
              <div
                className="border rounded-lg p-4 text-center text-xs"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = Array.from(e.dataTransfer.files || []);
                  setBeforeFiles(prev => [...prev, ...dropped]);
                }}
              >
                {isMobile ? (
                  <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => beforeRef.current?.click()}>
                    Buka Kamera
                  </button>
                ) : (
                  <>
                    <div className="mb-2">Drop file ke sini atau</div>
                    <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => beforeRef.current?.click()}>
                      Pilih File
                    </button>
                  </>
                )}
              </div>
              <input
                ref={beforeRef}
                type="file"
                accept="image/*"
                capture={isMobile ? "environment" : undefined}
                multiple
                className="hidden"
                onChange={(e) => {
                  const list = e.target.files ? Array.from(e.target.files) : [];
                  setBeforeFiles(prev => [...prev, ...list]);
                }}
              />
              {beforeFiles.length > 0 && (
                <ul className="mt-2 text-xs list-disc pl-5">
                  {beforeFiles.map((f, i) => <li key={i}>{f.name}</li>)}
                </ul>
              )}
            </div>

            {/* AFTER */}
            <div className="border rounded-xl p-3">
              <div className="text-xs font-medium mb-2">After</div>
              <div
                className="border rounded-lg p-4 text-center text-xs"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = Array.from(e.dataTransfer.files || []);
                  setAfterFiles(prev => [...prev, ...dropped]);
                }}
              >
                {isMobile ? (
                  <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => afterRef.current?.click()}>
                    Buka Kamera
                  </button>
                ) : (
                  <>
                    <div className="mb-2">Drop file ke sini atau</div>
                    <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => afterRef.current?.click()}>
                      Pilih File
                    </button>
                  </>
                )}
              </div>
              <input
                ref={afterRef}
                type="file"
                accept="image/*"
                capture={isMobile ? "environment" : undefined}
                multiple
                className="hidden"
                onChange={(e) => {
                  const list = e.target.files ? Array.from(e.target.files) : [];
                  setAfterFiles(prev => [...prev, ...list]);
                }}
              />
              {afterFiles.length > 0 && (
                <ul className="mt-2 text-xs list-disc pl-5">
                  {afterFiles.map((f, i) => <li key={i}>{f.name}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-3 space-y-2">
          <div className="grid gap-1">
            <label className="text-xs">
              Pelanggan <span className="text-red-600">*</span>
            </label>

            <CustomerPicker
              value={customerId}
              onChange={setCustomerId}
              placeholder="Ketik nama/WA/alamat pelanggan…"
              requiredText="Pelanggan wajib dipilih dari data terdaftar."
            />
          </div>
          {/* Voucher */}
          <div className="grid gap-1">
            <label className="text-xs">Kode Voucher</label>
            <div className="flex gap-2">
              <input
                className="border rounded px-3 py-2 flex-1"
                placeholder="MASUKKAN-KODE"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              />
              <span className="text-[10px] text-gray-500 self-center">
                Voucher diterapkan saat “Simpan & Cetak”
              </span>
            </div>
            {voucherMsg && <div className="text-xs text-gray-600">{voucherMsg}</div>}
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Diskon</label>
            <input
              type="number"
              min={0}
              className="border rounded px-3 py-2"
              value={discount}
              onChange={(e) => {
                const v = Number(e.target.value) || 0;
                dlog('discount input', v);
                setDiscount(v);
              }}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Catatan</label>
            <textarea
              className="border rounded px-3 py-2"
              value={notes}
              onChange={(e) => { dlog('notes input', e.target.value); setNotes(e.target.value); }}
            />
          </div>

          <div className="flex justify-between text-sm pt-2">
            <span>Grand Total</span>
            <span className="font-semibold">{toIDR(grand)}</span>
          </div>

          {/* Pembayaran */}
          <div className="pt-2 space-y-2">
            <div className="text-xs font-medium">Mode Pembayaran</div>
            <div className="flex gap-2">
              {(['PENDING', 'DP', 'FULL'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded border ${mode === m ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {mode === 'FULL' && (
              <div>
                <div className="text-xs font-medium mb-1">Metode</div>
                {(['CASH', 'QRIS', 'TRANSFER'] as PaymentMethod[]).map(pm => (
                  <button
                    key={pm}
                    onClick={() => setMethod(pm)}
                    className={`mr-2 mb-2 px-3 py-1 rounded border ${method === pm ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
                  >
                    {pm}
                  </button>
                ))}
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
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Masukkan nominal DP"
                />
                <div className="text-xs mt-1">Dibayar sekarang: <b>{toIDR(payableNow)}</b></div>
              </div>
            )}
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-2">
            <button
              disabled={loading || !canSubmit}   // <<< pakai canSubmit
              className="rounded bg-black text-white px-3 py-2 disabled:opacity-50"
              onClick={() => void onSubmit()}
            >
              {loading ? 'Menyimpan…' : 'Simpan & Cetak'}
            </button>

            <button
              type="button"
              className="rounded border px-3 py-2"
              onClick={() => { dlog('cancel/back clicked'); history.back(); }}
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
