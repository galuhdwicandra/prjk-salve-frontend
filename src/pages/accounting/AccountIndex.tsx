import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteAccountingAccount, listAccountingAccounts } from '../../api/accounting';
import type { AccountingAccount } from '../../types/accounting';
import { getErrorMessage } from '../../api/client';

const TYPE_LABEL: Record<string, string> = {
  ASSET: 'Aset',
  LIABILITY: 'Liabilitas',
  EQUITY: 'Ekuitas',
  REVENUE: 'Pendapatan',
  EXPENSE: 'Beban',
};

export default function AccountIndex() {
  const [rows, setRows] = useState<AccountingAccount[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const res = await listAccountingAccounts({
        q: q || undefined,
        type: type as never,
        per_page: 100,
      });

      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat COA.'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Hapus akun ini?')) return;

    try {
      await deleteAccountingAccount(id);
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menghapus akun.'));
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(load, 350);
    return () => window.clearTimeout(timer);
  }, [q, type]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-text-default)]">COA</h1>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Kelola Chart of Accounts sebagai fondasi modul akuntansi.
          </p>
        </div>

        <Link
          to="/accounting/accounts/new"
          className="btn-primary"
        >
          Tambah Akun
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 sm:grid-cols-[1fr_220px]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input"
          placeholder="Cari kode atau nama akun..."
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input"
        >
          <option value="">Semua Tipe</option>
          <option value="ASSET">Aset</option>
          <option value="LIABILITY">Liabilitas</option>
          <option value="EQUITY">Ekuitas</option>
          <option value="REVENUE">Pendapatan</option>
          <option value="EXPENSE">Beban</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-black/5">
              <tr>
                <th className="px-4 py-3 text-left">Kode</th>
                <th className="px-4 py-3 text-left">Nama Akun</th>
                <th className="px-4 py-3 text-left">Tipe</th>
                <th className="px-4 py-3 text-left">Normal</th>
                <th className="px-4 py-3 text-left">Scope</th>
                <th className="px-4 py-3 text-left">Kas/Bank</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[color:var(--color-text-muted)]">
                    Memuat data...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[color:var(--color-text-muted)]">
                    Belum ada akun.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-[color:var(--color-border)] last:border-0">
                    <td className="px-4 py-3 font-semibold">{row.code}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{TYPE_LABEL[row.type] ?? row.type}</td>
                    <td className="px-4 py-3">{row.normal_balance}</td>
                    <td className="px-4 py-3">{row.branch?.name ?? 'Global'}</td>
                    <td className="px-4 py-3">{row.is_cash_account ? 'Ya' : 'Tidak'}</td>
                    <td className="px-4 py-3">{row.is_active ? 'Aktif' : 'Nonaktif'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          to={`/accounting/accounts/${row.id}/edit`}
                          className="rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(row.id)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}