// src/pages/customers/CustomersIndex.tsx
import { useEffect, useMemo, useState } from "react";
import type { Customer, CustomerQuery, Paginated } from "../../types/customers";
import { listCustomers } from "../../api/customers";
import { useAuth, useHasRole } from "../../store/useAuth";
import { Link } from "react-router-dom";

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.2-3.2" />
        </svg>
    );
}
function IconUsers(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M20 21a7 7 0 0 0-14 0" />
            <circle cx="13" cy="7" r="4" />
            <path d="M6 21a6 6 0 0 1 7-5.7" opacity=".6" />
            <path d="M4 21a6 6 0 0 1 6-6" opacity=".35" />
        </svg>
    );
}
function IconChevron(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M9 6l6 6-6 6" />
        </svg>
    );
}

function initials(name?: string) {
    const n = (name ?? "").trim();
    if (!n) return "C";
    const parts = n.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "C";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (a + b).toUpperCase();
}

function formatWaLink(raw?: string) {
    if (!raw) return null;
    const cleaned = raw.replace(/[^\d]/g, "");
    if (!cleaned) return null;

    // jika mulai dengan 0 → ganti ke 62
    const normalized =
        cleaned.startsWith("0")
            ? "62" + cleaned.slice(1)
            : cleaned.startsWith("62")
                ? cleaned
                : cleaned;

    return `https://wa.me/${normalized}`;
}

function mapsUrl(address?: string | null) {
    const a = (address ?? "").trim();
    if (!a) return null;
    // Google Maps search query (paling stabil untuk alamat teks bebas)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
}

