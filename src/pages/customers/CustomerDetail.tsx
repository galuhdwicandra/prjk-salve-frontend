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
        return () => {
            cancelled = true;
        };
    }, [isNew, params.id]);

    function normalizeWa(input: string): string {
        // Minimal-normalize: hilangkan spasi dan non-digit ( dibiarkan kalau perlu)
        const s = (input || '').trim();
        // Contoh ringan: hilangkan spasi/tanda baca umum
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
                // SUSUN PAYLOAD MINIMAL & BERSIH — persis seperti contoh Postman
                const basePayload = {
                    name: form.name,
                    whatsapp: normalizeWa(form.whatsapp),
                    address: form.address,
                    notes: form.notes,
                };
                const cleanedBase = clean(basePayload);

                // HANYA superadmin boleh mengirim branch_id secara eksplisit
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
                    // Jangan kirim branch_id saat update kecuali superadmin memang mengubah cabang (kalau backendmu izinkan)
                    ...(hasRole('Superadmin') && form.branch_id && String(form.branch_id).trim() !== ''
                        ? { branch_id: String(form.branch_id).trim() }
                        : {}),
                });
                const payloadUpdate: Partial<CustomerUpsertPayload> = {
                    ...(cleanedUpdate.name !== undefined ? { name: String(cleanedUpdate.name) } : {}),
                    ...(cleanedUpdate.whatsapp !== undefined ? { whatsapp: String(cleanedUpdate.whatsapp) } : {}),
                    ...(cleanedUpdate.address !== undefined
                        ? { address: cleanedUpdate.address as string | null }
                        : {}),
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
            // tampilkan pesan server jika ada untuk memudahkan debug
            const anyErr = err as { response?: { data?: unknown }; message?: string };
            const srv = (anyErr.response?.data as { message?: string; errors?: unknown } | undefined) || undefined;
            const msg = srv?.message ?? (srv?.errors ? JSON.stringify(srv.errors) : undefined) ?? anyErr.message;
            setError(msg ?? 'Gagal menyimpan data pelanggan.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-4">Loading…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-semibold">{isNew ? 'Buat Pelanggan' : 'Detail Pelanggan'}</h1>
            <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
                {hasRole('Superadmin') && (
                    <input
                        placeholder="Branch ID (Superadmin)"
                        className="border rounded-xl px-3 py-2 w-full"
                        value={form.branch_id ?? ''}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                branch_id: e.target.value.trim() ? e.target.value.trim() : undefined,
                            }))
                        }
                    />
                )}
                <input
                    placeholder="Nama"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                />
                <input
                    placeholder="WhatsApp (08xxxxxxxxxx)"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    required
                />
                <input
                    placeholder="Alamat"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.address ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
                <textarea
                    placeholder="Catatan"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.notes ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
                {error && <div className="text-sm text-red-600">{error}</div>}
                <div className="flex gap-2">
                    <button
                        disabled={saving || !canEdit}
                        className="px-4 py-2 rounded-xl border shadow disabled:opacity-50"
                        type="submit"
                    >
                        {saving ? 'Menyimpan…' : 'Simpan'}
                    </button>
                    {!isNew && entity && (
                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl border"
                            onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
                        >
                            Salin WA
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
