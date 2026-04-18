// src/pages/orders/OrdersIndex.tsx
import { useCallback, useEffect, useState } from 'react';
import { deleteOrder, listOrders, openOrderReceipt } from '../../api/orders';
import { getErrorMessage } from '../../api/client';
import type { Order, OrderBackendStatus, PaginationMeta, PaymentMethod, PaymentStatus } from '../../types/orders';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import ConfirmDialog from '../../components/ConfirmDialog';

const dlog = (...args: unknown[]) => {
    if (import.meta.env?.DEV) console.log('[OrdersIndex]', ...args);
};

const shortOrderNo = (number?: string | null, invoiceNo?: string | null): string => {
    if (invoiceNo && invoiceNo.trim().length > 0) return invoiceNo;
    if (!number) return '-';
    const m = number.match(/(\d{4,})$/);
    const tail = m?.[1] ?? number.slice(-6);
    return `#${tail}`;
};

const paymentStatusLabel = (status?: PaymentStatus | null): string => {
    switch (status) {
        case 'PAID':
        case 'SETTLED':
            return 'Lunas';
        case 'DP':
            return 'DP';
        case 'PENDING':
            return 'Pending';
        case 'UNPAID':
            return 'Belum Bayar';
        default:
            return '-';
    }
};

const paymentStatusClass = (status?: PaymentStatus | null): string => {
    switch (status) {
        case 'PAID':
        case 'SETTLED':
            return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
        case 'DP':
            return 'bg-amber-50 text-amber-700 ring-amber-200';
        case 'PENDING':
            return 'bg-sky-50 text-sky-700 ring-sky-200';
        case 'UNPAID':
            return 'bg-rose-50 text-rose-700 ring-rose-200';
        default:
            return 'bg-slate-50 text-slate-600 ring-slate-200';
    }
};

const paymentMethodLabel = (method?: PaymentMethod | null): string => {
    switch (method) {
        case 'CASH':
            return 'Cash';
        case 'QRIS':
            return 'QRIS';
        case 'TRANSFER':
            return 'Transfer';
        case 'DP':
            return 'DP';
        case 'PENDING':
            return 'Pending';
        default:
            return '-';
    }
};

const paymentMethodClass = (method?: PaymentMethod | null): string => {
    switch (method) {
        case 'CASH':
            return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
        case 'QRIS':
            return 'bg-sky-50 text-sky-700 ring-sky-200';
        case 'TRANSFER':
            return 'bg-violet-50 text-violet-700 ring-violet-200';
        case 'DP':
            return 'bg-amber-50 text-amber-700 ring-amber-200';
        case 'PENDING':
            return 'bg-slate-100 text-slate-700 ring-slate-200';
        default:
            return 'bg-slate-50 text-slate-600 ring-slate-200';
    }
};

const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ['PENDING', 'DP', 'PAID', 'UNPAID', 'SETTLED'];
const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = ['PENDING', 'DP', 'CASH', 'QRIS', 'TRANSFER'];
type SortBy = 'created_at' | 'received_at' | 'ready_at';
type SortDir = 'asc' | 'desc';

function formatDateOnly(v?: string | null): string {
    if (!v) return '-';
    return String(v).slice(0, 10);
}

