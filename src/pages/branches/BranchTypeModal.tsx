import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
    createBranchType,
    deleteBranchType,
    listBranchTypes,
    updateBranchType,
} from '../../api/branchTypes';
import type { OutletType } from '../../types/branches';
import { IconCheck, IconPlus, IconTrash } from '../users/icons';

const LOCKED_CODES = ['workshop'];

type Props = {
    onClose: () => void;
};

export default function BranchTypeModal({ onClose }: Props) {
    const [rows, setRows] = useState<OutletType[]>([]);
    const [names, setNames] = useState<Record<string, string>>({});
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listBranchTypes({ per_page: 100 });
            const data = res.data ?? [];
            setRows(data);
            setNames(Object.fromEntries(data.map((row) => [row.id, row.name])));
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal memuat jenis outlet'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function add() {
        const name = newName.trim();
        if (!name) {
            setError('Nama jenis outlet wajib diisi.');
            return;
        }

        setBusy('new');
        setError(null);
        try {
            await createBranchType({ name });
            setNewName('');
            await refresh();
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menambah jenis outlet'));
        } finally {
            setBusy(null);
        }
    }

    async function rename(row: OutletType) {
        const name = (names[row.id] ?? '').trim();
        if (!name) {
            setError('Nama jenis outlet wajib diisi.');
            return;
        }

        setBusy(row.id);
        setError(null);
        try {
            await updateBranchType(row.id, { name });
            await refresh();
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal mengubah nama jenis outlet'));
        } finally {
            setBusy(null);
        }
    }

    async function remove(row: OutletType) {
        if (!window.confirm(`Hapus jenis outlet ${row.name}?`)) return;

        setBusy(row.id);
        setError(null);
        try {
            await deleteBranchType(row.id);
            await refresh();
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menghapus jenis outlet'));
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Kelola Jenis Outlet">
            <div className="box">
                <div className="modal-head">
                    <h3>Kelola Jenis Outlet</h3>
                    <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
                        {'\u2715'}
                    </button>
                </div>

                {error ? (
                    <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
                        {error}
                    </div>
                ) : null}

                <div className="field">
                    <label htmlFor="btype-new">Jenis Outlet Baru</label>
                    <div className="row">
                        <input
                            id="btype-new"
                            value={newName}
                            maxLength={120}
                            placeholder="mis. Drop Point"
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') void add();
                            }}
                        />
                        <button
                            type="button"
                            className="btn sm"
                            style={{ flex: 'none' }}
                            disabled={busy !== null}
                            onClick={() => void add()}
                        >
                            <IconPlus />
                            Tambah
                        </button>
                    </div>
                </div>

                <div className="tbl-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th className="num">Dipakai</th>
                                <th style={{ width: '1%' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="empty">
                                        Memuat{'\u2026'}
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="empty">
                                        Belum ada jenis outlet.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => {
                                    const used = row.branches_count ?? 0;
                                    const locked = LOCKED_CODES.includes(row.code);
                                    const dirty = (names[row.id] ?? '').trim() !== row.name;

                                    return (
                                        <tr key={row.id}>
                                            <td data-label="Nama">
                                                <input
                                                    value={names[row.id] ?? ''}
                                                    maxLength={120}
                                                    aria-label={`Nama jenis outlet ${row.name}`}
                                                    onChange={(e) =>
                                                        setNames((prev) => ({ ...prev, [row.id]: e.target.value }))
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && dirty) void rename(row);
                                                    }}
                                                />
                                            </td>
                                            <td className="num" data-label="Dipakai">
                                                {used === 0 ? '\u2014' : `${used} outlet`}
                                            </td>
                                            <td className="dt-act">
                                                <div className="row-actions">
                                                    <button
                                                        type="button"
                                                        className="iconbtn"
                                                        title="Simpan nama"
                                                        disabled={!dirty || busy !== null}
                                                        onClick={() => void rename(row)}
                                                    >
                                                        <IconCheck />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="iconbtn del"
                                                        title={
                                                            locked
                                                                ? 'Jenis bawaan sistem'
                                                                : used > 0
                                                                  ? 'Masih dipakai outlet'
                                                                  : 'Hapus jenis outlet'
                                                        }
                                                        disabled={locked || used > 0 || busy !== null}
                                                        onClick={() => void remove(row)}
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="modal-foot">
                    <span className="mini">Jenis yang masih dipakai outlet tidak bisa dihapus.</span>
                    <button type="button" className="btn ghost sm" style={{ marginLeft: 'auto' }} onClick={onClose}>
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
