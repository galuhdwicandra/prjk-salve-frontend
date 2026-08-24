import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getErrorMessage } from '../../api/client';
import { listBranches } from '../../api/branches';
import { listServiceCategories } from '../../api/serviceCategories';
import { listServices, updateService } from '../../api/services';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useIsManager } from '../../store/useAuth';
import type { Branch } from '../../types/branches';
import type { PaginationMeta, Service, ServiceCategory } from '../../types/services';
import { num } from '../../utils/money';
import { IconArchive, IconKebab, IconPlus, IconSort, IconSortDown, IconSortUp, IconTag, IconUnarchive } from '../users/icons';
import CategoryModal from './CategoryModal';
import ServiceModal from './ServiceModal';

type SortState = { key: string; dir: 1 | -1 };

const PAGE_SIZES = [25, 50, 100];

function priceAt(service: Service, branchId: string): number | null {
  const hit = (service.prices ?? []).find((price) => String(price.branch_id) === branchId);
  return hit ? Number(hit.price) : null;
}

function slaOf(service: Service): number | null {
  const hit = (service.prices ?? []).find((price) => price.sla_days != null);
  return hit ? Number(hit.sla_days) : null;
}

function variantSortValue(service: Service, key: string): number | string {
  if (key === 'name') return service.name.toLowerCase();
  if (key === 'sla') return slaOf(service) ?? -1;
  return priceAt(service, key) ?? -1;
}

