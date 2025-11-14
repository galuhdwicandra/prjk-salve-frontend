// src/pages/orders/OrderDetail.tsx
import { useCallback, useEffect, useState } from 'react';
import {
    getOrder,
    updateOrderStatus,
    getOrderReceiptHtml,
    openOrderReceipt,
} from '../../api/orders';
import ReceiptPreview from '../../components/ReceiptPreview';
import type { Order, OrderBackendStatus } from '../../types/orders';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import OrderPhotosGallery from '../../components/orders/OrderPhotosGallery';
import OrderPhotosUpload from '../../components/orders/OrderPhotosUpload';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllowedNext } from '../../utils/order-status';
import { isAxiosError } from 'axios';


type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[] | string>;
};

export default function OrderDetail(): React.ReactElement {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [row, setRow] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [receiptOpen, setReceiptOpen] = useState(false);
    const [receiptHtml, setReceiptHtml] = useState<string>('');
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptErr, setReceiptErr] = useState<string | null>(null);

    const loadReceipt = useCallback(async () => {
        if (!id) return;
        setReceiptLoading(true);
        setReceiptErr(null);
        try {
            const html = await getOrderReceiptHtml(id);
            setReceiptHtml(html);
        } catch {
            setReceiptErr('Gagal memuat struk');
        } finally {
            setReceiptLoading(false);
        }
    }, [id]);

    const refresh = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setErr(null);
        try {
            const res = await getOrder(id);
            setRow(res.data);
        } catch {
            setErr('Gagal memuat detail');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { void refresh(); }, [refresh]);

    const onTransit = useCallback(async (next: OrderBackendStatus) => {
        if (!id) return;
        try {
            await updateOrderStatus(id, next);
            await refresh();
        } catch (e: unknown) {
            let msg = 'Gagal ubah status';
            if (isAxiosError<ApiErrorResponse>(e)) {
                const api = e.response?.data;
                const errMap = api?.errors;

                const nextVal = errMap?.['next'];
                let detail: string | undefined;
                if (typeof nextVal === 'string') detail = nextVal;
                else if (Array.isArray(nextVal)) detail = nextVal[0];
                else if (errMap) {
                    const v = Object.values(errMap)[0];
                    detail = Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
                }

                msg = api?.message ?? detail ?? msg;
            }
            alert(msg);
        }
    }, [id, refresh]);

    return (
        <div className="space-y-3">
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {err && <div className="text-sm text-red-600">{err}</div>}
            {!loading && !row && !err && <div className="text-sm text-muted-foreground">Tidak ditemukan</div>}
            {row && (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold">Order #{row.id}</div>
                            <div className="text-xs text-muted-foreground">{row.customer?.name ?? '-'}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Tombol buka struk di tab baru */}
                            <button
                                type="button"
                                className="px-3 py-1.5 text-xs border rounded"
                                onClick={() => openOrderReceipt(row.id)}             // GET /orders/{id}/receipt -> tab baru
                                title="Buka struk di tab baru"
                            >
                                Receipt
                            </button>

                            {/* Toggle preview di halaman */}
                            <button
                                type="button"
                                className="px-3 py-1.5 text-xs border rounded"
                                onClick={async () => {
                                    const next = !receiptOpen;
                                    setReceiptOpen(next);
                                    if (next && !receiptHtml) {
                                        await loadReceipt();
                                    }
                                }}
                                title="Tampilkan/ sembunyikan preview struk"
                            >
                                {receiptOpen ? 'Tutup Preview' : 'Preview Receipt'}
                            </button>

                            {/* Shortcut ke halaman Piutang (F10) bila masih ada sisa */}
                            {(row.due_amount ?? 0) > 0 && (
                                <button
                                    type="button"
                                    className="px-3 py-1.5 text-xs rounded bg-black text-white"
                                    onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? '')}`)}
                                    title="Menuju halaman Piutang untuk pelunasan"
                                >
                                    Pelunasan
                                </button>
                            )}

                            <OrderStatusStepper backendStatus={row.status} />
                        </div>
                    </div>

                    <div className="rounded-2xl border p-3 overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Layanan</th>
                                    <th className="px-3 py-2 text-left">Qty</th>
                                    <th className="px-3 py-2 text-left">Harga</th>
                                    <th className="px-3 py-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(row.items ?? []).map((it) => (
                                    <tr key={it.id} className="border-t">
                                        <td className="px-3 py-2">{it.service?.name ?? it.service_id}</td>
                                        <td className="px-3 py-2">{it.qty}</td>
                                        <td className="px-3 py-2">{Number(it.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                                        <td className="px-3 py-2">{Number(it.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end gap-6 mt-3 text-sm">
                            <div><span className="text-muted-foreground">Subtotal</span> <b>{Number(row.subtotal).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                            <div><span className="text-muted-foreground">Diskon</span> <b>{Number(row.discount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                            <div><span className="text-muted-foreground">Grand</span> <b>{Number(row.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                            <div><span className="text-muted-foreground">Sisa</span> <b>{Number(row.due_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                        </div>
                    </div>

                    <OrderPhotosGallery
                        key={`${row.id}:${row.photos?.length ?? 0}`}
                        photos={row.photos ?? []}
                    />
                    <div className="mt-3">
                        <OrderPhotosUpload
                            orderId={row.id}
                            onUploaded={async () => { await refresh(); }}
                        />
                    </div>

                    {/* RECEIPT PREVIEW */}
                    {receiptOpen && (
                        <div className="rounded-2xl border">
                            <div className="flex items-center justify-between px-3 py-2 border-b">
                                <div className="text-sm font-semibold">Receipt Preview</div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="px-3 py-1.5 text-xs border rounded"
                                        onClick={loadReceipt}
                                        disabled={receiptLoading}
                                    >
                                        {receiptLoading ? 'Memuat…' : 'Reload'}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1.5 text-xs border rounded"
                                        onClick={() => openOrderReceipt(row.id, true)} // auto-print di tab baru (opsional)
                                        title="Buka & print"
                                    >
                                        Open & Print
                                    </button>
                                </div>
                            </div>

                            {receiptErr && <div className="p-3 text-xs text-red-600">{receiptErr}</div>}
                            {!receiptErr && receiptLoading && (
                                <div className="p-3 text-xs text-muted-foreground">Memuat struk…</div>
                            )}
                            {!receiptErr && !receiptLoading && !receiptHtml && (
                                <div className="p-3 text-xs text-muted-foreground">Belum ada HTML struk.</div>
                            )}
                            {!receiptErr && !!receiptHtml && (
                                <ReceiptPreview html={receiptHtml} height="70vh" />
                            )}
                        </div>
                    )}

                    <div className="rounded-2xl border p-3 flex flex-wrap gap-2">
                        {getAllowedNext(row.status).map((s) => (
                            <button
                                key={s}
                                className="border rounded px-2 py-1 text-xs"
                                onClick={() => void onTransit(s)}
                                title={`Set status ke ${s}`}
                            >
                                Set {s}
                            </button>
                        ))}

                        {getAllowedNext(row.status).length === 0 && (
                            <span className="text-xs text-muted-foreground">
                                Status terminal — tidak ada transisi.
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
