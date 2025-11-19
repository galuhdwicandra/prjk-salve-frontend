// src/pages/dashboard/DashboardHome.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listBranches } from '../../api/branches';
import { getDashboardSummary } from '../../api/dashboard';
import type { Branch } from '../../types/branches';
import type { DashboardSummary, DashboardSummaryMeta } from '../../types/dashboard';
import { toIDR } from '../../utils/money';
import { useAuth, useHasRole } from '../../store/useAuth';

type Meta = DashboardSummaryMeta;

function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function firstDayThisMonth(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-01`;
}

export default function DashboardHome() {
  const me = useAuth.user;
  const isSuperadmin = useHasRole(['Superadmin']);

  // filter
  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string>(() => {
    if (!isSuperadmin && me?.branch_id) return String(me.branch_id);
    return '';
  });
  const [from, setFrom] = useState<string>(firstDayThisMonth());
  const [to, setTo] = useState<string>(today());

  // data
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');

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
    setErr('');
    try {
      if (isSuperadmin && branchList.length === 0) {
        const br = await listBranches({ per_page: 100 });
        setBranchList(br.data ?? []);
      }
      const res = await getDashboardSummary(q);
      setData(res.data ?? null);
      setMeta((res.meta as Meta) ?? null);
    } catch (e) {
      setErr('Gagal memuat ringkasan dashboard');
      if (import.meta.env.DEV) console.error('[DashboardHome] load error', e);
    } finally {
      setLoading(false);
    }
  }, [q, isSuperadmin, branchList.length]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          <p className="text-xs text-gray-600">Ringkasan kinerja & laporan</p>
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="card bg-[var(--color-surface)] border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter ringkas dashboard"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3">
          {isSuperadmin && (
            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Cabang</span>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="input px-2 py-2 bg-white text-[color:var(--color-text-default)]"
              >
                <option value="">Semua Cabang</option>
                {branchList.map(b => (
                  <option key={b.id} value={String(b.id)}>{b.name}</option>
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
              className="input px-2 py-2 bg-white"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Sampai Tanggal</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="input px-2 py-2 bg-white"
            />
          </label>

          <div className="flex items-end gap-2 md:col-span-2">
            <button
              type="button"
              onClick={() => load()}
              className="btn-primary"
              aria-label="Terapkan filter"
            >
              Terapkan
            </button>
            <button
              type="button"
              onClick={() => { setFrom(firstDayThisMonth()); setTo(today()); }}
              className="btn-outline"
              aria-label="Reset tanggal"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {err ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      ) : null}

      {/* KPI Cards */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3"
        aria-busy={loading ? 'true' : 'false'}
      >
        <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} />
        <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} />
        <KpiCard
          title="Voucher Terpakai"
          value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
          loading={loading}
        />
        <KpiCard
          title="Ongkir"
          value={toIDR(Number(data?.delivery_shipping_fee ?? 0))}
          loading={loading}
        />
        <KpiCard
          title="Piutang Terbuka"
          value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
          loading={loading}
        />
      </section>

      {/* Top Layanan */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Top Layanan</h2>
        <div className="card bg-[var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
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
                  <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">Belum ada data</td></tr>
                ) : (
                  (data?.top_services ?? []).map((r) => (
                    <tr
                      key={`${r.service_id}-${r.name}`}
                      className="hover:bg-black/5 transition-colors"
                    >
                      <Td>{r.name}</Td>
                      <Td className="text-right">{r.qty}</Td>
                      <Td className="text-right">{toIDR(Number(r.amount))}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Omzet harian & bulanan */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SimpleTable
          title="Omzet Harian"
          cols={[
            { label: 'Tanggal', align: 'left' },
            { label: 'Omzet', align: 'right' },
          ]}
          loading={loading}
          empty={(data?.omzet_daily?.length ?? 0) === 0}
        >
          {(data?.omzet_daily ?? []).map((d) => (
            <tr key={d.date} className="hover:bg-black/5 transition-colors">
              <Td>{d.date}</Td>
              <Td className="text-right">{toIDR(Number(d.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>

        <SimpleTable
          title="Omzet Bulanan"
          cols={[
            { label: 'Bulan', align: 'left' },
            { label: 'Omzet', align: 'right' },
          ]}
          loading={loading}
          empty={(data?.omzet_monthly?.length ?? 0) === 0}
        >
          {(data?.omzet_monthly ?? []).map((m) => (
            <tr key={m.month} className="hover:bg-black/5 transition-colors">
              <Td>{m.month}</Td>
              <Td className="text-right">{toIDR(Number(m.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>
      </section>

      {/* Meta */}
      <footer className="text-xs text-gray-500">
        Rentang data: {meta?.from ?? from} s.d. {meta?.to ?? to}
        {meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ''}
      </footer>
    </div>
  );
}

/* ------------------------
   Subcomponents (UI)
------------------------ */

function KpiCard(props: { title: string; value: string; loading?: boolean }) {
  return (
    <div className="card bg-[var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3">
      <div className="text-xs text-gray-600">{props.title}</div>
      <div className="mt-1 text-lg font-semibold min-h-[28px]">
        {props.loading ? (
          <span className="inline-block h-5 w-24 rounded bg-black/10 animate-pulse" />
        ) : (
          props.value
        )}
      </div>
    </div>
  );
}

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
  cols: { label: string; align?: 'left' | 'right' }[];
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">{props.title}</h2>
      <div className="card bg-[var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[380px] w-full text-sm">
            <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
              <tr className="divide-x divide-[color:var(--color-border)]">
                {props.cols.map((c) => (
                  <Th key={c.label} className={c.align === 'right' ? 'text-right' : 'text-left'}>
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