export default function CustomersIndex() {
    // Snapshot auth store (sesuai pola Anda)
    function useAuthSnapshot() {
        const store = useAuth;
        const [, force] = useState(0);
        useEffect(() => {
            const unsubscribe = store.subscribe(() => force((x) => x + 1));
            return () => {
                unsubscribe();
            };
        }, [store]);
        return store;
    }

    const auth = useAuthSnapshot();
    const user = auth.user;
    const canManage = useHasRole(["Superadmin", "Admin Cabang", "Kasir"]);
    const isSuperadmin = useHasRole("Superadmin");

    const [query, setQuery] = useState<CustomerQuery>({ page: 1, per_page: 10 });
    const [rows, setRows] = useState<Paginated<Customer> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const branchIdForScope = useMemo(() => {
        if (isSuperadmin) return query.branch_id ?? undefined;
        const id = user?.branch_id as string | number | undefined;
        if (typeof id === "string") return id;
        if (typeof id === "number") return String(id);
        return undefined;
    }, [isSuperadmin, query.branch_id, user?.branch_id]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listCustomers({
                    ...query,
                    q: search || undefined,
                    branch_id: branchIdForScope,
                });
                if (!cancelled) setRows(data);
            } catch {
                if (!cancelled) setError("Gagal memuat data pelanggan.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [query, search, branchIdForScope]);

    const currentPage = rows?.meta.current_page ?? 1;
    const lastPage = rows?.meta.last_page ?? 1;
    const perPage = query.per_page ?? 10;
    const total = rows?.meta.total ?? 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                        <IconUsers />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Customers</h1>
                        <p className="mt-1 text-sm text-slate-500">Kelola data pelanggan dan akses detail histori.</p>
                    </div>
                </div>

                {canManage && (
                    <Link
                        to="/customers/new"
                        className="
              inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5
              text-sm font-semibold text-white shadow-sm
              hover:bg-slate-800 active:bg-slate-950
            "
                        aria-label="Tambah pelanggan baru"
                    >
                        New Customer
                    </Link>
                )}
            </div>

            {/* Toolbar */}
            <section
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]"
                aria-label="Toolbar pencarian pelanggan"
            >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="relative">
                        <label className="sr-only" htmlFor="cari">
                            Pencarian
                        </label>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <IconSearch />
                        </span>
                        <input
                            id="cari"
                            placeholder="Cari nama / WhatsApp / alamat…"
                            className="
                w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm
                text-slate-900 placeholder:text-slate-400
                focus:border-slate-900 focus:outline-none
              "
                            value={search}
                            onChange={(e) => {
                                setQuery((q) => ({ ...q, page: 1 }));
                                setSearch(e.target.value);
                            }}
                            aria-label="Cari pelanggan"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                        <div className="text-xs text-slate-500">
                            {loading ? "Memuat…" : total ? `${total} pelanggan` : "0 pelanggan"}
                        </div>

                        <div className="relative">
                            <label className="sr-only" htmlFor="perpage">
                                Per page
                            </label>
                            <select
                                id="perpage"
                                className="
                  appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm
                  text-slate-900 focus:border-slate-900 focus:outline-none
                "
                                value={perPage}
                                onChange={(e) => setQuery((q) => ({ ...q, per_page: Number(e.target.value), page: 1 }))}
                                aria-label="Jumlah baris per halaman"
                            >
                                <option value={10}>10 / page</option>
                                <option value={25}>25 / page</option>
                                <option value={50}>50 / page</option>
                            </select>
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <IconChevron />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Empty */}
            {!loading && !error && rows && rows.data.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
                    Belum ada data pelanggan.
                </div>
            )}

            {/* Table */}
            <section aria-busy={loading ? "true" : "false"}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-white">
                                <tr className="border-b border-slate-200">
                                    <Th className="pl-4">Customer</Th>
                                    <Th>WhatsApp</Th>
                                    <Th>Alamat</Th>
                                    <Th className="pr-4 text-right">Aksi</Th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <>
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                    </>
                                ) : (
                                    rows?.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                            <Td className="pl-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                                        {initials(c.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-medium text-slate-900">{c.name}</div>
                                                        <div className="truncate text-xs text-slate-500">ID: {String(c.id)}</div>
                                                    </div>
                                                </div>
                                            </Td>

                                            <Td>
                                                {formatWaLink(c.whatsapp) ? (
                                                    <a
                                                        href={formatWaLink(c.whatsapp) ?? "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="
         tabular-nums font-medium text-emerald-600
         hover:underline hover:text-emerald-700
       "
                                                        aria-label={`Hubungi ${c.name} via WhatsApp`}
                                                    >
                                                        {c.whatsapp}
                                                    </a>
                                                ) : (
                                                    <span className="tabular-nums text-slate-800">
                                                        {c.whatsapp ?? "-"}
                                                    </span>
                                                )}
                                            </Td>

                                            <Td>
                                                {mapsUrl(c.address) ? (
                                                    <a
                                                        href={mapsUrl(c.address)!}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="
         line-clamp-2 max-w-[56ch] text-slate-700
         hover:text-slate-900 hover:underline
       "
                                                        title="Buka di Google Maps"
                                                        aria-label={`Buka alamat ${c.name} di Google Maps`}
                                                    >
                                                        {c.address}
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </Td>

                                            <Td className="pr-4 text-right">
                                                <Link
                                                    to={`/customers/${String(c.id)}`}
                                                    className="
                            inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2
                            text-xs font-semibold text-slate-900
                            hover:bg-slate-50 active:bg-slate-100
                          "
                                                    aria-label={`Lihat detail pelanggan ${c.name}`}
                                                >
                                                    Detail
                                                </Link>
                                            </Td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* footer summary */}
                    <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            {total ? (
                                <>
                                    Menampilkan{" "}
                                    <span className="font-semibold text-slate-700">
                                        {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, total)}
                                    </span>{" "}
                                    dari <span className="font-semibold text-slate-700">{total}</span>
                                </>
                            ) : (
                                "Tidak ada data untuk ditampilkan"
                            )}
                        </div>

                        {/* Pagination */}
                        {!loading && rows && rows.meta.last_page > 1 && (
                            <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
                                <button
                                    disabled={currentPage <= 1}
                                    onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
                                    className="
                    rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 active:bg-slate-100
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                                >
                                    Prev
                                </button>

                                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                    Page <span className="font-semibold text-slate-900">{currentPage}</span> / {lastPage}
                                </span>

                                <button
                                    disabled={currentPage >= lastPage}
                                    onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
                                    className="
                    rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 active:bg-slate-100
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                                >
                                    Next
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------- Subcomponents ---------- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}>
            {children}
        </th>
    );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-3 align-top ${className}`}>{children}</td>;
}
function RowSkeleton() {
    return (
        <tr>
            <td className="px-3 py-4 pl-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-black/10 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-black/10 animate-pulse" />
                        <div className="h-3 w-20 rounded bg-black/10 animate-pulse" />
                    </div>
                </div>
            </td>
            <td className="px-3 py-4">
                <div className="h-4 w-32 rounded bg-black/10 animate-pulse" />
            </td>
            <td className="px-3 py-4">
                <div className="h-4 w-64 rounded bg-black/10 animate-pulse" />
            </td>
            <td className="px-3 py-4 pr-4 text-right">
                <div className="inline-block h-9 w-20 rounded bg-black/10 animate-pulse" />
            </td>
        </tr>
    );
}