export default function ServiceIndex() {
  const canManage = useIsManager();

  const [rows, setRows] = useState<Service[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [parents, setParents] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [archived, setArchived] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 1 });
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; service: Service | null }>({ open: false, service: null });
  const [catModal, setCatModal] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  const { toast, showSuccess, showError, hideToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listServices({
        tree: true,
        q: keyword || undefined,
        category_id: categoryId || undefined,
        page,
        per_page: perPage,
      });
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
      setSelected([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat katalog produk'));
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, page, perPage]);

  const loadParents = useCallback(async () => {
    try {
      const res = await listServices({ root: true, per_page: 200 });
      setParents(res.data ?? []);
    } catch {
      setParents([]);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await listServiceCategories({ per_page: 100 });
      setCategories(res.data ?? []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    setSlot(document.getElementById('pageActions'));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    void loadParents();
  }, [loadParents]);

  useEffect(() => {
    listBranches({ per_page: 100 })
      .then((res) => setBranches(res.data ?? []))
      .catch(() => setBranches([]));
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

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

  const groups = useMemo(() => {
    const visible = rows.filter((parent) => archived || parent.is_active);
    const ordered =
      sort.key === 'name'
        ? [...visible].sort((a, b) => a.name.localeCompare(b.name, 'id') * sort.dir)
        : visible;

    return ordered.map((parent) => {
      const variants = (parent.variants ?? []).filter((variant) => archived || variant.is_active);
      const sorted = [...variants].sort((a, b) => {
        const left = variantSortValue(a, sort.key);
        const right = variantSortValue(b, sort.key);
        if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;
        return String(left).localeCompare(String(right), 'id') * sort.dir;
      });
      return { parent, variants: sorted };
    });
  }, [rows, archived, sort]);

  const allVariants = useMemo(() => groups.flatMap((group) => group.variants), [groups]);
  const selectedRows = useMemo(
    () => allVariants.filter((variant) => selected.includes(variant.id)),
    [allVariants, selected],
  );

  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const allChecked = allVariants.length > 0 && allVariants.every((variant) => selected.includes(variant.id));
  const columnCount = 3 + branches.length;

  const applyActive = useCallback(
    async (targets: Service[], value: boolean) => {
      if (targets.length === 0) return;
      try {
        await Promise.all(
          targets.map((item) =>
            updateService(item.id, {
              category_id: item.category_id,
              parent_id: item.parent_id,
              name: item.name,
              unit: item.unit,
              price_default: Number(item.price_default),
              is_active: value,
            }),
          ),
        );
        showSuccess(value ? 'Varian dipulihkan.' : 'Varian diarsipkan.');
        await refresh();
      } catch (err) {
        showError(getErrorMessage(err, 'Gagal mengubah status varian'));
      }
    },
    [refresh, showError, showSuccess],
  );

  function onSort(key: string) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  }

  function openModal(service: Service | null) {
    setModal({ open: true, service });
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
        <button
          type="button"
          className="btn sm"
          disabled={branches.length === 0}
          onClick={() => openModal(null)}
        >
          <IconPlus />
          <span>Tambah Produk</span>
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
                  setCatModal(true);
                  setKebabOpen(false);
                }}
              >
                <IconTag />
                <span>Kelola Kategori</span>
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
          <span>Produk &amp; Layanan</span>
          <span className="ct-note">
            produk induk {'\u2192'} varian {'\u00b7'} centang varian untuk aksi massal
          </span>
          <input
            className="inp"
            style={{ maxWidth: 380 }}
            placeholder="nama produk / varian"
            aria-label="Cari nama produk atau varian"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="f">
            <label htmlFor="flt-cat">Kategori</label>
            <select
              id="flt-cat"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        {canManage ? (
          <div className={selectedRows.length ? 'bulkbar show' : 'bulkbar'}>
            <span className="bb-count">{selectedRows.length} dipilih</span>
            <div className="toolbar">
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => void applyActive(selectedRows, archived)}
              >
                {archived ? <IconUnarchive /> : <IconArchive />}
                {archived ? 'Pulihkan terpilih' : 'Arsipkan terpilih'}
              </button>
            </div>
            <button type="button" className="link" onClick={() => setSelected([])}>
              bersihkan
            </button>
          </div>
        ) : null}

        <div className="tbl-wrap catalog-tbl selectable-table">
          <table>
            <thead>
              <tr>
                <th className="dt-check">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Pilih semua varian"
                    onChange={(e) =>
                      setSelected(e.target.checked ? allVariants.map((variant) => variant.id) : [])
                    }
                  />
                </th>
                <th className="sortable" onClick={() => onSort('name')}>
                  Produk
                  {sortIcon('name')}
                </th>
                <th className="sortable num" onClick={() => onSort('sla')}>
                  SLA
                  {sortIcon('sla')}
                </th>
                {branches.map((branch) => (
                  <th key={branch.id} className="sortable num" onClick={() => onSort(branch.id)}>
                    {branch.name}
                    {sortIcon(branch.id)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columnCount} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={columnCount} className="empty">
                    {archived ? 'Tidak ada produk di arsip.' : 'Belum ada produk. Klik Tambah Produk.'}
                  </td>
                </tr>
              ) : (
                groups.map(({ parent, variants }) => (
                  <Fragment key={parent.id}>
                    <tr className={parent.is_active ? 'fam-row' : 'fam-row dt-arc'}>
                      <td className="dt-check" />
                      <td colSpan={columnCount - 1}>
                        <div className="fam-row-in">
                          <button type="button" className="link fam-name" onClick={() => openModal(parent)}>
                            {parent.name}
                          </button>
                          <span className="tag">{parent.category?.name ?? '-'}</span>
                          {parent.is_active ? null : <span className="tag">arsip</span>}
                        </div>
                      </td>
                    </tr>

                    {variants.length === 0 ? (
                      <tr>
                        <td className="dt-check" />
                        <td className="fam-empty" colSpan={columnCount - 1}>
                          Belum ada varian di produk ini.
                        </td>
                      </tr>
                    ) : (
                      variants.map((variant) => (
                        <tr
                          key={variant.id}
                          className={variant.is_active ? 'rowc' : 'rowc dt-arc'}
                          onClick={() => openModal(variant)}
                        >
                          <td className="dt-check" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selected.includes(variant.id)}
                              aria-label={`Pilih ${variant.name}`}
                              onChange={(e) => toggleRow(variant.id, e.target.checked)}
                            />
                          </td>
                          <td className="var-cell" data-label="Produk">
                            <span className="lnk">{variant.name}</span>
                            {variant.is_active ? null : <span className="tag"> arsip</span>}
                          </td>
                          <td className="num" data-label="SLA">
                            {slaOf(variant) ?? '\u2014'}
                          </td>
                          {branches.map((branch) => {
                            const price = priceAt(variant, branch.id);
                            return (
                              <td key={branch.id} className="num" data-label={branch.name}>
                                {price == null ? '\u2014' : num(price)}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </Fragment>
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
                aria-label="Jumlah produk induk per halaman"
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
        <ServiceModal
          service={modal.service}
          parents={parents}
          categories={categories}
          branches={branches}
          onClose={() => setModal({ open: false, service: null })}
          onDone={(message) => {
            setModal({ open: false, service: null });
            showSuccess(message);
            void refresh();
            void loadParents();
          }}
        />
      ) : null}
      
      {catModal ? (
        <CategoryModal
          onClose={() => {
            setCatModal(false);
            void loadCategories();
            void refresh();
          }}
        />
      ) : null}
    </>
  );
}
