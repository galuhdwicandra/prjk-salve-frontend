import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getAccountingDashboard } from '../../api/accounting';
import { listBranches } from '../../api/branches';
import { getErrorMessage } from '../../api/client';
import { useAuth } from '../../store/useAuth';
import type {
  AccountingDashboardCashFlowPoint,
  AccountingDashboardData,
  AccountingDashboardMeta,
  AccountingDashboardProfitByBranchPoint,
  AccountingDashboardReceivablesPoint,
  AccountingDashboardRevenueExpensePoint,
  AccountingDashboardWarningItem,
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
  }).format(Number.isFinite(amount) ? amount : 0);
}

function numberValue(value: number | string | null | undefined): number {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount) ? amount : 0;
}

function formatPeriod(value: string | null | undefined): string {
  if (!value) return '-';

  return String(value).slice(0, 10);
}

function warningToneClass(severity: AccountingDashboardWarningItem['severity']): string {
  if (severity === 'danger') {
    return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200';
  }

  if (severity === 'warning') {
    return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200';
  }

  return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200';
}

type ReportState = {
  data: AccountingDashboardData | null;
  meta: AccountingDashboardMeta | null;
};

function SummaryCard(props: {
  title: string;
  value: string;
  helper?: string;
  tone?: 'default' | 'positive' | 'negative' | 'warning';
}) {
  const toneClass =
    props.tone === 'positive'
      ? 'text-green-700 dark:text-green-300'
      : props.tone === 'negative'
        ? 'text-red-700 dark:text-red-300'
        : props.tone === 'warning'
          ? 'text-amber-700 dark:text-amber-300'
          : 'text-[color:var(--color-text)]';

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
        {props.title}
      </div>
      <div className={`mt-2 text-xl font-bold ${toneClass}`}>{props.value}</div>
      {props.helper ? (
        <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">{props.helper}</div>
      ) : null}
    </div>
  );
}

