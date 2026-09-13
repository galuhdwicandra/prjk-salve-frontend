import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { createService, deleteService, updateService } from '../../api/services';
import { setServicePrice, unsetServicePrice } from '../../api/servicePrices';
import type { Branch } from '../../types/branches';
import type { Service, ServiceCategory, ServiceUpsertPayload } from '../../types/services';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

export const DEFAULT_UNIT = 'ITEM';

function parentLabelOf(item: Service): string {
    return `${item.name} (${item.category?.name ?? '-'})`;
}

type OutletState = { active: boolean; price: string };

type FormState = {
    name: string;
    categoryId: string;
    isVariant: boolean;
    parentId: string;
    sla: string;
    outlets: Record<string, OutletState>;
};

type Props = {
    service: Service | null;
    parents: Service[];
    categories: ServiceCategory[];
    branches: Branch[];
    onClose: () => void;
    onDone: (message: string) => void;
};

function initialForm(
    service: Service | null,
    categories: ServiceCategory[],
    branches: Branch[],
): FormState {
    const prices = service?.prices ?? [];
    const outlets: Record<string, OutletState> = {};

    branches.forEach((branch) => {
        const hit = prices.find((price) => String(price.branch_id) === String(branch.id));
        outlets[branch.id] = { active: Boolean(hit), price: hit ? String(Number(hit.price)) : '' };
    });

    const sla = prices.find((price) => price.sla_days != null)?.sla_days;

    return {
        name: service?.name ?? '',
        categoryId: service?.category_id ?? categories[0]?.id ?? '',
        isVariant: Boolean(service?.parent_id),
        parentId: service?.parent_id ?? '',
        sla: sla != null ? String(sla) : '1',
        outlets,
    };
}

function isValidPrice(value: string): boolean {
    const price = Number(value);
    return value.trim() !== '' && Number.isFinite(price) && price >= 0;
}

