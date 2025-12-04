// src/pages/services/ServiceIndex.tsx
import { useEffect, useState, useCallback } from 'react';
import type { Service, PaginationMeta, ServiceCategory } from '../../types/services';
import { listServices, deleteService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import { useNavigate, Link } from 'react-router-dom';
import { toIDR } from '../../utils/money';

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

  const refresh = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listServices({
          q,
          category_id: category_id || undefined,
          page: p,
          per_page: perPage,
        });
        setRows(res.data ?? []);
        setMeta((res.meta as PaginationMeta) ?? null);
      } catch {
        setError('Gagal memuat layanan');
      } finally {
        setLoading(false);
      }
    },
    [q, category_id, perPage],
  );

  useEffect(() => {
    if (!cats.length) void loadCats();
  }, [cats.length, loadCats]);

  useEffect(() => {
    void refresh(page);
  }, [page, refresh]);

  useEffect(() => {
    const t = setTimeout(() => {
      void refresh(1);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q, category_id, refresh]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Services</h1>
          <p className="text-xs text-gray-600">Kelola layanan & harga per cabang.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/service-categories" className="btn-outline" aria-label="Kelola kategori">
            Categories
          </Link>
          <button className="btn-primary" onClick={() => nav('/services/new')} aria-label="Tambah layanan baru">
            New Service
          </button>
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter layanan"
      >
        <div className="p-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <label htmlFor="q" className="sr-only">Pencarian layanan</label>
              <input
                id="q"
                className="input w-full pl-9 py-2"
                placeholder="Cari nama layanan…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari layanan"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            </div>

            <div>
              <label htmlFor="cat" className="sr-only">Filter kategori</label>
              <select
                id="cat"
                className="input w-full py-2"
                value={category_id}
                onChange={(e) => setCategoryId(e.target.value)}
                aria-label="Pilih kategori layanan"
              >
                <option value="">Semua kategori</option>
                {cats.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setQ('');
                setCategoryId('');
              }}
              aria-label="Reset filter"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && rows && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada layanan.
        </div>
      )}

      {/* Table (konsisten dengan Customers) */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Nama</Th>
                  <Th>Kategori</Th>
                  <Th>Unit</Th>
                  <Th className="text-right">Harga Default</Th>
                  <Th className="text-right pr-4">Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : (
                  rows.map((s) => (
                    <tr key={s.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="line-clamp-1 font-medium">{s.name}</span></Td>
                      <Td><span className="line-clamp-1">{s.category?.name ?? '-'}</span></Td>
                      <Td>{s.unit}</Td>
                      <Td className="text-right tabular-nums">{toIDR(Number(s.price_default))}</Td>
                      <Td className="text-right">
                        <span
                          className={`chip ${s.is_active ? 'chip--solid' : 'chip--subtle'}`}
                          aria-label={s.is_active ? 'Aktif' : 'Nonaktif'}
                        >
                          {s.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </Td>
                      <Td className="text-right">
                        <div className="inline-flex justify-end gap-2">
                          <button
                            className="btn-outline"
                            onClick={() => nav(`/services/${s.id}/edit`)}
                            aria-label={`Edit layanan ${s.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-outline text-red-600"
                            onClick={async () => {
                              if (!confirm(`Hapus layanan ${s.name}?`)) return;
                              try {
                                await deleteService(s.id);
                                await refresh(page);
                              } catch {
                                alert('Gagal hapus');
                              }
                            }}
                            aria-label={`Hapus layanan ${s.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <div className="flex items-center gap-2 justify-end">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="btn-outline disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm">
          Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}
        </div>
        <button
          disabled={!!meta && page >= (meta.last_page ?? 1)}
          onClick={() => setPage((p) => p + 1)}
          className="btn-outline disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ---------- Subcomponents (konsisten dengan Customers) ---------- */
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
function RowSkeleton() {
  return (
    <tr>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-32 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse ml-auto" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}
