// src/pages/deliveries/DeliveryDetail.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assignCourier, listDeliveries, updateDeliveryStatus } from '../../api/deliveries';
import type { Delivery, DeliveryStatus } from '../../types/deliveries';
import AssignCourierSelect from '../../components/delivery/AssignCourierSelect';
import DeliveryStatusStepper from '../../components/delivery/DeliveryStatusStepper';
import { useHasRole } from '../../store/useAuth';

/* eslint-disable no-console */
const TAG = '[DeliveryDetail]';
const dbg = {
    log: (...args: unknown[]) => { if (import.meta.env.DEV) console.log(TAG, ...args); },
    warn: (...args: unknown[]) => { if (import.meta.env.DEV) console.warn(TAG, ...args); },
    err: (...args: unknown[]) => { if (import.meta.env.DEV) console.error(TAG, ...args); },
    group: (label: string) => { if (import.meta.env.DEV) console.groupCollapsed(`${TAG} ${label}`); },
    groupEnd: () => { if (import.meta.env.DEV) console.groupEnd(); },
};
/* eslint-enable no-console */

export default function DeliveryDetail() {
    const { id } = useParams();
    const [row, setRow] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const canAssign = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);
    const canUpdate = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']);

    const load = useCallback(async () => {
        dbg.group('load() start');
        dbg.log('params', { id });
        if (!id) {
            dbg.warn('no id in params; abort load');
            dbg.groupEnd();
            return;
        }
        const t0 = performance.now();
        setLoading(true); setErr(null);
        try {
            const res = await listDeliveries({ q: id, per_page: 1 });
            const list = res.data ?? [];
            const found = list.find(d => String(d.id) === String(id)) ?? null;
            setRow(found);
            if (!found) {
                setErr('Delivery tidak ditemukan');
                dbg.warn('not found');
            } else {
                dbg.log('found row', { id: found.id, status: found.status, assigned_to: found.assigned_to });
            }
        } catch (e) {
            dbg.err('load() error:', e);
            setErr('Gagal memuat delivery');
        } finally {
            setLoading(false);
            const dt = (performance.now() - t0).toFixed(1);
            dbg.log(`load() done in ${dt}ms`);
            dbg.groupEnd();
        }
    }, [id]);

    useEffect(() => {
        dbg.log('mount');
        void load();
        return () => { dbg.log('unmount'); };
    }, [load]);

    async function onAssign(user_id: string | number | null) {
        dbg.group('onAssign');
        dbg.log('attempt', { page_id: id, row_id: row?.id, user_id, canAssign });
        try {
            if (!row) { dbg.warn('blocked: no row'); return; }
            if (!canAssign) { dbg.warn('blocked: no permission'); return; }
            if (!user_id) { dbg.warn('skipped: user_id empty'); return; }
            await assignCourier(row.id, { user_id });
            dbg.log('assign success → reload');
            await load();
        } catch (e) {
            dbg.err('assign error:', e);
        } finally {
            dbg.groupEnd();
        }
    }

    async function onUpdateStatus(status: DeliveryStatus) {
        dbg.group('onUpdateStatus');
        const file = fileRef.current?.files?.[0] ?? null;
        dbg.log('attempt', {
            page_id: id,
            row_id: row?.id,
            from: row?.status,
            to: status,
            hasFile: !!file,
            canUpdate,
        });
        try {
            if (!row) { dbg.warn('blocked: no row'); return; }
            if (!canUpdate) { dbg.warn('blocked: no permission'); return; }
            await updateDeliveryStatus(row.id, { status, handover_photo: file });
            if (fileRef.current) {
                fileRef.current.value = '';
                dbg.log('file input cleared');
            }
            dbg.log('status updated → reload');
            await load();
        } catch (e) {
            dbg.err('update status error:', e);
        } finally {
            dbg.groupEnd();
        }
    }

    if (loading) return <div className="text-sm text-gray-500">Memuat…</div>;
    if (err) return <div className="text-sm text-red-600">{err}</div>;
    if (!row) return null;

    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-lg font-semibold">Delivery Detail</h1>
                <div className="text-xs text-gray-600">ID: {row.id}</div>
            </header>

            <div className="rounded-xl border p-4 space-y-3">
                <div className="flex flex-wrap gap-6 items-center">
                    <div><span className="text-xs">Order:</span> <span className="text-sm font-medium">{row.order_id}</span></div>
                    <div><span className="text-xs">Tipe:</span> <span className="text-sm">{row.type}</span></div>
                    <div><span className="text-xs">Fee:</span> <span className="text-sm">{Number(row.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span></div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs">Kurir</span>
                    <AssignCourierSelect value={row.assigned_to ?? null} onChange={onAssign} disabled={!canAssign} />
                </div>

                <div className="space-y-2">
                    <DeliveryStatusStepper status={row.status} />
                    <div className="flex items-center gap-2">
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            defaultValue={row.status}
                            onChange={(e) => {
                                const next = e.target.value as DeliveryStatus;
                                dbg.log('status select changed', { from: row.status, to: next });
                                void onUpdateStatus(next);
                            }}
                            disabled={!canUpdate}
                        >
                            {(['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED', 'FAILED', 'CANCELLED'] as DeliveryStatus[])
                                .map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="text-xs"
                            title="Foto serah-terima (opsional; dipakai saat DELIVERED)"
                            onChange={() => {
                                const f = fileRef.current?.files?.[0] ?? null;
                                dbg.log('file selected', f ? { name: f.name, size: f.size, type: f.type } : '(none)');
                            }}
                        />
                    </div>
                    {row.handover_photo && (
                        <a
                            href={(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '') + '/' + String(row.handover_photo).replace(/^\/+/, '')}
                            target="_blank" rel="noopener noreferrer"
                            className="text-xs underline"
                            onClick={() => dbg.log('open proof clicked', { url: row.handover_photo })}
                        >
                            Lihat bukti serah-terima
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
