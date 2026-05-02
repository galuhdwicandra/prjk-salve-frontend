import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProductionStaffDailyReport } from '../../api/production';
import { normalizeApiError } from '../../api/client';
import { listBranches } from '../../api/branches';
import { listUsers } from '../../api/users';
import { useAuth } from '../../store/useAuth';
import type { ProductionStaffReportRow } from '../../types/production';
import type { Branch } from '../../types/branches';
import type { User } from '../../types/users';

function today(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatDate(value?: string | null): string {
    return value || '-';
}

export default function ProductionReport() {
    const [dateFrom, setDateFrom] = useState(today());
    const [dateTo, setDateTo] = useState(today());
    const [branchId, setBranchId] = useState('');
    const [userId, setUserId] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [staffOptions, setStaffOptions] = useState<User[]>([]);
    const [rows, setRows] = useState<ProductionStaffReportRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isSuperadmin = useAuth.hasRole('Superadmin');

    const totals = useMemo(() => {
        return rows.reduce(
            (acc, row) => {
                acc.invoice += row.total_invoice;
                acc.qty += row.total_qty;
                acc.finished += row.finished;
                acc.unfinished += row.unfinished;
                acc.overdue += row.overdue;
                return acc;
            },
            { invoice: 0, qty: 0, finished: 0, unfinished: 0, overdue: 0 }
        );
    }, [rows]);

    const loadFilterOptions = useCallback(async () => {
        if (!isSuperadmin) return;

        try {
            const [branchResponse, userResponse] = await Promise.all([
                listBranches({ per_page: 100 }),
                listUsers({
                    role: 'Petugas Cuci',
                    branch_id: branchId || undefined,
                    per_page: 100,
                }),
            ]);

            setBranches(branchResponse.data ?? []);
            setStaffOptions(userResponse.data ?? []);
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        }
    }, [isSuperadmin, branchId]);

    useEffect(() => {
        void loadFilterOptions();
    }, [loadFilterOptions]);

    useEffect(() => {
        setUserId('');
    }, [branchId]);

    const loadReport = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getProductionStaffDailyReport({
                date_from: dateFrom,
                date_to: dateTo,
                branch_id: isSuperadmin && branchId ? branchId : undefined,
                user_id: isSuperadmin && userId ? userId : undefined,
            });

            setRows(response.data ?? []);
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        } finally {
            setLoading(false);
        }
    }, [dateFrom, dateTo, branchId, userId, isSuperadmin]);

    useEffect(() => {
        void loadReport();
    }, [loadReport]);

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Laporan Produksi Petugas
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Rekap invoice, qty, selesai, belum selesai, dan detail order yang dikerjakan petugas.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                <label className="block">
                    <span className="text-xs font-medium text-slate-500">Dari Tanggal</span>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(event) => setDateFrom(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </label>

                <label className="block">
                    <span className="text-xs font-medium text-slate-500">Sampai Tanggal</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(event) => setDateTo(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </label>

                {isSuperadmin ? (
                    <label className="block">
                        <span className="text-xs font-medium text-slate-500">Cabang</span>
                        <select
                            value={branchId}
                            onChange={(event) => setBranchId(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        >
                            <option value="">Semua Cabang</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : null}

                {isSuperadmin ? (
                    <label className="block">
                        <span className="text-xs font-medium text-slate-500">Petugas</span>
                        <select
                            value={userId}
                            onChange={(event) => setUserId(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        >
                            <option value="">Semua Petugas</option>
                            {staffOptions.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : null}

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={() => void loadReport()}
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Memuat...' : 'Tampilkan'}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-5">
                <SummaryCard label="Total Invoice" value={String(totals.invoice)} />
                <SummaryCard label="Total Qty" value={String(totals.qty)} />
                <SummaryCard label="Selesai" value={String(totals.finished)} />
                <SummaryCard label="Belum Selesai" value={String(totals.unfinished)} />
                <SummaryCard label="Terlambat" value={String(totals.overdue)} tone="danger" />
            </div>

            <div className="space-y-4">
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                        {loading ? 'Memuat laporan...' : 'Belum ada aktivitas produksi pada tanggal ini.'}
                    </div>
                ) : (
                    rows.map((row) => (
                        <section key={row.user_id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 p-4">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-950">{row.staff_name}</h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Total invoice {row.total_invoice}, total qty {row.total_qty}.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
                                        <MiniStat label="Invoice" value={row.total_invoice} />
                                        <MiniStat label="Qty" value={row.total_qty} />
                                        <MiniStat label="Selesai" value={row.finished} />
                                        <MiniStat label="Belum" value={row.unfinished} />
                                        <MiniStat label="Terlambat" value={row.overdue} tone="danger" />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Invoice</th>
                                            <th className="px-4 py-3">No Order</th>
                                            <th className="px-4 py-3">Customer</th>
                                            <th className="px-4 py-3">Qty</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Tanggal Masuk</th>
                                            <th className="px-4 py-3">Target Selesai</th>
                                            <th className="px-4 py-3">Tanggal Selesai Aktual</th>
                                            <th className="px-4 py-3">Keterlambatan</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {row.details.map((detail) => (
                                            <tr key={`${row.user_id}-${detail.order_id}`}>
                                                <td className="px-4 py-3 font-medium text-slate-900">{detail.invoice_no ?? '-'}</td>
                                                <td className="px-4 py-3 text-slate-700">{detail.number ?? '-'}</td>
                                                <td className="px-4 py-3 text-slate-700">{detail.customer_name ?? '-'}</td>
                                                <td className="px-4 py-3 text-slate-700">{detail.qty}</td>
                                                <td className="px-4 py-3 text-slate-700">{detail.current_status ?? '-'}</td>
                                                <td className="px-4 py-3 text-slate-700">{formatDate(detail.received_at)}</td>
                                                <td className="px-4 py-3 text-slate-700">{formatDate(detail.ready_at)}</td>
                                                <td className="px-4 py-3 text-slate-700">{formatDate(detail.finished_date)}</td>
                                                <td className="px-4 py-3">
                                                    <OverdueBadge
                                                        isOverdue={detail.is_overdue}
                                                        overdueText={detail.overdue_text}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ))
                )}
            </div>
        </div>
    );
}

function SummaryCard(props: { label: string; value: string; tone?: 'default' | 'danger' }) {
    const danger = props.tone === 'danger';

    return (
        <div
            className={[
                'rounded-2xl border bg-white p-4 shadow-sm',
                danger ? 'border-red-200 bg-red-50' : 'border-slate-200',
            ].join(' ')}
        >
            <p
                className={[
                    'text-xs font-medium uppercase tracking-wide',
                    danger ? 'text-red-600' : 'text-slate-500',
                ].join(' ')}
            >
                {props.label}
            </p>
            <p className={['mt-2 text-2xl font-semibold', danger ? 'text-red-700' : 'text-slate-950'].join(' ')}>
                {props.value}
            </p>
        </div>
    );
}

function MiniStat(props: { label: string; value: number; tone?: 'default' | 'danger' }) {
    const danger = props.tone === 'danger';

    return (
        <div
            className={[
                'rounded-xl border px-3 py-2',
                danger ? 'border-red-200 bg-red-50' : 'border-slate-200',
            ].join(' ')}
        >
            <div className={danger ? 'text-red-600' : 'text-slate-500'}>{props.label}</div>
            <div className={['font-semibold', danger ? 'text-red-700' : 'text-slate-950'].join(' ')}>
                {props.value}
            </div>
        </div>
    );
}

function OverdueBadge(props: { isOverdue: boolean; overdueText?: string | null }) {
    if (!props.isOverdue) {
        return (
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Tepat waktu
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            {props.overdueText ?? 'Terlambat'}
        </span>
    );
}