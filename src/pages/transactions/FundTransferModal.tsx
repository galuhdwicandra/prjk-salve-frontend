import { useMemo, useState } from 'react';
import { createCashTransfer } from '../../api/cashTransactions';
import { getErrorMessage } from '../../api/client';
import { useShowBalance } from '../../store/useAuth';
import type { AccountingAccount } from '../../types/accounting';
import type { FeeBearer } from '../../types/cash-transactions';
import { todayLocalYMD } from '../../utils/date';
import { rp } from '../../utils/money';

type Props = {
  accounts: AccountingAccount[];
  branchId: string;
  onClose: () => void;
  onDone: (message: string) => void;
};

function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function FundTransferModal({ accounts, branchId, onClose, onDone }: Props) {
  const showBalance = useShowBalance();

  const [fromId, setFromId] = useState(accounts[0]?.id ?? '');
  const [toId, setToId] = useState(accounts[1]?.id ?? '');
  const [amount, setAmount] = useState(0);
  const [trxDate, setTrxDate] = useState(todayLocalYMD());
  const [description, setDescription] = useState('');
  const [hasFee, setHasFee] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeBearer, setFeeBearer] = useState<FeeBearer>('SENDER');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = accounts.find((row) => row.id === fromId) ?? null;
  const to = accounts.find((row) => row.id === toId) ?? null;
  const fee = hasFee ? feeAmount : 0;

  const preview = useMemo(() => {
    const fromBefore = toNumber(from?.balance);
    const toBefore = toNumber(to?.balance);
    const fromDelta = -(amount + (feeBearer === 'SENDER' ? fee : 0));
    const toDelta = amount - (feeBearer === 'RECEIVER' ? fee : 0);

    return [
      { name: from?.name ?? '\u2014', before: fromBefore, after: fromBefore + fromDelta, delta: fromDelta },
      { name: to?.name ?? '\u2014', before: toBefore, after: toBefore + toDelta, delta: toDelta },
    ];
  }, [from, to, amount, fee, feeBearer]);

  async function submit() {
    if (!fromId || !toId || fromId === toId) {
      setError('Akun asal dan tujuan harus berbeda.');
      return;
    }

    if (amount <= 0) {
      setError('Nominal transfer harus lebih dari nol.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createCashTransfer({
        branch_id: branchId || null,
        trx_date: trxDate,
        from_account_id: fromId,
        to_account_id: toId,
        amount,
        description: description.trim() || null,
        fee_amount: fee,
        fee_bearer: feeBearer,
      });

      onDone('Pindah dana tersimpan.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan pindah dana'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label="Pindah Dana">
      <div className="box">
        <div className="modal-head">
          <h3>Pindah Dana</h3>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="grid2">
          <div className="field">
            <label htmlFor="tf-from">Transfer Dari</label>
            <select id="tf-from" value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {accounts.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="tf-to">Transfer Ke</label>
            <select id="tf-to" value={toId} onChange={(e) => setToId(e.target.value)}>
              {accounts.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="tf-amount">Nominal (Rp)</label>
            <input
              id="tf-amount"
              inputMode="numeric"
              value={amount.toLocaleString('id-ID')}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
            />
          </div>

          <div className="field">
            <label htmlFor="tf-date">Tanggal</label>
            <input id="tf-date" type="date" value={trxDate} onChange={(e) => setTrxDate(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="tf-desc">Deskripsi (opsional)</label>
          <textarea
            id="tf-desc"
            rows={2}
            maxLength={1000}
            value={description}
            placeholder="mis. isi saldo operasional"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="switch-row" style={{ marginBottom: 14 }}>
          <label className="switch">
            <input type="checkbox" checked={hasFee} onChange={(e) => setHasFee(e.target.checked)} />
            <span className="slider" />
          </label>
          <span>Ada biaya admin</span>
        </div>

        {hasFee ? (
          <div className="grid2">
            <div className="field">
              <label htmlFor="tf-fee">Nominal Biaya (Rp)</label>
              <input
                id="tf-fee"
                inputMode="numeric"
                value={feeAmount.toLocaleString('id-ID')}
                onChange={(e) => setFeeAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
              />
            </div>

            <div className="field">
              <label htmlFor="tf-bearer">Ditanggung oleh</label>
              <select id="tf-bearer" value={feeBearer} onChange={(e) => setFeeBearer(e.target.value as FeeBearer)}>
                <option value="SENDER">Pengirim</option>
                <option value="RECEIVER">Penerima</option>
              </select>
            </div>
          </div>
        ) : null}

        {showBalance ? (
          <div className="field">
            <label>Pengaruh Saldo</label>
            {preview.map((row) => (
              <div key={row.name} className="trx-sum" style={{ background: 'var(--soft)', borderRadius: 9, padding: '10px 12px', marginBottom: 6 }}>
                <b>{row.name}</b>
                <span className="mini">
                  Saldo {rp(row.before)} {'\u2192'} {rp(row.after)}{' '}
                  <span className="chip" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
                    {row.delta >= 0 ? '+' : '-'} {rp(Math.abs(row.delta))}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <button type="button" className="btn block" disabled={saving} onClick={() => void submit()}>
          {saving ? 'Menyimpan\u2026' : 'Simpan Pindah Dana'}
        </button>
      </div>
    </div>
  );
}
