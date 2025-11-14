import { useEffect, useRef, useState } from 'react';
import type { Branch } from '../../types/branches';
import type { ServicePrice, ServicePriceSetPayload } from '../../types/services';
import { listBranches } from '../../api/branches';
import { listServicePricesByService, setServicePrice } from '../../api/servicePrices';

interface Props {
    serviceId: string;
    defaultPrice: number;
}
type Row = Branch & { override?: ServicePrice | null; effective: number; };

export default function PricePerBranchInput({ serviceId, defaultPrice }: Props) {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
        (async () => {
            setLoading(true); setError(null);
            try {
                const branches = await listBranches({ per_page: 100 });
                const overrides = await listServicePricesByService(serviceId);
                const map = new Map((overrides.data ?? []).map((p) => [p.branch_id, p]));
                const merged: Row[] = (branches.data ?? []).map((b) => {
                    const ov = map.get(b.id) ?? null;
                    return { ...b, override: ov, effective: ov ? Number(ov.price) : Number(defaultPrice) };
                });
                setRows(merged);
            } catch {
                setError('Gagal memuat harga per cabang');
            } finally {
                setLoading(false);
            }
        })();
    }, [serviceId, defaultPrice]);

    async function onSaveOne(branch_id: string, price: number) {
        const payload: ServicePriceSetPayload = { service_id: serviceId, branch_id, price };
        try {
            await setServicePrice(payload);
            // refresh baris lokal
            setRows((prev) => prev.map((r) => r.id === branch_id ? { ...r, override: { id: r.override?.id ?? 'tmp', service_id: serviceId, branch_id, price } as ServicePrice, effective: price } : r));
            alert('Harga cabang diperbarui');
        } catch {
            alert('Gagal menyimpan harga cabang');
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
                        <tr key={r.id} className="border-t">
                            <td className="px-3 py-2">{r.code} — {r.name}</td>
                            <td className="px-3 py-2">{r.effective.toLocaleString('id-ID')}</td>
                            <td className="px-3 py-2">
                                <input
                                    type="number"
                                    min={0}
                                    step="100"
                                    className="border rounded px-2 py-1 w-36"
                                    defaultValue={r.override?.price ?? ''}
                                    placeholder={`Default ${defaultPrice}`}
                                    ref={(el) => { inputRefs.current[r.id] = el; }}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    className="underline text-xs"
                                    onClick={() => {
                                        const val = Number(inputRefs.current[r.id]?.value ?? NaN);
                                        if (!Number.isFinite(val) || val <= 0) { alert('Harga tidak valid'); return; }
                                        void onSaveOne(r.id, val);
                                    }}
                                >
                                    Simpan
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
