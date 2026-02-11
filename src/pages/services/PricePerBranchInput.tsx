// src/pages/services/PricePerBranchInput.tsx
import { useEffect, useRef, useState } from "react";
import type { Branch } from "../../types/branches";
import type { ServicePrice, ServicePriceSetPayload } from "../../types/services";
import { listBranches } from "../../api/branches";
import { listServicePricesByService, setServicePrice } from "../../api/servicePrices";

interface Props {
  serviceId: string;
  defaultPrice: number;
}
type Row = Branch & { override?: ServicePrice | null; effective: number };

function toStr(x: unknown) {
  return x == null ? "" : String(x);
}
function toNum(x: unknown, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}
function toIDR(n: number) {
  return n.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
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
      try {
        const branchesRes = await listBranches({ per_page: 100 });
        const branchesRaw: unknown = branchesRes?.data ?? branchesRes;
        const branches: Branch[] = Array.isArray(branchesRaw) ? branchesRaw : [];

        const overridesRes = await listServicePricesByService(serviceId);
        const overridesData: unknown = overridesRes?.data ?? overridesRes;
        const overrides: ServicePrice[] = Array.isArray(overridesData) ? overridesData : [];

        const map = new Map<string, ServicePrice>(
          overrides.map((p) => [toStr(p.branch_id), p])
        );

        const merged: Row[] = branches.map((b) => {
          const key = toStr(b.id);
          const ov = map.get(key) ?? null;
          const eff = ov ? toNum(ov.price, Number(defaultPrice)) : Number(defaultPrice);
          return { ...b, override: ov, effective: eff };
        });

        setRows(merged);
      } catch {
        setError("Gagal memuat harga per cabang.");
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId, defaultPrice]);

  async function onSaveOne(branch_id_raw: string | number, price_raw: number) {
    const branch_id = toStr(branch_id_raw);
    const price = toNum(price_raw);

    if (!Number.isFinite(price) || price <= 0) {
      setNotice(null);
      setError("Harga tidak valid.");
      return;
    }

    const payload: ServicePriceSetPayload = { service_id: serviceId, branch_id, price };

    try {
      setSaving(branch_id);
      setError(null);
      setNotice(null);

      const res = await setServicePrice(payload);
      const updated: ServicePrice = (res && (res as any).data ? (res as any).data : res) as ServicePrice;

      if (updated?.id) {
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

      setNotice("Harga cabang diperbarui.");
    } catch {
      setError("Gagal menyimpan harga cabang.");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          Memuat harga cabang…
        </div>
      </div>
    );
  }

  if (error && !rows.length) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Belum ada cabang.
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(0,0,0,.35)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Harga Per Cabang
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Atur harga override untuk setiap cabang.
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <div className="text-xs text-slate-500">Default Price</div>
          <div className="font-semibold text-slate-900">
            {toIDR(Number(defaultPrice))}
          </div>
        </div>
      </div>

      {notice && (
        <div className="mx-6 mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white sticky top-0 border-b border-slate-200">
            <tr>
              <Th>Cabang</Th>
              <Th className="text-right">Harga Efektif</Th>
              <Th className="text-right">Override</Th>
              <Th className="text-right pr-6">Aksi</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r, idx) => {
              const key = toStr(r.id);
              const isSaving = saving === key;

              return (
                <tr
                  key={key}
                  className={[
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                    "hover:bg-slate-100/60 transition-colors",
                  ].join(" ")}
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700">
                        {r.code}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {r.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Branch ID: {r.id}
                        </div>
                      </div>
                    </div>
                  </Td>

                  <Td className="text-right font-semibold text-slate-900">
                    {toIDR(r.effective)}
                  </Td>

                  <Td className="text-right">
                    <input
                      type="number"
                      min={0}
                      step="100"
                      className="
                        w-44 rounded-md border border-slate-200 bg-white
                        px-3 py-2 text-right text-sm text-slate-900
                        placeholder:text-slate-400
                        focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200
                      "
                      defaultValue={r.override?.price ?? ""}
                      placeholder={`Default ${toIDR(Number(defaultPrice))}`}
                      ref={(el) => { inputRefs.current[key] = el; }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError("Harga tidak valid.");
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }
                      }}
                    />
                  </Td>

                  <Td className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button
                        className="
                          inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white
                          hover:bg-slate-800 disabled:opacity-50
                        "
                        disabled={isSaving}
                        onClick={() => {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError("Harga tidak valid.");
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }}
                      >
                        {isSaving ? "Menyimpan…" : "Simpan"}
                      </button>

                      <button
                        className="
                          inline-flex items-center rounded-md border border-slate-200 bg-white
                          px-3 py-2 text-xs font-semibold text-slate-700
                          hover:bg-slate-50
                        "
                        onClick={() => {
                          const ref = inputRefs.current[key];
                          if (ref) ref.value = "";
                          setRows((prev) =>
                            prev.map((x) =>
                              toStr(x.id) === key
                                ? { ...x, override: null, effective: Number(defaultPrice) }
                                : x
                            )
                          );
                          setNotice("Override dihapus (kembali ke default). Belum tersimpan ke server.");
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
        Tekan <kbd className="rounded border px-1 py-0.5">Enter</kbd> pada kolom harga untuk menyimpan cepat.
      </div>
    </section>
  );
}

/* Subcomponents */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>;
}
