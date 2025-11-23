// src/pages/services/CategoryIndex.tsx
import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
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

      {/* Table */}
      <div aria-busy={loading ? 'true' : 'false'}>
        <DataTable<ServiceCategory>
          columns={[
            { key: 'name', header: 'Nama' },
            {
              key: 'is_active',
              header: 'Status',
              render: (r) =>
                r.is_active ? (
                  <span className="chip chip--solid">Active</span>
                ) : (
                  <span className="chip chip--danger">Inactive</span>
                ),
            },
            {
              key: 'actions',
              header: 'Aksi',
              render: (r) => (
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
              ),
            },
          ]}
          rows={rows}
          loading={loading}
          emptyText="Belum ada kategori"
        />
      </div>

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
