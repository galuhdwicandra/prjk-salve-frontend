import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { getAccountingCashFlow } from '../../api/accounting';
import { listBranches } from '../../api/branches';
import { getErrorMessage } from '../../api/client';
import type {
  AccountingCashFlowActivity,
  AccountingCashFlowData,
  AccountingCashFlowItem,
  AccountingCashFlowMeta,
} from '../../types/accounting';
import type { Branch } from '../../types/branches';
import { useAuth } from '../../store/useAuth';
import { todayLocalYMD } from '../../utils/date';
import { toIDR } from '../../utils/money';

function firstDateOfMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}-01`;
}

function num(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value?: string | null): string {
  if (!value) return '-';
  return value.slice(0, 10);
}

type ReportState = {
  data: AccountingCashFlowData | null;
  meta: AccountingCashFlowMeta | null;
};

function SummaryCard(props: {
  label: string;
  value: number;
  tone?: 'default' | 'positive' | 'negative';
}) {
  const toneClass =
    props.tone === 'positive'
      ? 'text-emerald-600'
      : props.tone === 'negative'
        ? 'text-red-600'
        : 'text-[color:var(--color-text-default)]';

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-1)]">
      <div className="text-sm text-[color:var(--color-text-muted)]">{props.label}</div>
      <div className={`mt-2 text-xl font-bold ${toneClass}`}>{toIDR(props.value)}</div>
    </div>
  );
}

function ActivityTable(props: {
  activity: AccountingCashFlowActivity;
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-1)]">
      <div className="flex flex-col gap-1 border-b border-[color:var(--color-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">{props.activity.label}</h2>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Mutasi akun kas/bank dari jurnal posted.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[color:var(--color-text-muted)]">Total</div>
          <div className="text-base font-bold">{toIDR(num(props.activity.total))}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[color:var(--color-bg-muted)] text-left">
            <tr>
              <th className="px-3 py-3 font-semibold">Tanggal</th>
              <th className="px-3 py-3 font-semibold">Jurnal</th>
              <th className="px-3 py-3 font-semibold">Keterangan</th>
              <th className="px-3 py-3 font-semibold">Akun Kas</th>
              <th className="px-3 py-3 text-right font-semibold">Kas Masuk</th>
              <th className="px-3 py-3 text-right font-semibold">Kas Keluar</th>
              <th className="px-3 py-3 text-right font-semibold">Net</th>
            </tr>
          </thead>

          <tbody>
            {props.activity.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-[color:var(--color-text-muted)]">
                  {props.emptyText}
                </td>
              </tr>
            ) : (
              props.activity.items.map((item: AccountingCashFlowItem) => (
                <tr key={item.id} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-3 py-3">{formatDate(item.journal_date)}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{item.journal_no ?? '-'}</div>
                    <div className="text-xs text-[color:var(--color-text-muted)]">
                      {item.source_no ?? item.event_key ?? '-'}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{item.description || '-'}</div>
                    {item.branch?.name ? (
                      <div className="text-xs text-[color:var(--color-text-muted)]">
                        {item.branch.code ? `${item.branch.code} - ` : ''}
                        {item.branch.name}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    {item.cash_account
                      ? `${item.cash_account.code ?? '-'} - ${item.cash_account.name ?? '-'}`
                      : '-'}
                  </td>
                  <td className="px-3 py-3 text-right">{toIDR(num(item.cash_in))}</td>
                  <td className="px-3 py-3 text-right">{toIDR(num(item.cash_out))}</td>
                  <td className="px-3 py-3 text-right font-semibold">{toIDR(num(item.net_amount))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CashFlowPage() {
  const canAccessAllBranches = useAuth.hasRole(['Superadmin', 'Akuntansi']);

  const [dateFrom, setDateFrom] = useState(firstDateOfMonth());
  const [dateTo, setDateTo] = useState(todayLocalYMD());
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

  const netCashFlowTone = useMemo(() => {
    const value = num(summary?.net_cash_flow);
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'default';
  }, [summary?.net_cash_flow]);

  async function loadBranches() {
    if (!canAccessAllBranches) return;

    setLoadingBranches(true);
    setError('');

    try {
      const res = await listBranches({ per_page: 500 });
      setBranches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data cabang.'));
    } finally {
      setLoadingBranches(false);
    }
  }

  async function loadReport() {
    setLoadingReport(true);
    setError('');

    try {
      const res = await getAccountingCashFlow({
        date_from: dateFrom,
        date_to: dateTo,
        branch_id: canAccessAllBranches && branchId ? branchId : undefined,
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
      setError(getErrorMessage(err, 'Gagal memuat laporan arus kas.'));
    } finally {
      setLoadingReport(false);
    }
  }

  function submitFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadReport();
  }

  useEffect(() => {
    void loadBranches();
    void loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-1)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-xl font-bold">Arus Kas</h1>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
              Laporan kas masuk, kas keluar, dan saldo kas berdasarkan jurnal akuntansi posted.
            </p>
          </div>

          <form onSubmit={submitFilter} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1">
              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                Tanggal awal
              </span>
              <input
                type="date"
                className="input"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                Tanggal akhir
              </span>
              <input
                type="date"
                className="input"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </label>

            {canAccessAllBranches ? (
              <label className="space-y-1">
                <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                  Cabang
                </span>
                <select
                  className="input"
                  value={branchId}
                  disabled={loadingBranches}
                  onChange={(event) => setBranchId(event.target.value)}
                >
                  <option value="">Semua cabang</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.code ? `${branch.code} - ` : ''}
                      {branch.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full disabled:opacity-60"
                disabled={loadingReport}
              >
                {loadingReport ? 'Memuat...' : 'Terapkan'}
              </button>
            </div>
          </form>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Saldo Awal Kas" value={num(summary?.opening_balance)} />
        <SummaryCard label="Total Kas Masuk" value={num(summary?.total_cash_in)} tone="positive" />
        <SummaryCard label="Total Kas Keluar" value={num(summary?.total_cash_out)} tone="negative" />
        <SummaryCard label="Arus Kas Bersih" value={num(summary?.net_cash_flow)} tone={netCashFlowTone} />
        <SummaryCard label="Saldo Akhir Kas" value={num(summary?.ending_balance)} />
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text-muted)] shadow-[var(--shadow-1)]">
        Basis laporan: <span className="font-semibold text-[color:var(--color-text-default)]">{report.meta?.basis ?? 'POSTED'}</span>
        {' '}· Sumber: <span className="font-semibold text-[color:var(--color-text-default)]">{report.meta?.source ?? 'accounting_journal_lines'}</span>
        {' '}· Periode: <span className="font-semibold text-[color:var(--color-text-default)]">{report.meta?.date_from ?? dateFrom}</span>
        {' '}s/d <span className="font-semibold text-[color:var(--color-text-default)]">{report.meta?.date_to ?? dateTo}</span>
      </div>

      {loadingReport ? (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-8 text-center text-sm text-[color:var(--color-text-muted)] shadow-[var(--shadow-1)]">
          Memuat laporan arus kas...
        </div>
      ) : (
        <>
          <ActivityTable
            activity={
              report.data?.operating_activities ?? {
                label: 'Aktivitas Operasional',
                items: [],
                total: 0,
              }
            }
            emptyText="Belum ada aktivitas operasional pada periode ini."
          />

          <ActivityTable
            activity={
              report.data?.investing_activities ?? {
                label: 'Aktivitas Investasi',
                items: [],
                total: 0,
              }
            }
            emptyText="Belum ada aktivitas investasi pada periode ini."
          />

          <ActivityTable
            activity={
              report.data?.financing_activities ?? {
                label: 'Aktivitas Pendanaan',
                items: [],
                total: 0,
              }
            }
            emptyText="Belum ada aktivitas pendanaan pada periode ini."
          />
        </>
      )}
    </div>
  );
}