import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getErrorMessage } from '../../api/client';
import { createVoucher, deleteVoucher, listVouchers, updateVoucher } from '../../api/vouchers';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useIsManager } from '../../store/useAuth';
import type { PaginationMeta, Voucher, VoucherStatus, VoucherType } from '../../types/vouchers';
import { fmtDate } from '../../utils/date';
import { downloadXlsx } from '../../utils/export-table';
import { num, rp } from '../../utils/money';
import {
  IconArchive,
  IconDownload,
  IconKebab,
  IconPlus,
  IconSort,
  IconSortDown,
  IconSortUp,
  IconTag,
  IconUnarchive,
  IconUpload,
} from '../users/icons';
import LoyaltyStampModal from './LoyaltyStampModal';
import VoucherModal from './VoucherModal';

type SortState = { key: string; dir: 1 | -1 };

const PAGE_SIZE = 25;

const STATUS_LABEL: Record<VoucherStatus, string> = {
  aktif: 'Aktif',
  belum: 'Belum Mulai',
  kadaluwarsa: 'Kadaluwarsa',
  nonaktif: 'Nonaktif',
};

const STATUS_STYLE: Record<VoucherStatus, { color: string; background: string }> = {
  aktif: { color: '#16803c', background: '#e7f6ec' },
  belum: { color: '#9a6a00', background: '#fdf3e0' },
  kadaluwarsa: { color: '#fff', background: '#DC2626' },
  nonaktif: { color: '#667085', background: '#f2f4f7' },
};

function statusOf(voucher: Voucher): VoucherStatus {
  if (!voucher.active) return 'nonaktif';

  const now = Date.now();
  if (voucher.start_at && now < new Date(voucher.start_at).getTime()) return 'belum';
  if (voucher.end_at && now > new Date(voucher.end_at).getTime()) return 'kadaluwarsa';

  return 'aktif';
}

function valueText(voucher: Voucher): string {
  return voucher.type === 'PERCENT' ? `${num(voucher.value)}%` : rp(Number(voucher.value));
}

function sortValue(voucher: Voucher, key: string): number | string {
  if (key === 'code') return voucher.code.toLowerCase();
  if (key === 'name') return (voucher.name ?? '').toLowerCase();
  if (key === 'status') return statusOf(voucher);
  if (key === 'value') return Number(voucher.value);
  if (key === 'period') return voucher.start_at ?? '';
  return voucher.usage_limit ?? Number.MAX_SAFE_INTEGER;
}

