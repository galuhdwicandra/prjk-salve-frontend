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
            let photo: File | null = null;
            if (status === 'HANDOVER' && file) {
                if (file.size > 4 * 1024 * 1024) { // 4MB
                    dbg.warn('blocked: file too large (>4MB)');
                    return;
                }
                photo = file;
            }
            await updateDeliveryStatus(row.id, { status, note: null, photo });
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
            {/* Header */}
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Delivery Detail</h1>
                    <div className="text-xs text-gray-600">ID: {row.id}</div>
                </div>
                <span className={statusChipClass(row.status)} aria-label={`Status: ${row.status}`}>
                    {row.status}
                </span>
            </header>

            {/* Card: Info utama */}
            <section className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1">
                <div className="p-4 grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <InfoLine label="Order">
                            <span className="font-medium">{row.order_id}</span>
                        </InfoLine>
                        <InfoLine label="Tipe">
                            <span>{row.type}</span>
                        </InfoLine>
                        <InfoLine label="Fee">
                            <span className="tabular-nums">
                                {Number(row.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </span>
                        </InfoLine>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs text-gray-600">Kurir</label>
                        <AssignCourierSelect
                            value={row.assigned_to ?? null}
                            onChange={onAssign}
                            disabled={!canAssign}
                        />
                    </div>
                </div>
            </section>

            {/* Card: Progress & aksi */}
            <section className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1">
                <div className="p-4 space-y-3">
                    <DeliveryStatusStepper status={row.status} />

                    <div className="grid gap-3 md:grid-cols-[240px_1fr] items-center">
                        <div className="grid gap-1">
                            <label htmlFor="status" className="text-xs text-gray-600">Ubah status</label>
                            <select
                                id="status"
                                className="input py-2"
                                value={row.status}
                                onChange={(e) => {
                                    const next = e.target.value as DeliveryStatus;
                                    dbg.log('status select changed', { from: row.status, to: next });
                                    void onUpdateStatus(next);
                                }}
                                disabled={!canUpdate}
                            >
                                {(['CREATED', 'ASSIGNED', 'ON_THE_WAY', 'PICKED', 'HANDOVER', 'COMPLETED', 'FAILED', 'CANCELLED'] as DeliveryStatus[])
                                    .map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="grid gap-1">
                            <label htmlFor="proof" className="text-xs text-gray-600">
                                Bukti serah-terima (opsional; digunakan saat HANDOVER, maks. 4MB)
                            </label>
                            <input
                                id="proof"
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="input py-1.5"
                                onChange={() => {
                                    const f = fileRef.current?.files?.[0] ?? null;
                                    dbg.log('file selected', f ? { name: f.name, size: f.size, type: f.type } : '(none)');
                                }}
                            />
                            {row.handover_photo && (
                                <div className="pt-1">
                                    <a
                                        href={(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '') + '/' + String(row.handover_photo).replace(/^\/+/, '')}
                                        target="_blank" rel="noopener noreferrer"
                                        className="btn-outline inline-flex"
                                        onClick={() => dbg.log('open proof clicked', { url: row.handover_photo })}
                                    >
                                        Lihat bukti serah-terima
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------- Sub UI ---------- */
function InfoLine({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-600">{label}</span>
            <div className="text-sm">{children}</div>
        </div>
    );
}

function statusChipClass(s: DeliveryStatus) {
    // Progress aktif = solid brand; selesai = subtle; batal/error = danger
    if (s === 'COMPLETED') return 'chip chip--subtle';
    if (s === 'FAILED' || s === 'CANCELLED') return 'chip chip--danger';
    return 'chip chip--solid';
}
