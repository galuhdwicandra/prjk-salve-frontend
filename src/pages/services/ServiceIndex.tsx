import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import type { Service, PaginationMeta, ServiceCategory } from '../../types/services';
import { listServices, deleteService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import { useNavigate, Link } from 'react-router-dom';

export default function ServiceIndex() {
    const nav = useNavigate();
    const [rows, setRows] = useState<Service[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [cats, setCats] = useState<ServiceCategory[]>([]);
    const [q, setQ] = useState('');
    const [category_id, setCategoryId] = useState<string>('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const perPage = 10;

    const loadCats = useCallback(async () => {
        try {
            const sc = await listServiceCategories({ per_page: 100 });
            setCats(sc.data ?? []);
        } catch {
            // optional: tampilkan toast/log, tapi jangan hentikan flow services
        }
    }, []);

    const refresh = useCallback(async (p = 1) => {
        setLoading(true); setError(null);
        try {
            const res = await listServices({
                q,
                category_id: category_id || undefined,
                page: p,
                per_page: perPage
            });
            setRows(res.data ?? []);
            setMeta((res.meta as PaginationMeta) ?? null);
        } catch {
            setError('Gagal memuat layanan');
        } finally {
            setLoading(false);
        }
    }, [q, category_id, perPage]);

    useEffect(() => { if (!cats.length) void loadCats(); }, [cats.length, loadCats]);
    useEffect(() => { void refresh(page); }, [page, refresh]);
    useEffect(() => {
        const t = setTimeout(() => { void refresh(1); setPage(1); }, 300);
        return () => clearTimeout(t);
    }, [q, category_id, refresh]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Services</h1>
                    <p className="text-xs text-gray-500">Kelola layanan & harga per cabang.</p>
                </div>
                <div className="space-x-2">
                    <Link to="/service-categories" className="rounded border px-3 py-2 text-sm">Categories</Link>
                    <button className="rounded border px-3 py-2 text-sm" onClick={() => nav('/services/new')}>New Service</button>
                </div>
            </header>

            <div className="flex flex-wrap items-center gap-2">
                <input className="border rounded px-3 py-2 text-sm" placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} />
                <select className="border rounded px-3 py-2 text-sm" value={category_id} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Semua kategori</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DataTable<Service>
                columns={[
                    { key: 'name', header: 'Nama' },
                    { key: 'category', header: 'Kategori', render: (s) => s.category?.name ?? '-' },
                    { key: 'unit', header: 'Unit' },
                    { key: 'price_default', header: 'Harga Default', render: (s) => Number(s.price_default).toLocaleString('id-ID') },
                    { key: 'is_active', header: 'Status', render: (s) => s.is_active ? 'Active' : 'Inactive' },
                    {
                        key: 'actions', header: 'Aksi', render: (s) => (
                            <div className="flex gap-2">
                                <button className="underline text-xs" onClick={() => nav(`/services/${s.id}/edit`)}>Edit</button>
                                <button className="underline text-xs text-red-600" onClick={async () => {
                                    if (!confirm(`Hapus layanan ${s.name}?`)) return;
                                    try { await deleteService(s.id); await refresh(page); } catch { alert('Gagal hapus'); }
                                }}>Delete</button>
                            </div>
                        )
                    },
                ]}
                rows={rows}
                loading={loading}
                emptyText="Belum ada layanan"
            />

            <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                <div className="text-xs text-gray-600">Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}</div>
                <button disabled={!!meta && page >= (meta.last_page ?? 1)} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
            </div>
        </div>
    );
}
