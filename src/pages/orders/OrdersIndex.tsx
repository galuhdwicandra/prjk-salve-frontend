import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../api/client';
import { bulkVoidOrders, listOrders } from '../../api/orders';
import DateRangePicker from '../../components/DateRangePicker';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth, useIsManager } from '../../store/useAuth';
import { fmtDate, rangeFor } from '../../utils/date';
import { downloadXlsx } from '../../utils/export-table';
import { rp } from '../../utils/money';
import type { Order, PaginationMeta, PaymentStatus } from '../../types/orders';
import {
  IconDownload,
  IconKebab,
  IconSort,
  IconSortDown,
  IconSortUp,
  IconTrash,
} from '../users/icons';

type SortKey = 'date' | 'no' | 'customer' | 'status' | 'process' | 'total' | 'outstanding' | 'outlet';
type SortState = { key: SortKey; dir: 1 | -1 };

const PAGE_SIZES = [25, 50, 100];

const STATUS_OPTIONS: { value: PaymentStatus | ''; label: string }[] = [
  { value: '', label: 'Semua' },
  { value: 'PAID', label: 'Lunas' },
  { value: 'DP', label: 'DP' },
  { value: 'PENDING', label: 'Belum Bayar' },
];

function statusChip(status: PaymentStatus | null | undefined): { label: string; cls: string } {
  if (status === 'PAID' || status === 'SETTLED') return { label: 'Lunas', cls: 'chip c-lunas' };
  if (status === 'DP') return { label: 'DP', cls: 'chip c-dp' };
  return { label: 'Belum Bayar', cls: 'chip c-belum' };
}

function processChip(destination: Order['processing_destination']): { label: string; cls: string } {
  if (destination === 'workshop') return { label: 'Workshop', cls: 'chip c-proses' };
  if (destination === 'vendor') return { label: 'Subcon', cls: 'chip c-proses' };
  return { label: 'Belum Disortir', cls: 'chip c-masuk' };
}

