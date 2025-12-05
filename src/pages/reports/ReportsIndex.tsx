import { useEffect, useMemo, useState } from 'react';
import { getReportPreview, exportReport, type ReportKind } from '../../api/reports';
import { listBranches } from '../../api/branches';

type Branch = { id: string; name: string };

const KINDS: ReportKind[] = ['sales', 'orders', 'receivables', 'expenses'];

export default function ReportsIndex() {
    const [kind, setKind] = useState<ReportKind>('sales');
    const [from, setFrom] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [branchId, setBranchId] = useState<string | null>(null);
    const [method, setMethod] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [pageInfo, setPageInfo] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // ambil daftar cabang (khusus superadmin akan tampil; implementasi auth di komponen lain)
        listBranches({ per_page: 100 }).then((res) => {
            const list = Array.isArray(res.data) ? res.data : [];
            setBranches(list.map((b: any) => ({ id: b.id, name: b.name })));
        }).catch(() => { });
    }, []);

    const params = useMemo(() => ({
        from, to,
        branch_id: branchId || undefined,
        method: kind === 'sales' && method ? method : undefined,
        status: (kind === 'orders' || kind === 'receivables') && status ? status : undefined,
        per_page: 20,
    }), [from, to, branchId, method, status, kind]);

    async function load() {
        setLoading(true);
        try {
            const resp = await getReportPreview(kind, params);
            setColumns(resp.meta.columns);
            setRows(resp.data);
            setPageInfo({
                current_page: resp.meta.current_page,
                last_page: resp.meta.last_page,
                per_page: resp.meta.per_page,
                total: resp.meta.total,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); /* auto-load on mount & kind change */ }, [kind]);

    async function onExport(format: 'csv' | 'xlsx' = 'csv') {
        const blob = await exportReport(kind, { ...params, format, delimiter: 'semicolon' });
        const fname = `${kind}_${from.replaceAll('-', '')}-${to.replaceAll('-', '')}_${branchId ? 'branch' : 'all'}.${format}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fname; a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-semibold">Reports</h1>

            {/* Tabs */}
            <div className="flex gap-2">
                {KINDS.map(k => (
                    <button
                        key={k}
                        onClick={() => setKind(k)}
                        className={`px-3 py-1 rounded ${k === kind ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                        {k.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Filter bar */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                <div>
                    <label className="block text-sm">Dari Tanggal</label>
                    <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border p-2 rounded w-full" />
                </div>
                <div>
                    <label className="block text-sm">Sampai Tanggal</label>
                    <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border p-2 rounded w-full" />
                </div>
                <div>
                    <label className="block text-sm">Cabang</label>
                    <select value={branchId ?? ''} onChange={e => setBranchId(e.target.value || null)} className="border p-2 rounded w-full">
                        <option value="">(Semua)</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                {kind === 'sales' && (
                    <div>
                        <label className="block text-sm">Metode</label>
                        <select value={method} onChange={e => setMethod(e.target.value)} className="border p-2 rounded w-full">
                            <option value="">(Semua)</option>
                            <option value="CASH">CASH</option>
                            <option value="QRIS">QRIS</option>
                            <option value="TRANSFER">TRANSFER</option>
                            <option value="PENDING">PENDING</option>
                        </select>
                    </div>
                )}
                {(kind === 'orders' || kind === 'receivables') && (
                    <div>
                        <label className="block text-sm">Status</label>
                        <input value={status} onChange={e => setStatus(e.target.value)} className="border p-2 rounded w-full" placeholder="cth: OPEN / PARTIAL / ..." />
                    </div>
                )}
                <div className="flex gap-2">
                    <button onClick={load} className="px-3 py-2 bg-blue-600 text-white rounded">Terapkan</button>
                    <button onClick={() => onExport('csv')} className="px-3 py-2 bg-green-600 text-white rounded">Export CSV</button>
                    {/* XLSX opsional nanti */}
                </div>
            </div>

            {/* Preview table */}
            <div className="overflow-auto border rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>{columns.map(c => <th key={c} className="text-left p-2">{c}</th>)}</tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-3" colSpan={columns.length}>Loading…</td></tr>
                        ) : rows.length === 0 ? (
                            <tr><td className="p-3" colSpan={columns.length}>Tidak ada data</td></tr>
                        ) : rows.map((r, i) => (
                            <tr key={i} className="border-t">
                                {columns.map(col => {
                                    const key = col.toLowerCase().replaceAll(' ', '_');
                                    return <td key={col} className="p-2">{String(r[key] ?? '')}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-xs text-gray-600">
                Hal {pageInfo.current_page} dari {pageInfo.last_page} • Total {pageInfo.total}
            </div>
        </div>
    );
}
