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
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <p className="text-xs text-gray-600">Ringkasan kinerja & laporan</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {isSuperadmin && (
                    <label className="grid gap-1 text-sm">
                        <span>Cabang</span>
                        <select
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="">Semua Cabang</option>
                            {branchList.map(b => (
                                <option key={b.id} value={String(b.id)}>{b.name}</option>
                            ))}
                        </select>
                    </label>
                )}
                <label className="grid gap-1 text-sm">
                    <span>Dari Tanggal</span>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    />
                </label>
                <label className="grid gap-1 text-sm">
                    <span>Sampai Tanggal</span>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    />
                </label>
                <div className="flex items-end gap-2">
                    <button
                        type="button"
                        onClick={() => load()}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        Terapkan
                    </button>
                    <button
                        type="button"
                        onClick={() => { setFrom(firstDayThisMonth()); setTo(today()); }}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {err ? <div className="text-sm text-red-600">{err}</div> : null}

            {/* KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
                <div className="overflow-auto border rounded">
                    <table className="min-w-[560px] w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-3 py-2">Layanan</th>
                                <th className="text-right px-3 py-2">Qty</th>
                                <th className="text-right px-3 py-2">Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={3} className="px-3 py-3 text-center text-gray-500">Memuat…</td></tr>
                            ) : (data?.top_services?.length ?? 0) === 0 ? (
                                <tr><td colSpan={3} className="px-3 py-3 text-center text-gray-500">Belum ada data</td></tr>
                            ) : (
                                (data?.top_services ?? []).map((r) => (
                                    <tr key={`${r.service_id}-${r.name}`}>
                                        <td className="px-3 py-2">{r.name}</td>
                                        <td className="px-3 py-2 text-right">{r.qty}</td>
                                        <td className="px-3 py-2 text-right">{toIDR(Number(r.amount))}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Omzet harian & bulanan — ringkas (tanpa chart, mengikuti kit yang ada) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <h2 className="text-sm font-semibold mb-2">Omzet Harian</h2>
                    <div className="border rounded overflow-auto">
                        <table className="min-w-[380px] w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr><th className="text-left px-3 py-2">Tanggal</th><th className="text-right px-3 py-2">Omzet</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={2} className="px-3 py-3 text-center text-gray-500">Memuat…</td></tr>
                                ) : (data?.omzet_daily?.length ?? 0) === 0 ? (
                                    <tr><td colSpan={2} className="px-3 py-3 text-center text-gray-500">Belum ada data</td></tr>
                                ) : (
                                    (data?.omzet_daily ?? []).map(d => (
                                        <tr key={d.date}>
                                            <td className="px-3 py-2">{d.date}</td>
                                            <td className="px-3 py-2 text-right">{toIDR(Number(d.amount))}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h2 className="text-sm font-semibold mb-2">Omzet Bulanan</h2>
                    <div className="border rounded overflow-auto">
                        <table className="min-w-[380px] w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr><th className="text-left px-3 py-2">Bulan</th><th className="text-right px-3 py-2">Omzet</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={2} className="px-3 py-3 text-center text-gray-500">Memuat…</td></tr>
                                ) : (data?.omzet_monthly?.length ?? 0) === 0 ? (
                                    <tr><td colSpan={2} className="px-3 py-3 text-center text-gray-500">Belum ada data</td></tr>
                                ) : (
                                    (data?.omzet_monthly ?? []).map(m => (
                                        <tr key={m.month}>
                                            <td className="px-3 py-2">{m.month}</td>
                                            <td className="px-3 py-2 text-right">{toIDR(Number(m.amount))}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Meta */}
            <footer className="text-xs text-gray-500">
                Rentang data: {meta?.from ?? from} s.d. {meta?.to ?? to}{meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ''}
            </footer>
        </div>
    );
}

function KpiCard(props: { title: string; value: string; loading?: boolean }) {
    return (
        <div className="rounded border p-3">
            <div className="text-xs text-gray-600">{props.title}</div>
            <div className="mt-1 text-lg font-semibold">
                {props.loading ? '…' : props.value}
            </div>
        </div>
    );
}
