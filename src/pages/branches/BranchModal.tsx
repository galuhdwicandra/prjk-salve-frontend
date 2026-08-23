import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { createBranch, deleteBranch, updateBranch } from '../../api/branches';
import type { Branch, BranchUpsertPayload, OutletType } from '../../types/branches';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

type FormState = {
    name: string;
    code: string;
    type: string;
    openTime: string;
    closeTime: string;
    address: string;
};

type Props = {
    branch: Branch | null;
    types: OutletType[];
    onClose: () => void;
    onDone: (message: string) => void;
};

function splitHours(hours: string | null | undefined): [string, string] {
    const [open = '', close = ''] = (hours ?? '').split(/[\u2013-]/);
    return [open.trim().replace('.', ':'), close.trim().replace('.', ':')];
}

function joinHours(open: string, close: string): string | null {
    if (!open || !close) return null;
    return `${open.replace(':', '.')}\u2013${close.replace(':', '.')}`;
}

function initialForm(branch: Branch | null, types: OutletType[]): FormState {
    const [openTime, closeTime] = splitHours(branch?.hours);

    return {
        name: branch?.name ?? '',
        code: branch?.code ?? '',
        type: branch?.type ?? types[0]?.code ?? '',
        openTime,
        closeTime,
        address: branch?.address ?? '',
    };
}

export default function BranchModal({ branch, types, onClose, onDone }: Props) {
    const editing = Boolean(branch);
    const [form, setForm] = useState<FormState>(() => initialForm(branch, types));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function buildPayload(isActive: boolean): BranchUpsertPayload | null {
        const name = form.name.trim();
        if (!name) {
            setError('Nama outlet wajib diisi.');
            return null;
        }

        if (!form.type) {
            setError('Jenis outlet wajib dipilih.');
            return null;
        }

        const code = form.code.trim().toUpperCase();
        if (editing && !code) {
            setError('Kode outlet wajib diisi.');
            return null;
        }

        return {
            code: code || null,
            name,
            type: form.type,
            address: form.address.trim() || null,
            hours: joinHours(form.openTime, form.closeTime),
            is_active: isActive,
        };
    }

    async function submit() {
        const payload = buildPayload(branch?.is_active ?? true);
        if (!payload) return;

        setSaving(true);
        setError(null);
        try {
            if (branch) {
                await updateBranch(branch.id, payload);
                onDone('Outlet diperbarui.');
            } else {
                await createBranch(payload);
                onDone('Outlet ditambahkan.');
            }
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menyimpan outlet'));
        } finally {
            setSaving(false);
        }
    }

    async function setActive(value: boolean) {
        if (!branch) return;

        const payload = buildPayload(value);
        if (!payload) return;

        setSaving(true);
        setError(null);
        try {
            await updateBranch(branch.id, payload);
            onDone(value ? 'Outlet dipulihkan.' : 'Outlet diarsipkan.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal mengubah status outlet'));
        } finally {
            setSaving(false);
        }
    }

    async function remove() {
        if (!branch) return;
        if (!window.confirm(`Hapus outlet ${branch.name}?`)) return;

        setSaving(true);
        setError(null);
        try {
            await deleteBranch(branch.id);
            onDone('Outlet dihapus.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menghapus outlet'));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={editing ? 'Edit Outlet' : 'Tambah Outlet'}>
            <div className="box">
                <div className="modal-head">
                    <h3>{editing ? 'Edit Outlet' : 'Tambah Outlet'}</h3>
                    <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
                        {'\u2715'}
                    </button>
                </div>

                {error ? (
                    <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
                        {error}
                    </div>
                ) : null}

                <div className="row">
                    <div className="field">
                        <label htmlFor="br-name">Nama Outlet</label>
                        <input
                            id="br-name"
                            value={form.name}
                            maxLength={150}
                            placeholder="mis. Buah Batu"
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="br-code">Kode Outlet</label>
                        <input
                            id="br-code"
                            value={form.code}
                            maxLength={32}
                            placeholder="mis. BB"
                            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        />
                        <span className="mini">
                            {editing
                                ? 'boleh diubah \u2014 semua data ikut menyesuaikan'
                                : 'kosongkan = dibuat otomatis'}
                        </span>
                    </div>
                </div>

                <div className="row">
                    <div className="field">
                        <label htmlFor="br-type">Jenis Outlet</label>
                        <select
                            id="br-type"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            {types.map((type) => (
                                <option key={type.id} value={type.code}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="br-open">Jam Operasional</label>
                        <div className="row">
                            <input
                                id="br-open"
                                type="time"
                                value={form.openTime}
                                aria-label="Jam buka"
                                onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                            />
                            <span className="mini" style={{ flex: 'none', alignSelf: 'center' }}>
                                s/d
                            </span>
                            <input
                                type="time"
                                value={form.closeTime}
                                aria-label="Jam tutup"
                                onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="br-address">Alamat Outlet</label>
                    <textarea
                        id="br-address"
                        rows={2}
                        maxLength={255}
                        value={form.address}
                        placeholder="alamat lengkap"
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                </div>

                <div className="modal-foot">
                    {editing && branch ? (
                        <>
                            <button
                                type="button"
                                className="btn ghost sm"
                                disabled={saving}
                                onClick={() => void setActive(!branch.is_active)}
                            >
                                {branch.is_active ? <IconArchive /> : <IconUnarchive />}
                                {branch.is_active ? 'Arsipkan' : 'Pulihkan'}
                            </button>
                            <button type="button" className="btn danger sm" disabled={saving} onClick={() => void remove()}>
                                <IconTrash />
                                Hapus
                            </button>
                        </>
                    ) : null}

                    <button
                        type="button"
                        className="btn"
                        style={editing ? { marginLeft: 'auto' } : undefined}
                        disabled={saving}
                        onClick={() => void submit()}
                    >
                        {saving ? 'Menyimpan\u2026' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
