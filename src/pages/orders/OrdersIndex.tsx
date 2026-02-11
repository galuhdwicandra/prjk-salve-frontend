// src/pages/orders/OrdersIndex.tsx
import { useCallback, useEffect, useState } from 'react';
import { listOrders, openOrderReceipt } from '../../api/orders';
import type { Order, OrderBackendStatus, PaginationMeta } from '../../types/orders';
import { Link } from 'react-router-dom';

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

export default function OrdersIndex(): React.ReactElement {
  const [rows, setRows] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<OrderBackendStatus | ''>('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (p = 1) => {
    dlog('refresh start', { q: q || undefined, status: status || undefined, page: p, perPage });
    setLoading(true); setError(null);
    try {
      const res = await listOrders({ q: q || undefined, status: status || undefined, page: p, per_page: perPage });
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
  }, [q, status]);

  useEffect(() => { dlog('mount'); return () => dlog('unmount'); }, []);
  useEffect(() => { dlog('query changed', q); }, [q]);
  useEffect(() => { dlog('status changed', status); }, [status]);
  useEffect(() => { dlog('page changed', page); }, [page]);
  useEffect(() => { dlog('rows/meta updated', { rows: rows.length, meta }); }, [rows, meta]);
  useEffect(() => { dlog('loading/error', { loading, error }); }, [loading, error]);

  useEffect(() => { void refresh(1); }, [refresh]);

  const onApply = () => {
    dlog('apply filter clicked');
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

  const onOpenReceipt = async (id: Order['id']) => {
    dlog('open receipt', id);
    try {
      await openOrderReceipt(id); // akan buka tab baru berisi HTML struk
    } catch (e) {
      dlog('open receipt error', e);
      setError('Gagal membuka struk. Izinkan pop-up untuk situs ini, lalu coba lagi.');
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
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-600">
              Pencarian
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {/* search icon */}
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
                placeholder="Cari nomor (INV…)/nama/phone…"
                value={q}
                onChange={(e) => { dlog('q input', e.target.value); setQ(e.target.value); }}
                aria-label="Cari pesanan"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-600">
              Status
            </label>
            <select
              className="
                mt-1 w-full rounded-lg border border-slate-200 bg-white
                px-3 py-2 text-sm text-slate-900
                focus:border-slate-900 focus:outline-none
              "
              value={status}
              onChange={(e) => { const v = e.target.value as OrderBackendStatus | ''; dlog('status select', v); setStatus(v); }}
              aria-label="Filter status"
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

          <div className="md:col-span-3 flex items-center gap-2">
            <button
              className="
                inline-flex w-full items-center justify-center
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
                  <Th>Status</Th>
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

                    <Td className="max-w-[240px] truncate" title={o.customer?.name ?? ''}>
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

                    <Td>
                      <StatusBadge status={o.status} />
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
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                Menampilkan halaman <span className="font-semibold text-slate-900">{meta.current_page}</span> dari{' '}
                <span className="font-semibold text-slate-900">{meta.last_page}</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  disabled={page <= 1}
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
                  disabled={page >= meta.last_page}
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
