import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import type { ServiceCategory, PaginationMeta } from '../../types/services';
import { listServiceCategories, createServiceCategory, updateServiceCategory, deleteServiceCategory } from '../../api/serviceCategories';

export default function CategoryIndex() {
    const [rows, setRows] = useState<ServiceCategory[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const perPage = 10;

    const refresh = useCallback(async (p = 1) => {
        setLoading(true); setError(null);
        try {
            const res = await listServiceCategories({ q, page: p, per_page: perPage });
            setRows(res.data ?? []);
            setMeta((res.meta as PaginationMeta) ?? null);
        } catch {
            setError('Gagal memuat kategori');
        } finally {
            setLoading(false);
        }
    }, [q, perPage]);

    useEffect(() => { void refresh(page); }, [page, refresh]);
    useEffect(() => {
        const t = setTimeout(() => { void refresh(1); setPage(1); }, 300);
        return () => clearTimeout(t);
    }, [q, refresh]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Service Categories</h1>
                    <p className="text-xs text-gray-500">Kelola kategori untuk mengelompokkan layanan.</p>
                </div>
                <button
                    className="rounded border px-3 py-2 text-sm"
                    onClick={async () => {
                        const name = prompt('Nama kategori:')?.trim();
                        if (!name) return;
                        try { await createServiceCategory({ name, is_active: true }); await refresh(page); } catch { alert('Gagal membuat kategori'); }
                    }}
                >
                    New Category
                </button>
            </header>

            <div className="flex items-center gap-2">
                <input className="border rounded px-3 py-2 text-sm" placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DataTable<ServiceCategory>
                columns={[
                    { key: 'name', header: 'Nama' },
                    { key: 'is_active', header: 'Status', render: (r) => (r.is_active ? 'Active' : 'Inactive') },
                    {
                        key: 'actions', header: 'Aksi', render: (r) => (
                            <div className="flex gap-2">
                                <button className="underline text-xs" onClick={async () => {
                                    const name = prompt('Ubah nama kategori:', r.name)?.trim();
                                    if (!name) return;
                                    try { await updateServiceCategory(r.id, { name }); await refresh(page); } catch { alert('Gagal update'); }
                                }}>Edit</button>
                                <button className="underline text-xs text-red-600" onClick={async () => {
                                    if (!confirm(`Hapus kategori ${r.name}?`)) return;
                                    try { await deleteServiceCategory(r.id); await refresh(page); } catch { alert('Gagal hapus'); }
                                }}>Delete</button>
                            </div>
                        )
                    },
                ]}
                rows={rows}
                loading={loading}
                emptyText="Belum ada kategori"
            />

            <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                <div className="text-xs text-gray-600">Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}</div>
                <button disabled={!!meta && page >= (meta.last_page ?? 1)} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
            </div>
        </div>
    );
}
