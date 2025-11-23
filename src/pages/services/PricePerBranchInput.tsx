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
  const [notice, setNotice] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setNotice(null);

      console.groupCollapsed('[PricePerBranchInput] LOAD');
      console.log('serviceId:', serviceId);
      console.log('defaultPrice:', defaultPrice);

      try {
        const branchesRes = await listBranches({ per_page: 100 });
        const branchesRaw: unknown = (branchesRes)?.data ?? branchesRes;
        const branches: Branch[] = Array.isArray(branchesRaw) ? branchesRaw : [];
        console.log('branches (raw):', branchesRes);
        console.log('branches (parsed):', branches);

        const overridesRes = await listServicePricesByService(serviceId);
        const overridesData: unknown = (overridesRes)?.data ?? overridesRes;
        const overrides: ServicePrice[] = Array.isArray(overridesData) ? overridesData : [];
        console.log('overrides (raw):', overridesRes);
        console.log('overrides (parsed):', overrides);

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
        setError('Gagal memuat harga per cabang.');
      } finally {
        console.groupEnd();
        setLoading(false);
      }
    })();
  }, [serviceId, defaultPrice]);

  async function onSaveOne(branch_id_raw: string | number, price_raw: number) {
    const branch_id = toStr(branch_id_raw);
    const price = toNum(price_raw);

    if (!Number.isFinite(price) || price <= 0) {
      setNotice(null);
      setError('Harga tidak valid.');
      return;
    }

    const payload: ServicePriceSetPayload = { service_id: serviceId, branch_id, price };

    console.groupCollapsed('[PricePerBranchInput] SAVE ONE');
    console.log('payload:', payload);

    try {
      setSaving(branch_id);
      setError(null);
      setNotice(null);

      const res = await setServicePrice(payload);
      console.log('response (raw):', res);
      const updated: ServicePrice = (res && (res).data ? (res).data : res) as ServicePrice;
      console.log('response (parsed row):', updated);

      if (!updated || !updated.id) {
        console.warn('No updated row returned, skip UI update.');
      } else {
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

        const ref = inputRefs.current[branch_id];
        if (ref) ref.value = toStr(updated.price);
      }

      setNotice('Harga cabang diperbarui.');
    } catch (e) {
      console.error('SAVE error:', e);
      setError('Gagal menyimpan harga cabang.');
    } finally {
      setSaving(null);
      console.groupEnd();
    }
  }

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="h-4 w-4 rounded-full bg-black/10 animate-pulse" />
          Memuat harga cabang…
        </div>
      </div>
    );
  }
  if (error && !rows.length) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
      >
        {error}
      </div>
    );
  }
  if (!rows.length) {
    return <div className="text-sm text-gray-500">Belum ada cabang.</div>;
  }

  return (
    <section className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]">
        <div>
          <h2 className="text-sm font-semibold">Harga Per Cabang</h2>
          <p className="text-xs text-gray-600">
            Default harga layanan: <span className="font-medium">{toIDR(Number(defaultPrice))}</span>
          </p>
        </div>
      </div>

      {/* Alerts */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="mx-4 mt-3 rounded-md border border-[color:var(--color-border)] bg-[#E6EDFF] text-[color:var(--color-text-default)] text-sm px-3 py-2"
        >
          {notice}
        </div>
      )}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="mx-4 mt-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto mt-3">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-[#E6EDFF] sticky top-0 z-10">
            <tr className="divide-x divide-[color:var(--color-border)]">
              <Th>Cabang</Th>
              <Th>Harga Efektif</Th>
              <Th>Override</Th>
              <Th className="text-right pr-4">Aksi</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]">
            {rows.map((r) => {
              const key = toStr(r.id);
              const isSaving = saving === key;
              return (
                <tr key={key} className="hover:bg-black/5 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.code}</span>
                      <span className="text-gray-500">— {r.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="font-medium">{toIDR(r.effective)}</span>
                  </Td>
                  <Td>
                    <input
                      type="number"
                      min={0}
                      step="100"
                      className="input w-40 text-right"
                      defaultValue={r.override?.price ?? ''}
                      placeholder={`Default ${toIDR(Number(defaultPrice))}`}
                      ref={(el) => { inputRefs.current[key] = el; }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError('Harga tidak valid.');
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }
                      }}
                      aria-label={`Harga override untuk cabang ${r.name}`}
                    />
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="btn-primary disabled:opacity-50"
                        disabled={isSaving}
                        onClick={() => {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError('Harga tidak valid.');
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }}
                        aria-label={`Simpan harga cabang ${r.name}`}
                      >
                        {isSaving ? 'Menyimpan…' : 'Simpan'}
                      </button>

                      <button
                        className="btn-outline"
                        onClick={() => {
                          // reset field ke kosong -> berarti pakai default saat berikutnya dihitung server
                          const ref = inputRefs.current[key];
                          if (ref) ref.value = '';
                          setRows((prev) =>
                            prev.map((x) =>
                              toStr(x.id) === key
                                ? { ...x, override: null, effective: Number(defaultPrice) }
                                : x
                            )
                          );
                          setNotice('Override dihapus (kembali ke default). Belum tersimpan ke server.');
                        }}
                        aria-label={`Kosongkan override cabang ${r.name}`}
                      >
                        Reset Field
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-[color:var(--color-border)] text-xs text-gray-500">
        Tip: Tekan <kbd className="px-1 py-0.5 border rounded">Enter</kbd> pada kolom harga untuk menyimpan cepat.
      </div>
    </section>
  );
}

/* ---------- Subcomponents UI ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
