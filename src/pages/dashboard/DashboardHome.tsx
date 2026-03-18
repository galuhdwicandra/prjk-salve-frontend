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

  const rangeText = `${meta?.from ?? from} — ${meta?.to ?? to}${meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ""}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="relative overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-elev-1">
        {/* Decorative gradient (UI only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(900px 240px at 10% 0%, rgba(79,70,229,0.16) 0%, rgba(79,70,229,0.00) 60%)," +
              "radial-gradient(680px 220px at 92% 10%, rgba(6,182,212,0.10) 0%, rgba(6,182,212,0.00) 55%)",
          }}
        />
        <div className="relative p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[color:var(--color-text-default)]">
                Dashboard
              </h1>
              <p className="text-xs text-[color:var(--color-text-muted)]">Ringkasan kinerja & laporan</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="chip border border-[color:var(--color-border)] bg-white/60 dark:bg-white/5 text-[color:var(--color-text-default)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-primary)]" />
                <span className="tabular-nums text-[11px]">{rangeText}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl shadow-elev-1"
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
                  className="input px-3 py-2 bg-[color:var(--color-surface)] text-[color:var(--color-text-default)]"
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
                className="input px-3 py-2 bg-[color:var(--color-surface)]"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Sampai Tanggal</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="input px-3 py-2 bg-[color:var(--color-surface)]"
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
          className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2 shadow-elev-1"
        >
          {err}
        </div>
      ) : null}

      {/* KPI Cards (mobile: horizontal scroll) */}
      <section aria-busy={loading ? "true" : "false"} className="space-y-2">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">Ringkasan</h2>
          <span className="text-xs text-[color:var(--color-text-muted)]">KPI utama pada rentang terpilih</span>
        </div>

        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} tone="brand" />
          <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} tone="neutral" />
          <KpiCard
            title="Voucher Terpakai"
            value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
            loading={loading}
            tone="accent"
          />
          <KpiCard title="Ongkir" value={toIDR(Number(data?.delivery_shipping_fee ?? 0))} loading={loading} tone="accent2" />
          <KpiCard
            title="Piutang Terbuka"
            value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
            loading={loading}
            tone="warning"
          />
          <KpiCard
            title="Outstanding DP"
            value={`${data?.dp_outstanding_count ?? 0} (${toIDR(Number(data?.dp_outstanding_amount ?? 0))})`}
            loading={loading}
            tone="warning2"
          />
        </div>

        <div className="md:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-1">
            <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} compact tone="brand" />
            <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} compact tone="neutral" />
            <KpiCard
              title="Voucher"
              value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
              loading={loading}
              compact
              tone="accent"
            />
            <KpiCard
              title="Ongkir"
              value={toIDR(Number(data?.delivery_shipping_fee ?? 0))}
              loading={loading}
              compact
              tone="accent2"
            />
            <KpiCard
              title="Piutang"
              value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
              loading={loading}
              compact
              tone="warning"
            />
            <KpiCard
              title="DP"
              value={`${data?.dp_outstanding_count ?? 0} (${toIDR(Number(data?.dp_outstanding_amount ?? 0))})`}
              loading={loading}
              compact
              tone="warning2"
            />
          </div>
        </div>
      </section>

      {/* Top Layanan */}
      <section className="space-y-2">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">Top Layanan</h2>
          <span className="text-xs text-[color:var(--color-text-muted)]">Top layanan berdasarkan pendapatan</span>
        </div>

        <CardTable>
          <table className="min-w-[560px] w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="divide-x divide-[color:var(--color-border)] bg-[rgba(79,70,229,0.10)]">
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
                  <td colSpan={3} className="px-3 py-4 text-center text-[color:var(--color-text-muted)]">
                    Belum ada data
                  </td>
                </tr>
              ) : (
                (data?.top_services ?? []).map((r) => (
                  <tr
                    key={`${r.service_id}-${r.name}`}
                    className="transition-colors hover:bg-[rgba(15,23,42,0.04)] dark:hover:bg-white/5"
                  >
                    <Td className="font-medium">{r.name}</Td>
                    <Td className="text-right tabular-nums">{r.qty}</Td>
                    <Td className="text-right tabular-nums">{toIDR(Number(r.amount))}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardTable>
      </section>

      {/* Ringkasan Pembayaran */}
      <section aria-busy={loading ? "true" : "false"} className="space-y-2">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">
            Ringkasan Pembayaran
          </h2>
          <span className="text-xs text-[color:var(--color-text-muted)]">
            Breakdown metode bayar dan status order
          </span>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-3">
          <PaymentCard
            title="DP Masuk"
            value={toIDR(Number(data?.payment_method_totals?.dp_amount ?? 0))}
            subtitle={`Order DP: ${data?.payment_status_totals?.dp_count ?? 0}`}
            tone="dp"
            loading={loading}
          />
          <PaymentCard
            title="Cash"
            value={toIDR(Number(data?.payment_method_totals?.cash_amount ?? 0))}
            subtitle="Pembayaran tunai"
            tone="cash"
            loading={loading}
          />
          <PaymentCard
            title="Transfer"
            value={toIDR(Number(data?.payment_method_totals?.transfer_amount ?? 0))}
            subtitle="Pembayaran transfer"
            tone="transfer"
            loading={loading}
          />
          <PaymentCard
            title="QRIS"
            value={toIDR(Number(data?.payment_method_totals?.qris_amount ?? 0))}
            subtitle="Pembayaran QRIS"
            tone="qris"
            loading={loading}
          />
          <PaymentCard
            title="Pending"
            value={toIDR(Number(data?.payment_status_totals?.pending_amount ?? 0))}
            subtitle={`Order pending: ${data?.payment_status_totals?.pending_count ?? 0}`}
            tone="pending"
            loading={loading}
          />
        </div>

        <div className="md:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-1">
            <PaymentCard
              title="DP Masuk"
              value={toIDR(Number(data?.payment_method_totals?.dp_amount ?? 0))}
              subtitle={`Order DP: ${data?.payment_status_totals?.dp_count ?? 0}`}
              tone="dp"
              loading={loading}
              compact
            />
            <PaymentCard
              title="Cash"
              value={toIDR(Number(data?.payment_method_totals?.cash_amount ?? 0))}
              subtitle="Pembayaran tunai"
              tone="cash"
              loading={loading}
              compact
            />
            <PaymentCard
              title="Transfer"
              value={toIDR(Number(data?.payment_method_totals?.transfer_amount ?? 0))}
              subtitle="Pembayaran transfer"
              tone="transfer"
              loading={loading}
              compact
            />
            <PaymentCard
              title="QRIS"
              value={toIDR(Number(data?.payment_method_totals?.qris_amount ?? 0))}
              subtitle="Pembayaran QRIS"
              tone="qris"
              loading={loading}
              compact
            />
            <PaymentCard
              title="Pending"
              value={toIDR(Number(data?.payment_status_totals?.pending_amount ?? 0))}
              subtitle={`Order pending: ${data?.payment_status_totals?.pending_count ?? 0}`}
              tone="pending"
              loading={loading}
              compact
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 p-3">
            <div className="text-[11px] uppercase tracking-wide text-[color:var(--color-text-muted)]">
              Status Order Pembayaran
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-300">Pending</div>
                <div className="mt-1 text-lg font-semibold text-[color:var(--color-text-default)]">
                  {loading ? (
                    <span className="inline-block h-5 w-12 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                  ) : (
                    data?.payment_status_totals?.pending_count ?? 0
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-3">
                <div className="text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-300">DP</div>
                <div className="mt-1 text-lg font-semibold text-[color:var(--color-text-default)]">
                  {loading ? (
                    <span className="inline-block h-5 w-12 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                  ) : (
                    data?.payment_status_totals?.dp_count ?? 0
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-3">
                <div className="text-[11px] uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Paid</div>
                <div className="mt-1 text-lg font-semibold text-[color:var(--color-text-default)]">
                  {loading ? (
                    <span className="inline-block h-5 w-12 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                  ) : (
                    data?.payment_status_totals?.paid_count ?? 0
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 p-3">
            <div className="text-[11px] uppercase tracking-wide text-[color:var(--color-text-muted)]">
              Sisa Tagihan DP
            </div>
            <div className="mt-2 text-xl font-semibold text-[color:var(--color-text-default)]">
              {loading ? (
                <span className="inline-block h-6 w-32 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
              ) : (
                toIDR(Number(data?.payment_status_totals?.dp_due_amount ?? 0))
              )}
            </div>
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
              Total sisa pembayaran dari order yang masih berstatus DP
            </p>
          </div>

          {/* <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 p-3">
            <div className="text-[11px] uppercase tracking-wide text-[color:var(--color-text-muted)]">
              Keterangan
            </div>
            <div className="mt-2 space-y-1 text-xs text-[color:var(--color-text-muted)] leading-relaxed">
              <p>DP, Cash, Transfer, dan QRIS diambil dari data pembayaran yang benar-benar masuk.</p>
              <p>Pending, DP, dan Paid diambil dari status pembayaran order.</p>
              <p>Pemisahan ini membuat dashboard lebih jelas antara uang masuk dan status transaksi.</p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Omzet harian & bulanan */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SimpleTable
          title="Omzet Harian"
          subtitle="Ringkasan omzet per tanggal"
          headTone="brand"
          cols={[
            { label: "Tanggal", align: "left" },
            { label: "Omzet", align: "right" },
          ]}
          loading={loading}
          empty={(data?.omzet_daily?.length ?? 0) === 0}
        >
          {(data?.omzet_daily ?? []).map((d) => (
            <tr
              key={d.date}
              className="transition-colors hover:bg-[rgba(15,23,42,0.04)] dark:hover:bg-white/5"
            >
              <Td className="tabular-nums">{d.date}</Td>
              <Td className="text-right tabular-nums">{toIDR(Number(d.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>

        <SimpleTable
          title="Omzet Bulanan"
          subtitle="Ringkasan omzet per bulan"
          headTone="accent"
          cols={[
            { label: "Bulan", align: "left" },
            { label: "Omzet", align: "right" },
          ]}
          loading={loading}
          empty={(data?.omzet_monthly?.length ?? 0) === 0}
        >
          {(data?.omzet_monthly ?? []).map((m) => (
            <tr
              key={m.month}
              className="transition-colors hover:bg-[rgba(15,23,42,0.04)] dark:hover:bg-white/5"
            >
              <Td className="tabular-nums">{m.month}</Td>
              <Td className="text-right tabular-nums">{toIDR(Number(m.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>
      </section>

      {/* Meta (bottom) */}
      <footer className="text-xs text-[color:var(--color-text-muted)]">
        Rentang data: {meta?.from ?? from} s.d. {meta?.to ?? to}
        {meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ""}
      </footer>
    </div>
  );
}

/* ------------------------
   Subcomponents (UI only)
------------------------ */

function CardTable(props: { children: React.ReactNode }) {
  return (
    <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
      <div className="overflow-auto">{props.children}</div>
    </div>
  );
}

type PaymentTone = "dp" | "cash" | "transfer" | "qris" | "pending";

function PaymentCard(props: {
  title: string;
  value: string;
  subtitle?: string;
  loading?: boolean;
  compact?: boolean;
  tone?: PaymentTone;
}) {
  const tone = props.tone ?? "cash";

  const accentStyle: Record<PaymentTone, string> = {
    dp: "bg-[rgba(245,158,11,0.95)]",
    cash: "bg-[rgba(16,185,129,0.95)]",
    transfer: "bg-[rgba(139,92,246,0.95)]",
    qris: "bg-[rgba(14,165,233,0.95)]",
    pending: "bg-[rgba(244,63,94,0.90)]",
  };

  const tintStyle: Record<PaymentTone, string> = {
    dp: "radial-gradient(420px 220px at 20% 0%, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.00) 60%)",
    cash: "radial-gradient(420px 220px at 20% 0%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.00) 60%)",
    transfer: "radial-gradient(420px 220px at 20% 0%, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.00) 60%)",
    qris: "radial-gradient(420px 220px at 20% 0%, rgba(14,165,233,0.12) 0%, rgba(14,165,233,0.00) 60%)",
    pending: "radial-gradient(420px 220px at 20% 0%, rgba(244,63,94,0.12) 0%, rgba(244,63,94,0.00) 60%)",
  };

  return (
    <div
      className={[
        "relative overflow-hidden bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1",
        "transition-transform duration-150 hover:-translate-y-[1px]",
        props.compact ? "p-3 w-[240px] shrink-0" : "p-3",
      ].join(" ")}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${accentStyle[tone]}`} aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{ background: tintStyle[tone] }}
      />

      <div className="relative">
        <div className="text-[11px] uppercase tracking-wide text-[color:var(--color-text-muted)]">
          {props.title}
        </div>

        <div className="mt-1 text-lg font-semibold min-h-[28px] text-[color:var(--color-text-default)]">
          {props.loading ? (
            <span className="inline-block h-5 w-24 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
          ) : (
            props.value
          )}
        </div>

        {props.subtitle ? (
          <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">
            {props.subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type KpiTone = "brand" | "neutral" | "accent" | "accent2" | "warning" | "warning2";

function KpiCard(props: { title: string; value: string; loading?: boolean; compact?: boolean; tone?: KpiTone }) {
  const tone = props.tone ?? "neutral";

  const accentStyle: Record<KpiTone, string> = {
    brand: "bg-[color:var(--color-brand-primary)]",
    neutral: "bg-black/10 dark:bg-white/15",
    accent: "bg-[color:var(--color-accent)]",
    accent2: "bg-[rgba(59,130,246,0.90)]", // blue-ish
    warning: "bg-[rgba(245,158,11,0.95)]", // amber-ish
    warning2: "bg-[rgba(244,63,94,0.90)]", // rose-ish
  };

  return (
    <div
      className={[
        "relative overflow-hidden bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1",
        "transition-transform duration-150 hover:-translate-y-[1px]",
        props.compact ? "p-3 w-[240px] shrink-0" : "p-3",
      ].join(" ")}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${accentStyle[tone]}`} aria-hidden="true" />
      {/* Subtle tint */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            tone === "brand"
              ? "radial-gradient(420px 220px at 20% 0%, rgba(79,70,229,0.12) 0%, rgba(79,70,229,0.00) 60%)"
              : tone === "accent"
                ? "radial-gradient(420px 220px at 20% 0%, rgba(6,182,212,0.10) 0%, rgba(6,182,212,0.00) 60%)"
                : "radial-gradient(420px 220px at 20% 0%, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.00) 60%)",
        }}
      />

      <div className="relative">
        <div className="text-[11px] uppercase tracking-wide text-[color:var(--color-text-muted)]">{props.title}</div>
        <div className="mt-1 text-lg font-semibold min-h-[28px] text-[color:var(--color-text-default)]">
          {props.loading ? <span className="inline-block h-5 w-24 rounded bg-black/10 dark:bg-white/10 animate-pulse" /> : props.value}
        </div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-default)] ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-[color:var(--color-text-default)] ${className}`}>{children}</td>;
}
function RowSkeleton({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-4">
        <div className="flex items-center justify-center gap-3">
          <span className="h-4 w-4 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
          <span className="h-4 w-40 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
          <span className="h-4 w-24 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
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
  headTone?: "brand" | "accent" | "neutral";
}) {
  const headTone = props.headTone ?? "neutral";
  const headBg =
    headTone === "brand"
      ? "bg-[rgba(79,70,229,0.10)]"
      : headTone === "accent"
        ? "bg-[rgba(6,182,212,0.10)]"
        : "bg-black/5 dark:bg-white/5";

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">{props.title}</h2>
          {props.subtitle ? <p className="text-xs text-[color:var(--color-text-muted)]">{props.subtitle}</p> : null}
        </div>
      </div>

      <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[420px] w-full text-sm">
            <thead className={`sticky top-0 z-10 ${headBg}`}>
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
                  <td colSpan={props.cols.length} className="px-3 py-4 text-center text-[color:var(--color-text-muted)]">
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
