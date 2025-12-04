// src/pages/receivables/ReceivablesIndex.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Receivable, ReceivableQuery, ReceivableStatus } from "../../types/receivables";
import { listReceivables } from "../../api/receivables";
import { toIDR } from "../../utils/money";
import SettleReceivableDialog from "../../components/receivables/SettleReceivableDialog";

type Meta = { current_page: number; per_page: number; total: number; last_page: number };

const STATUS: Array<ReceivableStatus | ""> = ["", "OPEN", "PARTIAL", "OVERDUE", "SETTLED"];

export default function ReceivablesIndex() {
  const [rows, setRows] = useState<Receivable[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [q, setQ] = useState<string>("");
  const [status, setStatus] = useState<ReceivableStatus | "">("");
  const [dueBefore, setDueBefore] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Receivable | null>(null);

  const params: ReceivableQuery = useMemo(
    () => ({ q, status, due_before: dueBefore || undefined, page, per_page: perPage }),
    [q, status, dueBefore, page, perPage]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listReceivables(params);
      setRows(res.data ?? []);
      setMeta((res.meta as Meta) ?? null);
    } catch {
      setError("Gagal memuat data piutang.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Receivables</h1>
          <p className="text-xs text-gray-600">Daftar piutang & status pelunasan</p>
        </div>
      </div>

      {/* Toolbar (FilterBar) */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar filter piutang"
      >
        <div className="p-3 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3">
          {/* Search */}
          <div className="relative">
            <label className="sr-only" htmlFor="cari">Cari</label>
            <input
              id="cari"
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
              className="input w-full pl-9 py-2"
              placeholder="Cari invoice/customer…"
              aria-label="Cari invoice atau nama pelanggan"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value as ReceivableStatus | ""); }}
              className="input w-full py-2"
            >
              {STATUS.map((s) => (
                <option key={s || "ALL"} value={s}>
                  {s || "ALL"}
                </option>
              ))}
            </select>
          </div>

          {/* Due before */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="dueBefore">Jatuh Tempo ≤</label>
            <input
              id="dueBefore"
              type="date"
              value={dueBefore}
              onChange={(e) => { setPage(1); setDueBefore(e.target.value); }}
              className="input w-full py-2"
            />
          </div>

          {/* Per page */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="perPage">Per halaman</label>
            <select
              id="perPage"
              value={perPage}
              onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
              className="input w-full py-2"
            >
              {[10, 15, 25, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Error */}
      {error ? (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      ) : null}

      {/* Table (konsisten dengan Customers) */}
      <section aria-busy={loading ? "true" : "false"}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Invoice</Th>
                  <Th>Customer</Th>
                  <Th>Jatuh Tempo</Th>
                  <Th className="text-right">Total</Th>
                  <Th className="text-right">Terbayar</Th>
                  <Th className="text-right">Sisa</Th>
                  <Th>Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-4 text-center text-gray-500">Belum ada data</td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const dueText = r.due_date
                      ? new Date(r.due_date).toLocaleDateString("id-ID")
                      : "-";
                    const isOverdue = r.status === "OVERDUE";
                    return (
                      <tr key={r.id} className="hover:bg-black/5 transition-colors">
                        <Td>{r.order?.invoice_no ?? "-"}</Td>
                        <Td><span className="line-clamp-1">{r.order?.customer?.name ?? "-"}</span></Td>
                        <Td>
                          <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                            {dueText}
                          </span>
                        </Td>
                        <Td className="text-right tabular-nums">{toIDR(r.order?.grand_total ?? 0)}</Td>
                        <Td className="text-right tabular-nums">{toIDR(r.order?.paid_amount ?? 0)}</Td>
                        <Td className="text-right">
                          <span className="chip chip--subtle">{toIDR(r.remaining_amount)}</span>
                        </Td>
                        <Td>{renderStatusChip(r.status)}</Td>
                        <Td className="text-right">
                          {r.remaining_amount > 0 ? (
                            <button
                              className="btn-primary"
                              onClick={() => { setSelected(r); setDialogOpen(true); }}
                              aria-label={`Pelunasan untuk ${r.order?.invoice_no ?? 'invoice'}`}
                            >
                              Pelunasan
                            </button>
                          ) : null}
                        </Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {meta ? `Hal ${meta.current_page}/${meta.last_page} — ${meta.total} data` : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={!meta || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={!meta || (meta && page >= meta.last_page)}
            onClick={() => setPage((p) => (meta ? Math.min(meta.last_page, p + 1) : p))}
            className="btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Dialog Pelunasan */}
      <SettleReceivableDialog
        open={dialogOpen}
        receivable={selected}
        onClose={() => setDialogOpen(false)}
        onSettled={() => load()}
      />
    </div>
  );
}

/* ---------- Subcomponents: konsisten dengan Customers ---------- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function RowSkeleton() {
  return (
    <tr>
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-6 w-24 rounded-full bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-24 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}

/* ---------- Status chip ---------- */
function renderStatusChip(s?: ReceivableStatus) {
  const base = "chip";
  switch (s) {
    case "OPEN":
      return <span className={`${base} chip--subtle`}>OPEN</span>;
    case "PARTIAL":
      return <span className={`${base} chip--subtle`}>PARTIAL</span>;
    case "OVERDUE":
      return <span className={`${base} chip--danger`}>OVERDUE</span>;
    case "SETTLED":
      return <span className={`${base} chip--solid`}>SETTLED</span>;
    default:
      return <span className="text-gray-600">-</span>;
  }
}
