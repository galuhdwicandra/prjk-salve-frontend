import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getErrorMessage } from '../../api/client';
import { listCustomerLabels } from '../../api/customerLabels';
import Toast from '../../components/Toast';
import { customerLabelChipClass } from '../../hooks/useCustomerLabels';
import { useToast } from '../../hooks/useToast';
import type { CustomerLabel } from '../../types/customers';
import { IconArchive, IconKebab, IconPlus, IconSortDown, IconSortUp } from '../users/icons';
import CustomerLabelModal from './CustomerLabelModal';

const PAGE_SIZES = [25, 50, 100];

export default function CustomerLabelsPage() {
  const [rows, setRows] = useState<CustomerLabel[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [archived, setArchived] = useState(false);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; label: CustomerLabel | null }>({
    open: false,
    label: null,
  });
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  const { toast, showSuccess, hideToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCustomerLabels(archived ? {} : { is_active: true });
      setRows(res.data ?? []);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat label customer'));
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
    const base = keyword ? rows.filter((row) => row.name.toLowerCase().includes(keyword)) : rows;

    return [...base].sort((a, b) => a.name.localeCompare(b.name, 'id') * sortDir);
  }, [rows, q, sortDir]);

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

  const pageActions = (
    <>
      <button type="button" className="btn sm" onClick={() => setModal({ open: true, label: null })}>
        <IconPlus />
        <span>Tambah Label</span>
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

      <div className="card">
        <div className="card-title">
          <span>Master Label Customer</span>
          <span className="ct-note">
            tag yang bisa dipasang ke pelanggan (mis. VIP, Langganan, Blacklist)
          </span>
          <input
            className="inp"
            style={{ maxWidth: 380 }}
            placeholder="nama label"
            aria-label="Cari nama label customer"
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

        <div className="tbl-wrap selectable-table">
          <table>
            <thead>
              <tr>
                <th className="dt-check">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Pilih semua label"
                    onChange={(e) => setSelected(e.target.checked ? paged.map((row) => row.id) : [])}
                  />
                </th>
                <th className="sortable" onClick={() => setSortDir((prev) => (prev === 1 ? -1 : 1))}>
                  Label
                  <span className="sort-ic on">{sortDir > 0 ? <IconSortUp /> : <IconSortDown />}</span>
                </th>
                <th className="num">Dipakai</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty">
                    {archived ? 'Tidak ada label di arsip.' : 'Belum ada label. Klik Tambah Label.'}
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr
                    key={row.id}
                    className={row.is_active ? 'rowc' : 'rowc dt-arc'}
                    onClick={() => setModal({ open: true, label: row })}
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
                    <td data-label="Label">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${customerLabelChipClass(row.color)}`}
                      >
                        {row.name}
                      </span>
                      {row.is_active ? null : <span className="tag"> arsip</span>}
                    </td>
                    <td className="num" data-label="Dipakai">
                      {row.usage_count ? (
                        `${row.usage_count} pelanggan`
                      ) : (
                        <span className="mini">{'\u2014'}</span>
                      )}
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
                aria-label="Jumlah label per halaman"
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

      {modal.open ? (
        <CustomerLabelModal
          label={modal.label}
          onClose={() => setModal({ open: false, label: null })}
          onDone={(message) => {
            setModal({ open: false, label: null });
            showSuccess(message);
            void refresh();
          }}
        />
      ) : null}
    </>
  );
}
