import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getErrorMessage } from '../../api/client';
import { listContactCategories } from '../../api/contactCategories';
import { createContact, deleteContact, listContacts, updateContact } from '../../api/contacts';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import type { Contact, ContactCategory, ContactQuery, PaginationMeta } from '../../types/contacts';
import { downloadXlsx } from '../../utils/export-table';
import { buildWhatsAppLink } from '../../utils/wa';
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
  IconWa,
} from '../users/icons';
import ContactCategoryModal from './ContactCategoryModal';
import ContactModal from './ContactModal';

type SortKey = NonNullable<ContactQuery['sort_by']>;
type SortState = { key: SortKey; dir: 'asc' | 'desc' };

const PAGE_SIZES = [25, 50, 100];

export default function ContactsIndex() {
  const { toast, showSuccess, hideToast } = useToast();

  const [rows, setRows] = useState<Contact[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<ContactCategory[]>([]);

  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 'asc' });
  const [selected, setSelected] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [form, setForm] = useState<{ open: boolean; contact: Contact | null }>({ open: false, contact: null });
  const [categoryModal, setCategoryModal] = useState(false);

  const params = useMemo<ContactQuery>(
    () => ({
      q: keyword || undefined,
      is_active: !archived,
      sort_by: sort.key,
      sort_dir: sort.dir,
      page,
      per_page: perPage,
    }),
    [keyword, archived, sort, page, perPage],
  );

  const loadCategories = useCallback(async () => {
    try {
      const res = await listContactCategories();
      setCategories(res.data ?? []);
    } catch {
      setCategories([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listContacts(params);
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data kontak'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    setSlot(document.getElementById('pageActions'));
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

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

  function toSheet(items: Contact[]): unknown[][] {
    return [
      ['nama', 'telepon', 'vendor_id', 'kategori', 'alamat'],
      ...items.map((item) => [
        item.name,
        item.phone ?? '',
        item.code ?? '',
        (item.categories ?? []).map((row) => row.name).join('; '),
        item.address ?? '',
      ]),
    ];
  }

  async function onExport() {
    setBusy(true);
    setError(null);
    try {
      const items = selected.length
        ? rows.filter((row) => selected.includes(row.id))
        : (await listContacts({ ...params, page: 1, per_page: 500 })).data ?? [];

      if (items.length === 0) {
        showSuccess('Tidak ada data untuk diekspor.');
        return;
      }

      downloadXlsx(`database-kontak-${new Date().toISOString().slice(0, 10)}.xlsx`, 'Kontak', toSheet(items));
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengekspor data'));
    } finally {
      setBusy(false);
    }
  }

  async function onImport(file: File) {
    setBusy(true);
    setError(null);
    try {
      const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim() !== '');
      const head = (lines.shift() ?? '').split(',').map((cell) => cell.trim().toLowerCase());
      const iName = head.indexOf('nama');
      const iPhone = head.indexOf('telepon');
      const iAddress = head.indexOf('alamat');
      const iCategory = head.indexOf('kategori');

      if (iName < 0) {
        setError('Header CSV wajib memuat kolom "nama".');
        return;
      }

      const byName = new Map(categories.map((row) => [row.name.toLowerCase(), row.id]));
      let ok = 0;
      let skipped = 0;

      for (const line of lines) {
        const cols = line.split(',').map((cell) => cell.trim());
        const name = cols[iName] ?? '';

        if (!name) {
          skipped += 1;
          continue;
        }

        const categoryIds =
          iCategory >= 0 && cols[iCategory]
            ? cols[iCategory]
                .split(';')
                .map((row) => byName.get(row.trim().toLowerCase()))
                .filter((row): row is string => Boolean(row))
            : [];

        try {
          await createContact({
            name,
            phone: iPhone >= 0 ? cols[iPhone] || null : null,
            address: iAddress >= 0 ? cols[iAddress] || null : null,
            category_ids: categoryIds,
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
      await Promise.all(ids.map((id) => updateContact(id, { is_active: next })));
      showSuccess(`${ids.length} kontak ${next ? 'dipulihkan' : 'diarsipkan'}.`);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memperbarui status kontak'));
    } finally {
      setBusy(false);
    }
  }

  async function bulkRemove() {
    if (selected.length === 0) return;
    if (!window.confirm(`Hapus ${selected.length} kontak terpilih?`)) return;

    setBusy(true);
    setError(null);
    try {
      await Promise.all(selected.map((id) => deleteContact(id)));
      showSuccess(`${selected.length} kontak dihapus.`);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus kontak'));
    } finally {
      setBusy(false);
    }
  }

  const pageActions = (
    <>
      <button type="button" className="btn sm" onClick={() => setForm({ open: true, contact: null })}>
        <IconPlus />
        <span>Tambah Kontak</span>
      </button>

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
          <button type="button" className="kebab-item" onClick={() => setCategoryModal(true)}>
            <IconTag />
            <span>Kategori Kontak</span>
          </button>

          <div className="kebab-sep" />

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
          <span>Database Kontak</span>
          <span className="ct-note">{loading ? 'Memuat\u2026' : `${total} kontak`}</span>
          <input
            className="inp"
            style={{ maxWidth: 380 }}
            placeholder="nama / telepon / vendor ID"
            aria-label="Cari nama, telepon, atau vendor ID"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
            <button type="button" className="btn danger sm" disabled={busy} onClick={() => void bulkRemove()}>
              Hapus terpilih
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

        <div className="tbl-wrap selectable-table">
          <table>
            <thead>
              <tr>
                <th className="dt-check">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Pilih semua kontak"
                    onChange={(e) => setSelected(e.target.checked ? rows.map((row) => row.id) : [])}
                  />
                </th>
                <th className="sortable" onClick={() => onSort('name')}>
                  Nama
                  {sortIcon('name')}
                </th>
                <th className="sortable" onClick={() => onSort('phone')}>
                  Nomor Telepon
                  {sortIcon('phone')}
                </th>
                <th>WA</th>
                <th className="sortable" onClick={() => onSort('code')}>
                  Vendor ID
                  {sortIcon('code')}
                </th>
                <th>Category</th>
                <th className="sortable" onClick={() => onSort('address')}>
                  Alamat
                  {sortIcon('address')}
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
                    {archived ? 'Tidak ada kontak di arsip.' : 'Belum ada kontak.'}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.is_active ? 'rowc' : 'rowc dt-arc'}
                    onClick={() => setForm({ open: true, contact: row })}
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
                      {row.is_active ? null : (
                        <span className="tag" style={{ marginLeft: 8 }}>
                          arsip
                        </span>
                      )}
                    </td>
                    <td data-label="Nomor Telepon">{row.phone || '\u2014'}</td>
                    <td data-label="WA" onClick={(e) => e.stopPropagation()}>
                      {row.phone ? (
                        <a
                          className="wa-btn"
                          href={buildWhatsAppLink(row.phone, `Halo ${row.name}`)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <IconWa />
                          WA
                        </a>
                      ) : (
                        '\u2014'
                      )}
                    </td>
                    <td data-label="Vendor ID">{row.code || '\u2014'}</td>
                    <td data-label="Category">
                      {(row.categories ?? []).length > 0
                        ? row.categories?.map((cat) => (
                            <span key={cat.id} className="tag" style={{ marginRight: 4 }}>
                              {cat.name}
                            </span>
                          ))
                        : '\u2014'}
                    </td>
                    <td data-label="Alamat">{row.address || '\u2014'}</td>
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
                aria-label="Jumlah kontak per halaman"
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

      {form.open ? (
        <ContactModal
          contact={form.contact}
          onClose={() => setForm({ open: false, contact: null })}
          onSaved={(_, message) => {
            setForm({ open: false, contact: null });
            showSuccess(message);
            void loadCategories();
            void refresh();
          }}
          onRemoved={(message) => {
            setForm({ open: false, contact: null });
            showSuccess(message);
            void refresh();
          }}
        />
      ) : null}

      {categoryModal ? (
        <ContactCategoryModal
          onClose={() => setCategoryModal(false)}
          onChanged={() => {
            void loadCategories();
            void refresh();
          }}
        />
      ) : null}
    </>
  );
}
