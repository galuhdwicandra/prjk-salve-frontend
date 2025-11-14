// src/pages/customers/CustomersIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Customer, CustomerQuery, Paginated } from '../../types/customers';
import { listCustomers } from '../../api/customers';
import { useAuth, useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';

export default function CustomersIndex() {
    function useAuthSnapshot() {
        const store = useAuth;
        const [, force] = useState(0);
        useEffect(() => {
            // subscribe() mengembalikan function yg saat dipanggil return boolean.
            // Cleanup React wajib kembalikan void, jadi bungkus dulu.
            const unsubscribe = store.subscribe(() => force((x) => x + 1));
            return () => {
                // panggil, tapi JANGAN return nilai boolean-nya
                unsubscribe();
            };
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
        return () => {
            cancelled = true;
        };
    }, [query, search, branchIdForScope]);

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Customers</h1>
                {canManage && (
                    <Link to="/customers/new" className="px-3 py-2 rounded-xl shadow border text-sm">New Customer</Link>
                )}
            </div>

            <div className="flex gap-2">
                <input
                    placeholder="Cari nama/WA/alamat…"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="border rounded-xl px-3 py-2"
                    value={query.per_page ?? 10}
                    onChange={(e) => setQuery((q) => ({ ...q, per_page: Number(e.target.value), page: 1 }))}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {loading && <div className="animate-pulse text-sm text-gray-500">Loading…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            {!loading && !error && rows && rows.data.length === 0 && (
                <div className="text-sm text-gray-500">Belum ada data pelanggan.</div>
            )}

            {!loading && !error && rows && rows.data.length > 0 && (
                <div className="overflow-auto rounded-xl border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3">Nama</th>
                                <th className="text-left p-3">WhatsApp</th>
                                <th className="text-left p-3">Alamat</th>
                                <th className="text-left p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.data.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="p-3">{c.name}</td>
                                    <td className="p-3">{c.whatsapp}</td>
                                    <td className="p-3">{c.address ?? '-'}</td>
                                    <td className="p-3">
                                        <Link to={`/customers/${String(c.id)}`} className="underline">Detail</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && rows && rows.meta.last_page > 1 && (
                <div className="flex items-center gap-2 justify-end">
                    <button
                        disabled={(rows.meta.current_page ?? 1) <= 1}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {rows.meta.current_page} / {rows.meta.last_page}
                    </span>
                    <button
                        disabled={rows.meta.current_page >= rows.meta.last_page}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
