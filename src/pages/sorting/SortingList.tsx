import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../store/useAuth';
import { fmtDate, todayLocalYMD } from '../../utils/date';
import { getErrorMessage } from '../../api/client';
import {
  handoverOrders,
  listSorting,
  sendOrdersByCourier,
  sortOrders,
} from '../../api/sorting';
import type {
  DeliveryNote,
  SkippedOrder,
  SortingDestination,
  SortingMeta,
  SortingOrder,
  SortingTab,
} from '../../api/sorting';
import { IconFile, IconSort, IconSortDown, IconSortUp } from '../users/icons';
import {
  AddressDialog,
  CreateNoteDialog,
  CreatePickupDialog,
  HandoverDialog,
} from './SortingDialogs';
import SortingDetailDialog from './SortingDetailDialog';
import { printDeliveryNote } from './print';

const TABS: { key: SortingTab; label: string }[] = [
  { key: 'incoming', label: 'Barang Masuk' },
  { key: 'delivery-note', label: 'Surat Jalan' },
  { key: 'at-subcon', label: 'Di Subcon' },
  { key: 'ready', label: 'Ready' },
];

const PAGE_SIZES = [25, 50, 100];

type SortKey = 'no' | 'customer' | 'outlet' | 'qty' | 'deadline' | 'photo';
type SortState = { key: SortKey; dir: 1 | -1 };

type DialogState =
  | { kind: 'none' }
  | { kind: 'note'; orders: SortingOrder[] }
  | { kind: 'pickup'; orders: SortingOrder[] }
  | { kind: 'handover'; orders: SortingOrder[] }
  | { kind: 'address'; orders: SortingOrder[] };

function emptyTextFor(tab: SortingTab): string {
  if (tab === 'delivery-note') return 'Tidak ada order yang menunggu surat jalan.';
  if (tab === 'at-subcon') return 'Tidak ada order di subcon.';
  if (tab === 'ready') return 'Belum ada order yang ready.';
  return 'Tidak ada barang yang perlu disortir.';
}

