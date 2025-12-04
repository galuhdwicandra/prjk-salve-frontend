// src/components/receivables/SettleReceivableDialog.tsx
import { useEffect, useMemo, useState } from "react";
import type { Receivable, ReceivableSettleResult } from "../../types/receivables";
import type { PaymentMethod } from "../../types/payments";
import { settleReceivable } from "../../api/receivables";
import { toIDR } from "../../utils/money";
import { openOrderReceipt } from "../../api/orders";
import type { Order } from "../../types/orders";
import { buildWhatsAppLink } from "../../utils/wa";

type Props = {
  open: boolean;
  receivable: Receivable | null;
  onClose: () => void;
  onSettled?: (r: Receivable) => void;
};

const METHODS: PaymentMethod[] = ["CASH", "QRIS", "TRANSFER"];

function extractOrderId(
  order: Order | { order: Order; [k: string]: unknown } | undefined
): string | null {
  if (!order) return null;
  if ("id" in order && typeof (order as Order).id === "string") {
    return (order as Order).id;
  }
  if ("order" in (order as { order: Order })) {
    return (order as { order: Order }).order?.id ?? null;
  }
  return null;
}

function buildReceiptMessage(receivable: Receivable, receiptUrl: string): string {
  const inv = receivable.order?.invoice_no ?? "-";
  const total = toIDR(receivable.order?.grand_total ?? 0);
  return [
    "Terima kasih atas pembayarannya.",
    `Kwitansi: ${receiptUrl}`,
    `No: ${inv}`,
    `Total: ${total}`,
    "— Salve Laundry",
  ].join("\n");
}

export default function SettleReceivableDialog({ open, receivable, onClose, onSettled }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [paidAt, setPaidAt] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (open && receivable) {
      setAmount(receivable.remaining_amount);
      setMethod("CASH");
      setPaidAt(new Date().toISOString().slice(0, 16)); // "YYYY-MM-DDTHH:mm"
      setNote("");
      setErr("");
    }
  }, [open, receivable]);

  const disabled = useMemo(() => {
    if (!receivable) return true;
    return amount <= 0 || amount > receivable.remaining_amount || loading;
  }, [amount, loading, receivable]);

  const customerPhone =
    receivable?.order?.customer?.phone ||
    receivable?.order?.customer?.whatsapp ||
    "";
  const canWhatsApp = Boolean(customerPhone);

  if (!open || !receivable) return null;

  const onSubmit = async (withWA = false) => {
    if (!receivable) return;
    setLoading(true);
    setErr("");
    try {
      const res = await settleReceivable(receivable.id, {
        amount,
        method,
        paid_at: paidAt ? new Date(paidAt).toISOString() : undefined,
        note: note || undefined,
      });
      const payload = res.data.data as ReceivableSettleResult;
      const next = payload.receivable;

      if (next.status === "SETTLED") {
        const orderId = payload.order_id ?? extractOrderId(payload.order as any);
        if (orderId && !withWA) {
          await openOrderReceipt(orderId, true);
        }
        const receiptUrl =
          payload.share_url /* prioritas: link publik */ ??
          payload.receipt_url ??
          (orderId ? `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/receipt` : "");

        if (withWA && receiptUrl && customerPhone) {
          const msg = buildReceiptMessage(receivable, receiptUrl);
          const wa = buildWhatsAppLink(customerPhone, msg);
          window.open(wa, "_blank");
        }
      }

      onSettled?.(next);
      onClose();
    } catch {
      setErr("Gagal memproses pelunasan. Periksa nominal/metode, atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settle-title"
    >
      <div className="w-full max-w-md rounded-lg border border-[color:var(--color-border)] bg-[var(--color-surface)] p-6 shadow-elev-2">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 id="settle-title" className="text-lg font-semibold tracking-tight">
              Pelunasan Piutang
            </h3>
            <p className="text-xs text-gray-600">Lengkapi detail pembayaran di bawah ini</p>
          </div>
        </div>

        {/* Info ringkas */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-md border border-[color:var(--color-border)] bg-white p-3 text-sm">
          <div>
            <div className="text-gray-600">Invoice</div>
            <div className="font-medium">{receivable.order?.invoice_no ?? "-"}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-600">Total</div>
            <div className="font-semibold">{toIDR(receivable.order?.grand_total ?? 0)}</div>
          </div>
          <div>
            <div className="text-gray-600">Terbayar</div>
            <div className="tabular-nums">{toIDR(receivable.order?.paid_amount ?? 0)}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-600">Sisa</div>
            <span className="chip chip--subtle font-semibold">
              {toIDR(receivable.remaining_amount)}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <label className="block text-sm" htmlFor="amount">
            Nominal Pelunasan
            <input
              id="amount"
              type="number"
              min={0}
              max={receivable.remaining_amount}
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input mt-1"
              autoFocus
              inputMode="numeric"
            />
          </label>

          <label className="block text-sm" htmlFor="method">
            Metode
            <select
              id="method"
              className="input mt-1"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm" htmlFor="paid_at">
            Tanggal Bayar
            <input
              id="paid_at"
              type="datetime-local"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="input mt-1"
            />
          </label>

          <label className="block text-sm" htmlFor="note">
            Catatan (opsional)
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input mt-1"
            />
          </label>

          {err ? (
            <p role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </p>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline" type="button">
            Batal
          </button>

          <button
            onClick={() => onSubmit(false)}
            disabled={disabled}
            className="btn-primary disabled:opacity-50"
            type="button"
          >
            {loading ? "Memproses..." : "Lunasi"}
          </button>

          {canWhatsApp && (
            <button
              onClick={() => onSubmit(true)}
              disabled={disabled}
              title="Lunasi dan kirim link kwitansi via WhatsApp"
              type="button"
              className="btn text-[color:var(--color-brand-on)] disabled:opacity-50"
              style={{ background: "var(--color-status-success)" }}
            >
              {loading ? "Memproses..." : "Lunasi & Kirim WA"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
