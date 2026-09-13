import { useCallback, useEffect, useMemo, useState } from 'react';
import { MODULE_GROUPS, getErrorMessage } from '../../api/client';
import type { ModuleKey } from '../../api/client';
import { createUser, deleteUser, getUser, setUserActive, updateUser } from '../../api/users';
import { SidebarIcon } from '../../layouts/SidebarIcon';
import type { Branch } from '../../types/branches';
import type { User, UserUpsertPayload } from '../../types/users';
import { roleFor, toggleValues, usernameFromEmail } from '../../utils/user-access';
import { PASSWORD_HINT, passwordError } from '../../utils/password';
import { IconArchive, IconChevron, IconTrash, IconUnarchive } from './icons';

type Props = {
    user: User | null;
    branches: Branch[];
    isSelf: boolean;
    onClose: () => void;
    onDone: (message: string) => void;
};

type FormState = {
    email: string;
    username: string;
    name: string;
    roleLabel: string;
    password: string;
    modules: ModuleKey[];
    manager: boolean;
    showBalance: boolean;
    customPrice: boolean;
    branchIds: string[];
};

const ALL_MODULE_KEYS: ModuleKey[] = MODULE_GROUPS.flatMap((group) => group.items.map((item) => item.key));

function initialForm(branches: Branch[]): FormState {
    return {
        email: '',
        username: '',
        name: '',
        roleLabel: '',
        password: '',
        modules: ALL_MODULE_KEYS,
        manager: false,
        showBalance: true,
        customPrice: false,
        branchIds: branches.map((branch) => branch.id),
    };
}

