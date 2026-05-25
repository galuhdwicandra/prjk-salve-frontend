import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createAccountingAccountMapping,
  getAccountingAccountMapping,
  listAccountingAccounts,
  updateAccountingAccountMapping,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import type {
  AccountingAccount,
  AccountingAccountMappingPayload,
  AccountingEventKey,
} from '../../types/accounting';

const EVENT_KEYS: AccountingEventKey[] = [
  'ORDER_PAID_CASH',
  'ORDER_PAID_QRIS',
  'ORDER_PAID_TRANSFER',
  'ORDER_RECEIVABLE_CREATED',
  'RECEIVABLE_SETTLED_CASH',
  'EXPENSE_CASH_BOX',
  'EXPENSE_NON_CASH',
  'CASH_OPENING_FLOAT',
  'CASH_WITHDRAWAL',
  'CASH_ADJUSTMENT_IN',
  'CASH_ADJUSTMENT_OUT',
  'ORDER_DISCOUNT',
];

const initialForm: AccountingAccountMappingPayload = {
  branch_id: null,
  event_key: 'ORDER_PAID_CASH',
  payment_method: '',
  expense_category: '',
  debit_account_id: '',
  credit_account_id: '',
  is_active: true,
};

export default function AccountMappingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<AccountingAccountMappingPayload>(initialForm);
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pageTitle = useMemo(() => (isEdit ? 'Edit Mapping Akun' : 'Tambah Mapping Akun'), [isEdit]);

  function setValue<K extends keyof AccountingAccountMappingPayload>(
    key: K,
    value: AccountingAccountMappingPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadAccounts() {
    const res = await listAccountingAccounts({ per_page: 300, is_active: true });
    setAccounts(Array.isArray(res.data) ? res.data : []);
  }

  async function loadDetail(mappingId: string) {
    setLoading(true);

    try {
      const res = await getAccountingAccountMapping(mappingId);
      const row = res.data;

      setForm({
        branch_id: row.branch_id,
        event_key: row.event_key,
        payment_method: row.payment_method ?? '',
        expense_category: row.expense_category ?? '',
        debit_account_id: row.debit_account_id,
        credit_account_id: row.credit_account_id,
        is_active: row.is_active,
      });
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal memuat mapping akun.'));
      navigate('/accounting/account-mappings');
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (form.debit_account_id === form.credit_account_id) {
      alert('Akun debit dan kredit tidak boleh sama.');
      return;
    }

    setSaving(true);

    const payload: AccountingAccountMappingPayload = {
      ...form,
      payment_method: form.payment_method?.trim() || null,
      expense_category: form.expense_category?.trim() || null,
    };

    try {
      if (id) {
        await updateAccountingAccountMapping(id, payload);
      } else {
        await createAccountingAccountMapping(payload);
      }

      navigate('/accounting/account-mappings');
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menyimpan mapping akun.'));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadAccounts();

    if (id) {
      loadDetail(id);
    }
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Pilih pasangan debit dan kredit untuk event transaksi existing.
          </p>
        </div>

        <Link to="/accounting/account-mappings" className="btn-outline">
          Kembali
        </Link>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      >
        {loading ? (
          <div className="text-sm text-[color:var(--color-text-muted)]">Memuat data...</div>
        ) : null}

        <label className="space-y-1">
          <span className="text-sm font-medium">Event Transaksi</span>
          <select
            value={form.event_key}
            onChange={(e) => setValue('event_key', e.target.value as AccountingEventKey)}
            className="input"
          >
            {EVENT_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Metode Bayar</span>
            <input
              value={form.payment_method ?? ''}
              onChange={(e) => setValue('payment_method', e.target.value)}
              className="input"
              placeholder="Contoh: CASH / QRIS / TRANSFER"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Kategori Expense</span>
            <input
              value={form.expense_category ?? ''}
              onChange={(e) => setValue('expense_category', e.target.value)}
              className="input"
              placeholder="Opsional"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Akun Debit</span>
            <select
              value={form.debit_account_id}
              onChange={(e) => setValue('debit_account_id', e.target.value)}
              className="input"
              required
            >
              <option value="">Pilih akun debit</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Akun Kredit</span>
            <select
              value={form.credit_account_id}
              onChange={(e) => setValue('credit_account_id', e.target.value)}
              className="input"
              required
            >
              <option value="">Pilih akun kredit</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] p-3 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setValue('is_active', e.target.checked)}
          />
          Mapping aktif
        </label>

        <div className="flex justify-end gap-2 border-t border-[color:var(--color-border)] pt-4">
          <Link to="/accounting/account-mappings" className="btn-outline">
            Batal
          </Link>

          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}