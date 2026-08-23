import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../api/client';
import { deleteCustomer, getCustomer, updateCustomer } from '../../api/customers';
import { getLoyaltySummary } from '../../api/loyalty';
import { listOrders } from '../../api/orders';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import type { Customer, CustomerVoucherUsage } from '../../types/customers';
import type { LoyaltySummary } from '../../types/loyalty';
import type { Order } from '../../types/orders';
import { fmtDate } from '../../utils/date';
import { rp } from '../../utils/money';
import { IconArchive, IconEdit, IconSort, IconSortDown, IconSortUp, IconTrash, IconUnarchive } from '../users/icons';
import CustomerEditModal from './CustomerEditModal';

const ORDER_PAGE_SIZES = [5, 10, 25];

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast, showSuccess, hideToast } = useToast();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vouchers, setVouchers] = useState<CustomerVoucherUsage[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersLastPage, setOrdersLastPage] = useState(1);
  const [ordersDir, setOrdersDir] = useState<'asc' | 'desc'>('desc');

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const res = await getCustomer(id);
      setCustomer(res.data);
      setVouchers(res.meta?.vouchers ?? []);

      if (res.data) {
        const summary = await getLoyaltySummary(res.data.id, res.data.branch_id);
        setLoyalty(summary.data ?? null);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat detail pelanggan'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!customer?.id) return;
    let alive = true;

    (async () => {
      try {
        const res = await listOrders({
          customer_id: customer.id,
          page: ordersPage,
          per_page: ordersPerPage,
          sort_by: 'created_at',
          sort_dir: ordersDir,
        });

        if (!alive) return;
        setOrders(res.data ?? []);
        setOrdersTotal(res.meta?.total ?? 0);
        setOrdersLastPage(res.meta?.last_page ?? 1);
      } catch {
        if (alive) setOrders([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [customer?.id, ordersPage, ordersPerPage, ordersDir]);

  async function setActive(next: boolean) {
    if (!customer) return;

    setBusy(true);
    setError(null);
    try {
      await updateCustomer(customer.id, { is_active: next });
      showSuccess(next ? 'Pelanggan dipulihkan.' : 'Pelanggan diarsipkan.');
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status pelanggan'));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!customer) return;

    setBusy(true);
    setError(null);
    try {
      await deleteCustomer(customer.id);
      navigate('/customers');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus pelanggan'));
      setBusy(false);
      setDeleteOpen(false);
    }
  }

  if (loading && !customer) {
    return <div className="card empty">Memuat{'\u2026'}</div>;
  }

  if (!customer) {
    return (
      <div className="card">
        <div className="empty">{error ?? 'Pelanggan tidak ditemukan.'}</div>
        <Link className="btn ghost sm" to="/customers">
          {'\u2190'} Database Customer
        </Link>
      </div>
    );
  }

  const cycle = loyalty?.cycle ?? 10;
  const stamps = loyalty?.stamps ?? 0;
  const cycleNo = Math.floor((loyalty?.lifetime ?? 0) / cycle) + 1;
  const ordersFrom = ordersTotal === 0 ? 0 : (ordersPage - 1) * ordersPerPage + 1;
  const ordersTo = Math.min(ordersPage * ordersPerPage, ordersTotal);

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      <div style={{ marginBottom: 16 }}>
        <Link className="btn ghost sm" to="/customers">
          {'\u2190'} Database Customer
        </Link>
      </div>

      {error ? (
        <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
          {error}
        </div>
      ) : null}

      <div className="rcd">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--navy)' }}>{customer.name}</h2>
              <div className="mini" style={{ marginTop: 4 }}>
                {customer.whatsapp}
                {customer.branch ? ` \u00b7 asal ${customer.branch.code ?? customer.branch.name}` : ''}
                {customer.is_active ? '' : ' \u00b7 arsip'}
              </div>
            </div>

            <div className="right">
              <div className="mini">Total Belanja</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{rp(Number(customer.spend_total ?? 0))}</div>
            </div>
          </div>

          <div className="kv" style={{ marginTop: 18 }}>
            <span>Kunjungan</span>
            <b>{customer.visits_count ?? 0}</b>
          </div>
          <div className="kv">
            <span>Terakhir order</span>
            <b>{customer.last_order_at ? fmtDate(customer.last_order_at) : '\u2014'}</b>
          </div>

          <div className="card-title" style={{ marginTop: 20, marginBottom: 10 }}>
            <span>Loyalty Stamp</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <b>Siklus ke-{cycleNo}</b>
            <b style={{ color: 'var(--orange)' }}>
              {stamps}/{cycle}
            </b>
          </div>

          <div className="stamp-bar" aria-label="Loyalty stamp">
            {Array.from({ length: cycle }, (_, index) => index + 1).map((no) => (
              <div key={no} className={no <= stamps ? 'stamp on' : 'stamp'}>
                {no}
              </div>
            ))}
          </div>

          <div className="mini" style={{ marginTop: 8 }}>
            Aturan stamp menyusul (sementara mengikuti jumlah kunjungan)
          </div>

          <div className="card-title" style={{ marginTop: 20, marginBottom: 10 }}>
            <span>Riwayat Voucher</span>
          </div>

          {vouchers.length === 0 ? (
            <div className="mini">Belum pernah pakai voucher.</div>
          ) : (
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>No. Receipt</th>
                    <th className="num">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => (
                    <tr key={`${voucher.code}-${voucher.number}`}>
                      <td data-label="Kode">
                        <b>{voucher.code}</b>
                      </td>
                      <td data-label="No. Receipt">{voucher.number}</td>
                      <td className="num" data-label="Nominal">
                        {rp(Number(voucher.applied_amount ?? 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mini" style={{ marginTop: 8 }}>
            Kode yang sudah dipakai tidak bisa dipakai lagi oleh nomor WA yang sama.
          </div>

          <div className="card-title" style={{ marginTop: 20, marginBottom: 10 }}>
            <span>Riwayat Belanja</span>
          </div>

          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th
                    className="sortable"
                    onClick={() => {
                      setOrdersDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                      setOrdersPage(1);
                    }}
                  >
                    Tanggal
                    <span className="sort-ic on">{ordersDir === 'asc' ? <IconSortUp /> : <IconSortDown />}</span>
                  </th>
                  <th>
                    No. Receipt
                    <span className="sort-ic">
                      <IconSort />
                    </span>
                  </th>
                  <th className="num">
                    Nominal
                    <span className="sort-ic">
                      <IconSort />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="empty">
                      Belum ada transaksi.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td data-label="Tanggal">{fmtDate(order.created_at)}</td>
                      <td data-label="No. Receipt">
                        <Link className="lnk" to={`/orders/${order.id}`}>
                          {order.invoice_no ?? order.number}
                        </Link>
                        {order.status === 'CANCELED' ? <span className="chip c-belum">VOID</span> : null}
                      </td>
                      <td className="num" data-label="Nominal">
                        {rp(Number(order.grand_total ?? 0))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {ordersTotal > 0 ? (
            <div className="dt-pager">
              <div className="dt-pager-size">
                Tampilkan{' '}
                <select
                  value={ordersPerPage}
                  aria-label="Jumlah transaksi per halaman"
                  onChange={(e) => {
                    setOrdersPerPage(Number(e.target.value));
                    setOrdersPage(1);
                  }}
                >
                  {ORDER_PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>{' '}
                per halaman
              </div>
              <div className="dt-pager-nav">
                <span className="mini">
                  {ordersFrom}
                  {'\u2013'}
                  {ordersTo} dari {ordersTotal}
                </span>
                <button
                  type="button"
                  className="pg-btn"
                  aria-label="Halaman sebelumnya"
                  disabled={ordersPage <= 1}
                  onClick={() => setOrdersPage((prev) => prev - 1)}
                >
                  {'\u2039'}
                </button>
                <span className="mini">
                  {ordersPage}/{ordersLastPage}
                </span>
                <button
                  type="button"
                  className="pg-btn"
                  aria-label="Halaman berikutnya"
                  disabled={ordersPage >= ordersLastPage}
                  onClick={() => setOrdersPage((prev) => prev + 1)}
                >
                  {'\u203a'}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="card">
          <div className="card-title">
            <span>Aksi</span>
          </div>

          <button
            type="button"
            className="btn block"
            style={{ marginBottom: 10 }}
            disabled={busy}
            onClick={() => setEditOpen(true)}
          >
            <IconEdit />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="btn block"
            style={{ marginBottom: 10 }}
            disabled={busy}
            onClick={() => void setActive(!customer.is_active)}
          >
            {customer.is_active ? <IconArchive /> : <IconUnarchive />}
            <span>{customer.is_active ? 'Arsipkan' : 'Pulihkan'}</span>
          </button>

          <button type="button" className="btn danger block" disabled={busy} onClick={() => setDeleteOpen(true)}>
            <IconTrash />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      {editOpen ? (
        <CustomerEditModal
          customer={customer}
          onClose={() => setEditOpen(false)}
          onDone={(updated) => {
            setEditOpen(false);
            setCustomer(updated);
            showSuccess('Pelanggan diperbarui.');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus pelanggan?"
        message={`Pelanggan "${customer.name}" akan dihapus. Struk lama tetap tersimpan, tetapi tidak lagi tertaut ke profil ini.`}
        confirmText={busy ? 'Menghapus\u2026' : 'Ya, hapus'}
        cancelText="Batal"
        confirmVariant="danger"
        loading={busy}
        onClose={() => {
          if (busy) return;
          setDeleteOpen(false);
        }}
        onConfirm={() => void remove()}
      />
    </>
  );
}
