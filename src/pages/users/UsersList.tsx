import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getErrorMessage } from '../../api/client';
import { listBranches } from '../../api/branches';
import { listUsers, setUserActive } from '../../api/users';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth, useIsManager } from '../../store/useAuth';
import type { Branch } from '../../types/branches';
import type { PaginationMeta, User, UserQuery } from '../../types/users';
import UserModal from './UserModal';
import { IconArchive, IconKebab, IconPlus, IconSort, IconSortDown, IconSortUp, IconUnarchive } from './icons';

type SortKey = 'name' | 'email' | 'role' | 'access';
type SortState = { key: SortKey; dir: 1 | -1 };

const PAGE_SIZES = [25, 50, 100];

const COLUMNS: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email / Username' },
    { key: 'role', label: 'Peran' },
    { key: 'access', label: 'Akses' },
];

function sortValue(row: User, key: SortKey): string | number {
    if (key === 'name') return (row.name ?? '').toLowerCase();
    if (key === 'email') return (row.email ?? '').toLowerCase();
    if (key === 'role') return (row.role_label ?? '').toLowerCase();
    return row.manager ? 1 : 0;
}

function branchLabel(row: User, totalBranches: number): string {
    const list = row.branches ?? [];
    if (totalBranches > 0 && list.length >= totalBranches) return 'Semua cabang';
    if (list.length === 0) return '\u2014';
    return list.map((branch) => branch.code).join(', ');
}

