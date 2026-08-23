import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listDeliveries } from '../api/deliveries';
import { listOrders } from '../api/orders';
import { useCanModule } from '../store/useAuth';
import { useActiveBranchId } from '../store/useBranch';
import type { DeliveryStatus } from '../types/deliveries';
import { IconBell } from '../pages/users/icons';

type NotificationItem = {
  key: string;
  dot: string;
  strong: string;
  text: string;
  to: string;
};

const PENDING_DELIVERY_STATUSES: DeliveryStatus[] = [
  'CREATED',
  'ASSIGNED',
  'ON_THE_WAY',
  'PICKED',
  'HANDOVER',
];

export default function NotificationBell() {
  const nav = useNavigate();
  const location = useLocation();
  const branchId = useActiveBranchId();
  const canDelivery = useCanModule('ops-kirim');

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    if (!canDelivery) {
      setItems([]);
      return;
    }

    setLoading(true);
    setFailed(false);

    const scope = branchId ? { branch_id: branchId } : {};

    try {
      const [orderRes, deliveryRes] = await Promise.all([
        listOrders({ ...scope, status: 'DELIVERING', per_page: 1 }),
        Promise.all(
          PENDING_DELIVERY_STATUSES.map((status) =>
            listDeliveries({ ...scope, status, per_page: 1 }),
          ),
        ),
      ]);

      const delivering = orderRes.meta?.total ?? 0;
      const pending = deliveryRes.reduce((sum, res) => sum + (res.meta?.total ?? 0), 0);

      const next: NotificationItem[] = [];

      if (delivering > 0) {
        next.push({
          key: 'delivering',
          dot: '#2563EB',
          strong: `${delivering} order`,
          text: 'sedang diantar kurir',
          to: '/deliveries',
        });
      }

      if (pending > 0) {
        next.push({
          key: 'surat-jalan',
          dot: '#2563EB',
          strong: `${pending} surat jalan`,
          text: 'belum selesai',
          to: '/deliveries',
        });
      }

      setItems(next);
    } catch {
      setItems([]);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [branchId, canDelivery]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) void load();
  }

  const badge = items.length > 9 ? '9+' : String(items.length);

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn"
        title="Notifikasi"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifikasi (${items.length})`}
        onClick={toggle}
      >
        <IconBell />
      </button>

      {items.length > 0 ? <span className="notif-badge">{badge}</span> : null}

      <div className={open ? 'notif-dd show' : 'notif-dd'}>
        <div className="notif-hd">
          Notifikasi{items.length > 0 ? ` (${items.length})` : ''}
        </div>

        {loading && items.length === 0 ? (
          <div className="notif-empty">Memuat…</div>
        ) : failed ? (
          <div className="notif-empty">Gagal memuat notifikasi.</div>
        ) : items.length === 0 ? (
          <div className="notif-empty">Tidak ada notifikasi ✨</div>
        ) : (
          items.map((item) => (
            <button
              key={item.key}
              type="button"
              className="notif-item"
              onClick={() => {
                setOpen(false);
                nav(item.to);
              }}
            >
              <span className="notif-dot" style={{ background: item.dot }} />
              <span className="notif-tx">
                <b>{item.strong}</b> {item.text}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
