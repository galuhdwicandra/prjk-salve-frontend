import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../api/client';
import { listDeliveryNotes } from '../../api/sorting';
import type { DeliveryNote, DeliveryNoteStatus } from '../../api/sorting';
import { listDeliveries } from '../../api/deliveries';
import type { Delivery } from '../../types/deliveries';
import { fmtDate } from '../../utils/date';
import { IconSort, IconSortDown, IconSortUp } from '../users/icons';
import DeliveryNoteDialog from './DeliveryNoteDialog';

type Tab = 'notes' | 'courier';
type SortKey = 'no' | 'date' | 'route' | 'orders' | 'status' | 'order' | 'customer' | 'outlet' | 'qty';
type SortState = { key: SortKey; dir: 1 | -1 };
type PageMeta = { total: number; last_page: number };

const TABS: { key: Tab; label: string }[] = [
  { key: 'notes', label: 'Surat Jalan' },
  { key: 'courier', label: 'Pengantaran Kurir' },
];

const PAGE_SIZES = [25, 50, 100];

const STATUS_OPTIONS = [
  { value: 'PENDING,PICKED', label: 'Belum selesai' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: '', label: 'Semua' },
];

const STATUS_CHIP: Record<DeliveryNoteStatus, { label: string; cls: string }> = {
  PENDING: { label: 'Belum Selesai', cls: 'chip c-masuk' },
  PICKED: { label: 'Sudah Diambil', cls: 'chip c-proses' },
  COMPLETED: { label: 'Selesai', cls: 'chip c-diambil' },
};

function fromLabel(note: DeliveryNote): string {
  return note.from_contact?.name ?? note.branch?.code ?? note.branch?.name ?? '-';
}

function toLabel(note: DeliveryNote): string {
  return note.to_contact?.name ?? note.to_branch?.code ?? note.to_branch?.name ?? '-';
}

function compareBy<T>(value: (row: T) => string | number, dir: 1 | -1) {
  return (a: T, b: T) => {
    const left = value(a);
    const right = value(b);
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * dir;
    return String(left).localeCompare(String(right), 'id') * dir;
  };
}

