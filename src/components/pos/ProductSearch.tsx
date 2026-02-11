// src/components/pos/ProductSearch.tsx
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { Service } from '../../types/services';
import { listServices } from '../../api/services';
import { listServicePricesByService, computeEffectivePrice } from '../../api/servicePrices';
import type { ServicePrice } from '../../types/services';
import { useAuth } from '../../store/useAuth';

type Props = {
  onPick: (row: Service & { price_effective: number }) => void;
};

type Row = Service & { price_effective: number };

function formatIDR(n: number): string {
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
        </div>
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-3 h-3 w-32 rounded bg-slate-200" />
    </div>
  );
}

export default function ProductSearch({ onPick }: Props): React.ReactElement {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branchId: string | null = user?.branch_id != null ? String(user.branch_id) : null;

  const [q, setQ] = useState('');
  const [base, setBase] = useState<Service[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, ServicePrice[]>>({});
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listServices({ q, is_active: true, per_page: 10, page: 1 });
      const list = (res.data ?? []) as Service[];
      setBase(list);

      const entries = await Promise.all(
        list.map(async (s) => [String(s.id), (await listServicePricesByService(String(s.id))).data] as const)
      );

      const map: Record<string, ServicePrice[]> = {};
      for (const [sid, prices] of entries) map[sid] = prices ?? [];
      setPriceMap(map);

      const computed: Row[] = list.map((s) => ({
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
    const computed: Row[] = base.map((s) => ({
      ...s,
      price_effective: computeEffectivePrice(priceMap[String(s.id)], branchId, s.price_default),
    }));
    setRows(computed);
  }, [branchId, base, priceMap]);

  const hintText = useMemo(() => {
    // Hint singkat, tidak mengubah logic (hanya copy)
    return 'Enter untuk cari · Klik kartu layanan untuk menambah ke keranjang';
  }, []);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <SearchIcon />
          </span>

          <input
            className="
              w-full rounded-xl border border-slate-200 bg-white
              py-2.5 pl-10 pr-10 text-sm text-slate-900
              placeholder:text-slate-400
              focus:border-slate-900 focus:outline-none
            "
            placeholder="Cari layanan… (mis. Cuci Sepatu, Fast Clean)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void refresh(); }}
            aria-label="Cari layanan"
          />

          {q.trim().length > 0 && (
            <button
              type="button"
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                rounded-lg p-2 text-slate-600 hover:bg-slate-100
                focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              onClick={() => setQ('')}
              aria-label="Hapus pencarian"
            >
              <XIcon />
            </button>
          )}
        </div>

        <button
          type="button"
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white
            hover:bg-slate-800 active:bg-slate-950
            disabled:cursor-not-allowed disabled:opacity-60
          "
          onClick={() => void refresh()}
          disabled={loading}
          aria-label="Cari"
        >
          <SearchIcon className="text-white/90" />
          Cari
        </button>
      </div>

      <div className="text-[11px] text-slate-500">{hintText}</div>

      {/* States */}
      {loading && (
        <div className="grid gap-2 sm:grid-cols-2" aria-live="polite">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && !error && rows.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              className="
                group w-full rounded-2xl border border-slate-200 bg-white p-3 text-left
                shadow-[0_14px_40px_-34px_rgba(0,0,0,.35)]
                transition hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              onClick={() => onPick(r)}
              title="Klik untuk menambah ke keranjang"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{r.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{r.unit}</div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold tracking-tight text-slate-900 tabular-nums">
                    {formatIDR(r.price_effective)}
                  </div>
                  <div className="mt-1 inline-flex rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                    + Tambah
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Klik untuk menambah ke keranjang.
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center">
          <div className="text-sm font-semibold text-slate-900">Tidak ada hasil</div>
          <div className="mt-1 text-xs text-slate-500">Coba kata kunci lain, atau kosongkan pencarian lalu tekan Cari.</div>
        </div>
      )}
    </div>
  );
}
