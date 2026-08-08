// src/pages/orders/OrderTracker.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { trackOrder } from '../../api/orders';
import { getErrorMessage } from '../../api/client';
import { fmtDate } from '../../utils/date';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import type { OrderTrackResult } from '../../types/orders';

const STATUS_LABEL: Record<OrderTrackResult['status'], string> = {
  QUEUE: 'Menunggu diproses',
  WASHING: 'Sedang dicuci',
  DRYING: 'Sedang dikeringkan',
  IRONING: 'Sedang finishing',
  READY: 'Siap diambil',
  DELIVERING: 'Dalam pengiriman',
  PICKED_UP: 'Selesai diambil',
  CANCELED: 'Dibatalkan',
};

export default function OrderTracker(): React.ReactElement {
  const { number } = useParams<{ number: string }>();
  const [data, setData] = useState<OrderTrackResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!number) return;
    setLoading(true);
    setError(null);
    trackOrder(number)
      .then((res) => setData(res.data))
      .catch((e) => setError(getErrorMessage(e, 'Order tidak ditemukan')))
      .finally(() => setLoading(false));
  }, [number]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-5 w-40 rounded bg-slate-200/70 animate-pulse" />
        <div className="h-3 w-full rounded bg-slate-200/70 animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-slate-200/70 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center">
        <img src="/logo-salve.png" alt="Logo Salve" className="mx-auto mb-4 h-12 w-12 object-contain" />
        <p role="alert" className="text-sm text-slate-600">
          {error ?? 'Order tidak ditemukan.'}
        </p>
      </div>
    );
  }

  const isCanceled = data.status === 'CANCELED';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <img src="/logo-salve.png" alt="Logo Salve" className="h-10 w-10 object-contain" />
        <div>
          <div className="text-xs font-medium text-slate-500">Lacak Pesanan</div>
          <div className="text-lg font-bold tracking-[-0.02em] text-slate-900">{data.number}</div>
        </div>
      </div>

      <div
        className={`rounded-xl px-4 py-3 text-sm font-semibold ${
          isCanceled ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {STATUS_LABEL[data.status]}
      </div>

      {!isCanceled && <OrderStatusStepper backendStatus={data.status} />}

      <div className="space-y-1 text-sm text-slate-600">
        {data.branch && (
          <div>Outlet: <span className="font-medium text-slate-900">{data.branch}</span></div>
        )}
        {data.received_at && (
          <div>Diterima: <span className="font-medium text-slate-900">{fmtDate(data.received_at)}</span></div>
        )}
        {!isCanceled && data.ready_at && (
          <div>Estimasi selesai: <span className="font-medium text-slate-900">{fmtDate(data.ready_at)}</span></div>
        )}
      </div>

      {data.items.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-medium text-slate-500">Item</div>
          <ul className="space-y-1 text-sm text-slate-900">
            {data.items.map((it, i) => (
              <li key={i} className="flex justify-between">
                <span>{it.service ?? '-'}</span>
                <span className="text-slate-500">x{it.qty}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