export default function ServiceModal({ service, parents, categories, branches, onClose, onDone }: Props) {
    const editing = Boolean(service);
    const [form, setForm] = useState<FormState>(() => initialForm(service, categories, branches));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lockVariant = editing && (service?.variants?.length ?? 0) > 0;

    function setOutlet(branchId: string, next: OutletState) {
        setForm((prev) => ({ ...prev, outlets: { ...prev.outlets, [branchId]: next } }));
    }

    function buildPayload(isActive: boolean): ServiceUpsertPayload | null {
        const name = form.name.trim();
        if (!name) {
            setError('Nama wajib diisi.');
            return null;
        }

        const parent = parents.find((item) => item.id === form.parentId) ?? null;
        if (form.isVariant && !parent) {
            setError('Produk keluarga (induk) wajib dipilih.');
            return null;
        }

        const categoryId = form.isVariant ? parent?.category_id ?? '' : form.categoryId;
        if (!categoryId) {
            setError('Kategori wajib dipilih.');
            return null;
        }

        return {
            category_id: categoryId,
            parent_id: form.isVariant ? parent?.id ?? null : null,
            name,
            unit: service?.unit ?? DEFAULT_UNIT,
            price_default: service ? Number(service.price_default) : 0,
            is_active: isActive,
        };
    }

    async function syncPrices(serviceId: string, slaDays: number) {
        const jobs: Promise<unknown>[] = [];

        branches.forEach((branch) => {
            const state = form.outlets[branch.id];
            const existed = (service?.prices ?? []).some((price) => String(price.branch_id) === String(branch.id));

            if (state?.active) {
                jobs.push(
                    setServicePrice({
                        service_id: serviceId,
                        branch_id: branch.id,
                        price: Number(state.price),
                        sla_days: slaDays,
                    }),
                );
                return;
            }

            if (existed) {
                jobs.push(unsetServicePrice(serviceId, branch.id));
            }
        });

        await Promise.all(jobs);
    }

    async function submit() {
        setError(null);

        const payload = buildPayload(service ? service.is_active : true);
        if (!payload) return;

        const slaDays = Number(form.sla);
        if (form.isVariant) {
            if (!Number.isInteger(slaDays) || slaDays < 0 || slaDays > 365) {
                setError('SLA harus bilangan bulat 0-365 hari.');
                return;
            }

            const invalid = branches.some(
                (branch) => form.outlets[branch.id]?.active && !isValidPrice(form.outlets[branch.id].price),
            );
            if (invalid) {
                setError('Harga outlet yang dicentang harus angka 0 atau lebih.');
                return;
            }
        }

        setSaving(true);
        try {
            const res = service ? await updateService(service.id, payload) : await createService(payload);
            const savedId = res.data?.id ?? service?.id;

            if (savedId && form.isVariant) {
                await syncPrices(savedId, slaDays);
            }

            onDone(service ? 'Produk diperbarui.' : 'Produk disimpan.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menyimpan produk'));
        } finally {
            setSaving(false);
        }
    }

    async function setActive(value: boolean) {
        if (!service) return;

        setSaving(true);
        setError(null);
        try {
            await updateService(service.id, {
                category_id: service.category_id,
                parent_id: service.parent_id,
                name: service.name,
                unit: service.unit,
                price_default: Number(service.price_default),
                is_active: value,
            });
            onDone(value ? 'Produk dipulihkan.' : 'Produk diarsipkan.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal mengubah status produk'));
        } finally {
            setSaving(false);
        }
    }

    async function remove() {
        if (!service) return;

        const label = service.parent_id ? 'varian' : 'produk';
        if (!window.confirm(`Hapus ${label} ${service.name}? Jika sudah pernah dipakai di order, arsipkan saja.`)) return;

        setSaving(true);
        setError(null);
        try {
            await deleteService(service.id);
            onDone('Produk dihapus.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menghapus produk'));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={editing ? 'Edit Produk' : 'Tambah Produk'}>
            <div className="box">
                <div className="modal-head">
                    <h3>{editing ? 'Edit Produk' : 'Tambah Produk'}</h3>
                    <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
                        {'\u2715'}
                    </button>
                </div>

                {error ? (
                    <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
                        {error}
                    </div>
                ) : null}

                {form.isVariant ? (
                    <div className="field">
                        <label htmlFor="svc-name">Nama Varian</label>
                        <input
                            id="svc-name"
                            value={form.name}
                            placeholder="mis. Regular / Signature"
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="row">
                        <div className="field">
                            <label htmlFor="svc-name">Nama Produk</label>
                            <input
                                id="svc-name"
                                value={form.name}
                                placeholder="mis. Deep Clean"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="svc-cat">Kategori</label>
                            <select
                                id="svc-cat"
                                value={form.categoryId}
                                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <label className="tgl">
                    <span className="switch">
                        <input
                            type="checkbox"
                            checked={form.isVariant}
                            disabled={lockVariant}
                            onChange={(e) => setForm({ ...form, isVariant: e.target.checked })}
                        />
                        <span className="slider" />
                    </span>
                    <span>Varian {'\u2014'} produk ini adalah varian dari produk lain</span>
                </label>

                {form.isVariant ? (
                    <>
                        <div className="field">
                            <label htmlFor="svc-parent">Produk Keluarga (induk)</label>
                            <select
                                id="svc-parent"
                                value={form.parentId}
                                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                            >
                                <option value="">{'\u2014'} pilih produk keluarga {'\u2014'}</option>
                                {parents
                                    .filter((item) => item.id !== service?.id)
                                    .map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {parentLabelOf(item)}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="svc-sla">SLA (hari)</label>
                            <input
                                id="svc-sla"
                                type="number"
                                min={0}
                                max={365}
                                step={1}
                                value={form.sla}
                                onChange={(e) => setForm({ ...form, sla: e.target.value })}
                            />
                        </div>

                        <div className="field">
                            <label>
                                Ketersediaan &amp; Harga per Outlet{' '}
                                <span className="mini">(centang outlet untuk aktif)</span>
                            </label>

                            {branches.map((branch) => {
                                const state = form.outlets[branch.id] ?? { active: false, price: '' };
                                return (
                                    <div key={branch.id} className="tgl" style={{ display: 'block', cursor: 'default' }}>
                                        <label className="switch-row" style={{ cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={state.active}
                                                onChange={(e) => setOutlet(branch.id, { ...state, active: e.target.checked })}
                                            />
                                            <span>{branch.name}</span>
                                            <span className="tag">{branch.code}</span>
                                        </label>

                                        {state.active ? (
                                            <div className="field" style={{ marginTop: 10, marginBottom: 0 }}>
                                                <label htmlFor={`svc-price-${branch.id}`}>Harga di {branch.code}</label>
                                                <input
                                                    id={`svc-price-${branch.id}`}
                                                    type="number"
                                                    min={0}
                                                    step={1000}
                                                    value={state.price}
                                                    onChange={(e) => setOutlet(branch.id, { ...state, price: e.target.value })}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : null}

                <div className="modal-foot">
                    {editing && service ? (
                        <>
                            <button
                                type="button"
                                className="btn ghost sm"
                                disabled={saving}
                                onClick={() => void setActive(!service.is_active)}
                            >
                                {service.is_active ? <IconArchive /> : <IconUnarchive />}
                                {service.is_active ? 'Arsipkan' : 'Pulihkan'}
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
