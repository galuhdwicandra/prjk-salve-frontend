// src/pages/deliveries/DeliveryIndex.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import AssignCourierSelect from '../../components/delivery/AssignCourierSelect';
import { listDeliveries, assignCourier, updateDeliveryStatus } from '../../api/deliveries';
import type { Delivery, DeliveryStatus } from '../../types/deliveries';
import { useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';
import { getOrder } from '../../api/orders';

const STATUSES: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED', 'FAILED', 'CANCELLED'];

/* eslint-disable no-console */
const TAG = '[DeliveryIndex]';
const dbg = {
  log: (...args: unknown[]) => { if (import.meta.env.DEV) console.log(TAG, ...args); },
  warn: (...args: unknown[]) => { if (import.meta.env.DEV) console.warn(TAG, ...args); },
  err: (...args: unknown[]) => { if (import.meta.env.DEV) console.error(TAG, ...args); },
  group: (label: string) => { if (import.meta.env.DEV) console.groupCollapsed(`${TAG} ${label}`); },
  groupEnd: () => { if (import.meta.env.DEV) console.groupEnd(); },
};
/* eslint-enable no-console */

export default function DeliveryIndex() {
  const canAssign = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);
  const canUpdate = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']);

  const [status, setStatus] = useState<DeliveryStatus | ''>('');
  const [courier, setCourier] = useState<string | number | ''>('');
  const [rows, setRows] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [orderMap, setOrderMap] = useState<Record<string, { invoice_no?: string | null; number?: string | null }>>({});

  const load = useCallback(async () => {
    const t0 = performance.now();
    dbg.group('load() start');
    dbg.log('filters', { status: status || '(all)', courier: courier || '(all)' });
    setLoading(true); setErr(null);
    try {
      const res = await listDeliveries({
        status: status || undefined,
        courier_id: courier || undefined,
        per_page: 100,
      });
      const list = res.data ?? [];
      setRows(list);
      dbg.log('loaded rows:', list.length, { sample: list.slice(0, 3) });
      try {
        const ids = Array.from(new Set(list.map(d => d.order_id).filter(Boolean)));
        if (ids.length) {
          // Batasi konkuren sederhana
          const chunkSize = 6;
          const nextMap: Record<string, { invoice_no?: string | null; number?: string | null }> = {};
          for (let i = 0; i < ids.length; i += chunkSize) {
            const chunk = ids.slice(i, i + chunkSize);
            const results = await Promise.allSettled(chunk.map((oid) => getOrder(oid)));
            results.forEach((r) => {
              if (r.status === 'fulfilled') {
                const data = r.value?.data;
                if (data?.id) {
                  nextMap[data.id] = { invoice_no: data.invoice_no ?? null, number: data.number ?? null };
                }
              }
            });
          }
          setOrderMap(prev => ({ ...prev, ...nextMap }));
        }
      } catch (e) {
        dbg.warn('hydrate order labels failed:', e);
      }
    } catch (e) {
      dbg.err('load() error:', e);
      setErr('Gagal memuat deliveries');
      setRows([]);
    } finally {
      setLoading(false);
      const dt = (performance.now() - t0).toFixed(1);
      dbg.log(`load() done in ${dt}ms`);
      dbg.groupEnd();
    }
  }, [status, courier]);

  useEffect(() => {
    dbg.log('mount');
    return () => { dbg.log('unmount'); };
  }, []);

  useEffect(() => {
    dbg.log('effect load() — dependencies changed', { status, courier });
    void load();
  }, [load, status, courier]);

  const onAssign = useCallback(async (d: Delivery, user_id: string | number | null) => {
    dbg.group('onAssign');
    dbg.log('attempt', { delivery_id: d.id, user_id, canAssign });
    try {
      if (!canAssign) {
        dbg.warn('blocked: no permission to assign');
        return;
      }
      if (!user_id) {
        dbg.warn('skipped: user_id is null/empty');
        return;
      }
      await assignCourier(d.id, { user_id });
      dbg.log('assign success → reload');
      await load();
    } catch (e) {
      dbg.err('assign error:', e);
    } finally {
      dbg.groupEnd();
    }
  }, [canAssign, load]);

  const advance = useCallback(async (d: Delivery) => {
    dbg.group('advance');
    dbg.log('attempt', { delivery_id: d.id, from: d.status, canUpdate });
    try {
      if (!canUpdate) {
        dbg.warn('blocked: no permission to update status');
        return;
      }
      const flow: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED'];
      const i = Math.max(0, flow.indexOf(d.status));
      const next = flow[Math.min(i + 1, flow.length - 1)];
      dbg.log('computed next', { next, index: i });

      if (next !== d.status) {
        await updateDeliveryStatus(d.id, { status: next });
        dbg.log('status updated → reload');
        await load();
      } else {
        dbg.warn('no-op: already at terminal or same status');
      }
    } catch (e) {
      dbg.err('advance error:', e);
    } finally {
      dbg.groupEnd();
    }
  }, [canUpdate, load]);

  // helper
  type DeliveryWithOrderRef = Delivery & {
    order_invoice_no?: string | null;
    order_number?: string | null;
  };
  const getOrderLabel = (d: Delivery): string => {
    const dx = d as DeliveryWithOrderRef;
    const cached = orderMap[d.order_id];
    return cached?.invoice_no ?? cached?.number ?? dx.order_invoice_no ?? dx.order_number ?? d.order_id;
  };

  const columns = useMemo(() => {
    dbg.log('columns memo recalculated');
    return [
      { key: 'id', header: 'ID' },
      {
        key: 'order_id', header: 'Order',
        render: (r: Delivery) => (
          <Link className="underline" to={`/orders/${r.order_id}`}>
            {getOrderLabel(r)}
          </Link>
        ),
      },
      { key: 'type', header: 'Tipe' },
      { key: 'fee', header: 'Fee', render: (r: Delivery) => Number(r.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
      {
        key: 'assigned_to', header: 'Kurir',
        render: (r: Delivery) => (
          <AssignCourierSelect
            value={r.assigned_to ?? null}
            onChange={(v) => onAssign(r, v)}
            disabled={!canAssign}
          />
        ),
      },
      {
        key: 'status', header: 'Status',
        render: (r: Delivery) => (
          <div className="flex items-center gap-2">
            <span className="text-xs rounded px-2 py-1 border">{r.status}</span>
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => void advance(r)}
              disabled={!canUpdate || r.status === 'DELIVERED' || r.status === 'FAILED' || r.status === 'CANCELLED'}
              title="Majukan status"
            >
              Next
            </button>
          </div>
        ),
      },
      { key: 'created_at', header: 'Dibuat' },
    ];
  }, [canAssign, canUpdate, onAssign, advance, orderMap]);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Deliveries</h1>
          <p className="text-xs text-gray-600">Auto-assign & tracking</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex flex-col">
          <label className="text-xs mb-1">Status</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={status}
            onChange={(e) => {
              dbg.log('filter change: status →', e.target.value || '(all)');
              setStatus(e.target.value as DeliveryStatus | '');
            }}
          >
            <option value="">— Semua —</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs mb-1">Kurir</label>
          <AssignCourierSelect
            value={courier || null}
            onChange={(v) => {
              dbg.log('filter change: courier →', v ?? '(all)');
              setCourier(v ?? '');
            }}
          />
        </div>
        <button
          type="button"
          className="border rounded px-3 py-2 text-sm"
          onClick={() => {
            dbg.log('filters reset');
            setStatus('');
            setCourier('');
          }}
        >
          Reset
        </button>
      </div>

      <DataTable<Delivery>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText={err ?? 'Belum ada data'}
      />
    </div>
  );
}
