// src/pages/customers/CustomersIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Customer, CustomerQuery, Paginated } from '../../types/customers';
import { listCustomers } from '../../api/customers';
import { useAuth, useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';

export default function CustomersIndex() {
    // Snapshot auth store (sesuai pola Anda)
    function useAuthSnapshot() {
        const store = useAuth;
        const [, force] = useState(0);
        useEffect(() => {
            const unsubscribe = store.subscribe(() => force((x) => x + 1));
            return () => { unsubscribe(); };
        }, [store]);
        return store;
    }

    const auth = useAuthSnapshot();
    const user = auth.user;
    const canManage = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);
    const isSuperadmin = useHasRole('Superadmin');

    const [query, setQuery] = useState<CustomerQuery>({ page: 1, per_page: 10 });
    const [rows, setRows] = useState<Paginated<Customer> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const branchIdForScope = useMemo(() => {
        if (isSuperadmin) return query.branch_id ?? undefined;
        const id = user?.branch_id as string | number | undefined;
        if (typeof id === 'string') return id;
        if (typeof id === 'number') return String(id);
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
                if (!cancelled) setError('Gagal memuat data pelanggan.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [query, search, branchIdForScope]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Customers</h1>
                    <p className="text-xs text-gray-600">Kelola data pelanggan & histori transaksi</p>
                </div>
                {canManage && (
                    <Link
                        to="/customers/new"
                        className="btn-primary"
                        aria-label="Tambah pelanggan baru"
                    >
                        New Customer
                    </Link>
                )}
            </div>

            {/* Toolbar (FilterBar) */}
            <section
                className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
                aria-label="Toolbar pencarian pelanggan"
            >
                <div className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                    <label className="sr-only" htmlFor="cari">Pencarian</label>
                    <div className="relative">
                        <input
                            id="cari"
                            placeholder="Cari nama/WA/alamat…"
                            className="input w-full pl-9 py-2"
                            value={search}
                            onChange={(e) => {
                                setQuery((q) => ({ ...q, page: 1 }));
                                setSearch(e.target.value);
                            }}
                            aria-label="Cari pelanggan"
                        />
                        {/* Ikon search (dekoratif) */}
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            🔎
                        </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <label className="text-sm text-gray-600" htmlFor="perpage">Per page</label>
                        <select
                            id="perpage"
                            className="input w-[88px] py-2"
                            value={query.per_page ?? 10}
                            onChange={(e) =>
                                setQuery((q) => ({ ...q, per_page: Number(e.target.value), page: 1 }))
                            }
                            aria-label="Jumlah baris per halaman"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Alert error */}
            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
                >
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && rows && rows.data.length === 0 && (
                <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
                    Belum ada data pelanggan.
                </div>
            )}

            {/* Table */}
            <section aria-busy={loading ? 'true' : 'false'}>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    <Th>Nama</Th>
                                    <Th>WhatsApp</Th>
                                    <Th>Alamat</Th>
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
                                        <RowSkeleton />
                                    </>
                                ) : (
                                    rows?.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-black/5 transition-colors">
                                            <Td>
                                                <span className="line-clamp-1 font-medium">{c.name}</span>
                                            </Td>
                                            <Td>
                                                <span className="tabular-nums">{c.whatsapp}</span>
                                            </Td>
                                            <Td>
                                                <span className="line-clamp-2 max-w-[48ch]">{c.address ?? '-'}</span>
                                            </Td>
                                            <Td className="text-right">
                                                <Link
                                                    to={`/customers/${String(c.id)}`}
                                                    className="btn-outline"
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
                </div>
            </section>

            {/* Pagination */}
            {!loading && rows && rows.meta.last_page > 1 && (
                <nav
                    className="flex items-center gap-2 justify-end"
                    aria-label="Navigasi halaman"
                >
                    <button
                        disabled={(rows.meta.current_page ?? 1) <= 1}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {rows.meta.current_page} / {rows.meta.last_page}
                    </span>
                    <button
                        disabled={rows.meta.current_page >= rows.meta.last_page}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
}

/* ---------- Subcomponents ---------- */
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
function RowSkeleton() {
    return (
        <tr>
            <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
            <td className="px-3 py-3"><div className="h-4 w-32 rounded bg-black/10 animate-pulse" /></td>
            <td className="px-3 py-3"><div className="h-4 w-64 rounded bg-black/10 animate-pulse" /></td>
            <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-20 rounded bg-black/10 animate-pulse" /></td>
        </tr>
    );
}