export default function DeliveryIndex() {
  const [tab, setTab] = useState<Tab>('notes');
  const [notes, setNotes] = useState<DeliveryNote[]>([]);
  const [couriers, setCouriers] = useState<Delivery[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [detail, setDetail] = useState<DeliveryNote | null>(null);

  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 1 });

  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    const timer = window.setTimeout(() => setTerm(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      if (tab === 'notes') {
        const res = await listDeliveryNotes({
          q: term || undefined,
          status: status || undefined,
          per_page: perPage,
          page,
        });
        setNotes(res.data ?? []);
        setMeta(res.meta ? { total: res.meta.total, last_page: res.meta.last_page } : null);
        return;
      }

      const res = await listDeliveries({ q: term || undefined, per_page: perPage, page });
      setCouriers(res.data ?? []);
      setMeta(res.meta ? { total: res.meta.total, last_page: res.meta.last_page } : null);
    } catch (e) {
      setErr(getErrorMessage(e, 'Gagal memuat data pengiriman.'));
      setNotes([]);
      setCouriers([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [tab, term, status, perPage, page]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
    setSearch('');
    setSort(tab === 'notes' ? { key: 'date', dir: 1 } : { key: 'no', dir: 1 });
  }, [tab]);

  useEffect(() => {
    setPage(1);
  }, [term, status, perPage]);

  const sortedNotes = useMemo(() => {
    const value = (row: DeliveryNote): string | number => {
      if (sort.key === 'date') return row.note_date ?? '';
      if (sort.key === 'route') return `${fromLabel(row)} ${toLabel(row)}`.toLowerCase();
      if (sort.key === 'orders') return row.orders_count ?? 0;
      if (sort.key === 'status') return row.status;
      return row.number.toLowerCase();
    };
    return [...notes].sort(compareBy(value, sort.dir));
  }, [notes, sort]);

  const sortedCouriers = useMemo(() => {
    const value = (row: Delivery): string | number => {
      if (sort.key === 'order') return (row.order_invoice_no ?? row.order_number ?? '').toLowerCase();
      if (sort.key === 'customer') return (row.customer?.name ?? '').toLowerCase();
      if (sort.key === 'outlet') return (row.branch?.code ?? '').toLowerCase();
      if (sort.key === 'qty') return row.qty ?? 0;
      if (sort.key === 'date') return row.created_at ?? '';
      return (row.number ?? row.id).toLowerCase();
    };
    return [...couriers].sort(compareBy(value, sort.dir));
  }, [couriers, sort]);

  const total = meta?.total ?? 0;
  const lastPage = meta?.last_page ?? 1;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

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

  const afterAction = async (message: string) => {
    setDetail(null);
    await load();
    showSuccess(message);
  };

  return (
    <div className="card">
      <div className="seg no-thumb" style={{ marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={t.key === tab ? 'seg-btn active' : 'seg-btn'}
            aria-current={t.key === tab ? 'page' : undefined}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="row" style={{ marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="field" style={{ marginBottom: 0, flex: 1, minWidth: 240 }}>
          <label htmlFor="kirim-q">Cari</label>
          <input
            id="kirim-q"
            type="search"
            placeholder={tab === 'notes' ? 'no surat jalan / tujuan' : 'no antar / order / pelanggan'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {tab === 'notes' ? (
          <div className="field" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
            <label htmlFor="kirim-status">Status</label>
            <select id="kirim-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {tab === 'courier' ? (
        <p className="mini" style={{ marginBottom: 12 }}>
          Pengantaran satuan ke customer (bukan surat jalan). Foto bukti serah-terima saat selesai.
        </p>
      ) : null}

      {err ? (
        <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
          {err}
        </div>
      ) : null}

      <div className="tbl-wrap">
        {tab === 'notes' ? (
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => onSort('no')}>
                  No. Surat Jalan
                  {sortIcon('no')}
                </th>
                <th className="sortable" onClick={() => onSort('date')}>
                  Tanggal
                  {sortIcon('date')}
                </th>
                <th className="sortable" onClick={() => onSort('route')}>
                  Dari {'\u2192'} Ke{sortIcon('route')}
                </th>
                <th className="sortable num" onClick={() => onSort('orders')}>
                  Order
                  {sortIcon('orders')}
                </th>
                <th className="sortable" onClick={() => onSort('status')}>
                  Status
                  {sortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : sortedNotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">
                    Belum ada surat jalan.
                  </td>
                </tr>
              ) : (
                sortedNotes.map((r) => (
                  <tr key={r.id}>
                    <td data-label="No. Surat Jalan">
                      <button type="button" className="link" onClick={() => setDetail(r)}>
                        {r.number}
                      </button>
                    </td>
                    <td data-label="Tanggal">{fmtDate(r.note_date)}</td>
                    <td data-label="Dari &rarr; Ke">
                      {r.from_contact ? (
                        <span className="chip c-subcon">{r.from_contact.name}</span>
                      ) : (
                        <span className="mini">{r.branch?.code ?? '-'}</span>
                      )}
                      {' \u2192 '}
                      {r.to_contact ? (
                        <span className="chip c-subcon">{r.to_contact.name}</span>
                      ) : (
                        <b>{toLabel(r)}</b>
                      )}
                    </td>
                    <td className="num" data-label="Order">
                      {r.orders_count ?? r.orders?.length ?? 0}
                    </td>
                    <td data-label="Status">
                      <span className={STATUS_CHIP[r.status].cls}>{STATUS_CHIP[r.status].label}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => onSort('no')}>
                  No. Antar
                  {sortIcon('no')}
                </th>
                <th className="sortable" onClick={() => onSort('order')}>
                  No. Order
                  {sortIcon('order')}
                </th>
                <th className="sortable" onClick={() => onSort('customer')}>
                  Pelanggan
                  {sortIcon('customer')}
                </th>
                <th className="sortable" onClick={() => onSort('outlet')}>
                  Outlet
                  {sortIcon('outlet')}
                </th>
                <th className="sortable num" onClick={() => onSort('qty')}>
                  Pasang
                  {sortIcon('qty')}
                </th>
                <th className="sortable" onClick={() => onSort('date')}>
                  Tgl Kirim
                  {sortIcon('date')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : sortedCouriers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    Belum ada pengantaran kurir.
                  </td>
                </tr>
              ) : (
                sortedCouriers.map((r) => (
                  <tr key={r.id}>
                    <td data-label="No. Antar">{r.number ?? '-'}</td>
                    <td data-label="No. Order">{r.order_invoice_no ?? r.order_number ?? '-'}</td>
                    <td data-label="Pelanggan">{r.customer?.name ?? '-'}</td>
                    <td data-label="Outlet">{r.branch?.code ?? '-'}</td>
                    <td className="num" data-label="Pasang">
                      {r.qty ?? 0}
                    </td>
                    <td data-label="Tgl Kirim">{fmtDate(r.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {total > 0 ? (
        <div className="dt-pager">
          <div className="dt-pager-size">
            Tampilkan{' '}
            <select
              value={perPage}
              aria-label="Jumlah baris per halaman"
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>{' '}
            per halaman
          </div>
          <div className="dt-pager-nav">
            <span className="mini">
              {from}
              {'\u2013'}
              {to} dari {total}
            </span>
            <button
              type="button"
              className="pg-btn"
              aria-label="Halaman sebelumnya"
              disabled={loading || page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              {'\u2039'}
            </button>
            <span className="mini">
              {page}/{lastPage}
            </span>
            <button
              type="button"
              className="pg-btn"
              aria-label="Halaman berikutnya"
              disabled={loading || page >= lastPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {'\u203a'}
            </button>
          </div>
        </div>
      ) : null}

      <DeliveryNoteDialog
        note={detail}
        onClose={() => setDetail(null)}
        onDone={afterAction}
        onError={showError}
      />

      <Toast show={toast.open} message={toast.message} kind={toast.kind} onClose={hideToast} />
    </div>
  );
}
