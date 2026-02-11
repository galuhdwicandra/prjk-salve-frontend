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

  const total = (meta?.total ?? rows?.length ?? 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Master Data</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-600">Services</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Services</h1>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">
              {loading ? 'Loading…' : `${total} items`}
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Kelola layanan dan harga default. Gunakan filter untuk mempercepat pencarian.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/service-categories"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
            aria-label="Kelola kategori"
          >
            <IconTag />
            Categories
          </Link>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60"
            onClick={() => nav('/services/new')}
            aria-label="Tambah layanan baru"
          >
            <IconPlus />
            New Service
          </button>
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]"
        aria-label="Filter layanan"
      >
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_240px_auto] md:items-center">
          {/* Search */}
          <div className="relative">
            <label htmlFor="q" className="sr-only">
              Pencarian layanan
            </label>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              id="q"
              className="
                w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm
                text-slate-900 placeholder:text-slate-400
                focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              placeholder="Cari nama layanan…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari layanan"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="cat" className="sr-only">
              Filter kategori
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconFilter />
              </span>
              <select
                id="cat"
                className="
                  w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm
                  text-slate-900
                  focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200
                "
                value={category_id}
                onChange={(e) => setCategoryId(e.target.value)}
                aria-label="Pilih kategori layanan"
              >
                <option value="">Semua kategori</option>
                {cats.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconChevronDown />
              </span>
            </div>
          </div>

          {/* Reset */}
          <div className="flex justify-end">
            <button
              type="button"
              className="
                inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5
                text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
              "
              onClick={() => {
                setQ('');
                setCategoryId('');
              }}
              aria-label="Reset filter"
            >
              <IconRotate />
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
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && rows && rows.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]">
          <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600">
            <IconBox />
          </div>
          <div className="text-sm font-semibold text-slate-900">Belum ada layanan</div>
          <div className="mt-1 text-sm text-slate-500">Klik “New Service” untuk menambahkan layanan baru.</div>
        </div>
      )}

      {/* Table */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]">
          {/* table top hint */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">Daftar Layanan</div>
            <div className="text-xs text-slate-500">
              Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-100">
                  <Th>Nama</Th>
                  <Th>Kategori</Th>
                  <Th>Unit</Th>
                  <Th className="text-right">Harga Default</Th>
                  <Th className="text-right">Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
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
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <Td>
                        <div className="min-w-[220px]">
                          <div className="line-clamp-1 font-semibold text-slate-900">{s.name}</div>
                          <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                            ID: <span className="tabular-nums">{s.id}</span>
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <span className="line-clamp-1 text-slate-700">{s.category?.name ?? '-'}</span>
                      </Td>

                      <Td>
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                          {s.unit}
                        </span>
                      </Td>

                      <Td className="text-right tabular-nums font-semibold text-slate-900">
                        {toIDR(Number(s.price_default))}
                      </Td>

                      <Td className="text-right">
                        <StatusPill active={!!s.is_active} />
                      </Td>

                      <Td className="text-right pr-4">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            className="
                              inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2
                              text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
                            "
                            onClick={() => nav(`/services/${s.id}/edit`)}
                            aria-label={`Edit layanan ${s.name}`}
                          >
                            <IconPencil />
                            Edit
                          </button>

                          <button
                            className="
                              inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2
                              text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100
                            "
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
                            <IconTrash />
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

          {/* Pagination bottom */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
            <div className="text-xs text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{rows?.length ?? 0}</span> data / halaman
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                  font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <IconChevronLeft />
                Prev
              </button>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums text-slate-700">
                {meta?.current_page ?? page} / {meta?.last_page ?? 1}
              </div>

              <button
                disabled={!!meta && page >= (meta.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="
                  inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                  font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                Next
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- UI Subcomponents (TIDAK ubah logika) ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function StatusPill({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Inactive
    </span>
  );
}

function RowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="ml-auto h-4 w-28 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4 text-right">
        <div className="ml-auto h-7 w-24 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4 text-right">
        <div className="ml-auto h-9 w-40 animate-pulse rounded bg-slate-200" />
      </td>
    </tr>
  );
}

/* ---------- Small Icons (inline SVG, no dependency) ---------- */
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.59 13.41 12 22l-10-10V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}
function IconPencil() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
function IconRotate() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}
function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v10l9 5 9-5V8" />
      <path d="M12 13v10" />
    </svg>
  );
}
