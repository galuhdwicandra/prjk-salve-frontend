// src/pages/reports/ReportsIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import { getReportPreview, exportReport, type ReportKind } from '../../api/reports';
import { listBranches } from '../../api/branches';

type Branch = { id: string; name: string };

const KINDS: ReportKind[] = ['sales', 'orders', 'receivables', 'expenses', 'services'];

export default function ReportsIndex() {
    const [kind, setKind] = useState<ReportKind>('sales');
    const [from, setFrom] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [branchId, setBranchId] = useState<string | null>(null);
    const [method, setMethod] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [pageInfo, setPageInfo] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listBranches({ per_page: 100 })
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                setBranches(list.map((b: any) => ({ id: b.id, name: b.name })));
            })
            .catch(() => { });
    }, []);

    const params = useMemo(
        () => ({
            from,
            to,
            branch_id: branchId || undefined,
            method: kind === 'sales' && method ? method : undefined,
            status: (kind === 'orders' || kind === 'receivables') && status ? status : undefined,
            per_page: 20,
            page,
        }),
        [from, to, branchId, method, status, kind, page]
    );

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const resp = await getReportPreview(kind, params);
            setColumns(resp.meta.columns ?? []);
            setRows(resp.data ?? []);
            setPageInfo({
                current_page: resp.meta.current_page,
                last_page: resp.meta.last_page,
                per_page: resp.meta.per_page,
                total: resp.meta.total,
            });
        } catch {
            setError('Gagal memuat pratinjau laporan.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load(); // auto-load saat mount / filter berubah
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kind, params]);

    async function onExport(format: 'csv' | 'xlsx' = 'csv') {
        const blob = await exportReport(kind, { ...params, format, delimiter: 'semicolon' });
        const fname = `${kind}_${from.replaceAll('-', '')}-${to.replaceAll('-', '')}_${branchId ? 'branch' : 'all'}.${format}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fname;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <h1 className="text-lg font-semibold tracking-tight">Reports</h1>
            </header>

            {/* Tabs (segmented) */}
            <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-2 w-max">
                <div className="flex gap-1">
                    {KINDS.map((k) => {
                        const active = k === kind;
                        return (
                            <button
                                key={k}
                                onClick={() => {
                                    setKind(k);
                                    setPage(1);
                                    // Reset filter khusus agar tidak “nempel” saat pindah tab
                                    setMethod('');
                                    setStatus('');
                                }}
                                className={active ? 'btn-primary' : 'btn-outline'}
                                aria-current={active ? 'page' : undefined}
                            >
                                {k.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filter bar */}
            <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-end">
                    <label className="grid gap-1 text-sm">
                        <span>Dari Tanggal</span>
                        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="input py-2" />
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span>Sampai Tanggal</span>
                        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="input py-2" />
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span>Cabang</span>
                        <select
                            value={branchId ?? ''}
                            onChange={(e) => { setBranchId(e.target.value || null); setPage(1); }}
                            className="input py-2"
                        >
                            <option value="">(Semua)</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </label>

                    {kind === 'sales' && (
                        <label className="grid gap-1 text-sm">
                            <span>Metode</span>
                            <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} className="input py-2">
                                <option value="">(Semua)</option>
                                <option value="CASH">CASH</option>
                                <option value="QRIS">QRIS</option>
                                <option value="TRANSFER">TRANSFER</option>
                                <option value="PENDING">PENDING</option>
                            </select>
                        </label>
                    )}

                    {(kind === 'orders' || kind === 'receivables') && (
                        <label className="grid gap-1 text-sm">
                            <span>Status</span>
                            <input
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                                className="input py-2"
                                placeholder="cth: OPEN / PARTIAL / ..."
                            />
                        </label>
                    )}

                    <div className="flex gap-2">
                        <button onClick={() => { setPage(1); load(); }} className="btn-primary">Terapkan</button>
                        <button onClick={() => onExport('csv')} className="btn-outline">Export CSV</button>
                        <button onClick={() => onExport('xlsx')} className="btn-outline">Export XLSX</button>
                    </div>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
                    {error}
                </div>
            )}

            {/* Preview table — gaya konsisten dengan CustomersIndex */}
            <section aria-busy={loading ? 'true' : 'false'}>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    {columns.map((c) => (
                                        <Th key={c}>{c}</Th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--color-border)]">
                                {loading ? (
                                    <>
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                    </>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td className="px-3 py-4 text-center text-gray-500" colSpan={Math.max(columns.length, 1)}>
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((r, i) => (
                                        <tr key={i} className="hover:bg-black/5 transition-colors">
                                            {columns.map((col) => {
                                                const key = col.toLowerCase().replaceAll(' ', '_');
                                                return <Td key={col}>{String(r[key] ?? '')}</Td>;
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pagination */}
            {!loading && pageInfo.last_page > 1 && (
                <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {pageInfo.current_page} / {pageInfo.last_page} • Total {pageInfo.total}
                    </span>
                    <button
                        disabled={page >= pageInfo.last_page}
                        onClick={() => setPage((p) => Math.min(pageInfo.last_page, p + 1))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
}

/* ---------- Subcomponents (tabel konsisten) ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
            {children}
        </th>
    );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function RowSkeleton({ cols }: { cols: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, idx) => (
                <td key={idx} className="px-3 py-3">
                    <div className="h-4 w-full max-w-[220px] rounded bg-black/10 animate-pulse" />
                </td>
            ))}
        </tr>
    );
}
