import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { fetchAllWorkRecapRows, getWorkRecap } from '../../api/production';
import DateRangePicker from '../../components/DateRangePicker';
import type { WorkRecapMeta, WorkRecapRow, WorkRecapSummary, WorkshopPhase } from '../../types/production';
import { fmtDate, fmtDateTime, rangeFor } from '../../utils/date';
import { downloadXlsx, printPdf } from '../../utils/export-table';
import { num } from '../../utils/money';
import { IconDownload, IconSort, IconSortDown, IconSortUp } from '../users/icons';

type SortKey =
  | 'logged_at'
  | 'order_number'
  | 'customer_name'
  | 'workshop_code'
  | 'phase'
  | 'qty'
  | 'technician';

type SortState = { key: SortKey; dir: 1 | -1 };

const PAGE_SIZES = [25, 50, 100];
const DEFAULT_RANGE = rangeFor('month');
const EMPTY_SUMMARY: WorkRecapSummary = { activities: 0, persiapan: 0, finishing: 0, pairs: 0 };

const EXPORT_COLUMNS = [
  'Tanggal',
  'No. Order',
  'Pelanggan',
  'Workshop',
  'Tahap',
  'Pasang',
  'Dikerjakan Oleh',
];

const PHASE_LABEL: Record<WorkshopPhase, string> = {
  persiapan: 'Persiapan',
  finishing: 'Finishing',
};

const PHASE_CHIP: Record<WorkshopPhase, string> = {
  persiapan: 'chip c-masuk',
  finishing: 'chip c-proses',
};

