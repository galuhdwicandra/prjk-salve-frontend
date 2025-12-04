// src/pages/branches/BranchIndex.tsx
import { useCallback, useEffect, useState } from 'react';
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

  useEffect(() => { void fetchPage(page); }, [fetchPage, page]);

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
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Branches</h1>
          <p className="text-xs text-gray-500">Kelola cabang & konfigurasi penomoran faktur.</p>
        </div>
        {canManage && (
          <div className="space-x-2">
            <button className="btn-primary" onClick={() => nav('/branches/new')}>
              New Branch
            </button>
          </div>
        )}
      </header>

      {/* Toolbar (search) */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar pencarian cabang"
      >
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <label className="sr-only" htmlFor="search-branch">Pencarian</label>
          <div className="relative">
            <input
              id="search-branch"
              className="input w-full pl-9 py-2"
              placeholder="Cari nama/kode…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari cabang"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>
        </div>
      </section>

      {/* Alert error */}
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
          Belum ada data cabang.
        </div>
      )}

      {/* Table (konsisten dengan Customers) */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Kode</Th>
                  <Th>Nama</Th>
                  <Th>Prefix Invoice</Th>
                  <Th>Reset</Th>
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
                  rows.map((b) => (
                    <tr key={b.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-medium">{b.code}</span></Td>
                      <Td><span className="line-clamp-1">{b.name}</span></Td>
                      <Td>{b.invoice_prefix ?? '—'}</Td>
                      <Td className="uppercase">{b.reset_policy ?? '—'}</Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="btn-outline px-2 py-1 text-xs"
                            onClick={() => nav(`/branches/${b.id}/edit`)}
                            aria-label={`Edit cabang ${b.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-outline px-2 py-1 text-xs"
                            onClick={() => nav(`/branches/${b.id}/invoice-settings`)}
                            aria-label={`Pengaturan invoice cabang ${b.name}`}
                          >
                            Invoice
                          </button>
                          {canManage && (
                            <button
                              className="btn-outline px-2 py-1 text-xs text-red-600"
                              onClick={async () => {
                                if (!confirm(`Hapus cabang ${b.name}?`)) return;
                                try {
                                  await deleteBranch(b.id);
                                  await fetchPage(page);
                                } catch {
                                  alert('Gagal menghapus');
                                }
                              }}
                              aria-label={`Hapus cabang ${b.name}`}
                            >
                              Delete
                            </button>
                          )}
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

      {/* Pagination (konsisten) */}
      {!loading && meta && meta.last_page > 1 && (
        <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
          <button
            disabled={(meta.current_page ?? 1) <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {meta.current_page} / {meta.last_page}
          </span>
          <button
            disabled={meta.current_page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

/* ---------- Subcomponents (konsisten dgn Customers) ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right">
        <div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" />
      </td>
    </tr>
  );
}
