import { useCallback, useEffect, useMemo, useState } from 'react';
import { listVouchers, deleteVoucher } from '../../api/vouchers';
import type { Voucher, PaginationMeta } from '../../types/vouchers';
import { useNavigate } from 'react-router-dom';
import { useHasRole } from '../../store/useAuth';

export default function VouchersIndex() {
    const canManage = useHasRole(['Superadmin', 'Admin Cabang']);
    const nav = useNavigate();
    const [rows, setRows] = useState<Voucher[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [active, setActive] = useState<'all' | 'active' | 'inactive'>('all');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const perPage = 10;

    const queryActive = useMemo(() => active === 'all' ? undefined : active === 'active', [active]);

    const fetchPage = useCallback(async (p = 1) => {
        setLoading(true); setError(null);
        try {
            const res = await listVouchers({ q, page: p, per_page: perPage, active: queryActive });
            setRows(res.data ?? []);
            setMeta(res.meta ?? null);
        } catch (ex: unknown) {
            const err = ex as { response?: { status?: number } };
            if (err?.response?.status === 403) setError('Tidak berwenang mengakses vouchers');
            else setError('Gagal memuat data voucher');
        } finally {
            setLoading(false);
        }
    }, [q, queryActive]);

    useEffect(() => { void fetchPage(page); }, [fetchPage, page]);

    useEffect(() => {
        const t = setTimeout(() => { void fetchPage(1); setPage(1); }, 300);
        return () => clearTimeout(t);
    }, [fetchPage, q, active]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Vouchers</h1>
                    <p className="text-xs text-gray-500">Kelola kode promo dan periode aktif.</p>
                </div>
                {canManage && (
                    <div className="space-x-2">
                        <button className="rounded border px-3 py-2 text-sm" onClick={() => nav('/vouchers/new')}>New Voucher</button>
                    </div>
                )}
            </header>

            <div className="flex items-center gap-2">
                <input
                    className="border rounded px-3 py-2 text-sm"
                    placeholder="Cari kode…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <select
                    className="border rounded px-3 py-2 text-sm"
                    value={active}
                    onChange={(e) => setActive(e.target.value as 'all' | 'active' | 'inactive')}
                >
                    <option value="all">Semua</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="overflow-auto border rounded">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="p-2">Kode</th>
                            <th className="p-2">Tipe</th>
                            <th className="p-2">Nilai</th>
                            <th className="p-2">Min Total</th>
                            <th className="p-2">Periode</th>
                            <th className="p-2">Limit</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-4" colSpan={8}>Memuat…</td></tr>
                        ) : rows.length === 0 ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={8}>Belum ada voucher</td></tr>
                        ) : rows.map(v => (
                            <tr key={v.id} className="border-t">
                                <td className="p-2 font-mono">{v.code}</td>
                                <td className="p-2">{v.type}</td>
                                <td className="p-2">{v.type === 'PERCENT' ? `${v.value}%` : new Intl.NumberFormat('id-ID').format(v.value)}</td>
                                <td className="p-2">{new Intl.NumberFormat('id-ID').format(v.min_total ?? 0)}</td>
                                <td className="p-2">
                                    {(v.start_at && v.end_at) ? `${v.start_at?.slice(0, 16)} — ${v.end_at?.slice(0, 16)}` : '—'}
                                </td>
                                <td className="p-2">{v.usage_limit ?? '—'}</td>
                                <td className="p-2">{v.active ? 'Aktif' : 'Nonaktif'}</td>
                                <td className="p-2">
                                    <div className="flex gap-2">
                                        <button className="underline text-xs" onClick={() => nav(`/vouchers/${v.id}/edit`)}>Edit</button>
                                        {canManage && (
                                            <button
                                                className="underline text-xs text-red-600"
                                                onClick={async () => {
                                                    if (!confirm(`Hapus voucher ${v.code}?`)) return;
                                                    try { await deleteVoucher(v.id); await fetchPage(page); } catch { alert('Gagal menghapus'); }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {meta && meta.last_page > 1 && (
                <div className="flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                    <div className="text-xs text-gray-600">Hal {meta.current_page} / {meta.last_page}</div>
                    <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
                </div>
            )}
        </div>
    );
}
