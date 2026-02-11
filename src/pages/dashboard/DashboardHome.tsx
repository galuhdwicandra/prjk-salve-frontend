// src/pages/dashboard/DashboardHome.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { listBranches } from "../../api/branches";
import { getDashboardSummary } from "../../api/dashboard";
import type { Branch } from "../../types/branches";
import type { DashboardSummary, DashboardSummaryMeta } from "../../types/dashboard";
import { toIDR } from "../../utils/money";
import { useAuth, useHasRole } from "../../store/useAuth";

type Meta = DashboardSummaryMeta;

function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function firstDayThisMonth(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-01`;
}

export default function DashboardHome() {
  const me = useAuth.user;
  const isSuperadmin = useHasRole(["Superadmin"]);

  // filter
  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string>(() => {
    if (!isSuperadmin && me?.branch_id) return String(me.branch_id);
    return "";
  });
  const [from, setFrom] = useState<string>(firstDayThisMonth());
  const [to, setTo] = useState<string>(today());

  // data
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const q = useMemo(() => {
    // Superadmin boleh pilih cabang; role lain pakai cabang login
    const out: { from: string; to: string; branch_id?: string | null } = { from, to };
    if (isSuperadmin) {
      if (branchId) out.branch_id = branchId;
    } else {
      if (me?.branch_id) out.branch_id = String(me.branch_id);
    }
    return out;
  }, [from, to, branchId, isSuperadmin, me?.branch_id]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      if (isSuperadmin && branchList.length === 0) {
        const br = await listBranches({ per_page: 100 });
        setBranchList(br.data ?? []);
      }
      const res = await getDashboardSummary(q);
      setData(res.data ?? null);
      setMeta((res.meta as Meta) ?? null);
    } catch (e) {
      setErr("Gagal memuat ringkasan dashboard");
      if (import.meta.env.DEV) console.error("[DashboardHome] load error", e);
    } finally {
      setLoading(false);
    }
  }, [q, isSuperadmin, branchList.length]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[color:var(--color-text-default)]">
            Dashboard
          </h1>
          <p className="text-xs text-gray-600">Ringkasan kinerja & laporan</p>
        </div>

        <div className="text-xs text-gray-500">
          {meta?.from ?? from} — {meta?.to ?? to}
          {meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ""}
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="bg-[var(--color-surface)] border border-[color:var(--color-border)] rounded-xl shadow-elev-1"
        aria-label="Filter ringkas dashboard"
      >
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {isSuperadmin && (
              <label className="grid gap-1 text-sm">
                <span className="text-[color:var(--color-text-default)]">Cabang</span>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="input px-3 py-2 bg-white text-[color:var(--color-text-default)]"
                >
                  <option value="">Semua Cabang</option>
                  {branchList.map((b) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Dari Tanggal</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="input px-3 py-2 bg-white"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Sampai Tanggal</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="input px-3 py-2 bg-white"
              />
            </label>

            <div className={`${isSuperadmin ? "lg:col-span-2" : "lg:col-span-3"} flex items-end gap-2`}>
              <button
                type="button"
                onClick={() => load()}
                className="btn-primary w-full sm:w-auto"
                aria-label="Terapkan filter"
              >
                Terapkan
              </button>
              <button
                type="button"
                onClick={() => {
                  setFrom(firstDayThisMonth());
                  setTo(today());
                }}
                className="btn-outline w-full sm:w-auto"
                aria-label="Reset tanggal"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {err ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      ) : null}

      {/* KPI Cards (mobile: horizontal scroll) */}
      <section aria-busy={loading ? "true" : "false"}>
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} />
          <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} />
          <KpiCard
            title="Voucher Terpakai"
            value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
            loading={loading}
          />
          <KpiCard title="Ongkir" value={toIDR(Number(data?.delivery_shipping_fee ?? 0))} loading={loading} />
          <KpiCard
            title="Piutang Terbuka"
            value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
            loading={loading}
          />
          <KpiCard
            title="Outstanding DP"
            value={`${data?.dp_outstanding_count ?? 0} (${toIDR(Number(data?.dp_outstanding_amount ?? 0))})`}
            loading={loading}
          />
        </div>

        <div className="md:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-1">
            <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} compact />
            <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} compact />
            <KpiCard
              title="Voucher"
              value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
              loading={loading}
              compact
            />
            <KpiCard title="Ongkir" value={toIDR(Number(data?.delivery_shipping_fee ?? 0))} loading={loading} compact />
            <KpiCard
              title="Piutang"
              value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
              loading={loading}
              compact
            />
            <KpiCard
              title="DP"
              value={`${data?.dp_outstanding_count ?? 0} (${toIDR(Number(data?.dp_outstanding_amount ?? 0))})`}
              loading={loading}
              compact
            />
          </div>
        </div>
      </section>

      {/* Top Layanan */}
      <section className="space-y-2">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">Top Layanan</h2>
          <span className="text-xs text-gray-500">Top layanan berdasarkan pendapatan</span>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[560px] w-full text-sm">
              <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Layanan</Th>
                  <Th className="text-right">Qty</Th>
                  <Th className="text-right">Pendapatan</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading ? (
                  <RowSkeleton colSpan={3} />
                ) : (data?.top_services?.length ?? 0) === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  (data?.top_services ?? []).map((r) => (
                    <tr key={`${r.service_id}-${r.name}`} className="hover:bg-black/5 transition-colors">
                      <Td className="font-medium">{r.name}</Td>
                      <Td className="text-right tabular-nums">{r.qty}</Td>
                      <Td className="text-right tabular-nums">{toIDR(Number(r.amount))}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Omzet harian & bulanan */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SimpleTable
          title="Omzet Harian"
          subtitle="Ringkasan omzet per tanggal"
          cols={[
            { label: "Tanggal", align: "left" },
            { label: "Omzet", align: "right" },
          ]}
          loading={loading}
          empty={(data?.omzet_daily?.length ?? 0) === 0}
        >
          {(data?.omzet_daily ?? []).map((d) => (
            <tr key={d.date} className="hover:bg-black/5 transition-colors">
              <Td className="tabular-nums">{d.date}</Td>
              <Td className="text-right tabular-nums">{toIDR(Number(d.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>

        <SimpleTable
          title="Omzet Bulanan"
          subtitle="Ringkasan omzet per bulan"
          cols={[
            { label: "Bulan", align: "left" },
            { label: "Omzet", align: "right" },
          ]}
          loading={loading}
          empty={(data?.omzet_monthly?.length ?? 0) === 0}
        >
          {(data?.omzet_monthly ?? []).map((m) => (
            <tr key={m.month} className="hover:bg-black/5 transition-colors">
              <Td className="tabular-nums">{m.month}</Td>
              <Td className="text-right tabular-nums">{toIDR(Number(m.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>
      </section>

      {/* Meta (bottom) */}
      <footer className="text-xs text-gray-500">
        Rentang data: {meta?.from ?? from} s.d. {meta?.to ?? to}
        {meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ""}
      </footer>
    </div>
  );
}

/* ------------------------
   Subcomponents (UI only)
------------------------ */

function KpiCard(props: { title: string; value: string; loading?: boolean; compact?: boolean }) {
  return (
    <div
      className={[
        "bg-[var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1",
        props.compact ? "p-3 w-[240px] shrink-0" : "p-3",
      ].join(" ")}
    >
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{props.title}</div>
      <div className="mt-1 text-lg font-semibold min-h-[28px] text-[color:var(--color-text-default)]">
        {props.loading ? <span className="inline-block h-5 w-24 rounded bg-black/10 animate-pulse" /> : props.value}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function RowSkeleton({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-4">
        <div className="flex items-center justify-center gap-3">
          <span className="h-4 w-4 rounded-full bg-black/10 animate-pulse" />
          <span className="h-4 w-40 rounded bg-black/10 animate-pulse" />
          <span className="h-4 w-24 rounded bg-black/10 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

function SimpleTable(props: {
  title: string;
  subtitle?: string;
  cols: { label: string; align?: "left" | "right" }[];
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">{props.title}</h2>
          {props.subtitle ? <p className="text-xs text-gray-500">{props.subtitle}</p> : null}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[420px] w-full text-sm">
            <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
              <tr className="divide-x divide-[color:var(--color-border)]">
                {props.cols.map((c) => (
                  <Th key={c.label} className={c.align === "right" ? "text-right" : "text-left"}>
                    {c.label}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-border)]">
              {props.loading ? (
                <RowSkeleton colSpan={props.cols.length} />
              ) : props.empty ? (
                <tr>
                  <td colSpan={props.cols.length} className="px-3 py-4 text-center text-gray-500">
                    Belum ada data
                  </td>
                </tr>
              ) : (
                props.children
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
