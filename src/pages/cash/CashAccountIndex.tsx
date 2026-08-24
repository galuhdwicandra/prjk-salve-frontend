import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  bulkDeleteAccountingAccounts,
  createAccountingAccount,
  listAccountingAccounts,
  updateAccountingAccount,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useShowBalance } from '../../store/useAuth';
import type { AccountingAccount } from '../../types/accounting';
import { downloadXlsx } from '../../utils/export-table';
import { toIDR } from '../../utils/money';
import {
  IconArchive,
  IconDownload,
  IconEdit,
  IconKebab,
  IconPlus,
  IconSortDown,
  IconSortUp,
  IconUnarchive,
  IconUpload,
} from '../users/icons';
import CashAccountModal from './CashAccountModal';
import CashAccountTxnDialog from './CashAccountTxnDialog';

const PAGE_SIZES = [25, 50, 100];

type SortKey = 'name' | 'balance' | 'description';

function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function CashAccountIndex() {
  const showBalance = useShowBalance();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [rows, setRows] = useState<AccountingAccount[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [archived, setArchived] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [form, setForm] = useState<{ open: boolean; account: AccountingAccount | null }>({
    open: false,
    account: null,
  });
  const [opened, setOpened] = useState<AccountingAccount | null>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAccountingAccounts({
        is_cash_account: true,
        is_active: !archived,
        per_page: 200,
      });

      setRows(Array.isArray(res.data) ? res.data : []);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat akun kas & bank'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [archived]);

  useEffect(() => {
    setSlot(document.getElementById('pageActions'));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setPage(1);
  }, [q, perPage, archived]);

  useEffect(() => {
    if (!kebabOpen) return;
    const close = () => setKebabOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [kebabOpen]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const base = keyword
      ? rows.filter(
          (row) =>
            row.name.toLowerCase().includes(keyword) ||
            (row.description ?? '').toLowerCase().includes(keyword),
        )
      : rows;

    return [...base].sort((a, b) => {
      if (sortKey === 'balance') return (toNumber(a.balance) - toNumber(b.balance)) * sortDir;
      if (sortKey === 'description') {
        return (a.description ?? '').localeCompare(b.description ?? '', 'id') * sortDir;
      }
      return a.name.localeCompare(b.name, 'id') * sortDir;
    });
  }, [rows, q, sortKey, sortDir]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(page, lastPage);
  const from = total === 0 ? 0 : (current - 1) * perPage + 1;
  const to = Math.min(current * perPage, total);

  const paged = useMemo(
    () => filtered.slice((current - 1) * perPage, current * perPage),
    [filtered, current, perPage],
  );

  const allChecked = paged.length > 0 && paged.every((row) => selected.includes(row.id));
  const columnCount = showBalance ? 5 : 4;

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === 1 ? -1 : 1));
      return;
    }
    setSortKey(key);
    setSortDir(1);
  }

  function sortIcon(key: SortKey) {
    return (
      <span className={sortKey === key ? 'sort-ic on' : 'sort-ic'}>
        {sortKey === key && sortDir < 0 ? <IconSortDown /> : <IconSortUp />}
      </span>
    );
  }

  async function applyActive(ids: string[], value: boolean) {
    setBusy(true);
    try {
      for (const id of ids) {
        await updateAccountingAccount(id, { is_active: value });
      }
      showSuccess(value ? 'Akun dipulihkan.' : 'Akun diarsipkan.');
      await refresh();
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal mengubah status akun'));
    } finally {
      setBusy(false);
    }
  }

  async function bulkRemove() {
    if (selected.length === 0) return;
    if (!window.confirm(`Hapus ${selected.length} akun terpilih?`)) return;

    setBusy(true);
    try {
      const res = await bulkDeleteAccountingAccounts(selected);
      showSuccess(`Dihapus ${res.meta.deleted} akun, dilewati ${res.meta.skipped} akun terpakai.`);
      await refresh();
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal menghapus akun terpilih'));
    } finally {
      setBusy(false);
    }
  }

  function exportAccounts() {
    const aoa: unknown[][] = [['nama', 'keterangan', 'saldo']];

    filtered.forEach((row) => aoa.push([row.name, row.description ?? '', toNumber(row.balance)]));

    downloadXlsx(`kas-bank-${new Date().toISOString().slice(0, 10)}.xlsx`, 'Kas & Bank', aoa);
  }

  async function importCsv(file: File) {
    setBusy(true);
    try {
      const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim() !== '');
      const head = (lines.shift() ?? '').split(',').map((cell) => cell.trim().toLowerCase());
      const iName = head.indexOf('nama');
      const iNote = head.indexOf('keterangan');

      if (iName < 0) {
        showError('Header CSV wajib memuat kolom "nama".');
        return;
      }

      const existing = await listAccountingAccounts({ is_cash_account: true, per_page: 500 });
      const byName = new Map(
        (Array.isArray(existing.data) ? existing.data : []).map((row) => [row.name.trim().toLowerCase(), row]),
      );

      let added = 0;
      let updated = 0;
      let skipped = 0;

      for (const line of lines) {
        const cols = line.split(',').map((cell) => cell.trim());
        const name = cols[iName] ?? '';
        const description = iNote >= 0 ? cols[iNote] ?? '' : '';

        if (!name) {
          skipped += 1;
          continue;
        }

        const match = byName.get(name.toLowerCase());

        try {
          if (match) {
            await updateAccountingAccount(match.id, { description: description || null });
            updated += 1;
          } else {
            await createAccountingAccount({
              name,
              description: description || null,
              is_cash_account: true,
              is_active: true,
            });
            added += 1;
          }
        } catch {
          skipped += 1;
        }
      }

      showSuccess(`Import selesai: ${added} baru, ${updated} diperbarui, ${skipped} dilewati.`);
      await refresh();
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal membaca berkas CSV'));
    } finally {
      setBusy(false);
    }
  }

  const pageActions = (
    <>
      <button
        type="button"
        className="btn sm"
        onClick={() => setForm({ open: true, account: null })}
      >
        <IconPlus />
        <span>Tambah Akun</span>
      </button>

      {archived ? (
        <button type="button" className="btn sm arc-pill" onClick={() => setArchived(false)}>
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
          <button
            type="button"
            className="kebab-item"
            disabled={busy}
            onClick={() => {
              setKebabOpen(false);
              fileRef.current?.click();
            }}
          >
            <IconUpload />
            <span>Import</span>
          </button>
          <button
            type="button"
            className="kebab-item"
            onClick={() => {
              setKebabOpen(false);
              exportAccounts();
            }}
          >
            <IconDownload />
            <span>Export</span>
          </button>
          <button
            type="button"
            className="kebab-item"
            onClick={() => {
              setArchived((prev) => !prev);
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

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      {slot ? createPortal(pageActions, slot) : null}

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) void importCsv(file);
        }}
      />

      <div className="card">
        <div className="card-title">
          <span>Kas &amp; Bank</span>
          <span className="ct-note">daftar akun kas &amp; bank dan saldonya</span>
        </div>

        <div className="field">
          <label htmlFor="kas-q">Cari</label>
          <input
            id="kas-q"
            type="search"
            placeholder="nama akun"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {error ? (
          <div
            role="alert"
            style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}
          >
            {error}
          </div>
        ) : null}

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
            <button type="button" className="btn danger sm" disabled={busy} onClick={() => void bulkRemove()}>
              Hapus terpilih
            </button>
          </div>
          <button type="button" className="link" onClick={() => setSelected([])}>
            bersihkan
          </button>
        </div>

        <div className="tbl-wrap selectable-table">
          <table>
            <thead>
              <tr>
                <th className="dt-check">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Pilih semua akun"
                    onChange={(e) => setSelected(e.target.checked ? paged.map((row) => row.id) : [])}
                  />
                </th>
                <th className="sortable" onClick={() => toggleSort('name')}>
                  Nama Akun
                  {sortIcon('name')}
                </th>
                {showBalance ? (
                  <th className="sortable num" onClick={() => toggleSort('balance')}>
                    Saldo
                    {sortIcon('balance')}
                  </th>
                ) : null}
                <th className="sortable" onClick={() => toggleSort('description')}>
                  Keterangan
                  {sortIcon('description')}
                </th>
                <th style={{ width: '1%', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columnCount + 1} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={columnCount + 1} className="empty">
                    {archived ? 'Tidak ada akun di arsip.' : 'Belum ada akun. Klik Tambah Akun atau Import.'}
                  </td>
                </tr>
              ) : (
                paged.map((row) => {
                  const balance = toNumber(row.balance);

                  return (
                    <tr
                      key={row.id}
                      className={row.is_active ? 'rowc' : 'rowc dt-arc'}
                      onClick={() => setOpened(row)}
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
                      <td data-label="Nama Akun">
                        <span className="lnk">{row.name}</span>
                        {row.is_active ? null : <span className="tag"> arsip</span>}
                      </td>
                      {showBalance ? (
                        <td
                          className="num"
                          data-label="Saldo"
                          style={balance < 0 ? { color: 'var(--danger)' } : undefined}
                        >
                          {toIDR(balance)}
                        </td>
                      ) : null}
                      <td data-label="Keterangan">{row.description ?? '\u2014'}</td>
                      <td className="dt-act" onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="iconbtn"
                            title="Edit akun"
                            onClick={() => setForm({ open: true, account: row })}
                          >
                            <IconEdit />
                          </button>
                          <button
                            type="button"
                            className="iconbtn"
                            title={row.is_active ? 'Arsipkan akun' : 'Pulihkan akun'}
                            disabled={busy}
                            onClick={() => void applyActive([row.id], !row.is_active)}
                          >
                            {row.is_active ? <IconArchive /> : <IconUnarchive />}
                          </button>
                        </div>
                      </td>
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
                aria-label="Jumlah akun per halaman"
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
                disabled={current <= 1}
                onClick={() => setPage(current - 1)}
              >
                {'\u2039'}
              </button>
              <span className="mini">
                {current}/{lastPage}
              </span>
              <button
                type="button"
                className="pg-btn"
                aria-label="Halaman berikutnya"
                disabled={current >= lastPage}
                onClick={() => setPage(current + 1)}
              >
                {'\u203a'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {form.open ? (
        <CashAccountModal
          account={form.account}
          onClose={() => setForm({ open: false, account: null })}
          onDone={(message) => {
            setForm({ open: false, account: null });
            showSuccess(message);
            void refresh();
          }}
        />
      ) : null}

      {opened ? (
        <CashAccountTxnDialog
          account={opened}
          onClose={() => setOpened(null)}
          onEdit={(account) => {
            setOpened(null);
            setForm({ open: true, account });
          }}
          onDone={(message) => {
            setOpened(null);
            showSuccess(message);
            void refresh();
          }}
        />
      ) : null}
    </>
  );
}
