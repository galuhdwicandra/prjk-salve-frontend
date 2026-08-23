import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeApiError, type FieldErrors } from '../../api/client';
import { applyOrderLoyaltyCorrection, resetOrderPaymentToPending, updateOrderStatus } from '../../api/orders';
import { createDelivery, listDeliveries } from '../../api/deliveries';
import OrderPhotosGallery from '../../components/orders/OrderPhotosGallery';
import OrderPhotosUpload from '../../components/orders/OrderPhotosUpload';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import { getAllowedNext } from '../../utils/order-status';
import { rp } from '../../utils/money';
import { useIsManager } from '../../store/useAuth';
import type { Order, OrderBackendStatus } from '../../types/orders';
import type { Delivery } from '../../types/deliveries';

type Props = {
  order: Order;
  onRefresh: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export default function OrderAdvancedPanel({ order, onRefresh, onSuccess, onError }: Props) {
  const navigate = useNavigate();
  const canEdit = useIsManager();

  const [statusErrors, setStatusErrors] = useState<FieldErrors>({});
  const [statusBusy, setStatusBusy] = useState(false);

  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [deliveryBusy, setDeliveryBusy] = useState(false);

  const [reward, setReward] = useState<'DISC25' | 'FREE100'>('FREE100');
  const [loyaltyNote, setLoyaltyNote] = useState('');
  const [loyaltyBusy, setLoyaltyBusy] = useState(false);

  const [resetReason, setResetReason] = useState('');
  const [resetBusy, setResetBusy] = useState(false);

  useEffect(() => {
    let alive = true;

    listDeliveries({ q: order.id, per_page: 1 })
      .then((res) => {
        if (!alive) return;
        setDeliveryId(res.data?.[0]?.id ?? null);
      })
      .catch(() => {
        if (alive) setDeliveryId(null);
      });

    return () => {
      alive = false;
    };
  }, [order.id]);

  const transit = useCallback(
    async (next: OrderBackendStatus) => {
      setStatusBusy(true);
      setStatusErrors({});

      try {
        const res = await updateOrderStatus(order.id, next);
        await onRefresh();
        onSuccess(res.message?.trim() || `Status order berhasil diubah menjadi ${next}.`);
      } catch (e) {
        const normalized = normalizeApiError(e);
        setStatusErrors(normalized.errors ?? {});
        onError(normalized.message || 'Gagal ubah status');
      } finally {
        setStatusBusy(false);
      }
    },
    [order.id, onRefresh, onSuccess, onError],
  );

  async function makeDelivery() {
    setDeliveryBusy(true);

    try {
      const res = (await createDelivery({
        order_id: order.id,
        type: 'delivery',
        fee: 0,
        zone_id: null,
      })) as { data?: { delivery?: Delivery; id?: string } | Delivery | null };

      const payload = res.data as { delivery?: Delivery; id?: string } | null;
      const created = payload?.delivery?.id ?? payload?.id ?? null;

      setDeliveryId(created);
      onSuccess('Pengiriman berhasil dibuat.');
      await onRefresh();
    } catch (e) {
      onError(normalizeApiError(e).message || 'Gagal membuat pengiriman');
    } finally {
      setDeliveryBusy(false);
    }
  }

  async function applyLoyalty() {
    setLoyaltyBusy(true);

    try {
      const res = await applyOrderLoyaltyCorrection(order.id, { reward, note: loyaltyNote });
      await onRefresh();
      setLoyaltyNote('');
      onSuccess(res.message?.trim() || 'Koreksi loyalty berhasil diterapkan.');
    } catch (e) {
      onError(normalizeApiError(e).message || 'Gagal menerapkan koreksi loyalty.');
    } finally {
      setLoyaltyBusy(false);
    }
  }

  async function resetPayment() {
    setResetBusy(true);

    try {
      await resetOrderPaymentToPending(order.id, {
        correction_type: 'RESET_TO_PENDING',
        reason: resetReason.trim(),
      });

      setResetReason('');
      await onRefresh();
      onSuccess('Pembayaran berhasil dikoreksi menjadi Pending.');
    } catch (e) {
      onError(normalizeApiError(e).message || 'Gagal melakukan koreksi pembayaran.');
    } finally {
      setResetBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <div className="card-title">Progres Order</div>
        <OrderStatusStepper backendStatus={order.status} />

        <div className="row" style={{ marginTop: 12 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="order_status_select">Ubah Status</label>
            <select
              id="order_status_select"
              defaultValue=""
              disabled={statusBusy}
              onChange={(e) => {
                const value = e.target.value as OrderBackendStatus | '';
                if (!value) return;
                void transit(value);
                e.currentTarget.value = '';
              }}
            >
              <option value="">{statusBusy ? 'Memproses\u2026' : `-- ${order.status} --`}</option>
              {getAllowedNext(order.status).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {statusErrors.next?.[0] ? (
              <div className="mini" style={{ color: 'var(--danger)', marginTop: 6 }}>
                {statusErrors.next[0]}
              </div>
            ) : null}
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Pengiriman</label>
            {deliveryId ? (
              <button
                type="button"
                className="btn ghost block"
                onClick={() => navigate(`/deliveries/${encodeURIComponent(deliveryId)}`)}
              >
                Lihat Pengiriman
              </button>
            ) : (
              <button type="button" className="btn ghost block" disabled={deliveryBusy} onClick={() => void makeDelivery()}>
                {deliveryBusy ? 'Membuat\u2026' : 'Buat Pengiriman'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="card-title">Catatan Barang Konsumen</div>
        <div className="mini" style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
          {order.notes && order.notes.trim() !== '' ? order.notes : '\u2014'}
        </div>
      </div>

      <div>
        <div className="card-title">Foto Order</div>
        <OrderPhotosGallery key={`${order.id}:${order.photos?.length ?? 0}`} photos={order.photos ?? []} />
        {['DELIVERING', 'PICKED_UP', 'CANCELED'].includes(order.status) ? null : (
          <div style={{ marginTop: 14 }}>
            <OrderPhotosUpload orderId={order.id} onUploaded={() => void onRefresh()} />
          </div>
        )}
      </div>

      {canEdit ? (
        <div>
          <div className="card-title">Koreksi Loyalty Manual</div>
          <div className="mini" style={{ marginBottom: 10 }}>
            Gunakan hanya untuk membetulkan order lama yang seharusnya mendapat diskon loyalty.
          </div>

          <div className="kv">
            <span className="muted">Reward saat ini</span>
            <b>{order.loyalty_reward && order.loyalty_reward !== 'NONE' ? order.loyalty_reward : 'Belum ada'}</b>
          </div>
          <div className="kv">
            <span className="muted">Diskon saat ini</span>
            <span>{rp(Number(order.discount ?? 0))}</span>
          </div>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="loyalty_reward">Jenis Reward</label>
            <select
              id="loyalty_reward"
              value={reward}
              disabled={loyaltyBusy}
              onChange={(e) => setReward(e.target.value === 'DISC25' ? 'DISC25' : 'FREE100')}
            >
              <option value="FREE100">Gratis 100% / FREE100</option>
              <option value="DISC25">Diskon 25% / DISC25</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="loyalty_note">Alasan Koreksi</label>
            <textarea
              id="loyalty_note"
              value={loyaltyNote}
              disabled={loyaltyBusy}
              onChange={(e) => setLoyaltyNote(e.target.value)}
              placeholder="Contoh: pelanggan sudah mencapai 10 stamp dan order ini seharusnya gratis."
            />
          </div>

          <button
            type="button"
            className="btn ghost block"
            disabled={loyaltyBusy || loyaltyNote.trim().length < 10}
            onClick={() => void applyLoyalty()}
          >
            {loyaltyBusy ? 'Memproses\u2026' : 'Terapkan Koreksi Loyalty'}
          </button>
        </div>
      ) : null}

      {canEdit && order.payment_status !== 'PENDING' ? (
        <div>
          <div className="card-title">Koreksi Pembayaran</div>
          <div className="mini" style={{ marginBottom: 10 }}>
            Menghapus seluruh pembayaran order ini dan mengembalikannya ke status Pending.
          </div>

          <div className="field">
            <label htmlFor="reset_reason">Alasan Koreksi</label>
            <textarea
              id="reset_reason"
              value={resetReason}
              disabled={resetBusy}
              onChange={(e) => setResetReason(e.target.value)}
              placeholder="Contoh: salah input, seharusnya pelanggan belum membayar."
            />
          </div>

          <button
            type="button"
            className="btn ghost block"
            disabled={resetBusy || resetReason.trim().length < 5}
            onClick={() => void resetPayment()}
          >
            {resetBusy ? 'Memproses\u2026' : 'Reset Pembayaran ke Pending'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