export default function OrdersIndex() {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const canVoid = useIsManager();
  const branches = useMemo(() => user?.branches ?? [], [user]);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [rows, setRows] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [range, setRange] = useState<[string, string]>(() => [...rangeFor('month')] as [string, string]);
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [branchId, setBranchId] = useState('');

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 1 });
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [voidOpen, setVoidOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [voidTargets, setVoidTargets] = useState<string[]>([]);

  const query = useMemo(
    () => ({
      q: keyword || undefined,
      payment_status: status || undefined,
      branch_id: branchId || undefined,
      date_from: range[0],
      date_to: range[1],
      sort_by: 'received_at' as const,
      sort_dir: sort.key === 'date' && sort.dir < 0 ? ('desc' as const) : ('asc' as const),
    }),
    [keyword, status, branchId, range, sort],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await listOrders({ ...query, page, per_page: perPage });
      setRows(res.data ?? []);
      setMeta((res.meta as PaginationMeta) ?? null);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat receipt list'));
    } finally {
      setLoading(false);
    }
  }, [query, page, perPage]);

  useEffect(() => {
    setSlot(document.getElementById('pageActions'));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setKeyword(q.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    if (!kebabOpen) return;
    const close = () => setKebabOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [kebabOpen]);

  const outletCodes = useMemo(
    () => new Map(branches.map((branch) => [String(branch.id), branch.code])),
    [branches],
  );

  const sorted = useMemo(() => {
    if (sort.key === 'date') return rows;

    const value = (order: Order): string | number => {
      switch (sort.key) {
        case 'no':
          return order.invoice_no ?? order.number;
        case 'customer':
          return order.customer?.name ?? order.customer_name ?? '';
        case 'status':
          return statusChip(order.payment_status).label;
        case 'process':
          return processChip(order.processing_destination).label;
        case 'total':
          return Number(order.grand_total);
        case 'outstanding':
          return Number(order.due_amount);
        default:
          return outletCodes.get(String(order.branch_id)) ?? '';
      }
    };

    return [...rows].sort((a, b) => {
      const left = value(a);
      const right = value(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;
      return String(left).localeCompare(String(right), 'id') * sort.dir;
    });
  }, [rows, sort, outletCodes]);

  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const allChecked = sorted.length > 0 && sorted.every((order) => selected.includes(String(order.id)));

  const selectedRows = useMemo(
    () => sorted.filter((order) => selected.includes(String(order.id))),
    [sorted, selected],
  );

  function openBulkVoid() {
    const targets = selectedRows
      .filter((order) => order.status !== 'CANCELED')
      .map((order) => String(order.id));

    if (targets.length === 0) {
      showError('Tidak ada receipt terpilih yang dapat di-void.');
      return;
    }

    setVoidTargets(targets);
    setVoidReason('');
    setVoidOpen(true);
  }

  async function submitBulkVoid() {
    if (voidTargets.length === 0 || voidReason.trim().length < 5) return;

    setBusy(true);
    setError(null);

    try {
      const result = await bulkVoidOrders(voidTargets, voidReason.trim());
      const count = result.data?.voided_count ?? voidTargets.length;

      setVoidOpen(false);
      setVoidReason('');
      setVoidTargets([]);

      await refresh();
      showSuccess(`${count} receipt berhasil di-void.`);
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal melakukan void receipt terpilih.'));
    } finally {
      setBusy(false);
    }
  }

  function onSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  }

  function sortIcon(key: SortKey) {
    const active = sort.key === key;
    return (
      <span className={active ? 'sort-ic on' : 'sort-ic'}>
        {active ? sort.dir > 0 ? <IconSortUp /> : <IconSortDown /> : <IconSort />}
      </span>
    );
  }

  async function onExport() {
    setError(null);

    try {
      const source = selected.length > 0
        ? sorted.filter((order) => selected.includes(String(order.id)))
        : (await listOrders({ ...query, page: 1, per_page: 500 })).data ?? [];

      downloadXlsx(
        `receipt-list-${range[0]}-${range[1]}.xlsx`,
        'Receipt List',
        [
          ['Tanggal', 'No. Receipt', 'Pelanggan', 'Status', 'Proses', 'Total', 'Outstanding', 'Outlet'],
          ...source.map((order) => [
            order.received_at ?? '',
            order.invoice_no ?? order.number,
            order.customer?.name ?? order.customer_name ?? '',
            statusChip(order.payment_status).label,
            processChip(order.processing_destination).label,
            Number(order.grand_total),
            Number(order.due_amount),
            outletCodes.get(String(order.branch_id)) ?? '',
          ]),
        ],
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengekspor data.'));
    }
  }

  const pageActions = (
    <div className={kebabOpen ? 'kebab open' : 'kebab'}>
      <button
        type="button"
        className="kebab-btn"
        aria-label="Menu"
        aria-expanded={kebabOpen}
        onClick={(e) => {
          e.stopPropagation();
          setKebabOpen((prev) => !prev);
        }}
      >
        <IconKebab />
      </button>
      <div className="kebab-menu">
        <button
          type="button"
          className="kebab-item"
          onClick={() => {
            setKebabOpen(false);
            void onExport();
          }}
        >
          <span>{selected.length > 0 ? `Export ${selected.length} terpilih` : 'Export XLSX'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Toast
        show={toast.open}
        kind={toast.kind}
        message={toast.message}
        onClose={hideToast}
      />
      {slot ? createPortal(pageActions, slot) : null}

      <div className="card">
        <div className="card-title">
          <span>Receipt List</span>
          <span className="ct-note">semua struk order dari POS {'\u00b7'} order tanpa foto belum masuk Workshop</span>
          <input
            className="inp"
            style={{ maxWidth: 380 }}
            placeholder="no / pelanggan"
            aria-label="Cari nomor receipt atau pelanggan"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="row" style={{ marginBottom: 14 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Periode</label>
            <DateRangePicker
              from={range[0]}
              to={range[1]}
              onChange={(start, end) => {
                setRange([start, end]);
                setPage(1);
              }}
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="receipt_status">Status</label>
            <select
              id="receipt_status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as PaymentStatus | '');
                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="receipt_outlet">Outlet</label>
            <select
              id="receipt_outlet"
              value={branchId}
              onChange={(e) => {
                setBranchId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua outlet</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.code} {'\u2014'} {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={selected.length ? 'bulkbar show' : 'bulkbar'}>
          <span className="bb-count">{selected.length} dipilih</span>

          <div className="toolbar">
            <button
              type="button"
              className="btn ghost sm"
              disabled={busy}
              onClick={() => void onExport()}
            >
              <IconDownload />
              Export terpilih
            </button>

            {canVoid ? (
              <button
                type="button"
                className="btn danger sm"
                disabled={busy}
                onClick={openBulkVoid}
              >
                <IconTrash />
                Void terpilih
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className="link"
            disabled={busy}
            onClick={() => setSelected([])}
          >
            bersihkan
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="tbl-wrap selectable-table">
          <table>
            <thead>
              <tr>
                <th className="dt-check">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Pilih semua receipt"
                    onChange={(e) => setSelected(e.target.checked ? sorted.map((order) => String(order.id)) : [])}
                  />
                </th>
                <th className="sortable" onClick={() => onSort('date')}>Tanggal{sortIcon('date')}</th>
                <th className="sortable" onClick={() => onSort('no')}>No. Receipt{sortIcon('no')}</th>
                <th className="sortable" onClick={() => onSort('customer')}>Pelanggan{sortIcon('customer')}</th>
                <th className="sortable" onClick={() => onSort('status')}>Status{sortIcon('status')}</th>
                <th className="sortable" onClick={() => onSort('process')}>Proses{sortIcon('process')}</th>
                <th className="sortable num" onClick={() => onSort('total')}>Total{sortIcon('total')}</th>
                <th className="sortable num" onClick={() => onSort('outstanding')}>Outstanding{sortIcon('outstanding')}</th>
                <th className="sortable" onClick={() => onSort('outlet')}>Outlet{sortIcon('outlet')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="empty">Memuat{'\u2026'}</td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty">Tidak ada receipt pada periode ini.</td>
                </tr>
              ) : (
                sorted.map((order) => {
                  const badge = statusChip(order.payment_status);
                  const process = processChip(order.processing_destination);
                  const due = Number(order.due_amount);

                  return (
                    <tr key={order.id} className="rowc">
                      <td className="dt-check">
                        <input
                          type="checkbox"
                          checked={selected.includes(String(order.id))}
                          aria-label={`Pilih ${order.invoice_no ?? order.number}`}
                          onChange={(e) =>
                            setSelected((prev) =>
                              e.target.checked
                                ? [...prev, String(order.id)]
                                : prev.filter((id) => id !== String(order.id)),
                            )
                          }
                        />
                      </td>
                      <td data-label="Tanggal">{fmtDate(order.received_at)}</td>
                      <td data-label="No. Receipt">
                        <Link className="lnk" to={`/orders/${order.id}`}>
                          {order.invoice_no ?? order.number}
                        </Link>
                      </td>
                      <td data-label="Pelanggan">{order.customer?.name ?? order.customer_name ?? '\u2014'}</td>
                      <td data-label="Status">
                        <span className={badge.cls}>{badge.label}</span>
                      </td>
                      <td data-label="Proses">
                        <span className={process.cls}>{process.label}</span>
                      </td>
                      <td className="num" data-label="Total">{rp(Number(order.grand_total))}</td>
                      <td className="num" data-label="Outstanding">{due > 0 ? rp(due) : '\u2014'}</td>
                      <td data-label="Outlet">{outletCodes.get(String(order.branch_id)) ?? '\u2014'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {total > 0 ? (
          <div className="dt-pager">
            <div className="dt-pager-size">
              Tampilkan{' '}
              <select
                value={perPage}
                aria-label="Jumlah receipt per halaman"
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>{' '}
              per halaman
            </div>
            <div className="dt-pager-nav">
              <span className="mini">{from}{'\u2013'}{to} dari {total}</span>
              <button
                type="button"
                className="pg-btn"
                aria-label="Halaman sebelumnya"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                {'\u2039'}
              </button>
              <span className="mini">{page}/{lastPage}</span>
              <button
                type="button"
                className="pg-btn"
                aria-label="Halaman berikutnya"
                disabled={page >= lastPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {'\u203a'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {voidOpen ? (
        <div
          className="modal show"
          role="dialog"
          aria-modal="true"
          aria-label="Void receipt terpilih"
        >
          <div className="box">
            <div className="modal-head">
              <h3>Void {voidTargets.length} Receipt</h3>
              <button
                type="button"
                className="mclose"
                disabled={busy}
                aria-label="Tutup"
                onClick={() => setVoidOpen(false)}
              >
                {'\u2715'}
              </button>
            </div>

            <div className="mini" style={{ marginBottom: 12 }}>
              Seluruh pembayaran receipt terpilih akan dihapus, jurnal
              penjualannya di-void, dan status order menjadi CANCELED.
              Tindakan ini tidak dapat dibatalkan.
            </div>

            <div className="field">
              <label htmlFor="bulk_void_reason">Alasan Void</label>
              <textarea
                id="bulk_void_reason"
                value={voidReason}
                maxLength={200}
                disabled={busy}
                placeholder="Contoh: order dibatalkan pelanggan sebelum pengerjaan."
                onChange={(event) => setVoidReason(event.target.value)}
              />
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn ghost"
                disabled={busy}
                onClick={() => setVoidOpen(false)}
              >
                Batal
              </button>

              <button
                type="button"
                className="btn danger"
                style={{ marginLeft: 'auto' }}
                disabled={busy || voidReason.trim().length < 5}
                onClick={() => void submitBulkVoid()}
              >
                {busy ? 'Memproses\u2026' : 'Konfirmasi Void'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
