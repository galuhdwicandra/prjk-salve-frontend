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
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="Cari kode/nama/phone…"
          value={q}
          onChange={(e) => { dlog('q input', e.target.value); setQ(e.target.value); }}
        />
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={(e) => { const v = e.target.value as OrderBackendStatus | ''; dlog('status select', v); setStatus(v); }}
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
        <button className="border rounded px-3 py-2" onClick={onApply}>Terapkan</button>
        <Link to="/pos" className="ml-auto rounded bg-black text-white px-3 py-2">Buat Transaksi</Link>
      </div>

      {loading && <div className="text-sm text-gray-500">Memuat…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && rows.length === 0 && <div className="text-sm text-muted-foreground">Data kosong</div>}

      {rows.length > 0 && (
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Kode</th>
                <th className="px-3 py-2 text-left">Customer</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-3 py-2">{o.id}</td>
                  <td className="px-3 py-2">{o.customer?.name ?? '-'}</td>
                  <td className="px-3 py-2">{o.status}</td>
                  <td className="px-3 py-2">{Number(o.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Link to={`/orders/${o.id}`} className="underline text-xs">Detail</Link>
                      <button
                        type="button"
                        className="text-xs border rounded px-2 py-1"
                        onClick={() => void onOpenReceipt(o.id)}
                        title="Lihat/Cetak struk"
                      >
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-end gap-2 p-2">
              <button disabled={page <= 1} className="border rounded px-2 py-1" onClick={onPrev}>Prev</button>
              <div className="text-xs">Page {meta.current_page} / {meta.last_page}</div>
              <button disabled={page >= meta.last_page} className="border rounded px-2 py-1" onClick={onNext}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
