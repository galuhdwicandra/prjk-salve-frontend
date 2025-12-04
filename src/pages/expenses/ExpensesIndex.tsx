// src/pages/expenses/ExpensesIndex.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listExpenses, deleteExpense } from '../../api/expenses';
import { listBranches } from '../../api/branches';
import type { Expense, ExpenseQuery } from '../../types/expenses';
import type { Branch } from '../../types/branches';
import { toIDR } from '../../utils/money';
import { useHasRole } from '../../store/useAuth';

type Meta = { current_page: number; per_page: number; total: number; last_page: number };

export default function ExpensesIndex() {
  const canManage = useHasRole(['Superadmin', 'Admin Cabang']);
  const isSuperadmin = useHasRole(['Superadmin']);
  const nav = useNavigate();

  const [rows, setRows] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');
  const [branchList, setBranchList] = useState<Branch[]>([]);

  // Filters
  const [branchId, setBranchId] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);

  const params: ExpenseQuery = useMemo(() => {
    const out: ExpenseQuery = { page, per_page: perPage };
    if (isSuperadmin && branchId) out.branch_id = branchId;
    if (dateFrom) out.date_from = dateFrom;
    if (dateTo) out.date_to = dateTo;
    return out;
  }, [page, perPage, isSuperadmin, branchId, dateFrom, dateTo]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      if (isSuperadmin && branchList.length === 0) {
        const bres = await listBranches({ per_page: 100 });
        setBranchList(bres.data ?? []);
      }
      const res = await listExpenses(params);
      setRows(res.data ?? []);
      setMeta((res.meta as unknown as Meta) ?? null);
    } catch (e) {
      setErr('Gagal memuat data');
      if (import.meta.env.DEV) console.error('[ExpensesIndex] load error', e);
    } finally {
      setLoading(false);
    }
  }, [params, isSuperadmin, branchList.length]);

  useEffect(() => { load(); }, [load]);

  async function onDelete(row: Expense) {
    if (!canManage) return;
    const ok = window.confirm(`Hapus pengeluaran "${row.category}" sebesar ${toIDR(Number(row.amount))}?`);
    if (!ok) return;
    try {
      await deleteExpense(row.id);
      await load();
    } catch (e) {
      if (import.meta.env.DEV) console.error('[ExpensesIndex] delete error', e);
      alert('Gagal menghapus');
    }
  }

  function fileUrl(path: string | null): string | null {
    if (!path) return null;
    const base = String(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Biaya Operasional</h1>
          <p className="text-xs text-gray-600">Catatan pengeluaran per cabang & periode</p>
        </div>
        {canManage && (
          <button
            className="btn-primary"
            onClick={() => nav('/expenses/new')}
            aria-label="Tambah pengeluaran"
          >
            Tambah
          </button>
        )}
      </div>

      {/* Toolbar (FilterBar) */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter data pengeluaran"
      >
        <div className="p-3 grid grid-cols-1 md:grid-cols-5 gap-2">
          {isSuperadmin && (
            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Cabang</span>
              <select
                value={branchId}
                onChange={(e) => { setBranchId(e.target.value); setPage(1); }}
                className="input py-2"
                aria-label="Pilih cabang"
              >
                <option value="">Semua Cabang</option>
                {branchList.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
              </select>
            </label>
          )}

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Dari Tanggal</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="input py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Sampai Tanggal</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="input py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Per halaman</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); }}
              className="input py-2"
              aria-label="Jumlah baris per halaman"
            >
              {[10, 15, 25, 50, 100].map(n => <option key={n} value={n}>{n}/hal</option>)}
            </select>
          </label>

          <div className="flex items-end">
            <button
              onClick={() => { setPage(1); load(); }}
              className="btn-outline"
            >
              Terapkan
            </button>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {err && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      )}

      {/* Empty state */}
      {!loading && !err && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada data.
        </div>
      )}

      {/* Table (sama gaya dengan Customers) */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Tanggal</Th>
                  {isSuperadmin && <Th>Cabang</Th>}
                  <Th>Kategori</Th>
                  <Th className="text-right">Nominal</Th>
                  <Th>Catatan</Th>
                  <Th>Bukti</Th>
                  {canManage && <Th className="text-right pr-4">Aksi</Th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading ? (
                  <>
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                  </>
                ) : (
                  rows.map(r => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td>{r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '-'}</Td>
                      {isSuperadmin && <Td>{r.branch?.name ?? r.branch_id}</Td>}
                      <Td><span className="font-medium">{r.category}</span></Td>
                      <Td className="text-right tabular-nums">{toIDR(Number(r.amount))}</Td>
                      <Td><span className="line-clamp-2 max-w-[48ch]">{r.note ?? '-'}</span></Td>
                      <Td>
                        {r.proof_path ? (
                          <a
                            className="text-[color:var(--brand)] underline"
                            target="_blank" rel="noopener noreferrer"
                            href={fileUrl(r.proof_path) ?? '#'}
                          >
                            Lihat
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </Td>
                      {canManage && (
                        <Td className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={`/expenses/${encodeURIComponent(r.id)}/edit`}
                              className="btn-outline"
                              aria-label={`Edit pengeluaran ${r.category}`}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => onDelete(r)}
                              className="btn-outline text-red-600"
                              aria-label={`Hapus pengeluaran ${r.category}`}
                            >
                              Hapus
                            </button>
                          </div>
                        </Td>
                      )}
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
        <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">
            Hal {page} / {meta.last_page} • {meta.total} data
          </div>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage(p => p + 1)}
            className="btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
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
function RowSkeleton({ showBranch, showAction }: { showBranch: boolean; showAction: boolean }) {
  return (
    <tr>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      {showBranch && <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>}
      <td className="px-3 py-3"><div className="h-4 w-32 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse ml-auto" /></td>
      <td className="px-3 py-3"><div className="h-4 w-64 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-8 w-16 rounded bg-black/10 animate-pulse" /></td>
      {showAction && <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" /></td>}
    </tr>
  );
}