function SimpleBar(props: {
  value: number;
  max: number;
  label: string;
}) {
  const percentage = props.max > 0 ? Math.min(100, Math.abs(props.value / props.max) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-xs">
        <span className="truncate text-[color:var(--color-text-muted)]">{props.label}</span>
        <span className="font-semibold">{money(props.value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-[color:var(--color-brand-primary)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RevenueExpenseChart(props: {
  rows: AccountingDashboardRevenueExpensePoint[];
}) {
  const max = Math.max(
    0,
    ...props.rows.map((row) => Math.max(numberValue(row.revenue), numberValue(row.expense))),
  );

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Pendapatan vs Beban</h2>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Dibaca dari jurnal posted pada periode filter.
        </p>
      </div>

      <div className="space-y-4">
        {props.rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[color:var(--color-border)] p-4 text-sm text-[color:var(--color-text-muted)]">
            Belum ada data pendapatan atau beban.
          </div>
        ) : (
          props.rows.map((row) => (
            <div key={row.period} className="space-y-2">
              <div className="text-sm font-semibold">{formatPeriod(row.period)}</div>
              <SimpleBar label="Pendapatan" value={numberValue(row.revenue)} max={max} />
              <SimpleBar label="Beban" value={numberValue(row.expense)} max={max} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CashFlowChart(props: {
  rows: AccountingDashboardCashFlowPoint[];
}) {
  const max = Math.max(
    0,
    ...props.rows.map((row) => Math.max(numberValue(row.cash_in), numberValue(row.cash_out))),
  );

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Kas Masuk vs Kas Keluar</h2>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Hanya dari akun yang ditandai sebagai akun kas atau bank.
        </p>
      </div>

      <div className="space-y-4">
        {props.rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[color:var(--color-border)] p-4 text-sm text-[color:var(--color-text-muted)]">
            Belum ada mutasi akun kas pada periode ini.
          </div>
        ) : (
          props.rows.map((row) => (
            <div key={row.period} className="space-y-2">
              <div className="text-sm font-semibold">{formatPeriod(row.period)}</div>
              <SimpleBar label="Kas Masuk" value={numberValue(row.cash_in)} max={max} />
              <SimpleBar label="Kas Keluar" value={numberValue(row.cash_out)} max={max} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BranchProfitTable(props: {
  rows: AccountingDashboardProfitByBranchPoint[];
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Laba Bersih per Cabang</h2>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Khusus Superadmin. Data mengikuti filter cabang jika dipilih.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-black/5 text-left dark:bg-white/5">
            <tr>
              <th className="px-3 py-3">Cabang</th>
              <th className="px-3 py-3 text-right">Pendapatan</th>
              <th className="px-3 py-3 text-right">Beban</th>
              <th className="px-3 py-3 text-right">Laba/Rugi</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-[color:var(--color-text-muted)]">
                  Belum ada data per cabang.
                </td>
              </tr>
            ) : (
              props.rows.map((row) => (
                <tr key={row.branch_id} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-3 py-3">
                    <div className="font-semibold">{row.branch_name ?? '-'}</div>
                    <div className="text-xs text-[color:var(--color-text-muted)]">{row.branch_code ?? '-'}</div>
                  </td>
                  <td className="px-3 py-3 text-right">{money(row.revenue)}</td>
                  <td className="px-3 py-3 text-right">{money(row.expense)}</td>
                  <td className="px-3 py-3 text-right font-semibold">{money(row.net_profit)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReceivablesTable(props: {
  rows: AccountingDashboardReceivablesPoint[];
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Piutang Berjalan</h2>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Mutasi akun piutang berdasarkan jurnal posted.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-black/5 text-left dark:bg-white/5">
            <tr>
              <th className="px-3 py-3">Tanggal</th>
              <th className="px-3 py-3 text-right">Piutang Masuk</th>
              <th className="px-3 py-3 text-right">Piutang Berkurang</th>
              <th className="px-3 py-3 text-right">Net</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-[color:var(--color-text-muted)]">
                  Belum ada mutasi piutang pada periode ini.
                </td>
              </tr>
            ) : (
              props.rows.map((row) => (
                <tr key={row.period} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-3 py-3 font-semibold">{formatPeriod(row.period)}</td>
                  <td className="px-3 py-3 text-right">{money(row.receivables_in)}</td>
                  <td className="px-3 py-3 text-right">{money(row.receivables_out)}</td>
                  <td className="px-3 py-3 text-right font-semibold">{money(row.net_receivables)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AccountingDashboardPage() {
  const canAccessAllBranches = useAuth.hasRole(['Superadmin', 'Akuntansi']);

  const [dateFrom, setDateFrom] = useState(firstDayOfMonth());
  const [dateTo, setDateTo] = useState(todayDate());
  const [branchId, setBranchId] = useState('');

  const [branches, setBranches] = useState<Branch[]>([]);
  const [report, setReport] = useState<ReportState>({
    data: null,
    meta: null,
  });

  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState('');

  const summary = report.data?.summary;
  const charts = report.data?.charts;
  const warnings = report.data?.warnings;

  const netProfitTone = useMemo(() => {
    const value = numberValue(summary?.net_profit);
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';

    return 'default';
  }, [summary?.net_profit]);

  const balanceTone = summary?.is_balance_sheet_balanced ? 'positive' : 'warning';

  async function loadBranches() {
    if (!canAccessAllBranches) return;

    setLoadingBranches(true);

    try {
      const res = await listBranches({ per_page: 500 });
      setBranches(Array.isArray(res.data) ? res.data : []);
    } catch {
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  }

  async function loadDashboard() {
    setLoadingReport(true);
    setError('');

    try {
      const res = await getAccountingDashboard({
        date_from: dateFrom,
        date_to: dateTo,
        branch_id: canAccessAllBranches && branchId ? branchId : null,
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
      setError(getErrorMessage(err, 'Gagal memuat dashboard akuntansi.'));
    } finally {
      setLoadingReport(false);
    }
  }

  function submitFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadDashboard();
  }

  useEffect(() => {
    void loadBranches();
    void loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dateFrom || !dateTo) return;

    void loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-text)]">
            Dashboard Akuntansi
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            Ringkasan akuntansi dari jurnal posted, COA, mapping akun, laba rugi, neraca, dan arus kas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/accounting/journals" className="btn-outline">
            Jurnal Umum
          </Link>
          <Link to="/accounting/profit-loss" className="btn-outline">
            Laba Rugi
          </Link>
          <Link to="/accounting/balance-sheet" className="btn-outline">
            Neraca
          </Link>
        </div>
      </div>

      <form
        onSubmit={submitFilter}
        className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-4">
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

          {canAccessAllBranches ? (
            <label className="space-y-1">
              <span className="text-sm font-medium">Cabang</span>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="input"
                disabled={loadingBranches}
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

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full" disabled={loadingReport}>
              {loadingReport ? 'Memuat...' : 'Tampilkan'}
            </button>
          </div>
        </div>

        {report.meta ? (
          <div className="mt-3 text-xs text-[color:var(--color-text-muted)]">
            Basis: jurnal {report.meta.basis.toUpperCase()} · Periode {report.meta.date_from} s/d {report.meta.date_to}
          </div>
        ) : null}

        {error ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Kas" value={money(summary?.total_cash)} />
        <SummaryCard title="Total Piutang" value={money(summary?.total_receivables)} />
        <SummaryCard title="Total Pendapatan" value={money(summary?.total_revenue)} />
        <SummaryCard title="Total Beban" value={money(summary?.total_expense)} />
        <SummaryCard title="Laba Bersih" value={money(summary?.net_profit)} tone={netProfitTone} />
        <SummaryCard title="Total Aset" value={money(summary?.total_assets)} />
        <SummaryCard title="Total Liabilitas" value={money(summary?.total_liabilities)} />
        <SummaryCard title="Total Ekuitas" value={money(summary?.total_equities)} />
        <SummaryCard
          title="Status Neraca"
          value={summary?.is_balance_sheet_balanced ? 'Balance' : 'Tidak Balance'}
          helper={`Selisih: ${money(summary?.balance_difference)}`}
          tone={balanceTone}
        />
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div>
            <h2 className="text-base font-semibold">Warning Akuntansi</h2>
            <p className="text-sm text-[color:var(--color-text-muted)]">
              Validasi cepat untuk mapping, jurnal, draft, dan keseimbangan neraca.
            </p>
          </div>

          <div className="text-sm font-semibold">
            {warnings?.summary.has_warning ? 'Perlu dicek' : 'Aman'}
          </div>
        </div>

        {!warnings || warnings.items.length === 0 ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
            Tidak ada warning utama pada periode dan scope cabang ini.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {warnings.items.map((item) => (
              <div key={item.key} className={`rounded-xl border px-4 py-3 text-sm ${warningToneClass(item.severity)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="mt-1">{item.message}</div>
                  </div>
                  <div className="rounded-full bg-white/70 px-2 py-1 text-xs font-bold dark:bg-black/20">
                    {item.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueExpenseChart rows={charts?.revenue_vs_expense ?? []} />
        <CashFlowChart rows={charts?.cash_in_vs_cash_out ?? []} />
      </div>

      {canAccessAllBranches ? (
        <BranchProfitTable rows={charts?.net_profit_by_branch ?? []} />
      ) : null}

      <ReceivablesTable rows={charts?.receivables_trend ?? []} />
    </div>
  );
}