export default function VouchersIndex() {
  const canManage = useIsManager();

  const [rows, setRows] = useState<Voucher[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<'' | VoucherType>('');
  const [status, setStatus] = useState<'' | VoucherStatus>('');
  const [page, setPage] = useState(1);
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 1 });
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; voucher: Voucher | null }>({ open: false, voucher: null });
  const [loyaltyOpen, setLoyaltyOpen] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  const { toast, showSuccess, showError, hideToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listVouchers({
        q: keyword || undefined,
        type: type || undefined,
        status: status || undefined,
        archived,
        page,
        per_page: PAGE_SIZE,
      });
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data voucher'));
    } finally {
      setLoading(false);
    }
  }, [keyword, type, status, archived, page]);

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

  const ordered = useMemo(() => {
    return [...rows].sort((a, b) => {
      const left = sortValue(a, sort.key);
      const right = sortValue(b, sort.key);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;
      return String(left).localeCompare(String(right), 'id') * sort.dir;
    });
  }, [rows, sort]);

  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const allChecked = ordered.length > 0 && ordered.every((row) => selected.includes(row.id));

  async function applyArchive(ids: string[], value: boolean) {
    if (ids.length === 0) return;

    setBusy(true);
    try {
      await Promise.all(ids.map((id) => updateVoucher(id, { is_archived: value } as never)));
      showSuccess(`${ids.length} voucher ${value ? 'diarsipkan' : 'dipulihkan'}.`);
      await refresh();
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal mengubah status voucher'));
    } finally {
      setBusy(false);
    }
  }

  async function removeSelected(ids: string[]) {
    if (ids.length === 0) return;
    if (!window.confirm(`Hapus ${ids.length} voucher?`)) return;

    setBusy(true);
    try {
      await Promise.all(ids.map((id) => deleteVoucher(id)));
      showSuccess(`${ids.length} voucher dihapus.`);
      await refresh();
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal menghapus voucher'));
    } finally {
      setBusy(false);
    }
  }

  async function onExport() {
    setBusy(true);
    try {
      const items = selected.length
        ? rows.filter((row) => selected.includes(row.id))
        : (await listVouchers({ archived, per_page: 500 })).data ?? [];

      if (items.length === 0) {
        showSuccess('Tidak ada data untuk diekspor.');
        return;
      }

      downloadXlsx(`master-promo-${new Date().toISOString().slice(0, 10)}.xlsx`, 'Voucher', [
        ['kode', 'nama', 'tipe', 'nilai', 'masa_dari', 'masa_ke', 'kuota_maks', 'gabung_voucher', 'gabung_diskon', 'hitung_setelah_diskon'],
        ...items.map((item) => [
          item.code,
          item.name,
          item.type === 'PERCENT' ? 'pct' : 'rp',
          Number(item.value),
          item.start_at?.slice(0, 10) ?? '',
          item.end_at?.slice(0, 10) ?? '',
          item.usage_limit ?? '',
          item.stack_voucher ? 'ya' : 'tidak',
          item.stack_discount ? 'ya' : 'tidak',
          item.percent_after_discount ? 'ya' : 'tidak',
        ]),
      ]);
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal mengekspor data'));
    } finally {
      setBusy(false);
    }
  }

  function onSort(key: string) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  }

  function sortIcon(key: string) {
    const active = sort.key === key;
    return (
      <span className={active ? 'sort-ic on' : 'sort-ic'}>
        {active ? sort.dir > 0 ? <IconSortUp /> : <IconSortDown /> : <IconSort />}
      </span>
    );
  }

  const pageActions = (
    <>
      {canManage ? (
        <button type="button" className="btn ghost sm" onClick={() => setLoyaltyOpen(true)}>
          <IconTag />
          <span>Atur Loyalty Stamp</span>
        </button>
      ) : null}

      {canManage ? (
        <button type="button" className="btn sm" onClick={() => setModal({ open: true, voucher: null })}>
          <IconPlus />
          <span>Tambah Voucher</span>
        </button>
      ) : null}

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
              setKebabOpen(false);
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

  async function onImport(file: File) {
    setBusy(true);
    setError(null);
    try {
      const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim() !== '');
      const head = (lines.shift() ?? '').split(',').map((cell) => cell.trim().toLowerCase());
      const at = (name: string) => head.indexOf(name);

      if (at('kode') < 0 || at('nama') < 0 || at('nilai') < 0) {
        setError('Header CSV wajib memuat kolom "kode", "nama", dan "nilai".');
        return;
      }

      const yes = (value: string) => /^(ya|yes|true|1)$/i.test(value.trim());
      let ok = 0;
      let skipped = 0;

      for (const line of lines) {
        const cols = line.split(',').map((cell) => cell.trim());
        const code = (cols[at('kode')] ?? '').toUpperCase();
        const amount = Number((cols[at('nilai')] ?? '').replace(/\D/g, ''));

        if (!/^[A-Z0-9]{4,10}$/.test(code) || amount <= 0) {
          skipped += 1;
          continue;
        }

        const isPercent = at('tipe') >= 0 && /pct|persen|%/i.test(cols[at('tipe')] ?? '');
        const from = at('masa_dari') >= 0 ? cols[at('masa_dari')] : '';
        const to = at('masa_ke') >= 0 ? cols[at('masa_ke')] : '';
        const quota = at('kuota_maks') >= 0 ? Number((cols[at('kuota_maks')] ?? '').replace(/\D/g, '')) : 0;

        try {
          await createVoucher({
            code,
            name: cols[at('nama')] || code,
            type: isPercent ? 'PERCENT' : 'NOMINAL',
            value: isPercent ? Math.min(amount, 100) : amount,
            start_at: from || null,
            end_at: to ? `${to} 23:59:59` : null,
            usage_limit: quota > 0 ? quota : null,
            active: true,
            stack_voucher: at('gabung_voucher') >= 0 && yes(cols[at('gabung_voucher')] ?? ''),
            stack_discount: at('gabung_diskon') < 0 || yes(cols[at('gabung_diskon')] ?? ''),
            percent_after_discount: at('hitung_setelah_diskon') < 0 || yes(cols[at('hitung_setelah_diskon')] ?? ''),
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

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      {slot ? createPortal(pageActions, slot) : null}

      <div className="card">
        <div className="card-hd">
          <div className="card-title">
            Master Promo <span className="ct-note">kelola kode voucher &amp; aturan loyalty</span>
          </div>
          <input
            className="hd-search"
            placeholder="nama / kode voucher"
            aria-label="Cari nama atau kode voucher"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="f">
            <label htmlFor="flt-type">Jenis Nilai</label>
            <select
              id="flt-type"
              value={type}
              onChange={(e) => {
                setType(e.target.value as '' | VoucherType);
                setPage(1);
              }}
            >
              <option value="">Semua</option>
              <option value="NOMINAL">Nominal (Rp)</option>
              <option value="PERCENT">Persentase (%)</option>
            </select>
          </div>

          <div className="f">
            <label htmlFor="flt-status">Status Aktif</label>
            <select
              id="flt-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as '' | VoucherStatus);
                setPage(1);
              }}
            >
              <option value="">Semua</option>
              <option value="aktif">Aktif</option>
              <option value="belum">Belum Mulai</option>
              <option value="kadaluwarsa">Kadaluwarsa</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        {canManage ? (
          <div className={selected.length ? 'bulkbar show' : 'bulkbar'}>
            <span className="bb-count">{selected.length} dipilih</span>
            <div className="toolbar">
              <button
                type="button"
                className="btn ghost sm"
                disabled={busy}
                onClick={() => void applyArchive(selected, !archived)}
              >
                {archived ? <IconUnarchive /> : <IconArchive />}
                {archived ? 'Pulihkan terpilih' : 'Arsipkan terpilih'}
              </button>
              <button
                type="button"
                className="btn danger sm"
                disabled={busy}
                onClick={() => void removeSelected(selected)}
              >
                Hapus terpilih
              </button>
            </div>
            <button type="button" className="link" onClick={() => setSelected([])}>
              bersihkan
            </button>
          </div>
        ) : null}

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '1%' }}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Pilih semua voucher"
                    onChange={(e) => setSelected(e.target.checked ? ordered.map((row) => row.id) : [])}
                  />
                </th>
                <th className="sortable" onClick={() => onSort('code')}>
                  Kode
                  {sortIcon('code')}
                </th>
                <th className="sortable" onClick={() => onSort('name')}>
                  Nama
                  {sortIcon('name')}
                </th>
                <th className="sortable" onClick={() => onSort('status')}>
                  Status Aktif
                  {sortIcon('status')}
                </th>
                <th className="sortable num" onClick={() => onSort('value')}>
                  Nilai
                  {sortIcon('value')}
                </th>
                <th className="sortable" onClick={() => onSort('period')}>
                  Masa Berlaku
                  {sortIcon('period')}
                </th>
                <th className="sortable num" onClick={() => onSort('quota')}>
                  Kuota
                  {sortIcon('quota')}
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
              ) : ordered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    {archived ? 'Tidak ada voucher di arsip.' : 'Belum ada voucher. Klik "Tambah Voucher".'}
                  </td>
                </tr>
              ) : (
                ordered.map((row) => {
                  const state = statusOf(row);
                  const used = row.orders_count ?? 0;

                  return (
                    <tr
                      key={row.id}
                      className={row.is_archived ? 'rowc dt-arc' : 'rowc'}
                      onClick={() => setModal({ open: true, voucher: row })}
                    >
                      <td className="dt-check" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.includes(row.id)}
                          aria-label={`Pilih voucher ${row.code}`}
                          onChange={(e) =>
                            setSelected((prev) =>
                              e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id),
                            )
                          }
                        />
                      </td>
                      <td data-label="Kode">
                        <span className="vcode">{row.code}</span>
                        {row.is_archived ? <span className="tag"> arsip</span> : null}
                      </td>
                      <td data-label="Nama">
                        <span className="lnk">{row.name || '-'}</span>
                      </td>
                      <td data-label="Status Aktif">
                        <span className="chip" style={STATUS_STYLE[state]}>
                          {STATUS_LABEL[state]}
                        </span>
                      </td>
                      <td data-label="Nilai" className="num">
                        <b>{valueText(row)}</b>
                      </td>
                      <td data-label="Masa Berlaku">
                        {row.start_at || row.end_at ? (
                          <span className="mini">
                            {fmtDate(row.start_at)} {'\u2192'} {fmtDate(row.end_at)}
                          </span>
                        ) : (
                          <span className="mini">Tanpa batas</span>
                        )}
                      </td>
                      <td data-label="Kuota" className="num">
                        {row.usage_limit == null ? (
                          <span className="mini">Tak terbatas</span>
                        ) : (
                          <span className="mono">
                            {used} / {row.usage_limit}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {lastPage > 1 ? (
          <div className="pager">
            <button type="button" className="btn ghost sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Sebelumnya
            </button>
            <span className="mini">
              Hal {page} / {lastPage} {'\u00b7'} {total} voucher
            </span>
            <button
              type="button"
              className="btn ghost sm"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </button>
          </div>
        ) : null}
      </div>

      {modal.open ? (
        <VoucherModal
          voucher={modal.voucher}
          onClose={() => setModal({ open: false, voucher: null })}
          onDone={(message) => {
            setModal({ open: false, voucher: null });
            showSuccess(message);
            void refresh();
          }}
        />
      ) : null}

      {loyaltyOpen ? (
        <LoyaltyStampModal onClose={() => setLoyaltyOpen(false)} onDone={(message) => {
          setLoyaltyOpen(false);
          showSuccess(message);
        }} />
      ) : null}
    </>
  );
}
