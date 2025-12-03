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
    order: Order | { order: Order;[k: string]: unknown } | undefined
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
        "— Salve Laundry"
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
                    payload.share_url /* prioritas: link publik */
                    ?? payload.receipt_url
                    ?? (orderId ? `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/receipt` : "");

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold">Pelunasan Piutang</h3>
                <div className="space-y-3">
                    <div className="text-sm">
                        <div>Invoice: <strong>{receivable.order?.invoice_no ?? "-"}</strong></div>
                        <div>Total: <strong>{toIDR(receivable.order?.grand_total ?? 0)}</strong></div>
                        <div>Terbayar: <strong>{toIDR(receivable.order?.paid_amount ?? 0)}</strong></div>
                        <div className="mt-1">
                            Sisa: <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold">
                                {toIDR(receivable.remaining_amount)}
                            </span>
                        </div>
                    </div>
                    <label className="block text-sm">
                        Nominal Pelunasan
                        <input
                            type="number"
                            min={0}
                            max={receivable.remaining_amount}
                            step="100"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                    </label>
                    <label className="block text-sm">
                        Metode
                        <select
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                            value={method}
                            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                        >
                            {METHODS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        Tanggal Bayar
                        <input
                            type="datetime-local"
                            value={paidAt}
                            onChange={(e) => setPaidAt(e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                    </label>
                    <label className="block text-sm">
                        Catatan (opsional)
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                    </label>
                    {err ? <p className="text-sm text-red-600">{err}</p> : null}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded-xl border px-4 py-2">Batal</button>
                    <button
                        onClick={() => onSubmit(false)}
                        disabled={disabled}
                        className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Lunasi"}
                    </button>
                    {canWhatsApp && (
                        <button
                            onClick={() => onSubmit(true)}
                            disabled={disabled}
                            title="Lunasi dan kirim link kwitansi via WhatsApp"
                            className="rounded-xl bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {loading ? "Memproses..." : "Lunasi & Kirim WA"}
                        </button>
                    )}
                </div>
            </div >
        </div >
    );
}
