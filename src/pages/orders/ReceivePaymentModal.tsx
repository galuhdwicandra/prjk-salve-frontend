import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getErrorMessage } from '../../api/client';
import { createOrderPayment } from '../../api/orders';
import QrisPreview from '../../components/pos/QrisPreview';
import { useActivePaymentMethods } from '../../hooks/useActivePaymentMethods';
import type { Order } from '../../types/orders';
import { todayLocalYMD } from '../../utils/date';
import { rp } from '../../utils/money';

type Props = {
  order: Order;
  onClose: () => void;
  onSaved: (order: Order) => void | Promise<void>;
};

export default function ReceivePaymentModal({
  order,
  onClose,
  onSaved,
}: Props) {
  const paymentMethods = useActivePaymentMethods();
  const due = Math.max(
    Number(order.grand_total) - Number(order.paid_amount),
    0,
  );

  const [method, setMethod] = useState(
    () => paymentMethods[0]?.code ?? '',
  );
  const [amount, setAmount] = useState(String(Math.round(due)));
  const [paidAt, setPaidAt] = useState(todayLocalYMD());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethods.some((item) => item.code === method)) return;

    setMethod(paymentMethods[0]?.code ?? '');
  }, [method, paymentMethods]);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!method) {
      setError('Metode pembayaran belum tersedia.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Nominal pembayaran harus lebih dari 0.');
      return;
    }

    if (numericAmount > due) {
      setError('Nominal pembayaran melebihi sisa tagihan.');
      return;
    }

    if (!paidAt) {
      setError('Tanggal pembayaran wajib diisi.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const { order: updated } = await createOrderPayment(order.id, {
        method,
        amount: numericAmount,
        paid_at: paidAt,
      });

      await onSaved(updated);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan pembayaran.'));
    } finally {
      setBusy(false);
    }
  }

  const customerName =
    order.customer?.name ??
    order.customer_name ??
    'Pelanggan';

  const formattedAmount = amount
    ? Number(amount).toLocaleString('id-ID')
    : '';

  const selectedPaymentMethod = paymentMethods.find(
    (paymentMethod) => paymentMethod.code === method,
  );

  const isQris =
    /qris/i.test(method) ||
    /qris/i.test(selectedPaymentMethod?.name ?? '');

  const qrisAmount = Number(amount);

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receive-payment-title"
    >
      <form
        className="box"
        style={{ maxWidth: 504, padding: 20 }}
        onSubmit={submitPayment}
      >
        <div className="modal-head">
          <div>
            <h3 id="receive-payment-title">
              Terima Pembayaran {'\u00b7'}{' '}
              {order.invoice_no ?? order.number}
            </h3>

            <div className="mini">
              {customerName} {'\u00b7'} sisa {rp(due)}
            </div>
          </div>

          <button
            type="button"
            className="mclose"
            aria-label="Tutup"
            disabled={busy}
            onClick={onClose}
          >
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div
            role="alert"
            style={{
              marginBottom: 12,
              color: 'var(--danger)',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="receive_payment_method">
            Metode Pembayaran
          </label>

          <select
            id="receive_payment_method"
            value={method}
            disabled={busy || paymentMethods.length === 0}
            required
            onChange={(event) => setMethod(event.target.value)}
          >
            {paymentMethods.map((paymentMethod) => (
              <option
                key={paymentMethod.code}
                value={paymentMethod.code}
              >
                {paymentMethod.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="receive_payment_amount">
            Nominal Pembayaran
          </label>

          <input
            id="receive_payment_amount"
            type="text"
            inputMode="numeric"
            value={formattedAmount}
            disabled={busy}
            required
            onChange={(event) => {
              setAmount(event.target.value.replace(/\D/g, ''));
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="receive_payment_date">
            Tanggal Pembayaran
          </label>

          <input
            id="receive_payment_date"
            type="date"
            value={paidAt}
            disabled={busy}
            required
            onChange={(event) => setPaidAt(event.target.value)}
          />
        </div>

        {isQris &&
          Number.isFinite(qrisAmount) &&
          qrisAmount > 0 &&
          qrisAmount <= due ? (
          <QrisPreview
            amount={qrisAmount}
            variant="receipt-payment"
          />
        ) : null}

        <div className="modal-foot">
          <button
            type="button"
            className="btn ghost"
            disabled={busy}
            onClick={onClose}
          >
            Batal
          </button>

          <button
            type="submit"
            className="btn"
            style={{ marginLeft: 'auto' }}
            disabled={busy || paymentMethods.length === 0}
          >
            {busy ? 'Menyimpan\u2026' : 'Simpan Pembayaran'}
          </button>
        </div>
      </form>
    </div>
  );
}