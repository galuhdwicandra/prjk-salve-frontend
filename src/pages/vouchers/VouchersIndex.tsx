// src/pages/vouchers/VouchersIndex.tsx
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

  const queryActive = useMemo(
    () => (active === 'all' ? undefined : active === 'active'),
    [active]
  );

  const fetchPage = useCallback(
    async (p = 1) => {
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
    },
    [q, queryActive]
  );

  useEffect(() => { void fetchPage(page); }, [fetchPage, page]);

  useEffect(() => {
    const t = setTimeout(() => { void fetchPage(1); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [fetchPage, q, active]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Vouchers</h1>
          <p className="text-xs text-gray-500">Kelola kode promo dan periode aktif.</p>
        </div>
        {canManage && (
          <button
            className="btn-primary"
            onClick={() => nav('/vouchers/new')}
            aria-label="Tambah voucher baru"
          >
            New Voucher
          </button>
        )}
      </header>

      {/* Toolbar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar pencarian voucher"
      >
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            <input
              className="input w-full pl-9 py-2"
              placeholder="Cari kode…"
              value={q}
              onChange={(e) => { setQ(e.target.value); }}
              aria-label="Cari voucher"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>

          <div className="flex items-center justify-end gap-2">
            <label htmlFor="filter-active" className="text-sm text-gray-600">Status</label>
            <select
              id="filter-active"
              className="input py-2"
              value={active}
              onChange={(e) => setActive(e.target.value as 'all' | 'active' | 'inactive')}
              aria-label="Filter status voucher"
            >
              <option value="all">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
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
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)] text-left">
                  <Th>Kode</Th>
                  <Th>Tipe</Th>
                  <Th className="text-right">Nilai</Th>
                  <Th className="text-right">Min Total</Th>
                  <Th>Periode</Th>
                  <Th className="text-right">Limit</Th>
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
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                      Belum ada voucher
                    </td>
                  </tr>
                ) : (
                  rows.map((v) => (
                    <tr key={v.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-mono">{v.code}</span></Td>
                      <Td>{v.type}</Td>
                      <Td className="text-right">
                        {v.type === 'PERCENT'
                          ? `${v.value}%`
                          : new Intl.NumberFormat('id-ID').format(v.value)}
                      </Td>
                      <Td className="text-right">
                        {new Intl.NumberFormat('id-ID').format(v.min_total ?? 0)}
                      </Td>
                      <Td>
                        {(v.start_at && v.end_at)
                          ? `${v.start_at?.slice(0, 16)} — ${v.end_at?.slice(0, 16)}`
                          : '—'}
                      </Td>
                      <Td className="text-right">{v.usage_limit ?? '—'}</Td>
                      <Td>{v.active ? 'Aktif' : 'Nonaktif'}</Td>
                      <Td className="text-right">
                        <div className="inline-flex gap-2">
                          <button
                            className="btn-outline"
                            onClick={() => nav(`/vouchers/${v.id}/edit`)}
                            aria-label={`Edit voucher ${v.code}`}
                          >
                            Edit
                          </button>
                          {canManage && (
                            <button
                              className="btn-outline text-red-600"
                              onClick={async () => {
                                if (!confirm(`Hapus voucher ${v.code}?`)) return;
                                try {
                                  await deleteVoucher(v.id);
                                  await fetchPage(page);
                                } catch {
                                  alert('Gagal menghapus');
                                }
                              }}
                              aria-label={`Hapus voucher ${v.code}`}
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

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman voucher">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">Hal {meta.current_page} / {meta.last_page}</span>
          <button
            disabled={page >= meta.last_page}
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
    <th className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
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
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-14 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right">
        <div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" />
      </td>
    </tr>
  );
}
