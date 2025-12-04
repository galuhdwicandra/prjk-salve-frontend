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
            // Admin Cabang: hanya boleh edit user di cabangnya dan bukan Superadmin
            const sameBranch = String(row.branch_id ?? '') === String(me?.branch_id ?? '');
            const rowHasSuperadmin = (row.roles ?? []).includes('Superadmin');
            return sameBranch && !rowHasSuperadmin;
        },
        [isSuperadmin, me?.branch_id]
    );

    const canToggleActive = canEditRow; // atur kebijakan sama dengan edit
    const canDeleteRow = useCallback(
        (row: User) => {
            if (isSuperadmin) return true; // Superadmin boleh
            // Admin Cabang: boleh hapus user di cabangnya dan bukan Superadmin
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
                // Admin Cabang: paksa filter berdasarkan cabang login
                if (!isSuperadmin && me?.branch_id) {
                    (query).branch_id = String(me.branch_id);
                }
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

    // Reset ke halaman 1 ketika q/perPage berubah
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

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Users</h1>
                    <p className="text-xs text-gray-500">Kelola akun, role, dan status aktif.</p>
                </div>
                {canManage && <Link to="/users/new" className="rounded border px-3 py-2 text-sm">New User</Link>}
            </header>

            <div className="flex gap-2">
                <input
                    className="border rounded px-3 py-2 text-sm w-full"
                    placeholder="Cari nama/username/email…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <select
                    className="border rounded px-3 py-2 text-sm"
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {isEmpty && <div className="text-sm text-gray-500">Belum ada user</div>}

            {!loading && rows.length > 0 && (
                <div className="overflow-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left">Nama</th>
                                <th className="px-3 py-2 text-left">Username</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">Branch</th>
                                <th className="px-3 py-2 text-left">Roles</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((u) => {
                                const allowEdit = canEditRow(u);
                                const allowToggle = canToggleActive(u);
                                const allowDelete = canDeleteRow(u);

                                return (
                                    <tr key={u.id} className="border-t">
                                        <td className="px-3 py-2">{u.name}</td>
                                        <td className="px-3 py-2">{u.username}</td>
                                        <td className="px-3 py-2">{u.email}</td>
                                        <td className="px-3 py-2">{u.branch_id ?? '-'}</td>
                                        <td className="px-3 py-2">{(u.roles ?? []).join(', ')}</td>
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-1 rounded text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {u.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 space-x-2">
                                            {allowEdit && (
                                                <Link className="underline text-xs" to={`/users/${String(u.id)}/edit`}>
                                                    Edit
                                                </Link>
                                            )}

                                            {canManage && (
                                                <>
                                                    <button
                                                        className={`underline text-xs ${allowToggle ? '' : 'opacity-40 cursor-not-allowed'}`}
                                                        disabled={!allowToggle}
                                                        onClick={() => handleToggleActive(u)}
                                                    >
                                                        {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    </button>

                                                    <button
                                                        className={`underline text-xs text-red-600 ${allowDelete ? '' : 'opacity-40 cursor-not-allowed'}`}
                                                        disabled={!allowDelete}
                                                        onClick={() => handleDelete(u)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {meta && meta.last_page > 1 && (
                <div className="flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">
                        Prev
                    </button>
                    <div className="text-xs text-gray-600">
                        Hal {meta.current_page} / {meta.last_page}
                    </div>
                    <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
