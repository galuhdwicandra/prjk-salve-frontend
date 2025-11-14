import { useCallback, useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import { useNavigate } from 'react-router-dom';
import { listBranches, deleteBranch } from '../../api/branches';
import type { Branch, PaginationMeta } from '../../types/branches';
import { useHasRole } from '../../store/useAuth';

export default function BranchIndex() {
    const canManage = useHasRole(['Superadmin']);
    const nav = useNavigate();
    const [rows, setRows] = useState<Branch[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const perPage = 10;

    const fetchPage = useCallback(async (p = 1) => {
        setLoading(true);
        setError(null);
        try {
            const res = await listBranches({ q, page: p, per_page: perPage });
            setRows(res.data ?? []);
            setMeta((res.meta as PaginationMeta) ?? null);
        } catch {
            setError('Gagal memuat data cabang');
        } finally {
            setLoading(false);
        }
    }, [q]);

    // Load saat halaman berubah
    useEffect(() => {
        void fetchPage(page);
    }, [fetchPage, page]);

    // Debounce pencarian (reset ke page 1)
    useEffect(() => {
        const t = setTimeout(() => {
            void fetchPage(1);
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [fetchPage, q]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Branches</h1>
                    <p className="text-xs text-gray-500">Kelola cabang & konfigurasi penomoran faktur.</p>
                </div>
                {canManage && (
                    <div className="space-x-2">
                        <button className="rounded border px-3 py-2 text-sm" onClick={() => nav('/branches/new')}>New Branch</button>
                    </div>
                )}
            </header>

            <div className="flex items-center gap-2">
                <input
                    className="border rounded px-3 py-2 text-sm"
                    placeholder="Cari nama/kode…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DataTable<Branch>
                columns={[
                    { key: 'code', header: 'Kode' },
                    { key: 'name', header: 'Nama' },
                    { key: 'invoice_prefix', header: 'Prefix Invoice' },
                    { key: 'reset_policy', header: 'Reset' },
                    {
                        key: 'actions',
                        header: 'Aksi',
                        render: (b) => (
                            <div className="flex gap-2">
                                <button className="underline text-xs" onClick={() => nav(`/branches/${b.id}/edit`)}>Edit</button>
                                <button className="underline text-xs" onClick={() => nav(`/branches/${b.id}/invoice-settings`)}>Invoice</button>
                                {canManage && (
                                    <button
                                        className="underline text-xs text-red-600"
                                        onClick={async () => {
                                            if (!confirm(`Hapus cabang ${b.name}?`)) return;
                                            try { await deleteBranch(b.id); await fetchPage(page); } catch { alert('Gagal menghapus'); }
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ),
                    },
                ]}
                rows={rows}
                loading={loading}
                emptyText="Belum ada data cabang"
            />

            <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                <div className="text-xs text-gray-600">
                    Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}
                </div>
                <button disabled={!!meta && page >= (meta.last_page ?? 1)} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
            </div>
        </div>
    );
}
