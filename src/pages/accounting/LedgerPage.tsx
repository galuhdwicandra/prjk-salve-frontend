import { useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { getAccountingLedger, listAccountingAccounts } from '../../api/accounting';
import { listBranches } from '../../api/branches';
import type {
  AccountingAccount,
  AccountingLedgerMeta,
  AccountingLedgerRow,
} from '../../types/accounting';
import type { Branch } from '../../types/branches';
import { todayLocalYMD } from '../../utils/date';
import { toIDR } from '../../utils/money';
import { useAuth } from '../../store/useAuth';

function firstDateOfMonth(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');

  return `${y}-${m}-01`;
}

function num(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value?: string | null): string {
  if (!value) return '-';
  return value.slice(0, 10);
}

export default function LedgerPage() {
  const isSuperadmin = useAuth.hasRole('Superadmin');

  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [rows, setRows] = useState<AccountingLedgerRow[]>([]);
  const [meta, setMeta] = useState<AccountingLedgerMeta | null>(null);

  const [accountId, setAccountId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [dateFrom, setDateFrom] = useState(firstDateOfMonth());
  const [dateTo, setDateTo] = useState(todayLocalYMD());
  const [page, setPage] = useState(1);

  const [loadingMaster, setLoadingMaster] = useState(false);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [error, setError] = useState('');

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === accountId) ?? null,
    [accounts, accountId],
  );

  async function loadMaster() {
    setLoadingMaster(true);
    setError('');

    try {
      const [accountRes, branchRes] = await Promise.all([
        listAccountingAccounts({
          is_active: true,
          per_page: 500,
        }),
        isSuperadmin
          ? listBranches({ per_page: 500 })
          : Promise.resolve({ data: [], meta: null, message: null, errors: null }),
      ]);

      const accountRows = Array.isArray(accountRes.data) ? accountRes.data : [];
      const branchRows = Array.isArray(branchRes.data) ? branchRes.data : [];

      setAccounts(accountRows);
      setBranches(branchRows);

      if (!accountId && accountRows.length > 0) {
        setAccountId(accountRows[0].id);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data master buku besar.'));
    } finally {
      setLoadingMaster(false);
    }
  }

  async function loadLedger(nextPage = page) {
    if (!accountId) {
      setRows([]);
      setMeta(null);
      return;
    }

    setLoadingLedger(true);
    setError('');

    try {
      const res = await getAccountingLedger({
        account_id: accountId,
        branch_id: isSuperadmin && branchId ? branchId : undefined,
        date_from: dateFrom,
        date_to: dateTo,
        page: nextPage,
        per_page: 50,
      });

      setRows(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta ?? null);
      setPage(nextPage);
    } catch (err) {
      setRows([]);
      setMeta(null);
      setError(getErrorMessage(err, 'Gagal memuat buku besar.'));
    } finally {
      setLoadingLedger(false);
    }
  }

  useEffect(() => {
    void loadMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accountId) {
      void loadLedger(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  function submitFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void loadLedger(1);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-1)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Buku Besar</h1>
            <p className="text-sm text-[color:var(--color-text-muted)]">
              Mutasi akun dari jurnal akuntansi yang sudah POSTED.
            </p>
          </div>

          {selectedAccount ? (
            <div className="rounded-xl border border-[color:var(--color-border)] px-3 py-2 text-sm">
              <div className="font-semibold">
                {selectedAccount.code} - {selectedAccount.name}
              </div>
              <div className="text-[color:var(--color-text-muted)]">
                Normal: {selectedAccount.normal_balance}
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={submitFilter} className="mt-4 grid gap-3 md:grid-cols-5">
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium">Akun</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="input"
              disabled={loadingMaster}
            >
              <option value="">Pilih akun</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </label>

          {isSuperadmin ? (
            <label className="space-y-1">
              <span className="text-sm font-medium">Cabang</span>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="input"
              >
                <option value="">Semua cabang</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.code} - {branch.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="space-y-1">
            <span className="text-sm font-medium">Tanggal Awal</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Tanggal Akhir</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input"
            />
          </label>

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full" disabled={loadingLedger || !accountId}>
              {loadingLedger ? 'Memuat...' : 'Tampilkan'}
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <div className="text-sm text-[color:var(--color-text-muted)]">Saldo Awal</div>
          <div className="mt-1 text-lg font-semibold">{toIDR(num(meta?.opening_balance))}</div>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <div className="text-sm text-[color:var(--color-text-muted)]">Total Debit</div>
          <div className="mt-1 text-lg font-semibold">{toIDR(num(meta?.total_debit))}</div>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <div className="text-sm text-[color:var(--color-text-muted)]">Total Kredit</div>
          <div className="mt-1 text-lg font-semibold">{toIDR(num(meta?.total_credit))}</div>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <div className="text-sm text-[color:var(--color-text-muted)]">Saldo Akhir</div>
          <div className="mt-1 text-lg font-semibold">{toIDR(num(meta?.ending_balance))}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-1)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-black/5">
              <tr>
                <th className="px-3 py-3 text-left font-semibold">Tanggal</th>
                <th className="px-3 py-3 text-left font-semibold">No Jurnal</th>
                <th className="px-3 py-3 text-left font-semibold">Keterangan</th>
                <th className="px-3 py-3 text-right font-semibold">Debit</th>
                <th className="px-3 py-3 text-right font-semibold">Kredit</th>
                <th className="px-3 py-3 text-right font-semibold">Saldo</th>
              </tr>
            </thead>

            <tbody>
              {loadingLedger ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-[color:var(--color-text-muted)]">
                    Memuat buku besar...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-[color:var(--color-text-muted)]">
                    Belum ada mutasi untuk filter ini.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-[color:var(--color-border)] last:border-0">
                    <td className="px-3 py-3">{formatDate(row.journal_date)}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{row.journal_no ?? '-'}</div>
                      <div className="text-xs text-[color:var(--color-text-muted)]">{row.source_no ?? '-'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div>{row.description || '-'}</div>
                      {row.branch ? (
                        <div className="text-xs text-[color:var(--color-text-muted)]">
                          {row.branch.code} - {row.branch.name}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-right">{toIDR(num(row.debit))}</td>
                    <td className="px-3 py-3 text-right">{toIDR(num(row.credit))}</td>
                    <td className="px-3 py-3 text-right font-semibold">{toIDR(num(row.balance))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[color:var(--color-border)] px-4 py-3 text-sm">
          <div className="text-[color:var(--color-text-muted)]">
            Total data: {meta?.total ?? 0}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-outline disabled:opacity-50"
              disabled={page <= 1 || loadingLedger}
              onClick={() => void loadLedger(page - 1)}
            >
              Sebelumnya
            </button>

            <span>
              Halaman {meta?.current_page ?? page} / {meta?.last_page ?? 1}
            </span>

            <button
              type="button"
              className="btn-outline disabled:opacity-50"
              disabled={!meta || page >= meta.last_page || loadingLedger}
              onClick={() => void loadLedger(page + 1)}
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}