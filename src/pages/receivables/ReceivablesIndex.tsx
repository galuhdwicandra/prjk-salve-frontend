import { useCallback, useEffect, useMemo, useState } from "react";
import type { Receivable, ReceivableQuery, ReceivableStatus } from "../../types/receivables";
import { listReceivables } from "../../api/receivables";
import DataTable from "../../components/DataTable"; // perbaikan path
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
            // API dinormalisasi: res.data = Receivable[] ; res.meta = Pagination meta
            setRows(res.data ?? []);
            setMeta((res.meta as Meta) ?? null);
        } catch {
            setError("Gagal memuat data piutang.");
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        load();
    }, [load]);

    const columns = [
        { key: "invoice_no", header: "Invoice", render: (r: Receivable) => r.order?.invoice_no ?? "-" },
        { key: "customer", header: "Customer", render: (r: Receivable) => r.order?.customer?.name ?? "-" },
        {
            key: "due_date",
            header: "Jatuh Tempo",
            render: (r: Receivable) => {
                const txt = r.due_date ? new Date(r.due_date).toLocaleDateString("id-ID") : "-";
                const danger = r.status === "OVERDUE";
                return <span className={danger ? "text-red-600 font-semibold" : ""}>{txt}</span>;
            },
        },
        { key: "grand_total", header: "Total", render: (r: Receivable) => toIDR(r.order?.grand_total ?? 0) },
        { key: "paid_amount", header: "Terbayar", render: (r: Receivable) => toIDR(r.order?.paid_amount ?? 0) },
        {
            key: "remaining",
            header: "Sisa",
            render: (r: Receivable) => (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold">{toIDR(r.remaining_amount)}</span>
            ),
        },
        { key: "status", header: "Status", render: (r: Receivable) => r.status },
        {
            key: "actions",
            header: "",
            render: (r: Receivable) =>
                r.remaining_amount > 0 ? (
                    <button
                        className="rounded-xl bg-black px-3 py-1 text-sm text-white"
                        onClick={() => {
                            setSelected(r);
                            setDialogOpen(true);
                        }}
                    >
                        Pelunasan
                    </button>
                ) : null,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-sm">Cari (Invoice/Customer)</label>
                    <input
                        value={q}
                        onChange={(e) => {
                            setPage(1);
                            setQ(e.target.value);
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        placeholder="cth: SLV-202510-000012 atau nama pelanggan"
                    />
                </div>

                <div>
                    <label className="block text-sm">Status</label>
                    <select
                        value={status}
                        onChange={(e) => {
                            setPage(1);
                            setStatus(e.target.value as ReceivableStatus | "");
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                        {STATUS.map((s) => (
                            <option key={s || "ALL"} value={s}>
                                {s || "ALL"}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm">Jatuh Tempo ≤</label>
                    <input
                        type="date"
                        value={dueBefore}
                        onChange={(e) => {
                            setPage(1);
                            setDueBefore(e.target.value);
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm">Per halaman</label>
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPage(1);
                            setPerPage(Number(e.target.value));
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                        {[10, 15, 25, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
            <DataTable rows={rows} columns={columns} loading={loading} />

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {meta ? `Hal ${meta.current_page}/${meta.last_page} — ${meta.total} data` : null}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        disabled={!meta || page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-xl border px-3 py-1 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={!meta || (meta && page >= meta.last_page)}
                        onClick={() => setPage((p) => (meta ? Math.min(meta.last_page, p + 1) : p))}
                        className="rounded-xl border px-3 py-1 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            <SettleReceivableDialog
                open={dialogOpen}
                receivable={selected}
                onClose={() => setDialogOpen(false)}
                onSettled={() => load()}
            />
        </div>
    );
}