export default function RekapPekerjaanPage() {
  const [from, setFrom] = useState(DEFAULT_RANGE[0]);
  const [to, setTo] = useState(DEFAULT_RANGE[1]);
  const [userId, setUserId] = useState('');
  const [phase, setPhase] = useState<'' | WorkshopPhase>('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sort, setSort] = useState<SortState>({ key: 'logged_at', dir: 1 });
  const [rows, setRows] = useState<WorkRecapRow[]>([]);
  const [meta, setMeta] = useState<WorkRecapMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  const query = useMemo(
    () => ({
      date_from: from,
      date_to: to,
      user_id: userId || undefined,
      phase: phase || undefined,
    }),
    [from, to, userId, phase],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getWorkRecap({ ...query, page, per_page: perPage });

      setRows(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta);
    } catch (err) {
      setRows([]);
      setMeta(null);
      setError(getErrorMessage(err, 'Gagal memuat rekap pekerjaan.'));
    } finally {
      setLoading(false);
    }
  }, [query, page, perPage]);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(() => {
    const value = (row: WorkRecapRow): string | number => {
      if (sort.key === 'qty') return row.qty;
      if (sort.key === 'logged_at') return row.logged_at ?? '';
      if (sort.key === 'phase') return PHASE_LABEL[row.phase];

      return row[sort.key] ?? '';
    };

    return [...rows].sort((a, b) => {
      const left = value(a);
      const right = value(b);

      if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;

      return String(left).localeCompare(String(right), 'id') * sort.dir;
    });
  }, [rows, sort]);

  const summary = meta?.summary ?? EMPTY_SUMMARY;
  const technicians = meta?.technicians ?? [];
  const chips = meta?.by_technician ?? [];
  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const fromRow = total === 0 ? 0 : (page - 1) * perPage + 1;
  const toRow = Math.min(page * perPage, total);

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

  async function runExport(format: 'xlsx' | 'pdf') {
    setExportOpen(false);
    setLoading(true);

    try {
      const all = await fetchAllWorkRecapRows(query);

      const aoa: unknown[][] = [
        EXPORT_COLUMNS,
        ...all.map((row) => [
          fmtDateTime(row.logged_at),
          row.order_number ?? '',
          row.customer_name ?? '',
          row.workshop_code ?? '',
          PHASE_LABEL[row.phase],
          row.qty,
          row.technician ?? '',
        ]),
      ];

      const subtitle = `Periode ${fmtDate(from)} \u2013 ${fmtDate(to)}`;

      if (format === 'xlsx') {
        downloadXlsx(`rekap-pekerjaan-${from}-${to}.xlsx`, 'Rekap Pekerjaan', aoa);
      } else if (!printPdf('Rekap Pekerjaan', subtitle, aoa)) {
        setError('Popup diblokir browser. Izinkan popup untuk export PDF.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyiapkan berkas export.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-title">
        <span>Rekap Pekerjaan</span>

        <span className="bb-hd-r">
          <span className="ct-note">siapa mengerjakan apa dalam satu periode</span>
          <button type="button" className="btn" onClick={() => setExportOpen(true)} disabled={total === 0}>
            <IconDownload />
            <span>Export</span>
          </button>
        </span>
      </div>

      <div className="filters">
        <div className="f auto">
          <label htmlFor="rp-periode">Periode</label>
          <DateRangePicker
            from={from}
            to={to}
            onChange={(nextFrom, nextTo) => {
              setFrom(nextFrom);
              setTo(nextTo);
              setPage(1);
            }}
          />
        </div>

        <div className="f">
          <label htmlFor="rp-teknisi">Teknisi</label>
          <select
            id="rp-teknisi"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua teknisi</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name}
              </option>
            ))}
          </select>
        </div>

        <div className="f">
          <label htmlFor="rp-tahap">Tahap</label>
          <select
            id="rp-tahap"
            value={phase}
            onChange={(e) => {
              setPhase(e.target.value as '' | WorkshopPhase);
              setPage(1);
            }}
          >
            <option value="">Semua</option>
            <option value="persiapan">Persiapan</option>
            <option value="finishing">Finishing</option>
          </select>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="rp-chips">
          {chips.map((chip) => (
            <span key={chip.user_id} className="chip c-diambil">
              {chip.name}: {num(chip.activities)} Pekerjaan
            </span>
          ))}
        </div>
      ) : null}

      {error ? <div className="login-err">{error}</div> : null}

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => onSort('logged_at')}>
                Tanggal
                {sortIcon('logged_at')}
              </th>
              <th className="sortable" onClick={() => onSort('order_number')}>
                No. Order
                {sortIcon('order_number')}
              </th>
              <th className="sortable" onClick={() => onSort('customer_name')}>
                Pelanggan
                {sortIcon('customer_name')}
              </th>
              <th className="sortable" onClick={() => onSort('workshop_code')}>
                Workshop
                {sortIcon('workshop_code')}
              </th>
              <th className="sortable" onClick={() => onSort('phase')}>
                Tahap
                {sortIcon('phase')}
              </th>
              <th className="sortable num" onClick={() => onSort('qty')}>
                Pasang
                {sortIcon('qty')}
              </th>
              <th className="sortable" onClick={() => onSort('technician')}>
                Dikerjakan Oleh
                {sortIcon('technician')}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="empty" colSpan={7}>
                  Memuat rekap pekerjaan{'\u2026'}
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td className="empty" colSpan={7}>
                  Belum ada aktivitas produksi pada periode ini.
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr key={row.id}>
                  <td data-label="Tanggal">{fmtDateTime(row.logged_at)}</td>
                  <td data-label="No. Order">
                    <b>{row.order_number ?? '\u2014'}</b>
                  </td>
                  <td data-label="Pelanggan">{row.customer_name ?? '\u2014'}</td>
                  <td data-label="Workshop">{row.workshop_code ?? '\u2014'}</td>
                  <td data-label="Tahap">
                    <span className={PHASE_CHIP[row.phase]}>{PHASE_LABEL[row.phase]}</span>
                  </td>
                  <td className="num" data-label="Pasang">
                    {num(row.qty)}
                  </td>
                  <td data-label="Dikerjakan Oleh">
                    <span className="lnk">{row.technician ?? '\u2014'}</span>
                  </td>
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
              aria-label="Jumlah baris per halaman"
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
              {fromRow}
              {'\u2013'}
              {toRow} dari {total}
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

      <div className="rp-sum">
        <div className="rp-sum-row">
          <span>Total pekerjaan</span>
          <span>
            {num(summary.activities)} aktivitas ({num(summary.persiapan)} persiapan {'\u00B7'}{' '}
            {num(summary.finishing)} finishing)
          </span>
        </div>
        <div className="rp-sum-row">
          <span>Total pasang dikerjakan</span>
          <span>{num(summary.pairs)} pasang</span>
        </div>
      </div>

      {exportOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Pilih format export">
          <div className="box">
            <div className="modal-head">
              <h3>Pilih Format Export</h3>
              <button type="button" className="mclose" onClick={() => setExportOpen(false)}>
                {'\u2715'}
              </button>
            </div>

            <div className="mini" style={{ marginBottom: 12 }}>
              {num(summary.activities)} baris data. {'\u00B7'} Periode {fmtDate(from)} {'\u2013'} {fmtDate(to)}
            </div>

            <button type="button" className="txn-choice" onClick={() => void runExport('xlsx')}>
              <b>Export ke Excel</b>
              <span>Berkas .xlsx untuk diolah lebih lanjut</span>
            </button>

            <button type="button" className="txn-choice" onClick={() => void runExport('pdf')}>
              <b>Export ke PDF</b>
              <span>Berkas siap cetak / dibagikan</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
