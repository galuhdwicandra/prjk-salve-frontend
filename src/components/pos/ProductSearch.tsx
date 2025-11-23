// src/components/pos/ProductSearch.tsx
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { Service } from '../../types/services';
import { listServices } from '../../api/services';
import { listServicePricesByService, computeEffectivePrice } from '../../api/servicePrices';
import type { ServicePrice } from '../../types/services';
import { useAuth } from '../../store/useAuth';

type Props = {
  onPick: (row: Service & { price_effective: number }) => void;
};

export default function ProductSearch({ onPick }: Props): React.ReactElement {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branchId: string | null = user?.branch_id != null ? String(user.branch_id) : null;
  const [q, setQ] = useState('');
  const [base, setBase] = useState<Service[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, ServicePrice[]>>({});
  const [rows, setRows] = useState<(Service & { price_effective: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listServices({ q, is_active: true, per_page: 10, page: 1 });
      const list = (res.data ?? []) as Service[];
      setBase(list);
      // Ambil daftar override harga per service (sekali per service, paralel)
      const entries = await Promise.all(
        list.map(async (s) => [String(s.id), (await listServicePricesByService(String(s.id))).data] as const)
      );
      const map: Record<string, ServicePrice[]> = {};
      for (const [sid, prices] of entries) map[sid] = prices ?? [];
      setPriceMap(map);
      // Hitung harga efektif untuk cabang aktif saat ini (tanpa request tambahan)
      const computed = list.map(s => ({
        ...s,
        price_effective: computeEffectivePrice(map[String(s.id)], branchId, s.price_default),
      }));
      setRows(computed);
    } catch {
      setError('Gagal memuat layanan');
    } finally {
      setLoading(false);
    }
  }, [q, branchId]);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    if (!base.length) return;
    const computed = base.map(s => ({
      ...s,
      price_effective: computeEffectivePrice(priceMap[String(s.id)], branchId, s.price_default),
    }));
    setRows(computed);
  }, [branchId, base, priceMap]);

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="flex gap-2">
        <input
          className="input px-3 py-2 w-full"
          placeholder="Cari layanan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void refresh(); }}
          aria-label="Cari layanan"
        />
        <button
          className="btn-outline"
          onClick={() => void refresh()}
          aria-label="Cari"
        >
          Cari
        </button>
      </div>
      <div className="text-[10px] text-gray-500">Enter untuk cari • Klik kartu layanan untuk menambah ke keranjang</div>

      {/* States */}
      {loading && (
        <div className="text-sm text-gray-500" aria-live="polite">Memuat…</div>
      )}
      {error && (
        <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>
      )}

      {/* Results */}
      {!loading && !error && rows.length > 0 && (
        <div className="grid md:grid-cols-2 gap-2">
          {rows.map((r) => (
            <button
              key={r.id}
              className="rounded-lg border border-(--color-border) bg-(--color-surface) p-3 text-left transition-colors hover:bg-black/5 focus-visible:focus-ring"
              onClick={() => onPick(r)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-600">{r.unit}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">
                  {r.price_effective.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="text-sm text-gray-600">Tidak ada hasil</div>
      )}
    </div>
  );
}
