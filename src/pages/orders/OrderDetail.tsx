import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Link, useParams } from 'react-router-dom';
import { normalizeApiError } from '../../api/client';
import {
  createOrderShareLink,
  getOrder,
  openOrderReceipt,
  voidOrder,
} from '../../api/orders';
import { resolveWhatsappTemplate } from '../../api/whatsappTemplates';
import OrderBeforePhotos from '../../components/orders/OrderBeforePhotos';
import CheckoutDialog from '../../components/pos/CheckoutDialog';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth, useIsManager } from '../../store/useAuth';
import { IconTrash } from '../users/icons';
import { fmtDate } from '../../utils/date';
import { rp } from '../../utils/money';
import { buildOrderWaMessage } from '../../utils/wa-templates';
import type { WaConfigKey } from '../../types/whatsapp-templates';
import { buildWhatsAppLink } from '../../utils/wa';
import EditOrderModal from './EditOrderModal';
import OrderAdvancedPanel from './OrderAdvancedPanel';
import PaymentHistoryModal from './PaymentHistoryModal';
import type { Order } from '../../types/orders';

type OrderWithPhone = Order & {
  customer?: (Order['customer'] & { phone?: string | null }) | null;
};

function termLabel(order: Order): string {
  if (order.payment_status === 'PAID' || order.payment_status === 'SETTLED') return 'FULL \u2014 lunas di depan';
  if (order.payment_status === 'DP') return 'DP \u2014 sebagian di depan';
  return 'PENDING \u2014 bayar nanti';
}

