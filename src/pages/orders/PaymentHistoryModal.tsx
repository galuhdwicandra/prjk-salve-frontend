import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { deleteOrderPayment, updateOrderPayment } from '../../api/orders';
import { useActivePaymentMethods } from '../../hooks/useActivePaymentMethods';
import { rp } from '../../utils/money';
import { fmtDate, toLocalYMD } from '../../utils/date';
import type { Order } from '../../types/orders';
import type { Payment } from '../../types/payments';

type Props = {
  order: Order;
  onClose: () => void;
  onChanged: (order: Order) => void | Promise<void>;
};

type Draft = {
  method: string;
  amount: string;
  paidAt: string;
};

export default function PaymentHistoryModal({ order, onClose, onChanged }: Props) {
  const methods = useActivePaymentMethods();
  const payments = order.payments ?? [];

  const [editing, setEditing] = useState<Payment | null>(null);
  const [draft, setDraft] = useState<Draft>({ method: '', amount: '', paidAt: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(payment: Payment) {
    setError(null);
    setEditing(payment);
    setDraft({
      method: payment.method,
      amount: String(Math.round(Number(payment.amount))),
      paidAt: toLocalYMD(payment.paid_at ?? payment.created_at),
    });
  }

  async function save() {
    if (!editing) return;

    const amount = Number(draft.amount.replace(/\D/g, ''));

    if (amount <= 0) {
      setError('Nominal pembayaran harus lebih dari 0.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const updated = await updateOrderPayment(order.id, editing.id, {
        method: draft.method,
        amount,
        paid_at: draft.paidAt || null,
      });

      setEditing(null);
      await onChanged(updated);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan pembayaran.'));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!editing) return;

    setBusy(true);
    setError(null);

    try {
      const updated = await deleteOrderPayment(order.id, editing.id);
      setEditing(null);
      await onChanged(updated);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus pembayaran.'));
    } finally {
      setBusy(false);
    }
  }

  const title = editing ? 'Edit Pembayaran' : 'Histori Pembayaran';

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label={title}>
      <div className="box">
        <div className="modal-head">
          <div>
            <h3>
              {title} {'\u00b7'} {order.invoice_no ?? order.number}
            </h3>
            {editing ? null : (
              <div className="mini">
                Total dibayar {rp(Number(order.paid_amount))} dari {rp(Number(order.grand_total))}
              </div>
            )}
          </div>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        {editing ? (
          <>
            <div className="field">
              <label htmlFor="payment_method">Metode Pembayaran</label>
              <select
                id="payment_method"
                value={draft.method}
                disabled={busy}
                onChange={(e) => setDraft((prev) => ({ ...prev, method: e.target.value }))}
              >
                {methods.map((method) => (
                  <option key={method.code} value={method.code}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="payment_amount">Nominal Pembayaran</label>
              <input
                id="payment_amount"
                type="text"
                inputMode="numeric"
                value={draft.amount}
                disabled={busy}
                onChange={(e) => setDraft((prev) => ({ ...prev, amount: e.target.value.replace(/\D/g, '') }))}
              />
            </div>

            <div className="field">
              <label htmlFor="payment_date">Tanggal Pembayaran</label>
              <input
                id="payment_date"
                type="date"
                value={draft.paidAt}
                disabled={busy}
                onChange={(e) => setDraft((prev) => ({ ...prev, paidAt: e.target.value }))}
              />
            </div>

            <div className="modal-foot">
              <button type="button" className="btn danger" disabled={busy} onClick={() => void remove()}>
                Hapus
              </button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button type="button" className="btn ghost" disabled={busy} onClick={() => setEditing(null)}>
                  Kembali
                </button>
                <button type="button" className="btn" disabled={busy} onClick={() => void save()}>
                  {busy ? 'Menyimpan\u2026' : 'Simpan'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mini" style={{ marginBottom: 12 }}>
              Klik salah satu baris untuk mengedit bila ada kesalahan input.
            </div>

            {payments.length === 0 ? (
              <div className="empty">Belum ada pembayaran tercatat.</div>
            ) : (
              payments.map((payment) => (
                <button
                  key={payment.id}
                  type="button"
                  onClick={() => startEdit(payment)}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '14px 16px',
                    marginBottom: 8,
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-sm)',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>
                    <b>{rp(Number(payment.amount))}</b>{' '}
                    <span className="mini">{payment.method}</span>
                  </span>
                  <span className="mini">{fmtDate(payment.paid_at ?? payment.created_at)}</span>
                </button>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
