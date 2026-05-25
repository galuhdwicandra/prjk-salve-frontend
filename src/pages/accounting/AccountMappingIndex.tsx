import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  deleteAccountingAccountMapping,
  listAccountingAccountMappings,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import type { AccountingAccountMapping } from '../../types/accounting';

export default function AccountMappingIndex() {
  const [rows, setRows] = useState<AccountingAccountMapping[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const res = await listAccountingAccountMappings({
        q: q || undefined,
        per_page: 100,
      });

      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat mapping akun.'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Hapus mapping akun ini?')) return;

    try {
      await deleteAccountingAccountMapping(id);
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menghapus mapping akun.'));
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(load, 350);
    return () => window.clearTimeout(timer);
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mapping Akun</h1>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Mapping ini menjadi dasar posting jurnal otomatis pada tahap berikutnya.
          </p>
        </div>

        <Link to="/accounting/account-mappings/new" className="btn-primary">
          Tambah Mapping
        </Link>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input"
          placeholder="Cari event, metode bayar, atau kategori expense..."
        />
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
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Metode</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Debit</th>
                <th className="px-4 py-3 text-left">Kredit</th>
                <th className="px-4 py-3 text-left">Scope</th>
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
                    Belum ada mapping akun.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-[color:var(--color-border)] last:border-0">
                    <td className="px-4 py-3 font-semibold">{row.event_key}</td>
                    <td className="px-4 py-3">{row.payment_method ?? '-'}</td>
                    <td className="px-4 py-3">{row.expense_category ?? '-'}</td>
                    <td className="px-4 py-3">
                      {row.debit_account
                        ? `${row.debit_account.code} - ${row.debit_account.name}`
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {row.credit_account
                        ? `${row.credit_account.code} - ${row.credit_account.name}`
                        : '-'}
                    </td>
                    <td className="px-4 py-3">{row.branch?.name ?? 'Global'}</td>
                    <td className="px-4 py-3">{row.is_active ? 'Aktif' : 'Nonaktif'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          to={`/accounting/account-mappings/${row.id}/edit`}
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