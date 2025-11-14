// src/components/pos/ProductSearch.tsx
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { Service } from '../../types/services';
import { listServices } from '../../api/services';
import { getEffectivePrice } from '../../api/servicePrices';
import { useAuth } from '../../store/useAuth';

type Props = {
    onPick: (row: Service & { price_effective: number }) => void;
};

export default function ProductSearch({ onPick }: Props): React.ReactElement {
    const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
    const branchId: string = user?.branch_id != null ? String(user.branch_id) : '';
    const [q, setQ] = useState('');
    const [rows, setRows] = useState<(Service & { price_effective: number })[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await listServices({ q, is_active: true, per_page: 10, page: 1 });
            const base = (res.data ?? []);
            const withPrice = await Promise.all(
                base.map(async (s) => ({
                    ...s,
                    price_effective: branchId ? await getEffectivePrice({ id: s.id, price_default: s.price_default }, branchId) : Number(s.price_default),
                }))
            );
            setRows(withPrice);
        } catch {
            setError('Gagal memuat layanan');
        } finally {
            setLoading(false);
        }
    }, [q, branchId]);

    useEffect(() => { void refresh(); }, [refresh]);

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Cari layanan…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') void refresh(); }}
                />
                <button className="border rounded px-3 py-2" onClick={() => void refresh()}>Cari</button>
            </div>

            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && rows.length > 0 && (
                <div className="grid md:grid-cols-2 gap-2">
                    {rows.map((r) => (
                        <button
                            key={r.id}
                            className="border rounded p-3 text-left hover:bg-muted"
                            onClick={() => onPick(r)}
                        >
                            <div className="font-medium">{r.name}</div>
                            <div className="text-xs text-muted-foreground">{r.unit}</div>
                            <div className="text-sm mt-1">{r.price_effective.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
                        </button>
                    ))}
                </div>
            )}

            {!loading && !error && rows.length === 0 && <div className="text-sm text-muted-foreground">Tidak ada hasil</div>}
        </div>
    );
}
