// src/components/pos/CheckoutDialog.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createOrderPayment } from "../../api/orders";
import type { PaymentCreatePayload, PaymentMethod } from "../../types/payments";
import { applyVoucherToOrder } from "../../api/vouchers";
import type { Order } from "../../types/orders";
import { toIDR } from "../../utils/money";

type PayMode = 'PENDING' | 'DP' | PaymentMethod;

type Props = {
  open: boolean;
  onClose: () => void;
  order: Order;
  onPaid: (order: Order) => void;
};

const METHODS: PaymentMethod[] = ['CASH', 'QRIS', 'TRANSFER'];

export default function CheckoutDialog({ open, onClose, order, onPaid }: Props) {
  const [mode, setMode] = useState<PayMode>('PENDING');
  const [dpAmount, setDpAmount] = useState<number>(0);
  const [payAmount, setPayAmount] = useState<number>(order.grand_total);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [voucherCode, setVoucherCode] = useState<string>('');
  const [applyLoading, setApplyLoading] = useState<boolean>(false);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [applyErr, setApplyErr] = useState<string | null>(null);

  const due = useMemo(
    () => Math.max((order.grand_total ?? 0) - (order.paid_amount ?? 0), 0),
    [order.grand_total, order.paid_amount]
  );

  // focus voucher input saat dialog terbuka
  const voucherRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    setMode('PENDING');
    setDpAmount(0);
    setPayAmount(due);
    setErr(null);
    setVoucherCode('');
    setApplyMsg(null);
    setApplyErr(null);
    // small delay untuk memastikan render selesai
    setTimeout(() => voucherRef.current?.focus(), 0);
  }, [open, order.id, due]);

  async function onSubmit() {
    try {
      setErr(null);
      if (mode === 'PENDING') {
        onClose();
        onPaid(order);
        return;
      }

      let payload: PaymentCreatePayload;

      if (mode === 'DP') {
        const n = Number.isFinite(dpAmount) ? dpAmount : 0;
        if (n <= 0) throw new Error('Nominal DP harus > 0');
        if (n > due) throw new Error('DP melebihi sisa tagihan');
        payload = { method: 'DP', amount: n };
      } else {
        const n = Number.isFinite(payAmount) ? payAmount : 0;
        if (n <= 0) throw new Error('Nominal bayar harus > 0');
        if (n > due) throw new Error('Nominal bayar melebihi sisa tagihan');
        payload = { method: mode, amount: n };
      }

      setLoading(true);
      const { order: updated } = await createOrderPayment(order.id, payload);
      onPaid(updated);
      onClose();
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Gagal menyimpan pembayaran';
      setErr(m);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-elev-2 bg-(--color-surface) text-(--color-text-default) border border-(--color-border)"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-(--color-border)">
          <div id="checkout-title" className="text-lg font-semibold">Pembayaran</div>
          <div className="text-xs text-gray-600">
            Tagihan: {toIDR(order.grand_total)} · Sudah bayar: {toIDR(order.paid_amount)} · Sisa: {toIDR(due)}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Voucher */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Voucher</label>
            <div className="flex items-center gap-2">
              <input
                ref={voucherRef}
                className="input px-3 py-2 text-sm flex-1"
                placeholder="MASUKKAN-KODE"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              />
              <button
                type="button"
                className="btn-outline disabled:opacity-50"
                disabled={applyLoading || voucherCode.trim().length === 0}
                onClick={async () => {
                  setApplyLoading(true);
                  setApplyMsg(null);
                  setApplyErr(null);
                  try {
                    const res = await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
                    const updated = res.order as Order;
                    onPaid(updated);
                    const pot = typeof (res).applied_amount === 'number' ? (res).applied_amount : 0;
                    setApplyMsg(`Voucher diterapkan. Potongan: ${toIDR(pot)}`);
                  } catch (ex: unknown) {
                    const statusObj = ex as { response?: { status?: number } };
                    const status = typeof statusObj?.response?.status === 'number' ? statusObj.response!.status! : 0;
                    if (status === 422) setApplyErr('Voucher tidak valid / tidak memenuhi syarat');
                    else if (status === 403) setApplyErr('Tidak berwenang menerapkan voucher untuk order ini');
                    else setApplyErr('Gagal menerapkan voucher');
                  } finally {
                    setApplyLoading(false);
                  }
                }}
              >
                {applyLoading ? 'Menerapkan…' : 'Terapkan'}
              </button>
            </div>
            {applyMsg && <div className="text-xs text-green-700">{applyMsg}</div>}
            {applyErr && <div className="text-xs text-red-600">{applyErr}</div>}
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Mode</label>
            <div className="inline-flex rounded-lg border border-(--color-border) overflow-hidden">
              {(['PENDING', 'DP', ...METHODS] as PayMode[]).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? 'bg-(--color-brand-primary) text-(--color-brand-on)'
                        : 'bg-white hover:bg-black/5'
                    }`}
                    aria-pressed={active}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DP input */}
          {mode === 'DP' && (
            <div>
              <label className="block text-sm mb-1">Nominal DP</label>
              <input
                type="number"
                min={1}
                max={due}
                value={dpAmount}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(Number(e.target.value || 0), due));
                  setDpAmount(v);
                }}
                className="input px-3 py-2 w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Maksimal {toIDR(due)}</div>
            </div>
          )}

          {/* Pay amount input */}
          {mode !== 'PENDING' && mode !== 'DP' && (
            <div>
              <label className="block text-sm mb-1">Nominal Bayar</label>
              <input
                type="number"
                min={1}
                max={due}
                value={payAmount}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(Number(e.target.value || 0), due));
                  setPayAmount(v);
                }}
                className="input px-3 py-2 w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Sisa tagihan: {toIDR(due)}</div>
            </div>
          )}

          {err && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
            >
              {err}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-(--color-border) flex items-center justify-end gap-2">
          <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary disabled:opacity-60"
            onClick={() => void onSubmit()}
            disabled={loading}
          >
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
