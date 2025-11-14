// src/pages/expenses/ExpensesIndex.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listExpenses, deleteExpense } from '../../api/expenses';
import { listBranches } from '../../api/branches';
import type { Expense, ExpenseQuery } from '../../types/expenses';
import type { Branch } from '../../types/branches';
import { toIDR } from '../../utils/money';
import { useHasRole } from '../../store/useAuth';

type Meta = { current_page: number; per_page: number; total: number; last_page: number };

export default function ExpensesIndex() {
    const canManage = useHasRole(['Superadmin', 'Admin Cabang']);
    const isSuperadmin = useHasRole(['Superadmin']);
    const nav = useNavigate();

    const [rows, setRows] = useState<Expense[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string>('');
    const [branchList, setBranchList] = useState<Branch[]>([]);

    // Filters
    const [branchId, setBranchId] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(15);

    const params: ExpenseQuery = useMemo(() => {
        const out: ExpenseQuery = { page, per_page: perPage };
        if (isSuperadmin && branchId) out.branch_id = branchId;
        if (dateFrom) out.date_from = dateFrom;
        if (dateTo) out.date_to = dateTo;
        return out;
    }, [page, perPage, isSuperadmin, branchId, dateFrom, dateTo]);

    const load = useCallback(async () => {
        setLoading(true);
        setErr('');
        try {
            if (isSuperadmin && branchList.length === 0) {
                const bres = await listBranches({ per_page: 100 });
                setBranchList(bres.data ?? []);
            }
            const res = await listExpenses(params);
            setRows(res.data ?? []);
            setMeta((res.meta as unknown as Meta) ?? null);
        } catch (e) {
            setErr('Gagal memuat data');
            if (import.meta.env.DEV) console.error('[ExpensesIndex] load error', e);
        } finally {
            setLoading(false);
        }
    }, [params, isSuperadmin, branchList.length]);

    useEffect(() => { load(); }, [load]);

    async function onDelete(row: Expense) {
        if (!canManage) return;
        const ok = window.confirm(`Hapus pengeluaran "${row.category}" sebesar ${toIDR(Number(row.amount))}?`);
        if (!ok) return;
        try {
            await deleteExpense(row.id);
            await load();
        } catch (e) {
            if (import.meta.env.DEV) console.error('[ExpensesIndex] delete error', e);
            alert('Gagal menghapus');
        }
    }

    function fileUrl(path: string | null): string | null {
        if (!path) return null;
        const base = String(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '');
        const clean = String(path).replace(/^\/+/, '');
        return `${base}/${clean}`;
    }

    return (
        <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
                <h1 className="text-lg font-semibold">Biaya Operasional</h1>
                {canManage && (
                    <button
                        className="rounded-lg bg-black px-3 py-2 text-white text-sm"
                        onClick={() => nav('/expenses/new')}
                    >
                        Tambah
                    </button>
                )}
            </div>

            <div className="mb-3 grid grid-cols-1 md:grid-cols-5 gap-2">
                {isSuperadmin && (
                    <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                    >
                        <option value="">Semua Cabang</option>
                        {branchList.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                    </select>
                )}
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border rounded-md px-2 py-1 text-sm" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border rounded-md px-2 py-1 text-sm" />
                <select value={perPage} onChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); }} className="border rounded-md px-2 py-1 text-sm">
                    {[10, 15, 25, 50, 100].map(n => <option key={n} value={n}>{n}/hal</option>)}
                </select>
                <button onClick={() => { setPage(1); load(); }} className="border rounded-md px-3 py-1 text-sm">Terapkan</button>
            </div>

            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {err && <div className="text-sm text-red-600">{err}</div>}
            {!loading && rows.length === 0 && <div className="text-sm text-gray-500">Belum ada data.</div>}

            {!loading && rows.length > 0 && (
                <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="p-2">Tanggal</th>
                                {isSuperadmin && <th className="p-2">Cabang</th>}
                                <th className="p-2">Kategori</th>
                                <th className="p-2">Nominal</th>
                                <th className="p-2">Catatan</th>
                                <th className="p-2">Bukti</th>
                                {canManage && <th className="p-2"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '-'}</td>
                                    {isSuperadmin && <td className="p-2">{r.branch?.name ?? r.branch_id}</td>}
                                    <td className="p-2">{r.category}</td>
                                    <td className="p-2">{toIDR(Number(r.amount))}</td>
                                    <td className="p-2">{r.note ?? '-'}</td>
                                    <td className="p-2">
                                        {r.proof_path ? (
                                            <a
                                                className="underline"
                                                target="_blank" rel="noopener noreferrer"
                                                href={fileUrl(r.proof_path) ?? '#'}
                                            >
                                                Lihat
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    {canManage && (
                                        <td className="p-2 text-right space-x-2">
                                            <Link to={`/expenses/${encodeURIComponent(r.id)}/edit`} className="underline">Edit</Link>
                                            <button onClick={() => onDelete(r)} className="underline text-red-600">Hapus</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {meta && meta.last_page > 1 && (
                <div className="mt-3 flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border rounded-md px-3 py-1 text-sm disabled:opacity-50">Prev</button>
                    <div className="text-sm">Hal {page} / {meta.last_page} • {meta.total} data</div>
                    <button disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)} className="border rounded-md px-3 py-1 text-sm disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    );
}
