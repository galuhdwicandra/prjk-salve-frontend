// src/pages/orders/OrdersIndex.tsx
import { useCallback, useEffect, useState } from 'react';
import { listOrders, openOrderReceipt } from '../../api/orders';
import type { Order, OrderBackendStatus, PaginationMeta } from '../../types/orders';
import { Link } from 'react-router-dom';

const dlog = (...args: unknown[]) => {
  if (import.meta.env?.DEV) console.log('[OrdersIndex]', ...args);
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

  return (
    <div className="space-y-4">
      {/* FilterBar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter orders"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3">
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="text-[color:var(--color-text-default)]">Pencarian</span>
            <input
              className="input px-3 py-2"
              placeholder="Cari kode/nama/phone…"
              value={q}
              onChange={(e) => { dlog('q input', e.target.value); setQ(e.target.value); }}
              aria-label="Cari pesanan"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Status</span>
            <select
              className="input px-3 py-2"
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
          </label>

          <div className="flex items-end gap-2">
            <button className="btn-primary" onClick={onApply}>Terapkan</button>
            {/* Tombol reset opsional bila ada kebutuhan nanti */}
          </div>

          <div className="flex items-end md:justify-end">
            <Link to="/pos" className="btn-primary md:ml-auto text-[color:var(--color-brand-on)]" aria-label="Buat transaksi baru">
              Buat Transaksi
            </Link>
          </div>
        </div>
      </section>

      {/* Loading / Error / Empty */}
      {loading && (
        <div className="text-sm text-gray-600">
          Memuat…
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-6 text-sm text-gray-500">
          Data kosong
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Kode</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th>Total</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {rows.map((o) => (
                  <tr key={o.id} className="hover:bg-black/5 transition-colors">
                    <Td>{o.id}</Td>
                    <Td>{o.customer?.name ?? '-'}</Td>
                    <Td><StatusBadge status={o.status} /></Td>
                    <Td>
                      {Number(o.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Link to={`/orders/${o.id}`} className="text-xs text-[color:var(--color-brand-primary)] hover:underline">
                          Detail
                        </Link>
                        <button
                          type="button"
                          className="text-xs btn-outline px-2 py-1"
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

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-end gap-2 p-2 border-t border-[color:var(--color-border)]">
              <button
                disabled={page <= 1}
                className="btn-outline px-2 py-1 disabled:opacity-50 disabled:pointer-events-none"
                onClick={onPrev}
              >
                Prev
              </button>
              <div className="text-xs text-gray-600">
                Page {meta.current_page} / {meta.last_page}
              </div>
              <button
                disabled={page >= meta.last_page}
                className="btn-outline px-2 py-1 disabled:opacity-50 disabled:pointer-events-none"
                onClick={onNext}
              >
                Next
              </button>
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-middle">{children}</td>;
}

function StatusBadge({ status }: { status: OrderBackendStatus }) {
  // Murni presentasi (warna/varian), tidak mengubah logika data
  const clsBase = 'chip text-xs';
  const cls =
    status === 'CANCELED'
      ? 'chip--danger'
      : status === 'READY' || status === 'PICKED_UP'
      ? 'chip--solid'
      : 'chip--subtle';
  return <span className={`${clsBase} ${cls}`}>{status}</span>;
}