export default function OrdersIndex(): React.ReactElement {
    const [rows, setRows] = useState<Order[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [status, setStatus] = useState<OrderBackendStatus | ''>('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | ''>('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [receivedFrom, setReceivedFrom] = useState('');
    const [receivedTo, setReceivedTo] = useState('');
    const [readyFrom, setReadyFrom] = useState('');
    const [readyTo, setReadyTo] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('created_at');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const me = useAuth.user;
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

    const refresh = useCallback(async (p = 1) => {
        dlog('refresh start', {
            q: q || undefined,
            status: status || undefined,
            payment_status: paymentStatus || undefined,
            payment_method: paymentMethod || undefined,
            from: from || undefined,
            to: to || undefined,
            received_from: receivedFrom || undefined,
            received_to: receivedTo || undefined,
            ready_from: readyFrom || undefined,
            ready_to: readyTo || undefined,
            sort_by: sortBy,
            sort_dir: sortDir,
            page: p,
            perPage,
        });

        setLoading(true);
        setError(null);

        try {
            const res = await listOrders({
                q: q || undefined,
                status: status || undefined,
                payment_status: paymentStatus || undefined,
                payment_method: paymentMethod || undefined,
                from: from || undefined,
                to: to || undefined,
                received_from: receivedFrom || undefined,
                received_to: receivedTo || undefined,
                ready_from: readyFrom || undefined,
                ready_to: readyTo || undefined,
                sort_by: sortBy,
                sort_dir: sortDir,
                page: p,
                per_page: perPage,
            });

            dlog('refresh success', { count: (res.data ?? []).length, meta: res.meta });
            setRows(res.data ?? []);
            setMeta(res.meta as PaginationMeta);
            setPage(p);
        } catch (e) {
            dlog('refresh error', e);
            setError('Gagal memuat data');
        } finally {
            setLoading(false);
            dlog('refresh finally: loading=false');
        }
    }, [
        q,
        status,
        paymentStatus,
        paymentMethod,
        from,
        to,
        receivedFrom,
        receivedTo,
        readyFrom,
        readyTo,
        sortBy,
        sortDir,
        perPage,
    ]);

    useEffect(() => { dlog('mount'); return () => dlog('unmount'); }, []);
    useEffect(() => { dlog('query changed', q); }, [q]);
    useEffect(() => { dlog('status changed', status); }, [status]);
    useEffect(() => { dlog('page changed', page); }, [page]);
    useEffect(() => { dlog('rows/meta updated', { rows: rows.length, meta }); }, [rows, meta]);
    useEffect(() => { dlog('loading/error', { loading, error }); }, [loading, error]);
    useEffect(() => { dlog('paymentStatus changed', paymentStatus); }, [paymentStatus]);
    useEffect(() => { dlog('paymentMethod changed', paymentMethod); }, [paymentMethod]);
    useEffect(() => { dlog('date filters changed', { from, to, receivedFrom, receivedTo, readyFrom, readyTo }); }, [from, to, receivedFrom, receivedTo, readyFrom, readyTo]);
    useEffect(() => { dlog('sorting changed', { sortBy, sortDir }); }, [sortBy, sortDir]);

    useEffect(() => { void refresh(1); }, [refresh]);

    const onApply = () => {
        dlog('apply filter clicked');
        void refresh(1);
    };

    const onReset = () => {
        dlog('reset filter clicked');
        setQ('');
        setStatus('');
        setPaymentStatus('');
        setPaymentMethod('');
        setFrom('');
        setTo('');
        setReceivedFrom('');
        setReceivedTo('');
        setReadyFrom('');
        setReadyTo('');
        setSortBy('created_at');
        setSortDir('desc');
        setError(null);
        void refresh(1);
    };

    const onPrev = () => {
        const target = page - 1;
        dlog('pagination prev', { from: page, to: target });
        void refresh(target);
    };

    const onNext = () => {
        const target = page + 1;
        dlog('pagination next', { from: page, to: target });
        void refresh(target);
    };

    const onChangePerPage = (value: number) => {
        dlog('perPage changed', { from: perPage, to: value });
        setPerPage(value);
        void refresh(1);
    };

    const onOpenReceipt = async (id: Order['id']) => {
        dlog('open receipt', id);
        try {
            await openOrderReceipt(id); // akan buka tab baru berisi HTML struk
        } catch (e) {
            dlog('open receipt error', e);
            setError('Gagal membuka struk. Izinkan pop-up untuk situs ini, lalu coba lagi.');
        }
    };

    const canDeleteOrder = (o: Order): boolean => {
        if (!me) return false;

        const isSuperadmin = me.roles.includes('Superadmin');
        const isAdminCabang = me.roles.includes('Admin Cabang');

        if (!isSuperadmin && !isAdminCabang) return false;

        if (isAdminCabang && String(me.branch_id ?? '') !== String(o.branch_id ?? '')) {
            return false;
        }

        const blockedStatus: OrderBackendStatus[] = ['DELIVERING', 'PICKED_UP', 'CANCELED'];
        if (blockedStatus.includes(o.status)) return false;

        const hasPayment =
            Number(o.paid_amount ?? 0) > 0 ||
            o.payment_status === 'PAID' ||
            o.payment_status === 'SETTLED' ||
            o.payment_status === 'DP';

        if (hasPayment) return false;

        return true;
    };

    const openDeleteDialog = (o: Order) => {
        if (!canDeleteOrder(o)) return;
        setDeleteTarget(o);
    };

    const closeDeleteDialog = () => {
        if (deletingId) return;
        setDeleteTarget(null);
    };

    const confirmDeleteOrder = async () => {
        if (!deleteTarget) return;

        setDeletingId(String(deleteTarget.id));
        setError(null);

        try {
            await deleteOrder(String(deleteTarget.id));

            const nextRows = rows.filter((row) => String(row.id) !== String(deleteTarget.id));
            setRows(nextRows);
            setDeleteTarget(null);

            if (nextRows.length === 0 && page > 1) {
                await refresh(page - 1);
            } else {
                await refresh(page);
            }
        } catch (e) {
            dlog('delete order error', e);
            setError(getErrorMessage(e, 'Gagal menghapus order.'));
        } finally {
            setDeletingId(null);
        }
    };

    const toWaLink = (raw?: string | null): string | null => {
        if (!raw) return null;

        // ambil hanya angka
        let digits = raw.replace(/\D/g, '');

        // jika diawali 0 → ubah ke 62 (Indonesia)
        if (digits.startsWith('0')) {
            digits = '62' + digits.slice(1);
        }

        return digits ? `https://wa.me/${digits}` : null;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola daftar pesanan, lihat detail, dan cetak struk.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to="/pos"
                        className="
              inline-flex items-center justify-center
              rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
            "
                        aria-label="Buat transaksi baru"
                    >
                        Buat Transaksi
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <section
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]"
                aria-label="Filter orders"
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-slate-600">
                            Pencarian
                        </label>
                        <div className="relative mt-1">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="M20 20l-3.2-3.2" />
                                </svg>
                            </span>
                            <input
                                className="
          w-full rounded-lg border border-slate-200 bg-white
          pl-10 pr-3 py-2 text-sm text-slate-900
          placeholder:text-slate-400
          focus:border-slate-900 focus:outline-none
        "
                                placeholder="No order / invoice / nama / WhatsApp / catatan"
                                value={q}
                                onChange={(e) => { dlog('q input', e.target.value); setQ(e.target.value); }}
                                aria-label="Cari pesanan"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Status Order
                        </label>
                        <select
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={status}
                            onChange={(e) => {
                                const v = e.target.value as OrderBackendStatus | '';
                                dlog('status select', v);
                                setStatus(v);
                            }}
                            aria-label="Filter status order"
                        >
                            <option value="">Semua Status</option>
                            <option value="QUEUE">QUEUE</option>
                            <option value="WASHING">WASHING</option>
                            <option value="DRYING">DRYING</option>
                            <option value="IRONING">IRONING</option>
                            <option value="READY">READY</option>
                            <option value="DELIVERING">DELIVERING</option>
                            <option value="PICKED_UP">PICKED_UP</option>
                            <option value="CANCELED">CANCELED</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Status Bayar
                        </label>
                        <select
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={paymentStatus}
                            onChange={(e) => {
                                const v = e.target.value as PaymentStatus | '';
                                dlog('payment status select', v);
                                setPaymentStatus(v);
                            }}
                            aria-label="Filter status bayar"
                        >
                            <option value="">Semua Status Bayar</option>
                            {PAYMENT_STATUS_OPTIONS.map((item) => (
                                <option key={item} value={item}>
                                    {paymentStatusLabel(item)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Metode Bayar
                        </label>
                        <select
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={paymentMethod}
                            onChange={(e) => {
                                const v = e.target.value as PaymentMethod | '';
                                dlog('payment method select', v);
                                setPaymentMethod(v);
                            }}
                            aria-label="Filter metode bayar"
                        >
                            <option value="">Semua Metode Bayar</option>
                            {PAYMENT_METHOD_OPTIONS.map((item) => (
                                <option key={item} value={item}>
                                    {paymentMethodLabel(item)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Urutkan
                        </label>
                        <select
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={sortBy}
                            onChange={(e) => {
                                const v = e.target.value as SortBy;
                                dlog('sortBy select', v);
                                setSortBy(v);
                            }}
                            aria-label="Urutkan berdasarkan"
                        >
                            <option value="created_at">Tanggal Order</option>
                            <option value="received_at">Tanggal Diterima</option>
                            <option value="ready_at">Tanggal Jadi</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Arah Urutan
                        </label>
                        <select
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={sortDir}
                            onChange={(e) => {
                                const v = e.target.value as SortDir;
                                dlog('sortDir select', v);
                                setSortDir(v);
                            }}
                            aria-label="Arah urutan"
                        >
                            <option value="desc">Terbaru</option>
                            <option value="asc">Terlama</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Order Dari
                        </label>
                        <input
                            type="date"
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={from}
                            onChange={(e) => {
                                dlog('from date', e.target.value);
                                setFrom(e.target.value);
                            }}
                            aria-label="Filter tanggal order dari"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Order Sampai
                        </label>
                        <input
                            type="date"
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={to}
                            onChange={(e) => {
                                dlog('to date', e.target.value);
                                setTo(e.target.value);
                            }}
                            aria-label="Filter tanggal order sampai"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Diterima Dari
                        </label>
                        <input
                            type="date"
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={receivedFrom}
                            onChange={(e) => {
                                dlog('receivedFrom date', e.target.value);
                                setReceivedFrom(e.target.value);
                            }}
                            aria-label="Filter tanggal diterima dari"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Diterima Sampai
                        </label>
                        <input
                            type="date"
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={receivedTo}
                            onChange={(e) => {
                                dlog('receivedTo date', e.target.value);
                                setReceivedTo(e.target.value);
                            }}
                            aria-label="Filter tanggal diterima sampai"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Jadi Dari
                        </label>
                        <input
                            type="date"
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={readyFrom}
                            onChange={(e) => {
                                dlog('readyFrom date', e.target.value);
                                setReadyFrom(e.target.value);
                            }}
                            aria-label="Filter tanggal jadi dari"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-600">
                            Jadi Sampai
                        </label>
                        <input
                            type="date"
                            className="
        mt-1 w-full rounded-lg border border-slate-200 bg-white
        px-3 py-2 text-sm text-slate-900
        focus:border-slate-900 focus:outline-none
      "
                            value={readyTo}
                            onChange={(e) => {
                                dlog('readyTo date', e.target.value);
                                setReadyTo(e.target.value);
                            }}
                            aria-label="Filter tanggal jadi sampai"
                        />
                    </div>

                    <div className="md:col-span-12 flex flex-wrap items-center justify-end gap-2 pt-1">
                        <button
                            type="button"
                            className="
        inline-flex items-center justify-center
        rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700
        hover:bg-slate-50
      "
                            onClick={onReset}
                        >
                            Reset
                        </button>

                        <button
                            className="
        inline-flex items-center justify-center
        rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white
        hover:bg-slate-800 active:bg-slate-950
      "
                            onClick={onApply}
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            </section>

            {/* Loading / Error / Empty */}
            {loading && (
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                    Memuat…
                </div>
            )}

            {error && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && rows.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M4 7h16" />
                            <path d="M4 12h16" />
                            <path d="M4 17h10" />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-slate-900">Data kosong</div>
                    <div className="mt-1 text-sm text-slate-500">Coba ubah filter atau kata kunci pencarian.</div>
                </div>
            )}

            {/* Table */}
            {rows.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                                <tr className="border-b border-slate-200">
                                    <Th>Nomor</Th>
                                    <Th>Customer</Th>
                                    <Th>Catatan</Th>
                                    <Th>Tanggal Masuk</Th>
                                    <Th>Tanggal Selesai</Th>
                                    <Th>Status Order</Th>
                                    <Th>Status Bayar</Th>
                                    <Th>Metode Bayar</Th>
                                    <Th className="text-right">Total</Th>
                                    <Th className="text-right">Aksi</Th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {rows.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                                        <Td className="font-medium text-slate-900 max-w-[180px] truncate" title={(o.invoice_no ?? o.number) ?? ''}>
                                            {shortOrderNo(o.number, o.invoice_no)}
                                        </Td>

                                        <Td className="max-w-60 truncate" title={o.customer?.name ?? ''}>
                                            <div className="flex flex-col">
                                                <span className="text-slate-900">{o.customer?.name ?? '—'}</span>

                                                {o.customer?.whatsapp && toWaLink(o.customer.whatsapp) ? (
                                                    <a
                                                        href={toWaLink(o.customer.whatsapp)!}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-emerald-600 hover:underline truncate"
                                                    >
                                                        {o.customer.whatsapp}
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </div>
                                        </Td>

                                        <Td className="max-w-[220px]">
                                            <div className="text-slate-600 text-xs line-clamp-2 whitespace-pre-line">
                                                {o.notes && o.notes.trim() !== '' ? o.notes : '-'}
                                            </div>
                                        </Td>

                                        <Td className="text-slate-700">
                                            {formatDateOnly(o.received_at)}
                                        </Td>

                                        <Td className="text-slate-700">
                                            {formatDateOnly(o.ready_at)}
                                        </Td>

                                        <Td>
                                            <StatusBadge status={o.status} />
                                        </Td>

                                        <Td>
                                            <span
                                                className={[
                                                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                                                    paymentStatusClass(o.payment_status),
                                                ].join(' ')}
                                            >
                                                {paymentStatusLabel(o.payment_status)}
                                            </span>
                                        </Td>

                                        <Td>
                                            <span
                                                className={[
                                                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                                                    paymentMethodClass(o.latest_payment_method),
                                                ].join(' ')}
                                            >
                                                {paymentMethodLabel(o.latest_payment_method)}
                                            </span>
                                        </Td>

                                        <Td className="text-right font-medium text-slate-900">
                                            {Number(o.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                        </Td>

                                        <Td className="text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <Link
                                                    to={`/orders/${o.id}`}
                                                    className="
        inline-flex items-center justify-center
        rounded-md border border-slate-200 bg-white px-3 py-1.5
        text-xs font-semibold text-slate-900
        hover:bg-slate-50
      "
                                                >
                                                    Detail
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="
        inline-flex items-center justify-center
        rounded-md bg-slate-900 px-3 py-1.5
        text-xs font-semibold text-white
        hover:bg-slate-800 active:bg-slate-950
      "
                                                    onClick={() => void onOpenReceipt(o.id)}
                                                    title="Lihat/Cetak struk"
                                                >
                                                    Receipt
                                                </button>

                                                {canDeleteOrder(o) && (
                                                    <button
                                                        type="button"
                                                        className="
                              inline-flex items-center justify-center
                              rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5
                              text-xs font-semibold text-rose-700
                              hover:bg-rose-100 active:bg-rose-200
                              disabled:opacity-50 disabled:pointer-events-none
                            "
                                                        onClick={() => openDeleteDialog(o)}
                                                        disabled={deletingId === String(o.id)}
                                                        title="Hapus order"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                <div className="text-xs text-slate-500">
                                    Menampilkan halaman <span className="font-semibold text-slate-900">{meta.current_page}</span> dari{' '}
                                    <span className="font-semibold text-slate-900">{meta.last_page}</span>
                                    {' '}• Total <span className="font-semibold text-slate-900">{meta.total}</span> data
                                </div>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="orders-per-page" className="text-xs font-medium text-slate-600">
                                        Per page
                                    </label>
                                    <select
                                        id="orders-per-page"
                                        value={perPage}
                                        onChange={(e) => onChangePerPage(Number(e.target.value))}
                                        className="
                      rounded-md border border-slate-200 bg-white px-3 py-1.5
                      text-xs font-semibold text-slate-900
                      outline-none focus:border-slate-400
                    "
                                    >
                                        <option value={10}>10</option>
                                        <option value={100}>100</option>
                                        <option value={200}>200</option>
                                        <option value={500}>500</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <button
                                    disabled={page <= 1 || loading}
                                    className="
                    inline-flex items-center justify-center rounded-md
                    border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none
                  "
                                    onClick={onPrev}
                                >
                                    Prev
                                </button>

                                <button
                                    disabled={page >= meta.last_page || loading}
                                    className="
                    inline-flex items-center justify-center rounded-md
                    border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none
                  "
                                    onClick={onNext}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Hapus order?"
                message={
                    deleteTarget
                        ? `Order ${shortOrderNo(deleteTarget.number, deleteTarget.invoice_no)} akan dihapus permanen.`
                        : undefined
                }
                confirmText="Ya, hapus order"
                cancelText="Batal"
                confirmVariant="danger"
                loading={!!deletingId}
                onConfirm={() => { void confirmDeleteOrder(); }}
                onClose={closeDeleteDialog}
            />
        </div>
    );
}

/* ------------------------
   Sub-komponen presentasional
------------------------- */

function Th({
    children,
    className = '',
    ...rest
}: React.ComponentProps<'th'>) {
    return (
        <th
            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${className}`}
            {...rest}
        >
            {children}
        </th>
    );
}

function Td({
    children,
    className = '',
    ...rest
}: React.ComponentProps<'td'>) {
    return (
        <td className={`px-4 py-3 align-middle ${className}`} {...rest}>
            {children}
        </td>
    );
}

function StatusBadge({ status }: { status: OrderBackendStatus }) {
    // Presentasi saja (badge), tidak mengubah logika data
    const base =
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset';

    // mapping warna (jelas dibaca, kontras aman)
    const cls =
        status === 'CANCELED'
            ? 'bg-red-50 text-red-700 ring-red-200'
            : status === 'READY'
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : status === 'PICKED_UP'
                    ? 'bg-slate-900 text-white ring-slate-900'
                    : status === 'DELIVERING'
                        ? 'bg-blue-50 text-blue-700 ring-blue-200'
                        : status === 'WASHING' || status === 'DRYING' || status === 'IRONING'
                            ? 'bg-amber-50 text-amber-700 ring-amber-200'
                            : 'bg-slate-50 text-slate-700 ring-slate-200';

    return <span className={`${base} ${cls}`}>{status}</span>;
}
