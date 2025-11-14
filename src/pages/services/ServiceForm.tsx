import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Service, ServiceUpsertPayload, ServiceCategory } from '../../types/services';
import { createService, getService, updateService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import PricePerBranchInput from './PricePerBranchInput';

export default function ServiceForm() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const editing = Boolean(id);

    const [cats, setCats] = useState<ServiceCategory[]>([]);
    const [form, setForm] = useState<ServiceUpsertPayload>({
        category_id: '',
        name: '',
        unit: 'ITEM',
        price_default: 0,
        is_active: true,
    });
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        (async () => {
            setLoading(true); setError(null);
            try {
                const sc = await listServiceCategories({ per_page: 100 });
                setCats(sc.data ?? []);
                if (editing) {
                    const res = await getService(id!);
                    const s = res.data as Service;
                    setService(s);
                    setForm({
                        category_id: s.category_id,
                        name: s.name,
                        unit: s.unit,
                        price_default: Number(s.price_default),
                        is_active: s.is_active,
                    });
                }
            } catch {
                setError('Gagal memuat data');
            } finally {
                setLoading(false);
            }
        })();
    }, [editing, id]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null); setFieldErrors({});
        if (!form.category_id || !form.name.trim() || !form.unit.trim() || Number(form.price_default) <= 0) {
            setLoading(false); setError('Kategori, Nama, Unit, dan Harga Default wajib diisi'); return;
        }
        try {
            if (editing) await updateService(id!, form);
            else await createService(form);
            alert('Tersimpan'); nav('/services', { replace: true });
        } catch (err: unknown) {
            const withResp = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
            const fe = withResp.response?.data?.errors ?? {};
            if (fe && typeof fe === 'object') setFieldErrors(fe);
            setError(withResp.response?.data?.message ?? 'Gagal menyimpan');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
                <h1 className="text-lg font-semibold">{editing ? 'Edit Service' : 'New Service'}</h1>
                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="grid gap-1">
                    <label className="text-xs">Kategori *</label>
                    <select className="border rounded px-3 py-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                        <option value="">Pilih kategori</option>
                        {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {fieldErrors.category_id && <p className="text-xs text-red-600">{fieldErrors.category_id.join(', ')}</p>}
                </div>

                <div className="grid gap-1">
                    <label className="text-xs">Nama *</label>
                    <input className="border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>}
                </div>

                <div className="grid gap-1">
                    <label className="text-xs">Unit *</label>
                    <input className="border rounded px-3 py-2" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value.toUpperCase() })} />
                    {fieldErrors.unit && <p className="text-xs text-red-600">{fieldErrors.unit.join(', ')}</p>}
                </div>

                <div className="grid gap-1">
                    <label className="text-xs">Harga Default *</label>
                    <input type="number" min={0} step="100" className="border rounded px-3 py-2" value={form.price_default}
                        onChange={(e) => setForm({ ...form, price_default: Number(e.target.value) })} />
                    {fieldErrors.price_default && <p className="text-xs text-red-600">{fieldErrors.price_default.join(', ')}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <input id="is_active" type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    <label htmlFor="is_active" className="text-sm">Active</label>
                </div>

                <div className="flex gap-2">
                    <button disabled={loading} className="rounded bg-black text-white px-3 py-2">{loading ? 'Menyimpan…' : 'Simpan'}</button>
                    <button type="button" className="rounded border px-3 py-2" onClick={() => history.back()}>Batal</button>
                </div>
            </form>

            {/* Harga per cabang (override) — tampil saat edit atau saat new sudah tersimpan */}
            {editing && service && (
                <section className="max-w-3xl space-y-2">
                    <h2 className="font-medium">Harga per Cabang</h2>
                    <p className="text-xs text-gray-500">
                        Harga efektif = override `service_prices` per cabang, jika tidak ada → pakai `price_default`.
                    </p>
                    <PricePerBranchInput serviceId={service.id} defaultPrice={Number(service.price_default)} />
                </section>
            )}
        </div>
    );
}
