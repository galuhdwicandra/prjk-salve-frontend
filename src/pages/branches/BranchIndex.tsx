import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getErrorMessage } from '../../api/client';
import { listBranches } from '../../api/branches';
import { listBranchTypes } from '../../api/branchTypes';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useIsManager } from '../../store/useAuth';
import type { Branch, OutletType, PaginationMeta } from '../../types/branches';
import { IconArchive, IconKebab, IconPlus, IconSort, IconSortDown, IconSortUp, IconTag } from '../users/icons';
import BranchModal from './BranchModal';
import BranchTypeModal from './BranchTypeModal';

type SortKey = 'code' | 'name' | 'type' | 'hours' | 'address' | 'orders';
type SortState = { key: SortKey; dir: 1 | -1 };

const PAGE_SIZES = [25, 50, 100];

export default function BranchIndex() {
  const canManage = useIsManager();

  const [rows, setRows] = useState<Branch[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [types, setTypes] = useState<OutletType[]>([]);

  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: 'code', dir: 1 });
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; branch: Branch | null }>({ open: false, branch: null });
  const [typeModal, setTypeModal] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  const { toast, showSuccess, hideToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listBranches({
        q: keyword || undefined,
        is_active: archived ? undefined : 1,
        page,
        per_page: perPage,
      });
      setRows(res.data ?? []);
      setMeta((res.meta as PaginationMeta) ?? null);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data outlet'));
    } finally {
      setLoading(false);
    }
  }, [keyword, archived, page, perPage]);

  const loadTypes = useCallback(async () => {
    try {
      const res = await listBranchTypes({ per_page: 100 });
      setTypes(res.data ?? []);
    } catch {
      setTypes([]);
    }
  }, []);

  useEffect(() => {
    setSlot(document.getElementById('pageActions'));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    void loadTypes();
  }, [loadTypes]);

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

  const typeLabels = useMemo(
    () => new Map(types.map((type) => [type.code, type.name])),
    [types],
  );

  const sorted = useMemo(() => {
    const value = (branch: Branch): string | number => {
      if (sort.key === 'orders') return branch.orders_count ?? 0;
      if (sort.key === 'type') return typeLabels.get(branch.type) ?? branch.type;
      if (sort.key === 'hours') return branch.hours ?? '';
      if (sort.key === 'address') return branch.address ?? '';
      return branch[sort.key].toLowerCase();
    };

    return [...rows].sort((a, b) => {
      const left = value(a);
      const right = value(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;
      return String(left).localeCompare(String(right), 'id') * sort.dir;
    });
  }, [rows, sort, typeLabels]);

  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const allChecked = sorted.length > 0 && sorted.every((branch) => selected.includes(branch.id));

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

  const pageActions = (
    <>
      {canManage ? (
        <button
          type="button"
          className="btn sm"
          disabled={types.length === 0}
          onClick={() => setModal({ open: true, branch: null })}
        >
          <IconPlus />
          <span>Tambah Outlet</span>
        </button>
      ) : null}

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
              setPage(1);
              setKebabOpen(false);
            }}
          >
            <IconArchive />
            <span>Tampilkan arsip</span>
            <span className="chk">{archived ? '\u2713' : ''}</span>
          </button>

          {canManage ? (
            <>
              <div className="kebab-sep" />
              <button
                type="button"
                className="kebab-item"
                onClick={() => {
                  setTypeModal(true);
                  setKebabOpen(false);
                }}
              >
                <IconTag />
                <span>Kelola Jenis Outlet</span>
              </button>
            </>
          ) : null}
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
          <span>Daftar Outlet</span>
          <span className="ct-note">arsipkan gerai yang sudah tidak beroperasi</span>
          <input
            className="inp"
            style={{ maxWidth: 380 }}
            placeholder="nama / kode outlet"
            aria-label="Cari nama atau kode outlet"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
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
                    aria-label="Pilih semua outlet"
                    onChange={(e) => setSelected(e.target.checked ? sorted.map((branch) => branch.id) : [])}
                  />
                </th>
                <th className="sortable" onClick={() => onSort('code')}>
                  Kode
                  {sortIcon('code')}
                </th>
                <th className="sortable" onClick={() => onSort('name')}>
                  Nama Outlet
                  {sortIcon('name')}
                </th>
                <th className="sortable" onClick={() => onSort('type')}>
                  Jenis
                  {sortIcon('type')}
                </th>
                <th className="sortable" onClick={() => onSort('hours')}>
                  Jam Operasional
                  {sortIcon('hours')}
                </th>
                <th className="sortable" onClick={() => onSort('address')}>
                  Alamat
                  {sortIcon('address')}
                </th>
                <th className="sortable num" onClick={() => onSort('orders')}>
                  Order
                  {sortIcon('orders')}
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
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    {archived ? 'Tidak ada outlet di arsip.' : 'Belum ada outlet. Klik Tambah Outlet.'}
                  </td>
                </tr>
              ) : (
                sorted.map((branch) => (
                  <tr
                    key={branch.id}
                    className={branch.is_active ? 'rowc' : 'rowc dt-arc'}
                    onClick={() => setModal({ open: true, branch })}
                  >
                    <td className="dt-check" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(branch.id)}
                        aria-label={`Pilih ${branch.name}`}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked ? [...prev, branch.id] : prev.filter((id) => id !== branch.id),
                          )
                        }
                      />
                    </td>
                    <td data-label="Kode">
                      <b>{branch.code}</b>
                    </td>
                    <td data-label="Nama Outlet">
                      <span className="lnk">{branch.name}</span>
                      {branch.is_active ? null : <span className="tag"> arsip</span>}
                    </td>
                    <td data-label="Jenis">
                      <span className="tag">{typeLabels.get(branch.type) ?? branch.type}</span>
                    </td>
                    <td data-label="Jam Operasional">{branch.hours || '\u2014'}</td>
                    <td data-label="Alamat">{branch.address || '\u2014'}</td>
                    <td className="num" data-label="Order">
                      {branch.orders_count ?? 0}
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
                aria-label="Jumlah outlet per halaman"
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

      {modal.open ? (
        <BranchModal
          branch={modal.branch}
          types={types}
          onClose={() => setModal({ open: false, branch: null })}
          onDone={(message) => {
            setModal({ open: false, branch: null });
            showSuccess(message);
            void refresh();
          }}
        />
      ) : null}

      {typeModal ? (
        <BranchTypeModal
          onClose={() => {
            setTypeModal(false);
            void loadTypes();
            void refresh();
          }}
        />
      ) : null}
    </>
  );
}
