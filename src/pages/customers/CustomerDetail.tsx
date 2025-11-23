// src/pages/customers/CustomerDetail.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, getCustomer, updateCustomer } from '../../api/customers';
import type { Customer, CustomerUpsertPayload, SingleResponse } from '../../types/customers';
import { useAuth } from '../../store/useAuth';

export default function CustomerDetail() {
    const params = useParams();
    const navigate = useNavigate();
    const isNew = !params.id || params.id === 'new';
    const { hasRole, user } = useAuth;

    const canEdit = hasRole('Superadmin') || hasRole('Admin Cabang') || hasRole('Kasir');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<CustomerUpsertPayload>({
        name: '',
        whatsapp: '',
        address: '',
        notes: '',
    });
    const [entity, setEntity] = useState<Customer | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (!isNew && params.id) {
            (async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await getCustomer(params.id!);
                    if (!cancelled) {
                        setEntity(res.data);
                        if (res.data) {
                            setForm({
                                name: res.data.name,
                                whatsapp: res.data.whatsapp,
                                address: res.data.address ?? '',
                                notes: res.data.notes ?? '',
                            });
                        }
                    }
                } catch {
                    if (!cancelled) setError('Gagal memuat detail pelanggan.');
                } finally {
                    if (!cancelled) setLoading(false);
                }
            })();
        }
        return () => { cancelled = true; };
    }, [isNew, params.id]);

    function normalizeWa(input: string): string {
        const s = (input || '').trim();
        return s.replace(/[^\d]/g, '');
    }

    // buang key undefined & konversi "" => null
    function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
        const out: Partial<T> = {};
        Object.entries(obj).forEach(([k, v]) => {
            if (v === undefined) return;
            if (typeof v === 'string') {
                const t = v.trim();
                (out as Record<string, unknown>)[k] = t === '' ? null : t;
            } else {
                (out as Record<string, unknown>)[k] = v;
            }
        });
        return out;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canEdit) return;
        setSaving(true);
        setError(null);
        try {
            let res: SingleResponse<Customer>;

            if (isNew) {
                const basePayload = {
                    name: form.name,
                    whatsapp: normalizeWa(form.whatsapp),
                    address: form.address,
                    notes: form.notes,
                };
                const cleanedBase = clean(basePayload);

                let finalBranchId: string | undefined;
                if (hasRole('Superadmin')) {
                    finalBranchId = form.branch_id && form.branch_id.trim() !== '' ? form.branch_id.trim() : undefined;
                } else {
                    finalBranchId = user?.branch_id ? String(user.branch_id) : undefined;
                    if (!finalBranchId) {
                        setError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
                        setSaving(false);
                        return;
                    }
                }

                const payloadCreate: CustomerUpsertPayload = {
                    name: String(cleanedBase.name ?? ''),
                    whatsapp: String(cleanedBase.whatsapp ?? ''),
                    address: (cleanedBase.address as string | null | undefined) ?? null,
                    notes: (cleanedBase.notes as string | null | undefined) ?? null,
                    ...(finalBranchId ? { branch_id: finalBranchId } : {}),
                };
                res = await createCustomer(payloadCreate);
            } else {
                if (!params.id) {
                    setError('ID pelanggan tidak valid.');
                    setSaving(false);
                    return;
                }
                const cleanedUpdate = clean({
                    name: form.name,
                    whatsapp: normalizeWa(form.whatsapp),
                    address: form.address,
                    notes: form.notes,
                    ...(hasRole('Superadmin') && form.branch_id && String(form.branch_id).trim() !== ''
                        ? { branch_id: String(form.branch_id).trim() }
                        : {}),
                });
                const payloadUpdate: Partial<CustomerUpsertPayload> = {
                    ...(cleanedUpdate.name !== undefined ? { name: String(cleanedUpdate.name) } : {}),
                    ...(cleanedUpdate.whatsapp !== undefined ? { whatsapp: String(cleanedUpdate.whatsapp) } : {}),
                    ...(cleanedUpdate.address !== undefined ? { address: cleanedUpdate.address as string | null } : {}),
                    ...(cleanedUpdate.notes !== undefined ? { notes: cleanedUpdate.notes as string | null } : {}),
                    ...(hasRole('Superadmin') && cleanedUpdate.branch_id !== undefined
                        ? { branch_id: String(cleanedUpdate.branch_id) }
                        : {}),
                };
                res = await updateCustomer(params.id, payloadUpdate);
            }

            if (res?.data?.id) {
                navigate(`/customers/${String(res.data.id)}`);
            } else {
                setError('Gagal menyimpan data pelanggan.');
            }
        } catch (err) {
            const anyErr = err as { response?: { data?: unknown }; message?: string };
            const srv = (anyErr.response?.data as { message?: string; errors?: unknown } | undefined) || undefined;
            const msg = srv?.message ?? (srv?.errors ? JSON.stringify(srv.errors) : undefined) ?? anyErr.message;
            setError(msg ?? 'Gagal menyimpan data pelanggan.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-6 w-48 rounded bg-black/10 animate-pulse" />
                <div className="card p-6 border border-[color:var(--color-border)] rounded-lg shadow-elev-1 space-y-4 max-w-2xl">
                    <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
                    <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
                    <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
                    <div className="h-20 w-full rounded bg-black/10 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-10 w-28 rounded bg-black/10 animate-pulse" />
                        <div className="h-10 w-24 rounded bg-black/10 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        {isNew ? 'Buat Pelanggan' : 'Detail Pelanggan'}
                    </h1>
                    <p className="text-xs text-gray-600">
                        Data identitas pelanggan untuk transaksi & penjemputan
                    </p>
                </div>
            </header>

            {/* Error global */}
            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
                >
                    {error}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={onSubmit}
                aria-busy={saving ? 'true' : 'false'}
                className="card p-4 md:p-6 border border-[color:var(--color-border)] rounded-lg shadow-elev-1 space-y-4 max-w-2xl"
            >
                {/* Cabang */}
                {hasRole('Superadmin') ? (
                    <label className="grid gap-1 text-sm">
                        <span>Branch ID (Superadmin)</span>
                        <input
                            placeholder="CTH: 019aa7... (opsional)"
                            className="input"
                            value={form.branch_id ?? ''}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    branch_id: e.target.value.trim() ? e.target.value.trim() : undefined,
                                }))
                            }
                        />
                        <span className="text-xs text-gray-500">Kosongkan untuk tidak mengubah cabang.</span>
                    </label>
                ) : (
                    <div className="text-sm text-gray-600">
                        Cabang: <span className="font-medium">{user?.branch_id ?? '-'}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm">
                        <span>Nama</span>
                        <input
                            placeholder="Nama pelanggan"
                            className="input"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            required
                            autoComplete="name"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>WhatsApp</span>
                        <input
                            placeholder="08xxxxxxxxxx"
                            className="input"
                            value={form.whatsapp}
                            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                            required
                            inputMode="tel"
                            autoComplete="tel"
                        />
                        <span className="text-xs text-gray-500">Hanya angka, akan dinormalisasi saat simpan.</span>
                    </label>

                    <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Alamat</span>
                        <input
                            placeholder="Alamat lengkap (opsional)"
                            className="input"
                            value={form.address ?? ''}
                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                            autoComplete="street-address"
                        />
                    </label>

                    <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Catatan</span>
                        <textarea
                            placeholder="Instruksi khusus, preferensi, atau catatan lain"
                            className="input min-h-[96px]"
                            value={form.notes ?? ''}
                            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        />
                    </label>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        disabled={saving || !canEdit}
                        className="btn-primary disabled:opacity-50"
                        type="submit"
                        aria-label="Simpan pelanggan"
                    >
                        {saving ? 'Menyimpan…' : 'Simpan'}
                    </button>

                    {!isNew && entity && (
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
                            aria-label="Salin nomor WhatsApp"
                        >
                            Salin WA
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
