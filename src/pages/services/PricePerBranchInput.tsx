// src/pages/services/PricePerBranchInput.tsx
import { useEffect, useRef, useState } from 'react';
import type { Branch } from '../../types/branches';
import type { ServicePrice, ServicePriceSetPayload } from '../../types/services';
import { listBranches } from '../../api/branches';
import { listServicePricesByService, setServicePrice } from '../../api/servicePrices';

interface Props {
    serviceId: string;
    defaultPrice: number;
}
type Row = Branch & { override?: ServicePrice | null; effective: number };

function toStr(x: unknown) {
    return x == null ? '' : String(x);
}
function toNum(x: unknown, fallback = 0) {
    const n = Number(x);
    return Number.isFinite(n) ? n : fallback;
}
function toIDR(n: number) {
    return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

export default function PricePerBranchInput({ serviceId, defaultPrice }: Props) {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            console.groupCollapsed('[PricePerBranchInput] LOAD');
            console.log('serviceId:', serviceId);
            console.log('defaultPrice:', defaultPrice);

            try {
                const branchesRes = await listBranches({ per_page: 100 });
                // branchesRes bisa berupa envelope {data: Branch[]} atau langsung [].
                const branchesRaw: unknown = (branchesRes)?.data ?? branchesRes;
                const branches: Branch[] = Array.isArray(branchesRaw) ? branchesRaw : [];
                console.log('branches (raw):', branchesRes);
                console.log('branches (parsed):', branches);

                const overridesRes = await listServicePricesByService(serviceId);
                // overridesRes bisa berupa envelope {data: ServicePrice[]} atau langsung [].
                const overridesData: unknown = (overridesRes)?.data ?? overridesRes;
                const overrides: ServicePrice[] = Array.isArray(overridesData) ? overridesData : [];
                console.log('overrides (raw):', overridesRes);
                console.log('overrides (parsed):', overrides);

                // Map dengan kunci string agar aman terhadap perbedaan tipe id
                const map = new Map<string, ServicePrice>(
                    overrides.map((p) => [toStr(p.branch_id), p])
                );

                const merged: Row[] = branches.map((b) => {
                    const key = toStr(b.id);
                    const ov = map.get(key) ?? null;
                    const eff = ov ? toNum(ov.price, Number(defaultPrice)) : Number(defaultPrice);
                    return { ...b, override: ov, effective: eff };
                });

                console.log('merged rows:', merged);
                setRows(merged);
            } catch (e) {
                console.error('LOAD error:', e);
                setError('Gagal memuat harga per cabang');
            } finally {
                console.groupEnd();
                setLoading(false);
            }
        })();
    }, [serviceId, defaultPrice]);

    async function onSaveOne(branch_id_raw: string | number, price_raw: number) {
        const branch_id = toStr(branch_id_raw);
        const price = toNum(price_raw);

        // Validasi harga
        if (!Number.isFinite(price) || price <= 0) {
            alert('Harga tidak valid');
            return;
        }

        const payload: ServicePriceSetPayload = { service_id: serviceId, branch_id, price };

        console.groupCollapsed('[PricePerBranchInput] SAVE ONE');
        console.log('payload:', payload);

        try {
            setSaving(branch_id);
            const res = await setServicePrice(payload);
            console.log('response (raw):', res);

            // res bisa envelope {data: row} atau langsung row
            const updated: ServicePrice = (res && (res).data ? (res).data : res) as ServicePrice;
            console.log('response (parsed row):', updated);

            if (!updated || !updated.id) {
                console.warn('No updated row returned, skip UI update.');
            } else {
                // Update baris pada tabel
                setRows((prev) =>
                    prev.map((r) =>
                        toStr(r.id) === branch_id
                            ? {
                                  ...r,
                                  override: updated,
                                  effective: toNum(updated.price, r.effective),
                              }
                            : r
                    )
                );

                // Sinkronkan tampilan input (karena kita pakai uncontrolled input + defaultValue)
                const ref = inputRefs.current[branch_id];
                if (ref) ref.value = toStr(updated.price);
            }

            alert('Harga cabang diperbarui.');
        } catch (e) {
            console.error('SAVE error:', e);
            alert('Gagal menyimpan harga cabang');
        } finally {
            setSaving(null);
            console.groupEnd();
        }
    }

    if (loading) return <div className="text-sm text-gray-500">Memuat harga cabang…</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (!rows.length) return <div className="text-sm text-gray-500">Belum ada cabang</div>;

    return (
        <div className="overflow-auto rounded border">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left">Cabang</th>
                        <th className="px-3 py-2 text-left">Harga Efektif</th>
                        <th className="px-3 py-2 text-left">Override</th>
                        <th className="px-3 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={toStr(r.id)} className="border-t">
                            <td className="px-3 py-2">{r.code} — {r.name}</td>
                            <td className="px-3 py-2">{toIDR(r.effective)}</td>
                            <td className="px-3 py-2">
                                <input
                                    type="number"
                                    min={0}
                                    step="100"
                                    className="border rounded px-2 py-1 w-36 text-right"
                                    defaultValue={r.override?.price ?? ''}
                                    placeholder={`Default ${toIDR(Number(defaultPrice))}`}
                                    ref={(el) => { inputRefs.current[toStr(r.id)] = el; }}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    className="underline text-xs"
                                    disabled={saving === toStr(r.id)}
                                    onClick={() => {
                                        const raw = inputRefs.current[toStr(r.id)]?.value;
                                        const val = toNum(raw, NaN);
                                        if (!Number.isFinite(val) || val <= 0) {
                                            alert('Harga tidak valid'); 
                                            return;
                                        }
                                        void onSaveOne(toStr(r.id), val);
                                    }}
                                >
                                    {saving === toStr(r.id) ? 'Menyimpan…' : 'Simpan'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