export default function SortingList() {
  const [tab, setTab] = useState<SortingTab>('incoming');
  const [rows, setRows] = useState<SortingOrder[]>([]);
  const [meta, setMeta] = useState<SortingMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [skipped, setSkipped] = useState<SkippedOrder[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>({ kind: 'none' });
  const [detail, setDetail] = useState<SortingOrder | null>(null);

  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const [branchId, setBranchId] = useState('');
  const [photo, setPhoto] = useState<'' | 'yes' | 'no'>('');
  const [destination, setDestination] = useState<'' | SortingDestination>('');
  const [contactId, setContactId] = useState('');
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: 'no', dir: 1 });

  const { toast, showSuccess, showError, hideToast } = useToast();
  const branches = useAuth.user?.branches ?? [];

  useEffect(() => {
    const timer = window.setTimeout(() => setTerm(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listSorting(tab, {
        q: term || undefined,
        branch_id: branchId || undefined,
        photo: tab === 'incoming' && photo ? photo : undefined,
        processing_destination: tab === 'delivery-note' && destination ? destination : undefined,
        contact_id: tab === 'at-subcon' && contactId ? contactId : undefined,
        per_page: perPage,
        page,
      });
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch (e) {
      setErr(getErrorMessage(e, 'Gagal memuat data sorting.'));
      setRows([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [tab, term, branchId, photo, destination, contactId, perPage, page]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setSelected([]);
    setSkipped([]);
    setPage(1);
    setPhoto('');
    setDestination('');
    setContactId('');
    setSort({ key: 'no', dir: 1 });
  }, [tab]);

  useEffect(() => {
    setPage(1);
  }, [term, branchId, photo, destination, contactId, perPage]);

  const sorted = useMemo(() => {
    const value = (row: SortingOrder): string | number => {
      if (sort.key === 'customer') return (row.customer_name ?? '').toLowerCase();
      if (sort.key === 'outlet') return (row.branch?.code ?? '').toLowerCase();
      if (sort.key === 'qty') return row.qty;
      if (sort.key === 'photo') return row.has_before_photo ? 1 : 0;
      if (sort.key === 'deadline') {
        return (tab === 'ready' ? row.completed_at : row.ready_at) ?? '';
      }
      return (row.invoice_no ?? row.number).toLowerCase();
    };

    return [...rows].sort((a, b) => {
      const left = value(a);
      const right = value(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;
      return String(left).localeCompare(String(right), 'id') * sort.dir;
    });
  }, [rows, sort, tab]);

  const selectedOrders = useMemo(
    () => rows.filter((r) => selected.includes(r.id)),
    [rows, selected],
  );

  const subconOptions = useMemo(
    () =>
      Array.from(
        new Map(
          rows
            .filter((r) => r.destination_contact)
            .map((r) => [r.destination_contact!.id, r.destination_contact!.name]),
        ),
      ),
    [rows],
  );

  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const allChecked = sorted.length > 0 && sorted.every((r) => selected.includes(r.id));
  const colSpan = tab === 'delivery-note' ? 7 : 6;

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

  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const afterAction = async (okCount: number, label: string, skippedRows: SkippedOrder[]) => {
    setSkipped(skippedRows);
    setSelected([]);
    setDialog({ kind: 'none' });
    setDetail(null);
    await load();

    if (okCount > 0) {
      showSuccess(`${okCount} ${label}` + (skippedRows.length ? ` \u00b7 ${skippedRows.length} dilewati` : ''));
      return;
    }

    showError(skippedRows[0]?.reason ?? 'Tidak ada order yang diproses.');
  };

  const runSort = async (dest: SortingDestination, ids: string[]) => {
    if (!ids.length) {
      showError('Pilih order dulu.');
      return;
    }

    setBusy(true);
    try {
      const res = await sortOrders(ids, dest);
      await afterAction(res.data.sorted.length, 'order disortir', res.data.skipped);
    } catch (e) {
      showError(getErrorMessage(e, 'Gagal menyortir order.'));
    } finally {
      setBusy(false);
    }
  };

  const runHandover = async (files: File[]) => {
    setBusy(true);
    try {
      const res = await handoverOrders(selected, files);
      await afterAction(res.data.handed_over.length, 'order diserahkan ke customer', res.data.skipped);
    } catch (e) {
      showError(getErrorMessage(e, 'Gagal menyerahkan order.'));
    } finally {
      setBusy(false);
    }
  };

  const runCourier = async (ids: string[], addresses: Record<string, string> = {}) => {
    setBusy(true);
    try {
      const res = await sendOrdersByCourier(ids, addresses);
      const needAddress = res.data.skipped.filter((s) => s.customer_id);

      if (needAddress.length > 0 && Object.keys(addresses).length === 0) {
        const pending = rows.filter((r) => needAddress.some((s) => s.order_id === r.id));

        setSkipped(res.data.skipped.filter((s) => !s.customer_id));
        setDialog({ kind: 'address', orders: pending });

        if (res.data.sent.length > 0) {
          showSuccess(`${res.data.sent.length} order dikirim via kurir.`);
          await load();
        }
        return;
      }

      await afterAction(res.data.sent.length, 'order dikirim via kurir', res.data.skipped);
    } catch (e) {
      showError(getErrorMessage(e, 'Gagal mengirim order via kurir.'));
    } finally {
      setBusy(false);
    }
  };

  const openNoteDialog = () => {
    if (!selected.length) {
      showError('Pilih order dulu.');
      return;
    }

    const targets = new Set(selectedOrders.map((o) => o.processing_destination));
    if (targets.size > 1) {
      showError('Pilih order dengan tujuan sama (semua Workshop, atau semua Subcon).');
      return;
    }

    setDialog({ kind: 'note', orders: selectedOrders });
  };

  const openPickupDialog = () => {
    if (!selected.length) {
      showError('Pilih order dulu.');
      return;
    }

    const subcons = new Set(selectedOrders.map((o) => o.destination_contact?.id ?? ''));
    if (subcons.size > 1) {
      showError('Pilih order dari subcon yang sama saja.');
      return;
    }

    setDialog({ kind: 'pickup', orders: selectedOrders });
  };

  const afterNoteCreated = async (note: DeliveryNote, label: string) => {
    setDialog({ kind: 'none' });
    setSelected([]);
    await load();
    showSuccess(`${label} ${note.number} dibuat (${note.orders?.length ?? 0} order)`);

    try {
      printDeliveryNote(note);
    } catch (e) {
      showError(getErrorMessage(e, 'Gagal membuka jendela cetak.'));
    }
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
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="sort-q">Cari</label>
          <input
            id="sort-q"
            type="search"
            placeholder="no order / nama"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {tab === 'incoming' ? (
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="sort-photo">Foto</label>
            <select
              id="sort-photo"
              value={photo}
              onChange={(e) => setPhoto(e.target.value as '' | 'yes' | 'no')}
            >
              <option value="">Semua</option>
              <option value="yes">Sudah ada foto</option>
              <option value="no">Belum ada foto</option>
            </select>
          </div>
        ) : null}

        {tab === 'delivery-note' ? (
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="sort-dest">Tujuan</label>
            <select
              id="sort-dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value as '' | SortingDestination)}
            >
              <option value="">Semua</option>
              <option value="workshop">Ke Workshop</option>
              <option value="vendor">Ke Subcon</option>
            </select>
          </div>
        ) : null}

        {tab === 'at-subcon' ? (
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="sort-vendor">Vendor</label>
            <select id="sort-vendor" value={contactId} onChange={(e) => setContactId(e.target.value)}>
              <option value="">Semua subcon</option>
              {subconOptions.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="sort-branch">{tab === 'delivery-note' ? 'Outlet Asal' : 'Outlet'}</label>
            <select id="sort-branch" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              <option value="">Semua</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.code} {'\u2014'} {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {tab === 'delivery-note' ? (
        <p className="mini" style={{ marginBottom: 12 }}>
          Order yang sudah <b style={{ color: 'var(--blue)' }}>disortir</b> & butuh dikirim. Pilih{' '}
          <b style={{ color: 'var(--blue)' }}>order</b> lalu buat surat jalan (tentukan{' '}
          <b style={{ color: 'var(--blue)' }}>tanggal & tujuan</b> spesifik).
        </p>
      ) : null}

      {tab === 'at-subcon' ? (
        <p className="mini" style={{ marginBottom: 12 }}>
          Order yang sedang <b style={{ color: 'var(--blue)' }}>dikerjakan subcon</b>. Pilih{' '}
          <b style={{ color: 'var(--blue)' }}>order</b> lalu buat <b>Surat Jalan Ambil</b> untuk
          menjemput kembali ke workshop.
        </p>
      ) : null}

      <div className={selected.length ? 'bulkbar show' : 'bulkbar'}>
        <span className="bb-count">{selected.length} dipilih</span>
        <div className="toolbar">
          {tab === 'incoming' ? (
            <>
              <button
                type="button"
                className="btn ghost sm"
                disabled={busy}
                onClick={() => void runSort('workshop', selected)}
              >
                Kerjakan di Workshop
              </button>
              <button
                type="button"
                className="btn ghost sm"
                disabled={busy}
                onClick={() => void runSort('vendor', selected)}
              >
                Kirim ke Subcon
              </button>
            </>
          ) : null}

          {tab === 'delivery-note' ? (
            <button type="button" className="btn ghost sm" disabled={busy} onClick={openNoteDialog}>
              <IconFile />
              Buat Surat Jalan
            </button>
          ) : null}

          {tab === 'at-subcon' ? (
            <button type="button" className="btn ghost sm" disabled={busy} onClick={openPickupDialog}>
              <IconFile />
              Buat Surat Jalan Ambil
            </button>
          ) : null}

          {tab === 'ready' ? (
            <>
              <button
                type="button"
                className="btn ghost sm"
                disabled={busy}
                onClick={() => setDialog({ kind: 'handover', orders: selectedOrders })}
              >
                Diambil Customer
              </button>
              <button
                type="button"
                className="btn ghost sm"
                disabled={busy}
                onClick={() => void runCourier(selected)}
              >
                Kirim via Kurir
              </button>
            </>
          ) : null}
        </div>
        <button type="button" className="link" onClick={() => setSelected([])}>
          bersihkan
        </button>
      </div>

      {err ? (
        <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
          {err}
        </div>
      ) : null}

      {skipped.length > 0 ? (
        <div className="hintbox" style={{ marginBottom: 12 }}>
          <div className="toolbar" style={{ justifyContent: 'space-between' }}>
            <b>{skipped.length} order dilewati</b>
            <button type="button" className="link" onClick={() => setSkipped([])}>
              tutup
            </button>
          </div>
          <ul style={{ margin: '6px 0 0 18px' }}>
            {skipped.map((s) => (
              <li key={s.order_id}>
                <b>{s.number ?? s.order_id}</b> {'\u2014'} {s.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '1%' }}>
                <input
                  type="checkbox"
                  aria-label="Pilih semua baris"
                  checked={allChecked}
                  disabled={sorted.length === 0}
                  onChange={(e) => setSelected(e.target.checked ? sorted.map((r) => r.id) : [])}
                />
              </th>
              <th className="sortable" onClick={() => onSort('no')}>
                No / Tanggal
                {sortIcon('no')}
              </th>
              <th className="sortable" onClick={() => onSort('customer')}>
                Pelanggan
                {sortIcon('customer')}
              </th>
              <th className="sortable" onClick={() => onSort('outlet')}>
                {tab === 'at-subcon' ? 'Vendor' : tab === 'delivery-note' ? 'Asal' : 'Outlet'}
                {sortIcon('outlet')}
              </th>
              {tab === 'delivery-note' ? (
                <th className="sortable" onClick={() => onSort('outlet')}>
                  Tujuan
                  {sortIcon('outlet')}
                </th>
              ) : null}
              <th className="sortable num" onClick={() => onSort('qty')}>
                Pasang
                {sortIcon('qty')}
              </th>
              <th className="sortable" onClick={() => onSort('deadline')}>
                {tab === 'ready' ? 'Tanggal Selesai' : 'Deadline'}
                {sortIcon('deadline')}
              </th>
              {tab === 'incoming' ? (
                <th className="sortable num" onClick={() => onSort('photo')}>
                  Foto
                  {sortIcon('photo')}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colSpan + 1} className="empty">
                  Memuat{'\u2026'}
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={colSpan + 1} className="empty">
                  {emptyTextFor(tab)}
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr key={r.id}>
                  <td className="dt-check">
                    <input
                      type="checkbox"
                      aria-label={`Pilih order ${r.number}`}
                      checked={selected.includes(r.id)}
                      onChange={() => toggleOne(r.id)}
                    />
                  </td>
                  <td data-label="No / Tanggal">
                    <button type="button" className="link" onClick={() => setDetail(r)}>
                      {r.invoice_no ?? r.number}
                    </button>
                    <div className="mini">{fmtDate(r.created_at)}</div>
                  </td>
                  <td data-label="Pelanggan">{r.customer_name ?? '-'}</td>
                  <td data-label="Outlet">
                    {tab === 'at-subcon' ? (
                      <span className="chip c-subcon">{r.destination_contact?.name ?? '-'}</span>
                    ) : tab === 'delivery-note' ? (
                      (r.branch?.code ?? '-')
                    ) : (
                      <>
                        {r.branch?.code ?? '-'}{' '}
                        <span className="mini">
                          ({r.branch?.type === 'droppoint' ? 'drop point' : 'workshop'})
                        </span>
                      </>
                    )}
                  </td>
                  {tab === 'delivery-note' ? (
                    <td data-label="Tujuan">
                      <span
                        className={
                          r.processing_destination === 'vendor' ? 'chip c-subcon' : 'chip c-proses'
                        }
                      >
                        {r.processing_destination === 'vendor' ? 'Subcon' : 'Workshop'}
                      </span>
                    </td>
                  ) : null}
                  <td className="num" data-label="Pasang">
                    {r.qty}
                  </td>
                  <td data-label={tab === 'ready' ? 'Tanggal Selesai' : 'Deadline'}>
                    {tab === 'ready' ? (
                      fmtDate(r.completed_at)
                    ) : r.ready_at ? (
                      <span className={r.is_late ? 'chip c-late' : 'chip c-masuk'}>
                        {fmtDate(r.ready_at)}
                        {r.is_late ? ' \u00b7 telat' : ''}
                      </span>
                    ) : (
                      '\u2014'
                    )}
                  </td>
                  {tab === 'incoming' ? (
                    <td className="num" data-label="Foto">
                      {r.has_before_photo ? (
                        <b style={{ color: 'var(--ok)' }}>{'\u2713'}</b>
                      ) : (
                        <b style={{ color: 'var(--danger)' }} title="Belum ada foto before">
                          {'\u2715'}
                        </b>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))
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
              aria-label="Jumlah order per halaman"
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

      <SortingDetailDialog
        open={detail !== null}
        tab={tab}
        row={detail}
        busy={busy}
        onClose={() => setDetail(null)}
        onSort={(dest) => runSort(dest, detail ? [detail.id] : [])}
        onPhotosChanged={load}
      />

      <CreateNoteDialog
        open={dialog.kind === 'note'}
        orders={dialog.kind === 'note' ? dialog.orders : []}
        defaultDate={todayLocalYMD()}
        onClose={() => setDialog({ kind: 'none' })}
        onCreated={(note) => afterNoteCreated(note, 'Surat jalan')}
        onError={showError}
      />

      <CreatePickupDialog
        open={dialog.kind === 'pickup'}
        orders={dialog.kind === 'pickup' ? dialog.orders : []}
        defaultDate={todayLocalYMD()}
        onClose={() => setDialog({ kind: 'none' })}
        onCreated={(note) => afterNoteCreated(note, 'Surat jalan ambil')}
        onError={showError}
      />

      <HandoverDialog
        open={dialog.kind === 'handover'}
        orders={dialog.kind === 'handover' ? dialog.orders : []}
        busy={busy}
        onClose={() => setDialog({ kind: 'none' })}
        onSubmit={runHandover}
      />

      <AddressDialog
        open={dialog.kind === 'address'}
        orders={dialog.kind === 'address' ? dialog.orders : []}
        busy={busy}
        onClose={() => setDialog({ kind: 'none' })}
        onSubmit={async (addresses, ids) => {
          setDialog({ kind: 'none' });
          await runCourier(ids, addresses);
        }}
      />

      <Toast show={toast.open} message={toast.message} kind={toast.kind} onClose={hideToast} />
    </div>
  );
}
