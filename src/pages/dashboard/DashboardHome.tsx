import { useCallback, useEffect, useMemo, useState } from "react";
import { listBranches } from "../../api/branches";
import { getDashboardSummary } from "../../api/dashboard";
import { fetchAllReportRows } from "../../api/reports";
import type { Branch } from "../../types/branches";
import type { CashflowPoint, DashboardSummary, DashboardSummaryMeta } from "../../types/dashboard";
import { downloadXlsx, printPdf } from "../../utils/export-table";
import { ORDER_EXPORT_COLUMNS, reportColumnLabel } from "../../utils/report-columns";
import { toIDR } from "../../utils/money";
import { useAuth } from "../../store/useAuth";

type Gran = "harian" | "mingguan" | "bulanan" | "tahunan";
type Bucket = { key: string; label: string; cashIn: number; cashOut: number; net: number };
type Slice = { label: string; value: number; color: string };

const MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const PALETTE = ["#2563EB", "#0A2A66", "#F5A02D", "#16A34A", "#7C3AED", "#0891B2", "#DC2626"];
const EMPTY_RANGE = "Tidak ada data pada rentang ini.";

function ymd(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function today(): string {
  return ymd(new Date());
}

function firstDayThisMonth(): string {
  const now = new Date();
  return ymd(new Date(now.getFullYear(), now.getMonth(), 1));
}

function parseYmd(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function bucketOf(date: string, gran: Gran): { key: string; label: string } {
  const parsed = parseYmd(date);

  if (gran === "tahunan") {
    const key = String(parsed.getFullYear());
    return { key, label: key };
  }

  if (gran === "bulanan") {
    return {
      key: date.slice(0, 7),
      label: `${MON_SHORT[parsed.getMonth()]} '${String(parsed.getFullYear()).slice(2)}`,
    };
  }

  if (gran === "mingguan") {
    const start = new Date(parsed);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return { key: ymd(start), label: `${start.getDate()} ${MON_SHORT[start.getMonth()]}` };
  }

  return { key: date, label: `${parsed.getDate()} ${MON_SHORT[parsed.getMonth()]}` };
}

function toBuckets(points: CashflowPoint[], gran: Gran): Bucket[] {
  const map = new Map<string, Bucket>();

  points.forEach((point) => {
    const { key, label } = bucketOf(point.date, gran);
    const current = map.get(key) ?? { key, label, cashIn: 0, cashOut: 0, net: 0 };

    current.cashIn += Number(point.cash_in);
    current.cashOut += Number(point.cash_out);
    current.net = current.cashIn - current.cashOut;
    map.set(key, current);
  });

  return [...map.values()].sort((a, b) => (a.key < b.key ? -1 : 1));
}

function decimal(value: number): string {
  return Number(value).toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

export default function DashboardHome() {
  const me = useAuth.user;
  const canPickBranch = (me?.branches.length ?? 0) > 1;

  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string>(() =>
    !canPickBranch && me?.branch_id ? String(me.branch_id) : "",
  );
  const [from, setFrom] = useState<string>(firstDayThisMonth());
  const [to, setTo] = useState<string>(today());
  const [gran, setGran] = useState<Gran>("harian");

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [meta, setMeta] = useState<DashboardSummaryMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const query = useMemo(() => {
    const effective = canPickBranch ? branchId : String(me?.branch_id ?? "");
    return { from, to, branch_id: effective || null };
  }, [from, to, branchId, canPickBranch, me?.branch_id]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      if (canPickBranch && branchList.length === 0) {
        const branches = await listBranches({ per_page: 100 });
        setBranchList(branches.data ?? []);
      }
      const res = await getDashboardSummary(query);
      setData(res.data ?? null);
      setMeta((res.meta as DashboardSummaryMeta) ?? null);
    } catch (e) {
      setErr("Gagal memuat ringkasan dashboard.");
      if (import.meta.env.DEV) console.error("[DashboardHome] load error", e);
    } finally {
      setLoading(false);
    }
  }, [query, canPickBranch, branchList.length]);

  useEffect(() => {
    load();
  }, [load]);

  const buckets = useMemo(() => toBuckets(data?.cashflow_daily ?? [], gran), [data, gran]);

  const outletSlices = useMemo<Slice[]>(
    () =>
      (data?.revenue_by_branch ?? []).map((row, index) => ({
        label: `${row.code} \u00B7 ${row.name}`,
        value: Number(row.amount),
        color: PALETTE[index % PALETTE.length],
      })),
    [data],
  );

  const repeatSlices = useMemo<Slice[]>(
    () => [
      { label: "Baru", value: Number(data?.customers_new ?? 0), color: "#2563EB" },
      { label: "Kembali", value: Number(data?.customers_returning ?? 0), color: "#F5A02D" },
    ],
    [data],
  );

  const mix = data?.category_mix ?? [];
  const mixTotal = mix.reduce((sum, row) => sum + Number(row.amount), 0);

  async function runExport(format: "xlsx" | "pdf") {
    setExporting(true);
    setErr("");
    try {
      const rows = await fetchAllReportRows("orders", query);
      const live = rows.filter((row) => row.order_status !== "CANCELED");

      if (live.length === 0) {
        setErr("Tidak ada data untuk diekspor.");
        return;
      }

      const aoa: unknown[][] = [
        ORDER_EXPORT_COLUMNS.map(reportColumnLabel),
        ...live.map((row) => ORDER_EXPORT_COLUMNS.map((column) => row[column] ?? "")),
      ];
      const subtitle = `Periode ${from} s.d. ${to}`;
      const name = `salve-dashboard-order-${today()}`;

      if (format === "xlsx") {
        downloadXlsx(`${name}.xlsx`, "Laporan Order", aoa);
      } else if (!printPdf("Laporan Order", subtitle, aoa)) {
        setErr("Popup diblokir browser. Izinkan popup untuk export PDF.");
      }
    } catch (e) {
      setErr("Gagal mengunduh file export.");
      if (import.meta.env.DEV) console.error("[DashboardHome] export error", e);
    } finally {
      setExporting(false);
      setExportOpen(false);
    }
  }

  return (
    <div className="card">
      <div className="filters">
        <div className="f">
          <label htmlFor="dashFrom">Dari Tanggal</label>
          <input id="dashFrom" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
        </div>

        <div className="f">
          <label htmlFor="dashTo">Sampai Tanggal</label>
          <input id="dashTo" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
        </div>

        {canPickBranch ? (
          <div className="f">
            <label htmlFor="dashBranch">Outlet</label>
            <select id="dashBranch" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              <option value="">Semua Outlet</option>
              {branchList.map((branch) => (
                <option key={branch.id} value={String(branch.id)}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="f">
          <label htmlFor="dashGran">Grafik</label>
          <select id="dashGran" value={gran} onChange={(e) => setGran(e.target.value as Gran)}>
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
          </select>
        </div>

        <div className="f auto">
          <label>{"\u00A0"}</label>
          <button
            type="button"
            className="btn sm hide-mobile"
            onClick={() => setExportOpen(true)}
            disabled={loading || exporting}
          >
            Export
          </button>
        </div>
      </div>

      {err ? (
        <div className="login-err" role="alert">
          {err}{" "}
          <button type="button" className="btn ghost sm" onClick={() => load()} disabled={loading}>
            Coba lagi
          </button>
        </div>
      ) : null}

      {loading ? <div className="empty">Memuat data dashboard...</div> : null}

      <div className="stats">
        <StatCard k="Pendapatan Diakui" v={toIDR(Number(data?.revenue_recognized ?? 0))} s="pekerjaan selesai" />
        <StatCard k="Diterima di Muka" v={toIDR(Number(data?.unearned_revenue ?? 0))} s="dibayar, belum selesai" />
        <StatCard k="Pasang" v={decimal(Number(data?.pairs ?? 0))} s="total pasang" />
        <StatCard k="ATV / Pasang" v={toIDR(Number(data?.atv_per_pair ?? 0))} s="dari yg selesai" />
        <StatCard k="Outstanding" v={toIDR(Number(data?.outstanding ?? 0))} s="belum tertagih" />
      </div>

      <div style={{ margin: "6px 0 20px" }}>
        <label style={{ marginBottom: 8 }}>
          Arus Kas &mdash; Cash In (atas) / Cash Out (bawah) / Net (garis)
        </label>
        <CashflowChart buckets={buckets} />
      </div>

      <div className="grid2" style={{ marginBottom: 20 }}>
        <div>
          <label style={{ marginBottom: 8 }}>Pendapatan per Outlet</label>
          <Pie data={outletSlices} money />
        </div>
        <div>
          <label style={{ marginBottom: 8 }}>Pelanggan Baru vs Kembali</label>
          <Pie data={repeatSlices} />
        </div>
      </div>

      <div>
        <label style={{ marginBottom: 8 }}>Mix per Kategori</label>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th className="num">Pasang</th>
                <th className="num">Pendapatan</th>
                <th className="num">%</th>
                <th style={{ width: "24%" }} />
              </tr>
            </thead>
            <tbody>
              {mix.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">
                    {EMPTY_RANGE}
                  </td>
                </tr>
              ) : (
                mix.map((row) => {
                  const percent = mixTotal ? (Number(row.amount) / mixTotal) * 100 : 0;

                  return (
                    <tr key={row.name}>
                      <td data-label="Kategori">
                        <b>{row.name}</b>
                      </td>
                      <td className="num" data-label="Pasang">
                        {decimal(Number(row.qty))}
                      </td>
                      <td className="num mono" data-label="Pendapatan">
                        {toIDR(Number(row.amount))}
                      </td>
                      <td className="num" data-label="%">
                        {percent.toFixed(1)}%
                      </td>
                      <td>
                        <div className="bar">
                          <span style={{ width: `${percent.toFixed(1)}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mini" style={{ marginTop: 16 }}>
        Rentang data: {meta?.from ?? from} s.d. {meta?.to ?? to}
        {meta?.branch_id ? ` \u00B7 Cabang: ${meta.branch_id}` : ""}
      </div>

      {exportOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Pilih format export">
          <div className="box">
            <div className="modal-head">
              <h3>Pilih Format Export</h3>
              <button type="button" className="mclose" onClick={() => setExportOpen(false)}>
                {"\u2715"}
              </button>
            </div>
            <button type="button" className="txn-choice" onClick={() => runExport("xlsx")} disabled={exporting}>
              <b>Export ke Excel</b>
              <span>Berkas .xlsx untuk diolah lebih lanjut</span>
            </button>
            <button type="button" className="txn-choice" onClick={() => runExport("pdf")} disabled={exporting}>
              <b>Export ke PDF</b>
              <span>Berkas siap cetak / dibagikan</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard(props: { k: string; v: string; s: string }) {
  return (
    <div className="stat">
      <div className="k">{props.k}</div>
      <div className="v mono">{props.v}</div>
      <div className="s">{props.s}</div>
    </div>
  );
}

function CashflowChart(props: { buckets: Bucket[] }) {
  if (props.buckets.length === 0) {
    return <div className="empty">Tidak ada arus kas pada rentang ini.</div>;
  }

  const width = 760;
  const height = 300;
  const padX = 42;
  const padY = 30;
  const mid = height / 2;
  const slot = (width - 2 * padX) / props.buckets.length;
  const barWidth = Math.min(28, slot * 0.46);
  const maxAbs = Math.max(
    1,
    ...props.buckets.map((b) => Math.max(b.cashIn, b.cashOut, Math.abs(b.net))),
  );
  const scale = (value: number) => (value / maxAbs) * (mid - padY);
  const line = props.buckets
    .map((b, i) => `${padX + slot * i + slot / 2},${mid - scale(b.net)}`)
    .join(" ");

  return (
    <div className="cbo-wrap">
      <div className="cbo-legend">
        <span>
          <i style={{ background: "#2563EB" }} />
          Cash In
        </span>
        <span>
          <i style={{ background: "#F5A02D" }} />
          Cash Out
        </span>
        <span>
          <i style={{ background: "#0A2A66" }} />
          Net
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="cbo-svg" preserveAspectRatio="xMidYMid meet">
        <line x1={padX} y1={mid} x2={width - padX} y2={mid} stroke="#cbd5e1" strokeWidth="1" />

        {props.buckets.map((bucket, index) => {
          const cx = padX + slot * index + slot / 2;
          const inH = scale(bucket.cashIn);
          const outH = scale(bucket.cashOut);

          return (
            <g key={bucket.key}>
              <rect x={cx - barWidth / 2} y={mid - inH} width={barWidth} height={inH} rx="2" fill="#2563EB" />
              <rect x={cx - barWidth / 2} y={mid} width={barWidth} height={outH} rx="2" fill="#F5A02D" />
              <circle cx={cx} cy={mid - scale(bucket.net)} r="3.5" fill="#0A2A66" stroke="#fff" strokeWidth="1" />
              <rect x={padX + slot * index} y={0} width={slot} height={height} fill="transparent">
                <title>
                  {`${bucket.label}\nIn: ${toIDR(bucket.cashIn)}\nOut: ${toIDR(bucket.cashOut)}\nNet: ${toIDR(bucket.net)}`}
                </title>
              </rect>
              <text x={cx} y={height - 8} textAnchor="middle" fontSize="9" fill="#64748b">
                {bucket.label}
              </text>
            </g>
          );
        })}

        <polyline points={line} fill="none" stroke="#0A2A66" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

function Pie(props: { data: Slice[]; money?: boolean }) {
  const total = props.data.reduce((sum, item) => sum + item.value, 0);

  if (total <= 0) {
    return <div className="empty">{EMPTY_RANGE}</div>;
  }

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;

  const slices = props.data.map((item) => {
    const length = (item.value / total) * circumference;
    const slice = { ...item, length, offset: cursor };
    cursor += length;
    return slice;
  });

  return (
    <div className="pie-wrap">
      <div className="pie-svg-wrap">
        <svg viewBox="0 0 128 128" className="pie-svg">
          {slices.map((slice) => (
            <circle
              key={slice.label}
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="22"
              strokeDasharray={`${slice.length} ${circumference - slice.length}`}
              strokeDashoffset={-slice.offset}
              transform="rotate(-90 64 64)"
            >
              <title>
                {`${slice.label}: ${props.money ? toIDR(slice.value) : slice.value} (${((slice.value / total) * 100).toFixed(1)}%)`}
              </title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="pie-legend">
        {props.data.map((item) => (
          <div className="pie-lg" key={item.label}>
            <i style={{ background: item.color }} />
            <span className="pie-lg-l">{item.label}</span>
            <span className="pie-lg-v">
              {props.money ? toIDR(item.value) : item.value} <b>{Math.round((item.value / total) * 100)}%</b>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
