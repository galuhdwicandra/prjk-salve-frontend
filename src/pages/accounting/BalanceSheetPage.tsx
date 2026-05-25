import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { getAccountingBalanceSheet } from '../../api/accounting';
import { listBranches } from '../../api/branches';
import { getErrorMessage } from '../../api/client';
import type {
    AccountingBalanceSheetAccountRow,
    AccountingBalanceSheetData,
    AccountingBalanceSheetMeta,
} from '../../types/accounting';
import type { Branch } from '../../types/branches';

function todayDate(): string {
    return new Date().toISOString().slice(0, 10);
}

function firstDateOfMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}-01`;
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
    data: AccountingBalanceSheetData | null;
    meta: AccountingBalanceSheetMeta | null;
};

function AccountSection(props: {
    title: string;
    rows: AccountingBalanceSheetAccountRow[];
    totalLabel: string;
    total: number;
}) {
    return (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm">
            <div className="border-b border-[color:var(--color-border)] px-5 py-4">
                <h2 className="text-base font-semibold text-[color:var(--color-text-default)]">
                    {props.title}
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-black/[0.02] text-xs uppercase tracking-wide text-[color:var(--color-text-muted)] dark:bg-white/[0.04]">
                        <tr>
                            <th className="px-5 py-3 text-left">Kode</th>
                            <th className="px-5 py-3 text-left">Nama Akun</th>
                            <th className="px-5 py-3 text-right">Debit</th>
                            <th className="px-5 py-3 text-right">Kredit</th>
                            <th className="px-5 py-3 text-right">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-[color:var(--color-text-muted)]">
                                    Belum ada data akun.
                                </td>
                            </tr>
                        ) : (
                            props.rows.map((row) => (
                                <tr key={`${row.code}-${row.name}`} className="border-b border-[color:var(--color-border)] last:border-0">
                                    <td className="px-5 py-3 font-semibold">{row.code}</td>
                                    <td className="px-5 py-3">{row.name}</td>
                                    <td className="px-5 py-3 text-right">{money(row.total_debit)}</td>
                                    <td className="px-5 py-3 text-right">{money(row.total_credit)}</td>
                                    <td className="px-5 py-3 text-right font-semibold">{money(row.balance)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-[color:var(--color-border)] bg-black/[0.02] dark:bg-white/[0.04]">
                            <td colSpan={4} className="px-5 py-3 font-semibold">
                                {props.totalLabel}
                            </td>
                            <td className="px-5 py-3 text-right font-bold">
                                {money(props.total)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default function BalanceSheetPage() {
    const [dateFrom, setDateFrom] = useState(firstDateOfMonth());
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

    const statusLabel = useMemo(() => {
        if (!summary) return 'Belum dimuat';

        return summary.is_balanced ? 'Neraca Seimbang' : 'Neraca Belum Seimbang';
    }, [summary]);

    const statusClassName = useMemo(() => {
        if (!summary) {
            return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200';
        }

        if (summary.is_balanced) {
            return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200';
        }

        return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200';
    }, [summary]);

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

            const res = await getAccountingBalanceSheet({
                date_from: dateFrom,
                date_to: dateTo,
                branch_id: branchId || null,
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
            setError(getErrorMessage(err, 'Gagal memuat Neraca.'));
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

        if (dateTo < dateFrom) {
            setError('Tanggal akhir harus sama atau setelah tanggal awal.');
            return;
        }

        loadReport();
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[color:var(--color-text-default)]">
                        Neraca
                    </h1>
                    <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                        Posisi aset, liabilitas, ekuitas, dan laba tahun berjalan berdasarkan jurnal posted.
                    </p>
                </div>

                <div className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${statusClassName}`}>
                    {statusLabel}
                </div>
            </div>

            <form
                onSubmit={submitFilter}
                className="grid gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto]"
            >
                <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                        Dari Tanggal
                    </span>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(event) => setDateFrom(event.target.value)}
                        className="input"
                        required
                    />
                </label>

                <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                        Sampai Tanggal
                    </span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(event) => setDateTo(event.target.value)}
                        className="input"
                        required
                    />
                </label>

                <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                        Cabang
                    </span>
                    <select
                        value={branchId}
                        onChange={(event) => setBranchId(event.target.value)}
                        className="input"
                        disabled={loadingBranches}
                    >
                        <option value="">Semua / sesuai akses</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                    >
                        {loading ? 'Memuat...' : 'Terapkan'}
                    </button>
                </div>
            </form>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                        Total Aset
                    </div>
                    <div className="mt-2 text-xl font-bold">{money(summary?.total_assets)}</div>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                        Total Liabilitas
                    </div>
                    <div className="mt-2 text-xl font-bold">{money(summary?.total_liabilities)}</div>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                        Total Ekuitas
                    </div>
                    <div className="mt-2 text-xl font-bold">{money(summary?.total_equities)}</div>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                        Selisih
                    </div>
                    <div className="mt-2 text-xl font-bold">{money(summary?.difference)}</div>
                </div>
            </div>

            {summary && !summary.is_balanced ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                    Neraca belum seimbang. Periksa jurnal posted, mapping akun, dan apakah seluruh transaksi sudah diposting ke jurnal.
                    Selisih saat ini: <strong>{money(numberValue(summary.difference))}</strong>.
                </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-2">
                <AccountSection
                    title="Aset"
                    rows={report.data?.assets ?? []}
                    totalLabel="Total Aset"
                    total={numberValue(summary?.total_assets)}
                />

                <div className="space-y-6">
                    <AccountSection
                        title="Liabilitas"
                        rows={report.data?.liabilities ?? []}
                        totalLabel="Total Liabilitas"
                        total={numberValue(summary?.total_liabilities)}
                    />

                    <AccountSection
                        title="Ekuitas"
                        rows={report.data?.equities ?? []}
                        totalLabel="Total Ekuitas + Laba Tahun Berjalan"
                        total={numberValue(summary?.total_equities)}
                    />
                </div>
            </div>
        </div>
    );
}