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

  useEffect(() => {
    setPage(1);
  }, [q, perPage]);

  useEffect(() => {
    void refresh(page);
  }, [page, refresh]);

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

  const totalUsers = meta?.total ?? rows.length;
  const showingFrom = meta ? (rows.length ? (meta.current_page - 1) * perPage + 1 : 0) : rows.length ? 1 : 0;
  const showingTo = meta ? (rows.length ? (meta.current_page - 1) * perPage + rows.length : 0) : rows.length;


  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">Settings / Users</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola akun, role, dan status aktif.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-xs text-slate-500">
            Total: <span className="font-semibold text-slate-700">{totalUsers}</span>
          </div>

          {canManage && (
            <Link
              to="/users/new"
              className="
                inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2
                text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950
              "
              aria-label="Tambah user baru"
            >
              <PlusIcon />
              New User
            </Link>
          )}
        </div>
      </header>

      {/* Toolbar */}
      <section
        className="rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(0,0,0,.35)]"
        aria-label="Toolbar pencarian user"
      >
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="relative">
              <label htmlFor="q" className="sr-only">
                Pencarian
              </label>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                id="q"
                className="
                  w-full rounded-lg border border-slate-200 bg-white
                  py-2.5 pl-10 pr-3 text-sm text-slate-900
                  placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                placeholder="Cari nama / username / email…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari user"
              />
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="text-xs text-slate-500">
                {meta ? (
                  <>
                    Menampilkan <span className="font-semibold text-slate-700">{showingFrom}</span>–
                    <span className="font-semibold text-slate-700">{showingTo}</span> dari{" "}
                    <span className="font-semibold text-slate-700">{meta.total ?? totalUsers}</span>
                  </>
                ) : (
                  <>
                    Menampilkan <span className="font-semibold text-slate-700">{rows.length}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="per" className="text-xs font-medium text-slate-600">
                  Per page
                </label>
                <select
                  id="per"
                  className="
                    rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm
                    focus:border-slate-900 focus:outline-none
                  "
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
          </div>
        </div>
      </section>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {isEmpty && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
          Belum ada user.
        </div>
      )}

      {/* Table */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(0,0,0,.35)]">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th className="pl-4">User</Th>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>Branch</Th>
                  <Th>Roles</Th>
                  <Th>Status</Th>
                  <Th className="pr-4 text-right">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
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
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        {/* User */}
                        <Td className="pl-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name || u.username || u.email || '?'} />
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-900">{u.name || '-'}</div>
                              <div className="truncate text-xs text-slate-500">ID: {String(u.id)}</div>
                            </div>
                          </div>
                        </Td>

                        <Td className="text-slate-700">{u.username || '-'}</Td>
                        <Td className="text-slate-700">
                          <span className="break-all">{u.email || '-'}</span>
                        </Td>
                        <Td className="text-slate-700">{u.branch_id ?? '-'}</Td>

                        <Td>
                          <div className="flex flex-wrap gap-1.5">
                            {(u.roles ?? []).length ? (
                              (u.roles ?? []).map((r) => (
                                <span
                                  key={r}
                                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700"
                                >
                                  {r}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </div>
                        </Td>

                        <Td>
                          <span
                            className={[
                              'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold',
                              u.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                'h-2 w-2 rounded-full',
                                u.is_active ? 'bg-emerald-500' : 'bg-slate-400',
                              ].join(' ')}
                            />
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </Td>

                        {/* Actions */}
                        <Td className="pr-4">
                          <div className="flex justify-end gap-1">
                            {allowEdit && (
                              <Link
                                className="icon-btn"
                                to={`/users/${String(u.id)}/edit`}
                                aria-label={`Edit user ${u.username ?? u.email}`}
                                title="Edit"
                              >
                                <EditIcon />
                              </Link>
                            )}

                            {canManage && (
                              <>
                                <button
                                  className={`icon-btn ${allowToggle ? '' : 'opacity-40 cursor-not-allowed'}`}
                                  disabled={!allowToggle}
                                  onClick={() => handleToggleActive(u)}
                                  aria-label={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                  title={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                >
                                  {u.is_active ? <PauseIcon /> : <PlayIcon />}
                                </button>

                                <button
                                  className={`icon-btn text-red-600 hover:bg-red-50 ${allowDelete ? '' : 'opacity-40 cursor-not-allowed'
                                    }`}
                                  disabled={!allowDelete}
                                  onClick={() => handleDelete(u)}
                                  aria-label="Delete"
                                  title="Delete"
                                >
                                  <TrashIcon />
                                </button>
                              </>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer mini */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
            <div>
              {meta ? (
                <>
                  Halaman <span className="font-semibold text-slate-700">{meta.current_page}</span> dari{' '}
                  <span className="font-semibold text-slate-700">{meta.last_page}</span>
                </>
              ) : (
                <>—</>
              )}
            </div>
            <div className="hidden sm:block">
              {me?.branch_id ? (
                <>Scope: Branch #{String(me.branch_id)}</>
              ) : (
                <>Scope: All</>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <nav className="flex items-center justify-end gap-2" aria-label="Navigasi halaman">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="page-btn disabled:opacity-50"
          >
            <ChevronLeftIcon />
            Prev
          </button>

          <span className="text-sm text-slate-600">
            Hal <span className="font-semibold text-slate-900">{meta.current_page}</span> / {meta.last_page}
          </span>

          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="page-btn disabled:opacity-50"
          >
            Next
            <ChevronRightIcon />
          </button>
        </nav>
      )}

      {/* Small local styles via Tailwind utility classnames (no logic change) */}
      <style>
        {`
          .icon-btn{
            display:inline-flex; align-items:center; justify-content:center;
            width:36px; height:36px;
            border:1px solid rgb(226 232 240);
            border-radius:10px;
            background:#fff;
            color: rgb(15 23 42);
          }
          .icon-btn:hover{ background: rgb(248 250 252); }
          .icon-btn:active{ background: rgb(241 245 249); }
          .page-btn{
            display:inline-flex; align-items:center; gap:8px;
            border:1px solid rgb(226 232 240);
            background:#fff;
            color: rgb(15 23 42);
            border-radius:10px;
            padding:8px 12px;
            font-size:14px;
            font-weight:600;
          }
          .page-btn:hover{ background: rgb(248 250 252); }
        `}
      </style>
    </div>
  );
}

/* ---------- Subcomponents (UI only) ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-3 align-middle ${className}`}>{children}</td>;
}

function RowSkeleton() {
  return (
    <tr>
      <td className="px-3 py-4 pl-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-3 py-4"><div className="h-4 w-28 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-4 w-56 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-4 w-16 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-4 w-36 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-6 w-24 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4 pr-4 text-right"><div className="inline-block h-9 w-28 rounded bg-slate-200 animate-pulse" /></td>
    </tr>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = useMemo(() => {
    const clean = (name || '').trim();
    if (!clean) return '?';
    const parts = clean.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join('') || '?';
  }, [name]);

  return (
    <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
      {initials}
    </div>
  );
}

/* ---------- Icons (pure visual) ---------- */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 5l12 7-12 7V5z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 5v14M16 5v14" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
