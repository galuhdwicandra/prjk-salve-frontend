import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listAccountingAccounts, transferAccountingFunds } from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import { useShowBalance } from '../../store/useAuth';
import { toIDR } from '../../utils/money';
import type { AccountingAccount, AccountingFundTransferPayload } from '../../types/accounting';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function projectedBalance(account: AccountingAccount | undefined, debit: number, credit: number): number {
  if (!account) return 0;

  const current = Number(account.balance ?? 0);

  return account.normal_balance === 'DEBIT' ? current + debit - credit : current + credit - debit;
}

const initialForm: AccountingFundTransferPayload = {
  journal_date: today(),
  description: '',
  from_account_id: '',
  to_account_id: '',
  amount: 0,
};

export default function JournalTransferForm() {
  const navigate = useNavigate();
  const showBalance = useShowBalance();

  const [form, setForm] = useState<AccountingFundTransferPayload>(initialForm);
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fromAccount = useMemo(
    () => accounts.find((a) => a.id === form.from_account_id),
    [accounts, form.from_account_id]
  );

  const toAccount = useMemo(
    () => accounts.find((a) => a.id === form.to_account_id),
    [accounts, form.to_account_id]
  );

  const isValid =
    form.from_account_id !== '' &&
    form.to_account_id !== '' &&
    form.from_account_id !== form.to_account_id &&
    Number(form.amount) > 0 &&
    form.journal_date !== '';

  function setValue<K extends keyof AccountingFundTransferPayload>(
    key: K,
    value: AccountingFundTransferPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadAccounts() {
    const res = await listAccountingAccounts({ per_page: 300, is_active: true });
    setAccounts(Array.isArray(res.data) ? res.data : []);
  }

  function goToReview(e: FormEvent) {
    e.preventDefault();

    if (!isValid) {
      setError('Lengkapi akun asal, akun tujuan (berbeda), dan jumlah transfer.');
      return;
    }

    setError('');
    setStep('review');
  }

  async function confirmTransfer() {
    setSaving(true);
    setError('');

    try {
      await transferAccountingFunds({
        ...form,
        amount: Number(form.amount),
      });

      navigate('/accounting/journals');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memproses transfer dana.'));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void loadAccounts();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transfer Dana</h1>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Pindahkan saldo antar akun. Jurnal akan langsung berstatus posted.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {step === 'form' ? (
        <form
          onSubmit={goToReview}
          className="space-y-5 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">Tanggal</span>
              <input
                type="date"
                value={form.journal_date}
                onChange={(e) => setValue('journal_date', e.target.value)}
                className="input"
                required
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Deskripsi</span>
              <input
                value={form.description ?? ''}
                onChange={(e) => setValue('description', e.target.value)}
                className="input"
                placeholder="Opsional"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Dari Akun</span>
              <select
                value={form.from_account_id}
                onChange={(e) => setValue('from_account_id', e.target.value)}
                className="input"
                required
              >
                <option value="">Pilih akun asal</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Ke Akun</span>
              <select
                value={form.to_account_id}
                onChange={(e) => setValue('to_account_id', e.target.value)}
                className="input"
                required
              >
                <option value="">Pilih akun tujuan</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Jumlah</span>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setValue('amount', Number(e.target.value || 0))}
                className="input"
                min={0}
                required
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-[color:var(--color-border)] pt-4">
            <Link to="/accounting/journals" className="btn-outline">
              Batal
            </Link>

            <button type="submit" className="btn-primary">
              Tinjau Transfer
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-5 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <div>
              <span className="text-[color:var(--color-text-muted)]">Tanggal</span>
              <p className="font-medium">{form.journal_date}</p>
            </div>
            <div>
              <span className="text-[color:var(--color-text-muted)]">Jumlah</span>
              <p className="font-medium">{toIDR(Number(form.amount))}</p>
            </div>
            <div>
              <span className="text-[color:var(--color-text-muted)]">Deskripsi</span>
              <p className="font-medium">{form.description || '-'}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">
                <tr>
                  <th className="px-4 py-3">Akun</th>
                  {showBalance ? <th className="px-4 py-3 text-right">Saldo Sebelum</th> : null}
                  {showBalance ? <th className="px-4 py-3 text-right">Saldo Sesudah</th> : null}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[color:var(--color-border)]">
                  <td className="px-4 py-3">
                    {fromAccount ? `${fromAccount.code} - ${fromAccount.name}` : '-'} (asal)
                  </td>
                  {showBalance ? (
                    <td className="px-4 py-3 text-right">{toIDR(Number(fromAccount?.balance ?? 0))}</td>
                  ) : null}
                  {showBalance ? (
                    <td className="px-4 py-3 text-right">
                      {toIDR(projectedBalance(fromAccount, 0, Number(form.amount)))}
                    </td>
                  ) : null}
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    {toAccount ? `${toAccount.code} - ${toAccount.name}` : '-'} (tujuan)
                  </td>
                  {showBalance ? (
                    <td className="px-4 py-3 text-right">{toIDR(Number(toAccount?.balance ?? 0))}</td>
                  ) : null}
                  {showBalance ? (
                    <td className="px-4 py-3 text-right">
                      {toIDR(projectedBalance(toAccount, Number(form.amount), 0))}
                    </td>
                  ) : null}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 border-t border-[color:var(--color-border)] pt-4">
            <button type="button" onClick={() => setStep('form')} disabled={saving} className="btn-outline">
              Kembali
            </button>

            <button type="button" onClick={confirmTransfer} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Memproses...' : 'Konfirmasi Transfer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
