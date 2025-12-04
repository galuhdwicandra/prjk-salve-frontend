// src/pages/deliveries/DeliveryIndex.tsx
import { useCallback, useEffect, useState } from 'react';
// import DataTable from '../../components/DataTable'; // tidak dipakai karena menggunakan tabel konsisten Customers
import AssignCourierSelect from '../../components/delivery/AssignCourierSelect';
import { listDeliveries, assignCourier, updateDeliveryStatus } from '../../api/deliveries';
import type { Delivery, DeliveryStatus } from '../../types/deliveries';
import { useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';
import { getOrder } from '../../api/orders';

const STATUSES: DeliveryStatus[] = [
  'CREATED',
  'ASSIGNED',
  'ON_THE_WAY',
  'PICKED',
  'HANDOVER',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
];

const FLOW: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'ON_THE_WAY', 'PICKED', 'HANDOVER', 'COMPLETED'];
const TERMINALS = new Set<DeliveryStatus>(['COMPLETED', 'FAILED', 'CANCELLED']);

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

      // Hydrate label order
      try {
        const ids = Array.from(new Set(list.map(d => d.order_id).filter(Boolean)));
        if (ids.length) {
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

  useEffect(() => { dbg.log('mount'); return () => { dbg.log('unmount'); }; }, []);
  useEffect(() => { dbg.log('effect load() — dependencies changed', { status, courier }); void load(); }, [load, status, courier]);

  const onAssign = useCallback(async (d: Delivery, user_id: string | number | null) => {
    dbg.group('onAssign');
    dbg.log('attempt', { delivery_id: d.id, user_id, canAssign });
    try {
      if (!canAssign) { dbg.warn('blocked: no permission to assign'); return; }
      if (!user_id) { dbg.warn('skipped: user_id is null/empty'); return; }
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
      if (!canUpdate) { dbg.warn('blocked: no permission to update status'); return; }
      if (TERMINALS.has(d.status)) { dbg.warn('no-op: terminal status'); return; }
      const i = Math.max(0, FLOW.indexOf(d.status));
      const next = FLOW[Math.min(i + 1, FLOW.length - 1)];
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
  type DeliveryWithOrderRef = Delivery & { order_invoice_no?: string | null; order_number?: string | null; };
  const getOrderLabel = (d: Delivery): string => {
    const dx = d as DeliveryWithOrderRef;
    const cached = orderMap[d.order_id];
    return cached?.invoice_no ?? cached?.number ?? dx.order_invoice_no ?? dx.order_number ?? d.order_id;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Deliveries</h1>
          <p className="text-xs text-gray-600">Auto-assign & tracking</p>
        </div>
      </header>

      {/* FilterBar */}
      <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1" aria-label="Filter deliveries">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Status</span>
            <select
              className="input py-2"
              value={status}
              onChange={(e) => { dbg.log('filter change: status →', e.target.value || '(all)'); setStatus(e.target.value as DeliveryStatus | ''); }}
              aria-label="Filter status"
            >
              <option value="">— Semua —</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Kurir</span>
            <AssignCourierSelect
              value={courier || null}
              onChange={(v) => { dbg.log('filter change: courier →', v ?? '(all)'); setCourier(v ?? ''); }}
            />
          </label>

          <div className="flex items-end">
            <button
              type="button"
              className="btn-outline"
              onClick={() => { dbg.log('filters reset'); setStatus(''); setCourier(''); }}
              aria-label="Reset filter"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {err && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {err}
        </div>
      )}

      {/* Empty state */}
      {!loading && !err && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada data.
        </div>
      )}

      {/* Table (konsisten dengan Customers) */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>ID</Th>
                  <Th>Order</Th>
                  <Th>Tipe</Th>
                  <Th className="text-right">Fee</Th>
                  <Th>Kurir</Th>
                  <Th>Status</Th>
                  <Th>Dibuat</Th>
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
                  </>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-mono">{r.id}</span></Td>
                      <Td>
                        <Link className="underline" to={`/orders/${r.order_id}`}>
                          {getOrderLabel(r)}
                        </Link>
                      </Td>
                      <Td>{r.type}</Td>
                      <Td className="text-right">
                        {Number(r.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </Td>
                      <Td>
                        <AssignCourierSelect
                          value={r.assigned_to ?? null}
                          onChange={(v) => onAssign(r, v)}
                          disabled={!canAssign}
                        />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <span className={chipClass(r.status)}>{r.status}</span>
                          <button
                            type="button"
                            className="btn-outline text-xs px-2 py-1"
                            onClick={() => void advance(r)}
                            disabled={!canUpdate || TERMINALS.has(r.status)}
                            title="Majukan status"
                          >
                            Next
                          </button>
                        </div>
                      </Td>
                      <Td>{r.created_at}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Subcomponents & helpers (konsisten dengan Customers) ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-8 w-36 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-6 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}

/** Map status ke gaya chip konsisten */
function chipClass(s: DeliveryStatus) {
  if (s === 'FAILED' || s === 'CANCELLED') {
    return 'inline-flex items-center rounded-full px-2.5 py-1 text-xs text-white bg-[color:var(--color-status-danger)]';
  }
  if (s === 'COMPLETED') {
    return 'inline-flex items-center rounded-full px-2.5 py-1 text-xs text-[color:var(--color-brand-primary)] bg-[#E6EDFF]';
  }
  // progress statuses
  return 'inline-flex items-center rounded-full px-2.5 py-1 text-xs text-[color:var(--color-brand-on)] bg-[color:var(--color-brand-primary)]';
}
