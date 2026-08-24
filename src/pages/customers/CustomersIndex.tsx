import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../api/client';
import { createCustomer, listCustomers, updateCustomer } from '../../api/customers';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../store/useAuth';
import type { Customer, CustomerQuery, PaginationMeta } from '../../types/customers';
import { fmtDate } from '../../utils/date';
import { downloadXlsx } from '../../utils/export-table';
import { rp } from '../../utils/money';
import {
  IconArchive,
  IconDownload,
  IconKebab,
  IconSort,
  IconSortDown,
  IconSortUp,
  IconUnarchive,
  IconUpload,
} from '../users/icons';

type SortKey = NonNullable<CustomerQuery['sort_by']>;
type SortState = { key: SortKey; dir: 'asc' | 'desc' };
type VisitsOp = '' | 'gte' | 'lte';

const PAGE_SIZES = [25, 50, 100];

export default function CustomersIndex() {
  const navigate = useNavigate();
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branches = useMemo(() => user?.branches ?? [], [user]);
  const canPickBranch = branches.length > 1;

  const [rows, setRows] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [branchId, setBranchId] = useState('');
  const [visitsOp, setVisitsOp] = useState<VisitsOp>('');
  const [visits, setVisits] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: 'visits', dir: 'asc' });
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  const { toast, showSuccess, hideToast } = useToast();

  const params = useMemo<CustomerQuery>(
    () => ({
      q: keyword || undefined,
      branch_id: branchId || undefined,
      is_active: !archived,
      visits_op: visitsOp || undefined,
      visits: visitsOp && visits !== '' ? Number(visits) : undefined,
      sort_by: sort.key,
      sort_dir: sort.dir,
      page,
      per_page: perPage,
    }),
    [keyword, branchId, archived, visitsOp, visits, sort, page, perPage],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCustomers(params);
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data pelanggan'));
    } finally {
      setLoading(false);
    }
  }, [params]);

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

  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const allChecked = rows.length > 0 && rows.every((row) => selected.includes(row.id));

  function onSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
    setPage(1);
  }

  function sortIcon(key: SortKey) {
    const active = sort.key === key;
    return (
      <span className={active ? 'sort-ic on' : 'sort-ic'}>
        {active ? sort.dir === 'asc' ? <IconSortUp /> : <IconSortDown /> : <IconSort />}
      </span>
    );
  }

  function toSheet(items: Customer[]): unknown[][] {
    return [
      ['nama', 'wa', 'alamat', 'asal_outlet', 'label', 'kunjungan', 'total_belanja', 'terakhir'],
      ...items.map((item) => [
        item.name,
        item.whatsapp,
        item.address ?? '',
        item.branch?.name ?? '',
        (item.tags ?? []).join('; '),
        item.visits_count ?? 0,
        Number(item.spend_total ?? 0),
        item.last_order_at ? item.last_order_at.slice(0, 10) : '',
      ]),
    ];
  }

  async function onExport() {
    setBusy(true);
    setError(null);
    try {
      const items = selected.length
        ? rows.filter((row) => selected.includes(row.id))
        : (await listCustomers({ ...params, page: 1, per_page: 500 })).data ?? [];

      if (items.length === 0) {
        showSuccess('Tidak ada data untuk diekspor.');
        return;
      }

      downloadXlsx(
        `database-pelanggan-${new Date().toISOString().slice(0, 10)}.xlsx`,
        'Pelanggan',
        toSheet(items),
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengekspor data'));
    } finally {
      setBusy(false);
    }
  }

  async function onImport(file: File) {
    if (canPickBranch && !branchId) {
      setError('Pilih Asal Outlet terlebih dahulu sebelum import.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim() !== '');
      const head = (lines.shift() ?? '').split(',').map((cell) => cell.trim().toLowerCase());
      const iName = head.indexOf('nama');
      const iWa = head.indexOf('wa');
      const iAddress = head.indexOf('alamat');
      const iLabel = head.indexOf('label');

      if (iName < 0 || iWa < 0) {
        setError('Header CSV wajib memuat kolom "nama" dan "wa".');
        return;
      }

      let ok = 0;
      let skipped = 0;

      for (const line of lines) {
        const cols = line.split(',').map((cell) => cell.trim());
        const name = cols[iName] ?? '';
        const wa = (cols[iWa] ?? '').replace(/\D+/g, '');

        if (!name || !wa) {
          skipped += 1;
          continue;
        }

        try {
          await createCustomer({
            name,
            whatsapp: wa,
            address: iAddress >= 0 ? cols[iAddress] || null : null,
            tags:
              iLabel >= 0 && cols[iLabel]
                ? cols[iLabel].split(';').map((tag) => tag.trim()).filter(Boolean)
                : [],
            ...(branchId ? { branch_id: branchId } : {}),
          });
          ok += 1;
        } catch {
          skipped += 1;
        }
      }

      showSuccess(`Import selesai: ${ok} ditambahkan, ${skipped} dilewati.`);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal membaca berkas CSV'));
    } finally {
      setBusy(false);
    }
  }

  async function applyActive(ids: string[], next: boolean) {
    if (ids.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      await Promise.all(ids.map((id) => updateCustomer(id, { is_active: next })));
      showSuccess(`${ids.length} pelanggan ${next ? 'dipulihkan' : 'diarsipkan'}.`);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memperbarui status pelanggan'));
    } finally {
      setBusy(false);
    }
  }

  const pageActions = (
    <>
      {archived ? (
        <button
          type="button"
          className="btn sm arc-pill"
          onClick={() => {
            setArchived(false);
            setPage(1);
          }}
        >
          {'\u2715'} <span>Tutup Arsip</span>
        </button>
      ) : null}

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
          <label className="kebab-item">
            <IconUpload />
            <span>Import</span>
            <input
              type="file"
              accept=".csv,text/csv"
              hidden
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) void onImport(file);
              }}
            />
          </label>

          <button type="button" className="kebab-item" disabled={busy} onClick={() => void onExport()}>
            <IconDownload />
            <span>{selected.length > 0 ? `Export ${selected.length} terpilih` : 'Export'}</span>
          </button>

          <div className="kebab-sep" />

          <button
            type="button"
            className="kebab-item"
            onClick={() => {
              setArchived((prev) => !prev);
              setPage(1);
            }}
          >
            <IconArchive />
            <span>Tampilkan arsip</span>
            <span className="chk">{archived ? '\u2713' : ''}</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      {slot ? createPortal(pageActions, slot) : null}

      <div className="card">
        <div className="card-title">
          <span>Daftar Pelanggan</span>
          <span className="ct-note">
            {loading ? 'Memuat\u2026' : `${meta?.active_total ?? 0} pelanggan aktif`}
          </span>
          <input
            className="inp"
            style={{ maxWidth: 380 }}
            placeholder="nama / WA"
            aria-label="Cari nama atau nomor WhatsApp"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="row" style={{ marginBottom: 14 }}>
          {canPickBranch ? (
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="cust-branch">Asal Outlet</label>
              <select
                id="cust-branch"
                value={branchId}
                onChange={(e) => {
                  setBranchId(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Semua</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.code} {'\u2014'} {branch.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="cust-visits-op">Jumlah Kunjungan</label>
            <div className="row">
              <select
                id="cust-visits-op"
                value={visitsOp}
                onChange={(e) => {
                  setVisitsOp(e.target.value as VisitsOp);
                  setPage(1);
                }}
              >
                <option value="">Semua</option>
                <option value="gte">{'\u2265'}</option>
                <option value="lte">{'\u2264'}</option>
              </select>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="jml"
                aria-label="Jumlah kunjungan"
                value={visits}
                onChange={(e) => {
                  setVisits(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className={selected.length ? 'bulkbar show' : 'bulkbar'}>
          <span className="bb-count">{selected.length} dipilih</span>
          <div className="toolbar">
            <button
              type="button"
              className="btn ghost sm"
              disabled={busy}
              onClick={() => void applyActive(selected, archived)}
            >
              {archived ? <IconUnarchive /> : <IconArchive />}
              {archived ? 'Pulihkan terpilih' : 'Arsipkan terpilih'}
            </button>
          </div>
          <button type="button" className="link" onClick={() => setSelected([])}>
            bersihkan
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="tbl-wrap customer-table">
          <table>
            <thead>
              <tr>
                <th className="dt-check">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Pilih semua pelanggan"
                    onChange={(e) => setSelected(e.target.checked ? rows.map((row) => row.id) : [])}
                  />
                </th>
                <th className="sortable" onClick={() => onSort('name')}>
                  Nama
                  {sortIcon('name')}
                </th>
                <th className="sortable" onClick={() => onSort('wa')}>
                  WA
                  {sortIcon('wa')}
                </th>
                <th className="sortable" onClick={() => onSort('branch')}>
                  Asal
                  {sortIcon('branch')}
                </th>
                <th className="sortable num" onClick={() => onSort('visits')}>
                  Kunjungan
                  {sortIcon('visits')}
                </th>
                <th className="sortable num" onClick={() => onSort('spend')}>
                  Total Belanja
                  {sortIcon('spend')}
                </th>
                <th className="sortable" onClick={() => onSort('last_order')}>
                  Terakhir
                  {sortIcon('last_order')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    {archived
                      ? 'Tidak ada pelanggan di arsip.'
                      : 'Belum ada pelanggan. Data terisi otomatis saat order dibuat di POS.'}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.is_active ? 'rowc' : 'rowc dt-arc'}
                    onClick={() => navigate(`/customers/${row.id}`)}
                  >
                    <td className="dt-check" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        aria-label={`Pilih ${row.name}`}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id),
                          )
                        }
                      />
                    </td>
                    <td data-label="Nama">
                      <span className="lnk">{row.name}</span>
                      {(row.visits_count ?? 0) > 1 ? (
                        <span className="chip c-lunas" style={{ marginLeft: 8 }}>
                          Repeat
                        </span>
                      ) : null}
                      {row.is_active ? null : (
                        <span className="tag" style={{ marginLeft: 8 }}>
                          arsip
                        </span>
                      )}
                    </td>
                    <td data-label="WA">{row.whatsapp || '\u2014'}</td>
                    <td data-label="Asal">{row.branch?.code ?? row.branch?.name ?? '\u2014'}</td>
                    <td className="num" data-label="Kunjungan">
                      {row.visits_count ?? 0}
                    </td>
                    <td className="num" data-label="Total Belanja">
                      {rp(Number(row.spend_total ?? 0))}
                    </td>
                    <td data-label="Terakhir">{row.last_order_at ? fmtDate(row.last_order_at) : '\u2014'}</td>
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
                aria-label="Jumlah pelanggan per halaman"
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
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
                disabled={page <= 1}
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
                disabled={page >= lastPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {'\u203a'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
