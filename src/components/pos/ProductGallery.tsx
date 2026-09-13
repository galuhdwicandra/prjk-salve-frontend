import { useEffect, useMemo, useState } from 'react';
import { listServices } from '../../api/services';
import { computeEffectivePrice, computeEffectiveSla } from '../../api/servicePrices';
import type { Service } from '../../types/services';
import { rp } from '../../utils/money';

type PickedRow = { id: string; name: string; unit: string; price_effective: number; sla_days: number };

type Props = {
  onPick: (row: PickedRow) => void;
  branchId: string | null;
};

type GalleryEntry = {
  parent: Service;
  options: Service[];
};

function tileFont(name: string): number {
  if (name.length > 34) return 12;
  if (name.length > 22) return 14;
  if (name.length > 14) return 16;
  return 18;
}

export default function ProductGallery({ onPick, branchId }: Props) {
  const [parents, setParents] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [picked, setPicked] = useState<GalleryEntry | null>(null);

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setError(null);

    listServices({ tree: true, is_active: true, per_page: 100, branch_id: branchId ?? undefined })
      .then((res) => {
        if (!alive) return;
        setParents(res.data ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setError('Gagal memuat produk.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [branchId]);

  const priceOf = useMemo(
    () => (service: Service) => computeEffectivePrice(service.prices, branchId, service.price_default),
    [branchId],
  );

  const slaOf = useMemo(
    () => (service: Service) => computeEffectiveSla(service.prices, branchId),
    [branchId],
  );

  const entries = useMemo<GalleryEntry[]>(() => {
    const search = keyword.trim().toLowerCase();

    return parents
      .map((parent) => ({
        parent,
        options: (parent.variants ?? []).filter((variant) => variant.is_active),
      }))
      .filter((entry) => entry.options.length > 0)
      .filter((entry) => !search || entry.parent.name.toLowerCase().includes(search));
  }, [parents, keyword, priceOf]);

  function pick(service: Service) {
    onPick({
      id: service.id,
      name: service.name,
      unit: service.unit,
      price_effective: priceOf(service),
      sla_days: computeEffectiveSla(service.prices, branchId),
    });
    setPicked(null);
  }

  function openEntry(entry: GalleryEntry) {
    if (entry.options.length === 1) {
      pick(entry.options[0]);
      return;
    }

    setPicked(entry);
  }

  return (
    <>
      <div className="pos-toolbar">
        <div className="pos-title">Produk</div>
        <input
          type="text"
          className="pos-search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari produk..."
          autoComplete="off"
          aria-label="Cari produk"
        />
      </div>

      {error ? <div className="login-err">{error}</div> : null}

      <div className="pos-gallery">
        {loading ? (
          <div className="empty" style={{ gridColumn: '1/-1', padding: 40 }}>
            Memuat produk…
          </div>
        ) : entries.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1/-1', padding: 40 }}>
            Tidak ada produk aktif di outlet ini.
          </div>
        ) : (
          entries.map((entry) => {
            const lowest = Math.min(...entry.options.map(priceOf));

            return (
              <button
                type="button"
                className="pcard"
                key={entry.parent.id}
                style={{ textAlign: 'left' }}
                onClick={() => openEntry(entry)}
              >
                <div className="pcard-ic" style={{ fontSize: tileFont(entry.parent.name) }}>
                  {entry.parent.name}
                </div>

                <div className="pcard-row">
                  <div className="pcard-info">
                    <span className="pcard-pr">
                      {entry.options.length > 1 ? 'mulai ' : ''}
                      {rp(lowest)}
                    </span>
                    <span className="pcard-cnt">{entry.options.length} pilihan</span>
                  </div>

                  <span className="pcard-add">+</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {picked ? (
        <div className="modal show" role="dialog" aria-modal="true" onClick={() => setPicked(null)}>
          <div className="box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{picked.parent.name}</h3>
              <button type="button" className="mclose" onClick={() => setPicked(null)} aria-label="Tutup">
                {'\u2715'}
              </button>
            </div>

            <div className="mini" style={{ marginBottom: 10 }}>
              Pilih varian untuk ditambahkan ke order
            </div>

            <div className="vpick">
              {picked.options.map((variant) => (
                <button type="button" className="vpick-row" key={variant.id} onClick={() => pick(variant)}>
                  <span className="vp-nm">{variant.name}</span>
                  <span className="vp-meta">
                    <span className="vp-pr mono">{rp(priceOf(variant))}</span>
                    <span className="mini">{slaOf(variant) > 0 ? `${slaOf(variant)} hari` : variant.unit}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