export default function UserModal({ user, branches, isSelf, onClose, onDone }: Props) {
    const editing = Boolean(user);
    const [form, setForm] = useState<FormState>(() => initialForm(branches));
    const [roles, setRoles] = useState<string[]>([]);
    const [openGroups, setOpenGroups] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;
        setLoading(true);

        getUser(String(user.id))
            .then((res) => {
                if (cancelled) return;
                const detail = res.data;
                setRoles(detail.roles ?? []);
                setForm({
                    email: detail.email ?? '',
                    username: detail.username ?? '',
                    name: detail.name ?? '',
                    roleLabel: detail.role_label ?? '',
                    password: '',
                    modules: detail.modules ?? [],
                    manager: detail.manager === true,
                    showBalance: detail.show_balance !== false,
                    customPrice: detail.custom_price === true,
                    branchIds: (detail.branches ?? []).map((branch) => branch.id),
                });
            })
            .catch((err: unknown) => {
                if (!cancelled) setError(getErrorMessage(err, 'Gagal memuat data pengguna'));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user]);

    const allModulesOn = useMemo(
        () => ALL_MODULE_KEYS.every((key) => form.modules.includes(key)),
        [form.modules],
    );

    const allBranchesOn = branches.length > 0 && branches.every((branch) => form.branchIds.includes(branch.id));

    const setModules = useCallback((keys: ModuleKey[], on: boolean) => {
        setForm((prev) => ({ ...prev, modules: toggleValues(prev.modules, keys, on) }));
    }, []);

    const setBranches = useCallback((ids: string[], on: boolean) => {
        setForm((prev) => ({ ...prev, branchIds: toggleValues(prev.branchIds, ids, on) }));
    }, []);

    const toggleGroup = useCallback((label: string) => {
        setOpenGroups((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
    }, []);

    async function onSave() {
        const email = form.email.trim().toLowerCase();
        const name = form.name.trim();
        const username = (form.username.trim() || usernameFromEmail(email)).toLowerCase();

        if (!name) return setError('Nama lengkap wajib diisi.');
        if (!email) return setError('Email wajib diisi.');
        if (username.length < 3) return setError('Username minimal 3 karakter (huruf kecil, angka, titik, underscore).');
        if (!editing || form.password) {
            const invalid = passwordError(form.password);
            if (invalid) return setError(invalid);
        }
        if (form.modules.length === 0) return setError('Pilih minimal satu modul.');
        if (form.branchIds.length === 0) return setError('Pilih minimal satu cabang.');

        setSaving(true);
        setError(null);

        const payload: UserUpsertPayload = {
            name,
            email,
            username,
            role: roleFor(roles, form.manager, allBranchesOn),
            role_label: form.roleLabel.trim(),
            modules: form.modules,
            manager: form.manager,
            all_branches: allBranchesOn,
            show_balance: form.showBalance,
            custom_price: form.customPrice,
            branch_id: form.branchIds[0],
            branch_ids: form.branchIds,
        };

        try {
            if (user) {
                if (form.password) payload.password = form.password;
                await updateUser(String(user.id), payload);
                onDone('Pengguna diperbarui');
            } else {
                await createUser({ ...payload, password: form.password, is_active: true });
                onDone('Pengguna ditambahkan');
            }
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menyimpan pengguna'));
            setSaving(false);
        }
    }

    async function onArchive(value: boolean) {
        if (!user) return;
        setSaving(true);
        setError(null);
        try {
            await setUserActive(String(user.id), value);
            onDone(value ? 'Dipulihkan' : 'Diarsipkan');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal mengubah status pengguna'));
            setSaving(false);
        }
    }

    async function onDelete() {
        if (!user) return;
        if (!confirm(`Hapus pengguna "${user.name}"?`)) return;
        setSaving(true);
        setError(null);
        try {
            await deleteUser(String(user.id));
            onDone('Pengguna dihapus');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menghapus pengguna'));
            setSaving(false);
        }
    }

    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={editing ? 'Edit Pengguna' : 'Tambah Pengguna'}>
            <div className="box lg" id="modalBox">
                <div className="modal-head">
                    <h3>{editing ? 'Edit' : 'Tambah'} Pengguna</h3>
                    <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
                        {'\u2715'}
                    </button>
                </div>

                {error ? (
                    <div role="alert" className="ac-toggle" style={{ marginBottom: 12, color: 'var(--danger)' }}>
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="empty">Memuat data pengguna…</div>
                ) : (
                    <>
                        <div className="field">
                            <label htmlFor="uEmail">
                                Email <span className="mini">(buat login)</span>
                            </label>
                            <input
                                id="uEmail"
                                type="text"
                                inputMode="email"
                                autoComplete="off"
                                placeholder="nama@domain.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="uUsername">
                                Username <span className="mini">(buat login juga — opsional, kalau kosong ikut email)</span>
                            </label>
                            <input
                                id="uUsername"
                                type="text"
                                autoComplete="off"
                                placeholder="mis. budi"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="uFullName">
                                Nama Lengkap <span className="mini">(nama orangnya, bukan username)</span>
                            </label>
                            <input
                                id="uFullName"
                                type="text"
                                placeholder="mis. Budi Santoso"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="uRoleInput">
                                Nama Role <span className="mini">(bebas diketik — hanya label, tidak menentukan akses)</span>
                            </label>
                            <input
                                id="uRoleInput"
                                type="text"
                                placeholder="mis. Kasir, Supervisor, Owner"
                                value={form.roleLabel}
                                onChange={(e) => setForm({ ...form, roleLabel: e.target.value })}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="uPass">
                                {editing ? 'Reset Password' : 'Password'}{' '}
                                <span className="mini">
                                    {editing
                                        ? `(kosongkan bila tidak diubah; ${PASSWORD_HINT})`
                                        : `(${PASSWORD_HINT})`}
                                </span>
                            </label>
                            <input
                                id="uPass"
                                type="password"
                                autoComplete="new-password"
                                placeholder={editing ? 'password baru' : 'password'}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        <div
                            className="card-title"
                            style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            Akses Modul &amp; Submodul
                            <label className="modall-lbl">
                                <input
                                    type="checkbox"
                                    checked={allModulesOn}
                                    onChange={(e) => setModules(ALL_MODULE_KEYS, e.target.checked)}
                                />
                                Semua modul
                            </label>
                        </div>

                        <div className="umod-list">
                            {MODULE_GROUPS.map((group) => {
                                const keys = group.items.map((item) => item.key);
                                const groupOn = keys.every((key) => form.modules.includes(key));
                                const open = openGroups.includes(group.label);

                                return (
                                    <div className="umod" key={group.label}>
                                        <div className="umod-head">
                                            <input
                                                type="checkbox"
                                                checked={groupOn}
                                                onChange={(e) => setModules(keys, e.target.checked)}
                                                aria-label={`Akses modul ${group.label}`}
                                            />
                                            <div className="umod-name" onClick={() => toggleGroup(group.label)}>
                                                <span className="umod-ic">
                                                    <SidebarIcon name={group.icon} />
                                                </span>
                                                <b>{group.label}</b>
                                            </div>
                                            <button
                                                type="button"
                                                className={open ? 'umod-caret open' : 'umod-caret'}
                                                aria-expanded={open}
                                                aria-label={`Submodul ${group.label}`}
                                                onClick={() => toggleGroup(group.label)}
                                            >
                                                <IconChevron />
                                            </button>
                                        </div>

                                        {open ? (
                                            <div className="umod-subs">
                                                {group.items.map((item) => (
                                                    <label className="ac-item" key={item.key}>
                                                        <input
                                                            type="checkbox"
                                                            checked={form.modules.includes(item.key)}
                                                            onChange={(e) => setModules([item.key], e.target.checked)}
                                                        />
                                                        {item.label}
                                                    </label>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>

                        <label className="ac-toggle" style={{ marginTop: 16 }}>
                            <input
                                type="checkbox"
                                checked={form.manager}
                                onChange={(e) => setForm({ ...form, manager: e.target.checked })}
                            />
                            <span>
                                <b>Akses manager</b> — bisa edit dan void / delete
                            </span>
                        </label>

                        <label className="ac-toggle" style={{ marginTop: 8 }}>
                            <input
                                type="checkbox"
                                checked={form.showBalance}
                                onChange={(e) => setForm({ ...form, showBalance: e.target.checked })}
                            />
                            <span>
                                <b>Tampilkan saldo terkini di transaksi</b> — saat catat uang masuk/keluar &amp; pindah dana
                            </span>
                        </label>

                        <label className="ac-toggle" style={{ marginTop: 8 }}>
                            <input
                                type="checkbox"
                                checked={form.customPrice}
                                onChange={(e) => setForm({ ...form, customPrice: e.target.checked })}
                            />
                            <span>
                                <b>Akses custom harga</b> — boleh mengubah harga satuan saat input order di POS
                            </span>
                        </label>

                        <div className="card-title" style={{ marginTop: 16 }}>
                            Akses Cabang
                        </div>

                        <label className="ac-toggle" style={{ marginTop: 8 }}>
                            <input
                                type="checkbox"
                                checked={allBranchesOn}
                                onChange={(e) => setBranches(branches.map((branch) => branch.id), e.target.checked)}
                            />
                            <span>
                                <b>Semua cabang</b>
                            </span>
                        </label>

                        <div className="ac-list">
                            {branches.length === 0 ? (
                                <div className="mini">Belum ada cabang.</div>
                            ) : (
                                branches.map((branch) => (
                                    <label className="ac-item" key={branch.id}>
                                        <input
                                            type="checkbox"
                                            checked={form.branchIds.includes(branch.id)}
                                            onChange={(e) => setBranches([branch.id], e.target.checked)}
                                        />
                                        <b>{branch.code}</b> <span className="mini">{branch.name}</span>
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="modal-foot">
                            {editing ? (
                                <>
                                    {user?.is_active === false ? (
                                        <button type="button" className="btn ghost sm" disabled={saving} onClick={() => void onArchive(true)}>
                                            <IconUnarchive /> Pulihkan
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn ghost sm"
                                            disabled={saving || isSelf}
                                            title={isSelf ? 'Tidak bisa arsipkan akun sendiri' : undefined}
                                            onClick={() => void onArchive(false)}
                                        >
                                            <IconArchive /> Arsipkan
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="btn danger sm"
                                        disabled={saving || isSelf}
                                        title={isSelf ? 'Tidak bisa menghapus akun sendiri' : undefined}
                                        onClick={() => void onDelete()}
                                    >
                                        <IconTrash /> Hapus
                                    </button>
                                    <span style={{ flex: 1 }} />
                                </>
                            ) : null}
                            <button type="button" className="btn" disabled={saving} onClick={() => void onSave()}>
                                {saving ? 'Menyimpan…' : 'Simpan'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
