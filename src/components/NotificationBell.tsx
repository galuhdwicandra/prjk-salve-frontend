import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listDeliveries } from '../api/deliveries';
import { listOrders } from '../api/orders';
import { useAuth, useCanModule } from '../store/useAuth';
import { useActiveBranchId } from '../store/useBranch';
import type { DeliveryStatus } from '../types/deliveries';
import { fmtDate, todayLocalYMD } from '../utils/date';
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
  const canReceipt = useCanModule('kasir-receipt');

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [allBranches, setAllBranches] = useState(false);
  const multiBranch = useAuth.branchIds.length > 1;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef(0)

  const load = useCallback(async () => {
    const seq = ++seqRef.current;

    if (!canDelivery && !canReceipt) {
      setItems([]);
      return;
    }

    setLoading(true);
    setFailed(false);

    const scope = branchId ? { branch_id: branchId } : {};
    const newScope = allBranches ? {} : scope;

    try {
      const today = todayLocalYMD();

      const [orderRes, deliveryRes, finishedRes, oneDayRes, newRes] = await Promise.all([
        canDelivery ? listOrders({ ...scope, status: 'DELIVERING', per_page: 1 }) : null,
        Promise.all(
          (canDelivery ? PENDING_DELIVERY_STATUSES : []).map((status) =>
            listDeliveries({ ...scope, status, per_page: 1 }),
          ),
        ),
        canReceipt ? listOrders({ ...scope, finished_on: today, per_page: 1 }) : null,
        canReceipt
          ? listOrders({ ...scope, one_day_due: 1, sort_by: 'ready_at', sort_dir: 'asc', per_page: 50 })
          : null,
        canReceipt ? listOrders({ ...newScope, date_from: today, date_to: today, per_page: 50 }) : null,
      ]);

      if (seq !== seqRef.current) return;

      const delivering = orderRes?.meta?.total ?? 0;
      const pending = deliveryRes.reduce((sum, res) => sum + (res.meta?.total ?? 0), 0);
      const finished = finishedRes?.meta?.total ?? 0;

      const next: NotificationItem[] = [];

      for (const order of oneDayRes?.data ?? []) {
        next.push({
          key: `one-day-${order.id}`,
          dot: order.ready_at && order.ready_at < today ? 'var(--danger)' : 'var(--warn)',
          strong: order.customer?.name ?? order.customer_name ?? '-',
          text: `· ${order.number} · ${order.branch?.name ?? '-'} · One Day selesai ${fmtDate(order.ready_at)}`,
          to: `/orders/${order.id}`,
        });
      }

      for (const order of (newRes?.data ?? []).filter((o) => o.status !== 'CANCELED')) {
        next.push({
          key: `new-${order.id}`,
          dot: '#2563EB',
          strong: order.customer?.name ?? order.customer_name ?? '-',
          text: `· ${order.number} · ${order.branch?.name ?? '-'} · order baru`,
          to: `/orders/${order.id}`,
        });
      }

      if (finished > 0) {
        next.push({
          key: 'finished-today',
          dot: 'var(--ok)',
          strong: `${finished} order`,
          text: 'selesai hari ini',
          to: '/orders?finished=today',
        });
      }

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
      if (seq !== seqRef.current) return;
      setItems([]);
      setFailed(true);
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [allBranches, branchId, canDelivery, canReceipt]);

  useEffect(() => {
    setItems([]);
    void load();
    const timer = window.setInterval(() => void load(), 60000);
    return () => window.clearInterval(timer);
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

        <div
          className="notif-hd"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
        >
          <span>Notifikasi{items.length > 0 ? ` (${items.length})` : ''}</span>
          {multiBranch ? (
            <div className="loc-badge">
              <select
                aria-label="Cakupan cabang notifikasi order baru"
                value={allBranches ? 'all' : 'active'}
                onChange={(e) => setAllBranches(e.target.value === 'all')}
              >
                <option value="active">Cabang aktif</option>
                <option value="all">Semua cabang</option>
              </select>
            </div>
          ) : null}
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
