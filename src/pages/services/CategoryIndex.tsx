// src/pages/services/CategoryIndex.tsx
import { useEffect, useState, useCallback } from 'react';
import type { ServiceCategory, PaginationMeta } from '../../types/services';
import {
  listServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from '../../api/serviceCategories';

export default function CategoryIndex() {
  const [rows, setRows] = useState<ServiceCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;

  const refresh = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listServiceCategories({ q, page: p, per_page: perPage });
        setRows(res.data ?? []);
        setMeta((res.meta as PaginationMeta) ?? null);
      } catch {
        setError('Gagal memuat kategori');
      } finally {
        setLoading(false);
      }
    },
    [q, perPage],
  );

  useEffect(() => { void refresh(page); }, [page, refresh]);

  useEffect(() => {
    const t = setTimeout(() => { void refresh(1); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [q, refresh]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Service Categories</h1>
          <p className="text-xs text-gray-600">Kelola kategori untuk mengelompokkan layanan.</p>
        </div>
        <button
          className="btn-primary"
          onClick={async () => {
            const name = prompt('Nama kategori:')?.trim();
            if (!name) return;
            try {
              await createServiceCategory({ name, is_active: true });
              await refresh(page);
            } catch {
              alert('Gagal membuat kategori');
            }
          }}
          aria-label="Tambah kategori layanan"
        >
          + New Category
        </button>
      </header>

      {/* Toolbar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar filter kategori"
      >
        <div className="p-3">
          <div className="relative max-w-xl">
            <label htmlFor="search-cat" className="sr-only">Cari kategori</label>
            <input
              id="search-cat"
              className="input w-full pl-9 py-2"
              placeholder="Cari nama…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari nama kategori"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
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
      {!loading && !error && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada kategori
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
                  <Th>Status</Th>
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
                  </>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td>
                        <span className="line-clamp-1 font-medium">{r.name}</span>
                      </Td>
                      <Td>
                        {r.is_active ? (
                          <span className="chip chip--solid">Active</span>
                        ) : (
                          <span className="chip chip--danger">Inactive</span>
                        )}
                      </Td>
                      <Td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="btn-outline text-xs px-3 py-1"
                            onClick={async () => {
                              const name = prompt('Ubah nama kategori:', r.name)?.trim();
                              if (!name) return;
                              try {
                                await updateServiceCategory(r.id, { name });
                                await refresh(page);
                              } catch {
                                alert('Gagal update');
                              }
                            }}
                            aria-label={`Ubah kategori ${r.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-outline text-xs px-3 py-1 text-red-600"
                            onClick={async () => {
                              if (!confirm(`Hapus kategori ${r.name}?`)) return;
                              try {
                                await deleteServiceCategory(r.id);
                                await refresh(page);
                              } catch {
                                alert('Gagal hapus');
                              }
                            }}
                            aria-label={`Hapus kategori ${r.name}`}
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

/* ---------- Subcomponents (konsisten) ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}