export default function UsersList() {
    const me = useAuth.user;
    const canManage = useIsManager();

    const [rows, setRows] = useState<User[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [archived, setArchived] = useState(false);
    const [sort, setSort] = useState<SortState>({ key: 'name', dir: 1 });
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [kebabOpen, setKebabOpen] = useState(false);
    const [modal, setModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    const [slot, setSlot] = useState<HTMLElement | null>(null);

    const { toast, showSuccess, showError, hideToast } = useToast();

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const query: UserQuery = { page, per_page: perPage, is_active: !archived };
            const res = await listUsers(query);
            setRows(res.data ?? []);
            setMeta(res.meta ?? null);
            setSelected([]);
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal memuat data pengguna'));
        } finally {
            setLoading(false);
        }
    }, [page, perPage, archived]);

    useEffect(() => {
        setSlot(document.getElementById('pageActions'));
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    useEffect(() => {
        listBranches({ per_page: 100 })
            .then((res) => setBranches(res.data ?? []))
            .catch(() => setBranches([]));
    }, []);

    useEffect(() => {
        if (!kebabOpen) return;
        const close = () => setKebabOpen(false);
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [kebabOpen]);

    const sortedRows = useMemo(() => {
        return [...rows].sort((a, b) => {
            const left = sortValue(a, sort.key);
            const right = sortValue(b, sort.key);
            if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;
            return String(left).localeCompare(String(right), 'id') * sort.dir;
        });
    }, [rows, sort]);

    const total = meta?.total ?? rows.length;
    const lastPage = meta?.last_page ?? 1;
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    const allChecked = sortedRows.length > 0 && sortedRows.every((row) => selected.includes(String(row.id)));

    const applyActive = useCallback(
        async (ids: string[], value: boolean) => {
            if (ids.length === 0) {
                showError('Pilih dulu pengguna yang mau diproses.');
                return;
            }
            try {
                await Promise.all(ids.map((id) => setUserActive(id, value)));
                showSuccess(value ? 'Dipulihkan' : 'Diarsipkan');
                await refresh();
            } catch (err) {
                showError(getErrorMessage(err, 'Gagal mengubah status pengguna'));
            }
        },
        [refresh, showError, showSuccess],
    );

    function onSort(key: SortKey) {
        setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    }

    function toggleRow(id: string, checked: boolean) {
        setSelected((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
    }

    const selectableIds = selected.filter((id) => id !== String(me?.id ?? ''));

    const pageActions = (
        <>
            {canManage ? (
                <button type="button" className="btn sm" onClick={() => setModal({ open: true, user: null })}>
                    <IconPlus />
                    <span>Tambah User</span>
                </button>
            ) : null}

            {archived ? (
                <button type="button" className="btn sm arc-pill" onClick={() => setArchived(false)}>
                    {'\u2715'} <span>Tutup Arsip</span>
                </button>
            ) : null}

            <div className={kebabOpen ? 'kebab open' : 'kebab'}>
                <button
                    type="button"
                    className="kebab-btn"
                    aria-label="Menu"
                    aria-expanded={kebabOpen}
                    onClick={(e) => {
                        e.stopPropagation();
                        setKebabOpen((prev) => !prev);
                    }}
                >
                    <IconKebab />
                </button>
                <div className="kebab-menu">
                    <button
                        type="button"
                        className="kebab-item"
                        onClick={() => {
                            setArchived((prev) => !prev);
                            setKebabOpen(false);
                        }}
                    >
                        <IconArchive />
                        <span>Tampilkan arsip</span>
                        <span className="chk">{archived ? '\u2713' : ''}</span>
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

            {slot ? createPortal(pageActions, slot) : null}

            <div className="card">
                <div className="card-title">
                    Pengguna <span className="ct-note">email, peran (label bebas), akses modul, manager &amp; cabang</span>
                </div>

                {error ? (
                    <div role="alert" className="ac-toggle" style={{ marginBottom: 12, color: 'var(--danger)' }}>
                        {error}
                    </div>
                ) : null}

                {canManage ? (
                    <div className={selectableIds.length ? 'bulkbar show' : 'bulkbar'}>
                        <span className="bb-count">{selectableIds.length} dipilih</span>
                        <div className="toolbar">
                            <button
                                type="button"
                                className="btn ghost sm"
                                onClick={() => void applyActive(selectableIds, archived)}
                            >
                                {archived ? <IconUnarchive /> : <IconArchive />}
                                {archived ? 'Pulihkan terpilih' : 'Arsipkan terpilih'}
                            </button>
                        </div>
                        <button type="button" className="link" onClick={() => setSelected([])}>
                            bersihkan
                        </button>
                    </div>
                ) : null}

                <div className="tbl-wrap selectable-table">
                    <table>
                        <thead>
                            <tr>
                                <th className="dt-check">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        aria-label="Pilih semua"
                                        onChange={(e) =>
                                            setSelected(e.target.checked ? sortedRows.map((row) => String(row.id)) : [])
                                        }
                                    />
                                </th>
                                {COLUMNS.map((column) => {
                                    const active = sort.key === column.key;
                                    return (
                                        <th key={column.key} className="sortable" onClick={() => onSort(column.key)}>
                                            {column.label}
                                            <span className={active ? 'sort-ic on' : 'sort-ic'}>
                                                {active ? (sort.dir > 0 ? <IconSortUp /> : <IconSortDown />) : <IconSort />}
                                            </span>
                                        </th>
                                    );
                                })}
                                <th style={{ width: '1%' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="empty">
                                        Memuat…
                                    </td>
                                </tr>
                            ) : sortedRows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty">
                                        {archived ? 'Tidak ada pengguna di arsip.' : 'Belum ada pengguna. Klik Tambah User.'}
                                    </td>
                                </tr>
                            ) : (
                                sortedRows.map((row) => {
                                    const id = String(row.id);
                                    const self = id === String(me?.id ?? '');
                                    return (
                                        <tr
                                            key={id}
                                            className={row.is_active ? 'rowc' : 'rowc dt-arc'}
                                            onClick={() => setModal({ open: true, user: row })}
                                        >
                                            <td className="dt-check" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(id)}
                                                    aria-label={`Pilih ${row.name}`}
                                                    onChange={(e) => toggleRow(id, e.target.checked)}
                                                />
                                            </td>
                                            <td data-label="Nama">
                                                <span className="lnk">{row.name}</span>
                                                {row.is_active ? null : <span className="tag"> arsip</span>}
                                                {self ? <span className="tag"> anda</span> : null}
                                            </td>
                                            <td data-label="Email / Username">
                                                {row.email || '\u2014'}
                                                {row.username && row.username !== row.email ? (
                                                    <div className="mini">@{row.username}</div>
                                                ) : null}
                                            </td>
                                            <td data-label="Peran">
                                                <span className="chip c-proses">{row.role_label || '\u2014'}</span>
                                            </td>
                                            <td data-label="Akses">
                                                <span className={row.manager ? 'chip c-diambil' : 'chip c-masuk'}>
                                                    {row.manager ? 'Manager' : 'Staff'}
                                                </span>{' '}
                                                <span className="mini">{branchLabel(row, branches.length)}</span>
                                            </td>
                                            <td className="dt-act" onClick={(e) => e.stopPropagation()}>
                                                {canManage ? (
                                                    <div className="row-actions">
                                                        {row.is_active ? (
                                                            <button
                                                                type="button"
                                                                className="iconbtn"
                                                                disabled={self}
                                                                title={self ? 'Tidak bisa arsipkan akun sendiri' : 'Arsipkan'}
                                                                onClick={() => void applyActive([id], false)}
                                                            >
                                                                <IconArchive />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="iconbtn"
                                                                title="Pulihkan dari arsip"
                                                                onClick={() => void applyActive([id], true)}
                                                            >
                                                                <IconUnarchive />
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {total > 0 ? (
                    <div className="dt-pager">
                        <div className="dt-pager-size">
                            Tampilkan{' '}
                            <select
                                value={perPage}
                                aria-label="Jumlah baris per halaman"
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                {PAGE_SIZES.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>{' '}
                            per halaman
                        </div>
                        <div className="dt-pager-nav">
                            <span className="mini">
                                {from}
                                {'\u2013'}
                                {to} dari {total}
                            </span>
                            <button
                                type="button"
                                className="pg-btn"
                                aria-label="Halaman sebelumnya"
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => prev - 1)}
                            >
                                {'\u2039'}
                            </button>
                            <span className="mini">
                                {page}/{lastPage}
                            </span>
                            <button
                                type="button"
                                className="pg-btn"
                                aria-label="Halaman berikutnya"
                                disabled={page >= lastPage}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                {'\u203a'}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>

            {modal.open ? (
                <UserModal
                    user={modal.user}
                    branches={branches}
                    isSelf={String(modal.user?.id ?? '') === String(me?.id ?? '')}
                    onClose={() => setModal({ open: false, user: null })}
                    onDone={(message) => {
                        setModal({ open: false, user: null });
                        showSuccess(message);
                        void refresh();
                    }}
                />
            ) : null}
        </>
    );
}
