import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createAccountingAccount,
  getAccountingAccount,
  listAccountingAccounts,
  updateAccountingAccount,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import type {
  AccountingAccount,
  AccountingAccountPayload,
  AccountingAccountType,
  AccountingNormalBalance,
} from '../../types/accounting';

const initialForm: AccountingAccountPayload = {
  branch_id: null,
  parent_id: null,
  code: '',
  name: '',
  type: 'ASSET',
  normal_balance: 'DEBIT',
  is_cash_account: false,
  is_active: true,
  sort_order: 0,
};

function normalByType(type: AccountingAccountType): AccountingNormalBalance {
  if (type === 'ASSET' || type === 'EXPENSE') return 'DEBIT';
  return 'CREDIT';
}

export default function AccountForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<AccountingAccountPayload>(initialForm);
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pageTitle = useMemo(() => (isEdit ? 'Edit Akun' : 'Tambah Akun'), [isEdit]);

  function setValue<K extends keyof AccountingAccountPayload>(key: K, value: AccountingAccountPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadOptions() {
    const res = await listAccountingAccounts({ per_page: 200, is_active: true });
    setAccounts(Array.isArray(res.data) ? res.data : []);
  }

  async function loadDetail(accountId: string) {
    setLoading(true);

    try {
      const res = await getAccountingAccount(accountId);
      const row = res.data;

      setForm({
        branch_id: row.branch_id,
        parent_id: row.parent_id,
        code: row.code,
        name: row.name,
        type: row.type,
        normal_balance: row.normal_balance,
        is_cash_account: row.is_cash_account,
        is_active: row.is_active,
        sort_order: row.sort_order ?? 0,
      });
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal memuat akun.'));
      navigate('/accounting/accounts');
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        await updateAccountingAccount(id, form);
      } else {
        await createAccountingAccount(form);
      }

      navigate('/accounting/accounts');
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menyimpan akun.'));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadOptions();

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
            Normal balance akan mengikuti tipe akun agar COA tetap konsisten.
          </p>
        </div>

        <Link to="/accounting/accounts" className="btn-outline">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Kode Akun</span>
            <input
              value={form.code}
              onChange={(e) => setValue('code', e.target.value)}
              className="input"
              required
              maxLength={32}
              placeholder="Contoh: 1010"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Nama Akun</span>
            <input
              value={form.name}
              onChange={(e) => setValue('name', e.target.value)}
              className="input"
              required
              maxLength={150}
              placeholder="Contoh: Kas Cabang"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Tipe</span>
            <select
              value={form.type}
              onChange={(e) => {
                const nextType = e.target.value as AccountingAccountType;
                setForm((prev) => ({
                  ...prev,
                  type: nextType,
                  normal_balance: normalByType(nextType),
                }));
              }}
              className="input"
            >
              <option value="ASSET">Aset</option>
              <option value="LIABILITY">Liabilitas</option>
              <option value="EQUITY">Ekuitas</option>
              <option value="REVENUE">Pendapatan</option>
              <option value="EXPENSE">Beban</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Normal Balance</span>
            <select
              value={form.normal_balance}
              onChange={(e) => setValue('normal_balance', e.target.value as AccountingNormalBalance)}
              className="input"
            >
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Akun Induk</span>
            <select
              value={form.parent_id ?? ''}
              onChange={(e) => setValue('parent_id', e.target.value || null)}
              className="input"
            >
              <option value="">Tidak ada</option>
              {accounts
                .filter((account) => account.id !== id)
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Urutan</span>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setValue('sort_order', Number(e.target.value || 0))}
              className="input"
              min={0}
            />
          </label>

          <div className="grid gap-3 rounded-xl border border-[color:var(--color-border)] p-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_cash_account}
                onChange={(e) => setValue('is_cash_account', e.target.checked)}
              />
              Akun kas / bank
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setValue('is_active', e.target.checked)}
              />
              Aktif
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[color:var(--color-border)] pt-4">
          <Link to="/accounting/accounts" className="btn-outline">
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