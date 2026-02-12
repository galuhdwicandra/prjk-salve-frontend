// src/components/pos/ProductSearch.tsx
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
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

function highlight(text: string, keyword: string): React.ReactNode {
  const k = keyword.trim();
  if (!k) return text;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'ig');
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? <mark key={i} className="rounded bg-yellow-200 px-1">{p}</mark> : <span key={i}>{p}</span>
  );
}

export default function ProductSearch({ onPick }: Props): React.ReactElement {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branchId: string | null = user?.branch_id != null ? String(user.branch_id) : null;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const priceCacheRef = useRef<Record<string, ServicePrice[]>>({});

  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [debouncedQ, setDebouncedQ] = useState('');
  const [base, setBase] = useState<Service[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, ServicePrice[]>>({});
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const keyword = debouncedQ;

      // minimal 2 karakter untuk menghindari "load terlalu luas"
      if (keyword.length > 0 && keyword.length < 2) {
        setBase([]);
        setRows([]);
        setLoading(false);
        return;
      }
      const res = await listServices({ q: keyword, is_active: true, per_page: 10, page });
      const list = (res.data ?? []) as Service[];
      setHasMore(list.length === 10);

      setBase((prev) => (page === 1 ? list : [...prev, ...list]));

      const entries = await Promise.all(
        list.map(async (s) => {
          const sid = String(s.id);
          if (priceCacheRef.current[sid]) return [sid, priceCacheRef.current[sid]] as const;
          const prices = (await listServicePricesByService(sid)).data ?? [];
          priceCacheRef.current[sid] = prices;
          return [sid, prices] as const;
        })
      );

      setPriceMap((prev) => {
        const next = { ...prev };
        for (const [sid, prices] of entries) next[sid] = prices ?? [];
        return next;
      });

      if (page === 1) setSelectedIdx(0);
    } catch {
      setError('Gagal memuat layanan');
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, page]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => inputRef.current?.focus(), 0);
    void refresh();
  }, [open, debouncedQ, page, refresh]);

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
    return 'Ketik untuk mencari · Klik layanan untuk menambah ke keranjang';
  }, []);

  return (
    <div className="space-y-3">
      {/* Trigger button (hemat tempat di POSPage) */}
      <button
        type="button"
        className="
          w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left
          text-sm font-semibold text-slate-900 hover:bg-slate-50
          focus:outline-none focus:ring-2 focus:ring-slate-200
        "
        onClick={() => { setPage(1); setOpen(true); }}
      >
        <div className="flex items-center justify-between">
          <span>Cari layanan</span>
          <span className="text-xs text-slate-500">Buka</span>
        </div>
        <div className="mt-0.5 text-[11px] text-slate-500">
          {q.trim() ? `Kata kunci: "${q.trim()}"` : 'Ketik nama layanan di popup.'}
        </div>
      </button>

      {/* Popup pencarian layanan */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3"
          onClick={() => { setOpen(false); setError(null); }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-200">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">Pilih Layanan</div>
                <div className="text-xs text-slate-500">{hintText}</div>
              </div>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => { setOpen(false); setError(null); }}
              >
                Tutup
              </button>
            </div>

            {/* Search bar di dalam modal */}
            <div className="p-4 space-y-3">
              <div className="flex items-stretch gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <SearchIcon />
                  </span>

                  <input
                    ref={inputRef}
                    className="
                      w-full rounded-xl border border-slate-200 bg-white
                      py-2.5 pl-10 pr-10 text-sm text-slate-900
                      placeholder:text-slate-400
                      focus:border-slate-900 focus:outline-none
                    "
                    placeholder="Ketik minimal 2 huruf… (mis. Cuci, Fast, Sepatu)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        setOpen(false);
                        setError(null);
                        return;
                      }
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setSelectedIdx((i) => Math.min(i + 1, Math.max(rows.length - 1, 0)));
                        return;
                      }
                      if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setSelectedIdx((i) => Math.max(i - 1, 0));
                        return;
                      }
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const picked = rows[selectedIdx];
                        if (!picked) return;
                        onPick(picked);
                        setQ('');
                        setOpen(false);
                      }
                    }}
                    aria-label="Cari layanan"
                    autoFocus
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
                <>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {rows.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        className={[
                          "group w-full rounded-2xl border border-slate-200 bg-white p-3 text-left",
                          "shadow-[0_14px_40px_-34px_rgba(0,0,0,.35)]",
                          "transition hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50",
                          "focus:outline-none focus:ring-2 focus:ring-slate-200",
                          rows[selectedIdx]?.id === r.id ? "border-slate-900 ring-2 ring-slate-200" : ""
                        ].join(" ")}
                        onClick={() => {
                          onPick(r);
                          setQ('');       // reset agar tidak penuh
                          setOpen(false); // tutup modal setelah pilih
                        }}
                        title="Klik untuk menambah ke keranjang"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">
                              {highlight(r.name, debouncedQ)}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500">{r.unit}</div>
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="text-sm font-semibold tracking-tight text-slate-900 tabular-nums">
                              {formatIDR(r.price_effective)}
                            </div>
                            <div className="mt-1 inline-flex rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                              Tambah
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Pagination sederhana: muat lagi */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={loading || !hasMore}
                    >
                      {hasMore ? "Muat lagi" : "Tidak ada lagi"}
                    </button>
                  </div>
                </>
              )}

              {!loading && !error && rows.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center">
                  <div className="text-sm font-semibold text-slate-900">Tidak ada hasil</div>
                  <div className="mt-1 text-xs text-slate-500">Ketik minimal 2 huruf, lalu klik Cari.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
      }


    </div >
  );
}
