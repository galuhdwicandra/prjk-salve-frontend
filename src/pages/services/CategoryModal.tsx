import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
    createServiceCategory,
    deleteServiceCategory,
    listServiceCategories,
    updateServiceCategory,
} from '../../api/serviceCategories';
import type { ServiceCategory } from '../../types/services';
import { IconCheck, IconPlus, IconTrash } from '../users/icons';

type Props = {
    onClose: () => void;
};

export default function CategoryModal({ onClose }: Props) {
    const [rows, setRows] = useState<ServiceCategory[]>([]);
    const [names, setNames] = useState<Record<string, string>>({});
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listServiceCategories({ per_page: 100 });
            const data = res.data ?? [];
            setRows(data);
            setNames(Object.fromEntries(data.map((row) => [row.id, row.name])));
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal memuat kategori'));
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
            setError('Nama kategori wajib diisi.');
            return;
        }

        setBusy('new');
        setError(null);
        try {
            await createServiceCategory({ name, is_active: true });
            setNewName('');
            await refresh();
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menambah kategori'));
        } finally {
            setBusy(null);
        }
    }

    async function rename(row: ServiceCategory) {
        const name = (names[row.id] ?? '').trim();
        if (!name) {
            setError('Nama kategori wajib diisi.');
            return;
        }

        setBusy(row.id);
        setError(null);
        try {
            await updateServiceCategory(row.id, { name, is_active: row.is_active });
            await refresh();
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal mengubah nama kategori'));
        } finally {
            setBusy(null);
        }
    }

    async function remove(row: ServiceCategory) {
        if (!window.confirm(`Hapus kategori ${row.name}?`)) return;

        setBusy(row.id);
        setError(null);
        try {
            await deleteServiceCategory(row.id);
            await refresh();
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menghapus kategori'));
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Kelola Kategori">
            <div className="box">
                <div className="modal-head">
                    <h3>Kelola Kategori</h3>
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
                    <label htmlFor="cat-new">Kategori Baru</label>
                    <div className="row">
                        <input
                            id="cat-new"
                            value={newName}
                            maxLength={120}
                            placeholder="mis. Jasa"
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
                                        Belum ada kategori.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => {
                                    const used = row.services_count ?? 0;
                                    const dirty = (names[row.id] ?? '').trim() !== row.name;

                                    return (
                                        <tr key={row.id}>
                                            <td data-label="Nama">
                                                <input
                                                    value={names[row.id] ?? ''}
                                                    maxLength={120}
                                                    aria-label={`Nama kategori ${row.name}`}
                                                    onChange={(e) =>
                                                        setNames((prev) => ({ ...prev, [row.id]: e.target.value }))
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && dirty) void rename(row);
                                                    }}
                                                />
                                            </td>
                                            <td className="num" data-label="Dipakai">
                                                {used === 0 ? '\u2014' : `${used} item`}
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
                                                        title={used > 0 ? 'Masih dipakai produk' : 'Hapus kategori'}
                                                        disabled={used > 0 || busy !== null}
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
                    <span className="mini">Kategori yang masih dipakai produk tidak bisa dihapus.</span>
                    <button type="button" className="btn ghost sm" style={{ marginLeft: 'auto' }} onClick={onClose}>
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