function statusLabel(order: Order): string {
  if (order.status === 'CANCELED') return 'VOID';
  if (order.payment_status === 'PAID' || order.payment_status === 'SETTLED') return 'LUNAS';
  if (order.payment_status === 'DP') return 'DP';
  return 'BELUM BAYAR';
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const canEdit = useIsManager();
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);

  const [row, setRow] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [voidBusy, setVoidBusy] = useState(false);

  const { toast, showSuccess, showError, hideToast } = useToast();

  const refresh = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await getOrder(id);
      setRow(res.data);
    } catch (e) {
      const normalized = normalizeApiError(e);
      setRow(null);

      if (!normalized.isNotFound && !normalized.isForbidden) {
        setErr(normalized.message || 'Gagal memuat detail');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sendWa = useCallback(async (key: WaConfigKey) => {
    if (!row) return;

    const target = row as OrderWithPhone;
    const wa = target.customer?.whatsapp || target.customer?.phone || '';

    if (!wa) {
      showError('Nomor WhatsApp pelanggan belum tersedia.');
      return;
    }

    try {
      const link = await createOrderShareLink(row.id);
      const resolved = await resolveWhatsappTemplate(key, row.branch_id);
      const branch = useAuth.user?.branches.find((b) => String(b.id) === String(row.branch_id));
      const message = buildOrderWaMessage(row, key, resolved.data?.content, {
        outletName: branch?.name,
        trackerUrl: link,
      });

      window.open(buildWhatsAppLink(wa, message), '_blank', 'noopener,noreferrer');
    } catch {
      showError('Gagal menyiapkan pesan WhatsApp.');
    }
  }, [row, showError]);

  async function submitVoid() {
    if (!row) return;

    setVoidBusy(true);

    try {
      await voidOrder(row.id, voidReason.trim());
      setVoidOpen(false);
      setVoidReason('');
      await refresh();
      showSuccess('Receipt berhasil di-void.');
    } catch (e) {
      showError(normalizeApiError(e).message || 'Gagal melakukan void receipt.');
    } finally {
      setVoidBusy(false);
    }
  }

  if (loading && !row) {
    return <div className="card"><div className="empty">Memuat{'\u2026'}</div></div>;
  }

  if (err) {
    return (
      <div className="card">
        <div role="alert" style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>{err}</div>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="card">
        <div className="empty">
          Order tidak tersedia, sudah dihapus, atau bukan milik outlet Anda.
          <div style={{ marginTop: 12 }}>
            <Link className="btn ghost sm" to="/orders">Kembali ke Receipt List</Link>
          </div>
        </div>
      </div>
    );
  }

  const outlet = user?.branches.find((branch) => String(branch.id) === String(row.branch_id));
  const lastPayment = (row.payments ?? [])[(row.payments ?? []).length - 1] ?? null;
  const voided = row.status === 'CANCELED';

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      <div style={{ marginBottom: 14 }}>
        <Link className="btn ghost sm" to="/orders">{'\u2190'} Receipt List</Link>
      </div>

      <div className="rcd">
        <div className="rcd-main">
          <div className="card">
            <div className="rcd-head">
              <div style={{ minWidth: 0 }}>
                <h2 className="rcd-no">
                  {row.invoice_no ?? row.number}
                </h2>
                <div className="mini" style={{ marginTop: 4 }}>
                  {fmtDate(row.received_at)}
                  {outlet ? ` \u00b7 ${outlet.name}` : ''}
                </div>
              </div>

              <div className="rcd-total">
                <div className="mini">Total</div>
                <b>{rp(Number(row.grand_total))}</b>
                <div style={{ marginTop: 4, fontSize: 13, fontWeight: 800, color: voided ? 'var(--danger)' : 'var(--ok)' }}>
                  {statusLabel(row)}
                </div>
              </div>
            </div>

            <div className="kv" style={{ marginTop: 18 }}>
              <div>Pelanggan</div>
              {row.customer_id ? (
                <Link className="lnk" to={`/customers/${row.customer_id}`}>
                  {row.customer?.name ?? row.customer_name ?? '\u2014'}
                </Link>
              ) : (
                <span>{row.customer_name ?? '\u2014'}</span>
              )}
            </div>

            <div className="tbl-wrap" style={{ marginTop: 14 }}>
              <table>
                <thead>
                  <tr>
                    <th>Layanan</th>
                    <th className="num">Qty</th>
                    <th className="num">Harga</th>
                    <th className="num">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(row.items ?? []).map((item) => (
                    <tr key={item.id}>
                      <td data-label="Layanan">{item.service?.name ?? item.service_id}</td>
                      <td className="num" data-label="Qty">{Number(item.qty)}</td>
                      <td className="num" data-label="Harga">{rp(Number(item.price))}</td>
                      <td className="num" data-label="Subtotal">{rp(Number(item.total))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="totals" style={{ marginTop: 16 }}>
              <div className="l">
                <span>Subtotal</span>
                <span>{rp(Number(row.subtotal))}</span>
              </div>
              {Number(row.discount ?? 0) > 0 ? (
                <div className="l">
                  <span>Diskon</span>
                  <span>{'\u2212'} {rp(Number(row.discount))}</span>
                </div>
              ) : null}
              <div className="l grand">
                <span>Total</span>
                <span>{rp(Number(row.grand_total))}</span>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="kv">
                <div>Ketentuan</div>
                <span>{termLabel(row)}</span>
              </div>
              <div className="kv">
                <div>Metode</div>
                <span>{lastPayment?.method ?? '\u2014'}</span>
              </div>
              <div className="kv">
                <div>Dibayar</div>
                <b>{rp(Number(row.paid_amount))}</b>
              </div>
              {Number(row.due_amount) > 0 ? (
                <div className="kv">
                  <div>Sisa Tagihan</div>
                  <b style={{ color: 'var(--danger)' }}>{rp(Number(row.due_amount))}</b>
                </div>
              ) : null}
              <div className="kv">
                <div>Estimasi selesai</div>
                <span>{fmtDate(row.ready_at)}</span>
              </div>
            </div>
          </div>

          <details className="card">
            <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 800 }}>
              Opsi lanjutan {'\u2014'} status, pengiriman, foto & koreksi
            </summary>
            <div style={{ marginTop: 18 }}>
              <OrderAdvancedPanel
                order={row}
                onRefresh={refresh}
                onSuccess={showSuccess}
                onError={showError}
              />
            </div>
          </details>
        </div>

        <div className="rcd-side">
          <div className="card">
            <div className="card-title">Foto Before</div>
            <OrderBeforePhotos
              orderId={row.id}
              photos={row.photos ?? []}
              readOnly={voided}
              onChanged={refresh}
            />
          </div>

          <div className="card">
            <div className="card-title">Aksi</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <button type="button" className="btn block" onClick={() => void openOrderReceipt(row.id)}>
                <IconPrinter /> Cetak Receipt
              </button>

              <button type="button" className="btn block" onClick={() => void sendWa('struk')}>
                <IconChat /> Kirim via WA
              </button>

              <button
                type="button"
                className="btn ghost block"
                disabled={!canEdit || voided}
                onClick={() => setEditOpen(true)}
              >
                <IconPencil /> Edit Order
              </button>

              {Number(row.due_amount) > 0 && !voided ? (
                <>
                  <button type="button" className="btn block" onClick={() => setPayOpen(true)}>
                    Terima Pembayaran
                  </button>

                  <button type="button" className="btn orange block" onClick={() => void sendWa('reminder')}>
                    <IconChat /> WA: Ingatkan Bayar
                  </button>
                </>
              ) : null}

              <button
                type="button"
                className="btn danger block"
                disabled={!canEdit || voided}
                onClick={() => {
                  setVoidReason('');
                  setVoidOpen(true);
                }}
              >
                <IconTrash /> Void Receipt
              </button>

              <div className="mini">
                Void membatalkan struk & mengembalikan saldo penjualannya.
              </div>

              <button type="button" className="btn ghost block" onClick={() => setHistoryOpen(true)}>
                Histori Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>

      {editOpen ? (
        <EditOrderModal
          order={row}
          onClose={() => setEditOpen(false)}
          onPhotosChanged={refresh}
          onSaved={async () => {
            setEditOpen(false);
            await refresh();
            showSuccess('Order berhasil diperbarui.');
          }}
        />
      ) : null}

      {historyOpen ? (
        <PaymentHistoryModal
          order={row}
          onClose={() => setHistoryOpen(false)}
          onChanged={async () => {
            await refresh();
            showSuccess('Histori pembayaran diperbarui.');
          }}
        />
      ) : null}

      {voidOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Void Receipt">
          <div className="box">
            <div className="modal-head">
              <h3>Void Receipt {'\u00b7'} {row.invoice_no ?? row.number}</h3>
              <button type="button" className="mclose" onClick={() => setVoidOpen(false)} aria-label="Tutup">
                {'\u2715'}
              </button>
            </div>

            <div className="mini" style={{ marginBottom: 12 }}>
              Seluruh pembayaran dihapus, jurnal penjualannya di-void, dan status order menjadi CANCELED.
              Tindakan ini tidak dapat dibatalkan.
            </div>

            <div className="field">
              <label htmlFor="void_reason">Alasan Void</label>
              <textarea
                id="void_reason"
                value={voidReason}
                disabled={voidBusy}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="Contoh: order dibatalkan pelanggan sebelum pengerjaan."
              />
            </div>

            <div className="modal-foot">
              <button type="button" className="btn ghost" disabled={voidBusy} onClick={() => setVoidOpen(false)}>
                Batal
              </button>
              <button
                type="button"
                className="btn danger"
                style={{ marginLeft: 'auto' }}
                disabled={voidBusy || voidReason.trim().length < 5}
                onClick={() => void submitVoid()}
              >
                {voidBusy ? 'Memproses\u2026' : 'Ya, Void Receipt'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <CheckoutDialog
        open={payOpen}
        order={row}
        onClose={() => setPayOpen(false)}
        onPaid={() => { void refresh(); }}
      />
    </>
  );
}

function IconPrinter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V3h12v6" />
      <rect x="4" y="9" width="16" height="7" rx="2" />
      <path d="M6 16h12v5H6z" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
