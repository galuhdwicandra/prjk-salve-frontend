import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { getErrorMessage } from '../../api/client';
import { getAccountingProfitLoss } from '../../api/accounting';
import { listBranches } from '../../api/branches';
import type {
  AccountingProfitLossAccountRow,
  AccountingProfitLossData,
  AccountingProfitLossMeta,
} from '../../types/accounting';
import type { Branch } from '../../types/branches';

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function firstDayOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

function money(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function numberValue(value: number | string | null | undefined): number {
  return Number(value ?? 0);
}

type ReportState = {
  data: AccountingProfitLossData | null;
  meta: AccountingProfitLossMeta | null;
};

export default function ProfitLossPage() {
  const [dateFrom, setDateFrom] = useState(firstDayOfMonth());
  const [dateTo, setDateTo] = useState(todayDate());
  const [branchId, setBranchId] = useState('');

  const [branches, setBranches] = useState<Branch[]>([]);
  const [report, setReport] = useState<ReportState>({
    data: null,
    meta: null,
  });

  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = report.data?.summary;

  const netProfitLabel = useMemo(() => {
    const value = numberValue(summary?.net_profit);

    if (value > 0) return 'Laba Bersih';
    if (value < 0) return 'Rugi Bersih';

    return 'Impas';
  }, [summary?.net_profit]);

  async function loadBranches() {
    try {
      setLoadingBranches(true);
      const res = await listBranches({ per_page: 100 });
      setBranches(res.data ?? []);
    } catch {
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  }

  async function loadReport() {
    try {
      setLoading(true);
      setError(null);

      const res = await getAccountingProfitLoss({
        date_from: dateFrom,
        date_to: dateTo,
        branch_id: branchId || null,
        basis: 'posted',
      });

      setReport({
        data: res.data,
        meta: res.meta,
      });
    } catch (err) {
      setReport({
        data: null,
        meta: null,
      });
      setError(getErrorMessage(err, 'Gagal memuat laporan laba rugi.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    if (!dateFrom || !dateTo) {
      return;
    }

    loadReport();
  }, [dateFrom, dateTo, branchId]);

  function submitFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadReport();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-text)]">
            Laporan Laba Rugi
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            Laporan performa usaha dari jurnal akuntansi yang sudah diposting.
          </p>
        </div>

        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm">
          <div className="text-[color:var(--color-text-muted)]">Basis</div>
          <div className="font-semibold text-[color:var(--color-text)]">
            Jurnal POSTED
          </div>
        </div>
      </div>

      <form
        onSubmit={submitFilter}
        className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[color:var(--color-text)]">
              Tanggal Awal
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[color:var(--color-text)]">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[color:var(--color-text)]">
              Cabang
            </label>
            <select
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm outline-none"
              disabled={loadingBranches}
            >
              <option value="">Semua / Cabang Saya</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Memuat...' : 'Refresh Laporan'}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </form>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Pendapatan Kotor"
          value={money(summary?.total_gross_revenue)}
        />
        <SummaryCard
          label="Diskon / Kontra Pendapatan"
          value={money(summary?.total_contra_revenue)}
        />
        <SummaryCard
          label="Total Beban"
          value={money(summary?.total_expense)}
        />
        <SummaryCard
          label={netProfitLabel}
          value={money(summary?.net_profit)}
          strong
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportSection
          title="Pendapatan"
          rows={report.data?.revenues ?? []}
          emptyText="Belum ada akun pendapatan pada periode ini."
          totalLabel="Total Pendapatan Kotor"
          totalValue={summary?.total_gross_revenue ?? 0}
          loading={loading}
        />

        <ReportSection
          title="Diskon / Kontra Pendapatan"
          rows={report.data?.contra_revenues ?? []}
          emptyText="Belum ada diskon atau kontra pendapatan pada periode ini."
          totalLabel="Total Kontra Pendapatan"
          totalValue={summary?.total_contra_revenue ?? 0}
          loading={loading}
        />

        <ReportSection
          title="Beban"
          rows={report.data?.expenses ?? []}
          emptyText="Belum ada akun beban pada periode ini."
          totalLabel="Total Beban"
          totalValue={summary?.total_expense ?? 0}
          loading={loading}
        />

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">
            Ringkasan Laba Rugi
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <SummaryLine label="Pendapatan Kotor" value={money(summary?.total_gross_revenue)} />
            <SummaryLine label="Diskon / Kontra Pendapatan" value={`(${money(summary?.total_contra_revenue)})`} />
            <SummaryLine label="Pendapatan Bersih" value={money(summary?.net_revenue)} strong />
            <SummaryLine label="Total Beban" value={`(${money(summary?.total_expense)})`} />
            <div className="border-t border-[color:var(--color-border)] pt-3">
              <SummaryLine label={netProfitLabel} value={money(summary?.net_profit)} strong />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
      <div className="text-sm text-[color:var(--color-text-muted)]">{label}</div>
      <div className={`mt-2 text-xl ${strong ? 'font-bold' : 'font-semibold'} text-[color:var(--color-text)]`}>
        {value}
      </div>
    </div>
  );
}

function ReportSection({
  title,
  rows,
  emptyText,
  totalLabel,
  totalValue,
  loading,
}: {
  title: string;
  rows: AccountingProfitLossAccountRow[];
  emptyText: string;
  totalLabel: string;
  totalValue: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm">
      <div className="border-b border-[color:var(--color-border)] px-5 py-4">
        <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Kode</th>
              <th className="px-4 py-3 text-left font-semibold">Akun</th>
              <th className="px-4 py-3 text-right font-semibold">Debit</th>
              <th className="px-4 py-3 text-right font-semibold">Kredit</th>
              <th className="px-4 py-3 text-right font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[color:var(--color-text-muted)]">
                  Memuat data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[color:var(--color-text-muted)]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.account_id} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-semibold">{row.code}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 text-right">{money(row.debit)}</td>
                  <td className="px-4 py-3 text-right">{money(row.credit)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(row.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-[color:var(--color-border)]">
              <td colSpan={4} className="px-4 py-3 text-right font-semibold">
                {totalLabel}
              </td>
              <td className="px-4 py-3 text-right font-bold">
                {money(totalValue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className={`${strong ? 'font-semibold' : ''} text-[color:var(--color-text)]`}>
        {label}
      </div>
      <div className={`${strong ? 'font-bold' : 'font-medium'} text-right text-[color:var(--color-text)]`}>
        {value}
      </div>
    </div>
  );
}