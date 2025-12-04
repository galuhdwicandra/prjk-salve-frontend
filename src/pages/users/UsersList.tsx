// src/pages/users/UsersList.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listUsers, deleteUser, setUserActive } from '../../api/users';
import type { User, PaginationMeta, UserQuery } from '../../types/users';
import { Link } from 'react-router-dom';
import { useAuth, useHasRole } from '../../store/useAuth';

export default function UsersList() {
  const me = useAuth.user; // akses user login (branch_id, roles)
  const isSuperadmin = useHasRole('Superadmin');
  const canManage = useHasRole(['Superadmin', 'Admin Cabang']);

  const [rows, setRows] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard per-baris agar UI tidak men-trigger 403
  const canEditRow = useCallback(
    (row: User) => {
      if (isSuperadmin) return true;
      const sameBranch = String(row.branch_id ?? '') === String(me?.branch_id ?? '');
      const rowHasSuperadmin = (row.roles ?? []).includes('Superadmin');
      return sameBranch && !rowHasSuperadmin;
    },
    [isSuperadmin, me?.branch_id]
  );

  const canToggleActive = canEditRow;
  const canDeleteRow = useCallback(
    (row: User) => {
      if (isSuperadmin) return true;
      const sameBranch = String(row.branch_id ?? '') === String(me?.branch_id ?? '');
      const rowHasSuperadmin = (row.roles ?? []).includes('Superadmin');
      return sameBranch && !rowHasSuperadmin;
    },
    [isSuperadmin, me?.branch_id]
  );

  const refresh = useCallback(
    async (p = page) => {
      setLoading(true);
      setError(null);
      try {
        const query: UserQuery = { q, page: p, per_page: perPage };
        if (!isSuperadmin && me?.branch_id) query.branch_id = String(me.branch_id);
        const res = await listUsers(query);
        setRows(res.data ?? []);
        setMeta((res.meta as PaginationMeta) ?? null);
      } catch {
        setError('Gagal memuat data user');
      } finally {
        setLoading(false);
      }
    },
    [page, q, perPage, isSuperadmin, me?.branch_id]
  );

  useEffect(() => { setPage(1); }, [q, perPage]);
  useEffect(() => { void refresh(page); }, [page, refresh]);

  const handleToggleActive = useCallback(
    async (u: User) => {
      if (!canManage || !canToggleActive(u)) return;
      try {
        await setUserActive(String(u.id), !u.is_active);
        await refresh();
      } catch {
        alert('Gagal set status');
      }
    },
    [canManage, canToggleActive, refresh]
  );

  const handleDelete = useCallback(
    async (u: User) => {
      if (!canManage || !canDeleteRow(u)) return;
      if (!confirm(`Hapus user ${u.username || u.email}?`)) return;
      try {
        await deleteUser(String(u.id));
        await refresh();
      } catch {
        alert('Gagal menghapus');
      }
    },
    [canManage, canDeleteRow, refresh]
  );

  const isEmpty = useMemo(() => !loading && rows.length === 0, [loading, rows.length]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Users</h1>
          <p className="text-xs text-gray-500">Kelola akun, role, dan status aktif.</p>
        </div>
        {canManage && (
          <Link to="/users/new" className="btn-primary" aria-label="Tambah user baru">
            New User
          </Link>
        )}
      </header>

      {/* Toolbar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar pencarian user"
      >
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            <label htmlFor="q" className="sr-only">Pencarian</label>
            <input
              id="q"
              className="input w-full pl-9 py-2"
              placeholder="Cari nama/username/email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari user"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <label htmlFor="per" className="text-sm text-gray-600">Per page</label>
            <select
              id="per"
              className="input w-[88px] py-2"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              aria-label="Jumlah baris per halaman"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}
      {isEmpty && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada user.
        </div>
      )}

      {/* Table */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Nama</Th>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>Branch</Th>
                  <Th>Roles</Th>
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
                    <RowSkeleton />
                  </>
                ) : (
                  rows.map((u) => {
                    const allowEdit = canEditRow(u);
                    const allowToggle = canToggleActive(u);
                    const allowDelete = canDeleteRow(u);
                    return (
                      <tr key={u.id} className="hover:bg-black/5 transition-colors">
                        <Td><span className="font-medium">{u.name}</span></Td>
                        <Td>{u.username}</Td>
                        <Td className="break-all">{u.email}</Td>
                        <Td>{u.branch_id ?? '-'}</Td>
                        <Td>
                          <div className="flex flex-wrap gap-1">
                            {(u.roles ?? []).map((r) => (
                              <span key={r} className="chip chip--subtle">
                                {r}
                              </span>
                            ))}
                          </div>
                        </Td>
                        <Td>
                          <span className={`chip ${u.is_active ? 'chip--solid' : 'chip--subtle'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </Td>
                        <Td className="text-right space-x-2">
                          {allowEdit && (
                            <Link
                              className="btn-outline"
                              to={`/users/${String(u.id)}/edit`}
                              aria-label={`Edit user ${u.username ?? u.email}`}
                            >
                              Edit
                            </Link>
                          )}
                          {canManage && (
                            <>
                              <button
                                className={`btn-outline ${allowToggle ? '' : 'opacity-40 cursor-not-allowed'}`}
                                disabled={!allowToggle}
                                onClick={() => handleToggleActive(u)}
                              >
                                {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                              <button
                                className={`btn-outline text-red-600 ${allowDelete ? '' : 'opacity-40 cursor-not-allowed'}`}
                                disabled={!allowDelete}
                                onClick={() => handleDelete(u)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </Td>
                      </tr>
                    );
                  })
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

/* ---------- Subcomponents ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-56 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-36 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-6 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}
