import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../store/useAuth';
import { getErrorMessage } from '../../api/client';
import { uploadOrderPhotos } from '../../api/orderPhotos';
import {
  finishProductionTask,
  getProductionBoard,
  moveProductionTask,
  startProductionTask,
} from '../../api/production';
import { fmtDate, todayLocalYMD } from '../../utils/date';
import { IconCamera, IconImage, IconSort, IconSortDown, IconSortUp } from '../users/icons';
import WorkshopDetailDialog from './WorkshopDetailDialog';
import type { ProductionTask, WorkshopPhase } from '../../types/production';

const TABS: { key: WorkshopPhase; label: string }[] = [
  { key: 'persiapan', label: 'Persiapan' },
  { key: 'finishing', label: 'Finishing' },
];

const PAGE_SIZES = [25, 50, 100];

type SortKey = 'no' | 'customer' | 'workshop' | 'qty' | 'deadline';
type SortState = { key: SortKey; dir: 1 | -1 };

function orderLabel(task: ProductionTask): string {
  return task.order?.invoice_no ?? task.order?.number ?? '-';
}

function workshopCode(task: ProductionTask): string {
  return task.branch?.code ?? '-';
}

function isLate(task: ProductionTask): boolean {
  const target = task.order?.ready_at;
  return Boolean(target && target < todayLocalYMD());
}

export default function WorkshopBoard() {
  const [tab, setTab] = useState<WorkshopPhase>('persiapan');
  const [rows, setRows] = useState<ProductionTask[]>([]);
  const [meta, setMeta] = useState({ total: 0, last_page: 1 });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [detail, setDetail] = useState<ProductionTask | null>(null);
  const [starting, setStarting] = useState<ProductionTask | null>(null);
  const [canceling, setCanceling] = useState<ProductionTask | null>(null);

  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const [branchId, setBranchId] = useState(String(useAuth.user?.branch_id ?? ''));
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
      const res = await getProductionBoard({
        phase: tab,
        q: term || undefined,
        branch_id: branchId || undefined,
        per_page: perPage,
        page,
      });

      setRows(res.data?.items ?? []);
      setMeta({ total: res.meta?.total ?? 0, last_page: res.meta?.last_page ?? 1 });
    } catch (e) {
      setErr(getErrorMessage(e, 'Gagal memuat antrean workshop.'));
      setRows([]);
      setMeta({ total: 0, last_page: 1 });
    } finally {
      setLoading(false);
    }
  }, [tab, term, branchId, perPage, page]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
    setSort({ key: 'no', dir: 1 });
  }, [tab]);

  useEffect(() => {
    setPage(1);
  }, [term, branchId, perPage]);

  const sorted = useMemo(() => {
    const value = (row: ProductionTask): string | number => {
      if (sort.key === 'customer') return (row.order?.customer?.name ?? '').toLowerCase();
      if (sort.key === 'workshop') return workshopCode(row).toLowerCase();
      if (sort.key === 'qty') return row.qty;
      if (sort.key === 'deadline') return row.order?.ready_at ?? '';
      return orderLabel(row).toLowerCase();
    };

    return [...rows].sort((a, b) => {
      const left = value(a);
      const right = value(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * sort.dir;
      return String(left).localeCompare(String(right), 'id') * sort.dir;
    });
  }, [rows, sort]);

  const total = meta.total;
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

  const runAction = async (task: ProductionTask, action: () => Promise<unknown>, ok: string) => {
    setBusy(task.id);
    try {
      await action();
      await load();
      showSuccess(ok);
    } catch (e) {
      showError(getErrorMessage(e, 'Aksi workshop gagal diproses.'));
    } finally {
      setBusy(null);
    }
  };

  const startPreparation = async (task: ProductionTask, files: File[]) => {
    setBusy(task.id);
    try {
      if (files.length > 0) await uploadOrderPhotos(task.order_id, [], files);
      await startProductionTask(task.order_id);
      setStarting(null);
      await load();
      showSuccess(`Persiapan dimulai \u00b7 ${orderLabel(task)}`);
    } catch (e) {
      showError(getErrorMessage(e, 'Gagal memulai persiapan.'));
    } finally {
      setBusy(null);
    }
  };

  const cancelProcess = async (task: ProductionTask) => {
    setCanceling(null);
    await runAction(
      task,
      () => moveProductionTask(task.order_id, { to_status: 'QUEUE' }),
      `Proses ${orderLabel(task)} dibatalkan.`,
    );
  };

  function rowActions(task: ProductionTask) {
    const disabled = busy === task.id;

    if (tab === 'finishing') {
      return task.current_status === 'IRONING' ? (
        <button
          type="button"
          className="btn sm ok"
          disabled={disabled}
          onClick={() =>
            void runAction(
              task,
              () => finishProductionTask(task.order_id),
              `Finishing selesai \u2014 ${orderLabel(task)} masuk Sorting List (Ready).`,
            )
          }
        >
          Selesai
        </button>
      ) : (
        <button
          type="button"
          className="btn sm"
          disabled={disabled}
          onClick={() =>
            void runAction(
              task,
              () => moveProductionTask(task.order_id, { to_status: 'IRONING' }),
              `Finishing dimulai \u00b7 ${orderLabel(task)}`,
            )
          }
        >
          Mulai Finishing
        </button>
      );
    }

    return (
      <>
        {task.current_status === 'WASHING' ? (
          <button
            type="button"
            className="btn sm ok"
            disabled={disabled}
            onClick={() =>
              void runAction(
                task,
                () => moveProductionTask(task.order_id, { to_status: 'DRYING' }),
                `Persiapan selesai \u2192 tab Finishing.`,
              )
            }
          >
            Selesai
          </button>
        ) : (
          <button
            type="button"
            className="btn sm"
            disabled={disabled}
            onClick={() => setStarting(task)}
          >
            Proses
          </button>
        )}
        <button
          type="button"
          className="btn sm danger"
          disabled={disabled}
          onClick={() => setCanceling(task)}
        >
          Batalkan
        </button>
      </>
    );
  }

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
          <label htmlFor="ws-q">Cari</label>
          <input
            id="ws-q"
            type="search"
            placeholder="no order / nama"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="ws-branch">Workshop</label>
          <select id="ws-branch" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            <option value="">Semua workshop</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {err ? (
        <div
          role="alert"
          style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}
        >
          {err}
        </div>
      ) : null}

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => onSort('no')}>
                No / Tanggal
                {sortIcon('no')}
              </th>
              <th className="sortable" onClick={() => onSort('customer')}>
                Pelanggan
                {sortIcon('customer')}
              </th>
              <th className="sortable" onClick={() => onSort('workshop')}>
                Workshop
                {sortIcon('workshop')}
              </th>
              <th className="sortable num" onClick={() => onSort('qty')}>
                Pasang
                {sortIcon('qty')}
              </th>
              <th className="sortable" onClick={() => onSort('deadline')}>
                Deadline
                {sortIcon('deadline')}
              </th>
              <th className="dt-act" style={{ width: '1%' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="empty">
                  Memuat{'\u2026'}
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  {tab === 'finishing'
                    ? 'Belum ada order di finishing.'
                    : 'Belum ada order untuk dikerjakan.'}
                </td>
              </tr>
            ) : (
              sorted.map((task) => {
                const origin = task.order?.branch?.code ?? null;
                const dest = workshopCode(task);
                const late = isLate(task);

                return (
                  <tr key={task.id}>
                    <td data-label="No / Tanggal">
                      <button type="button" className="link" onClick={() => setDetail(task)}>
                        {orderLabel(task)}
                      </button>
                      <div className="mini">{fmtDate(task.order?.received_at)}</div>
                    </td>
                    <td data-label="Pelanggan">{task.order?.customer?.name ?? '-'}</td>
                    <td data-label="Workshop">
                      {origin && origin !== dest ? (
                        <>
                          {origin} <span className="mini">{'\u2192'} {dest}</span>
                        </>
                      ) : (
                        dest
                      )}
                    </td>
                    <td className="num" data-label="Pasang">
                      {task.qty}
                    </td>
                    <td data-label="Deadline">
                      {task.order?.ready_at ? (
                        <span className={late ? 'chip c-late' : 'chip c-masuk'}>
                          {fmtDate(task.order.ready_at)}
                          {late ? ' \u00b7 telat' : ''}
                        </span>
                      ) : (
                        '\u2014'
                      )}
                    </td>
                    <td className="dt-act">
                      <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
                        {rowActions(task)}
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
              {page}/{meta.last_page}
            </span>
            <button
              type="button"
              className="pg-btn"
              aria-label="Halaman berikutnya"
              disabled={loading || page >= meta.last_page}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {'\u203a'}
            </button>
          </div>
        </div>
      ) : null}

      <StartPhotoDialog
        task={starting}
        busy={starting !== null && busy === starting.id}
        onClose={() => setStarting(null)}
        onSubmit={(files) => {
          if (starting) void startPreparation(starting, files);
        }}
      />

      <ConfirmDialog
        open={canceling !== null}
        title="Batalkan proses?"
        message={
          canceling
            ? `Order ${orderLabel(canceling)} kembali ke antrean dan bisa diedit lagi di Receipt List.`
            : undefined
        }
        confirmText="Batalkan Proses"
        confirmVariant="danger"
        loading={canceling !== null && busy === canceling.id}
        onConfirm={() => {
          if (canceling) void cancelProcess(canceling);
        }}
        onClose={() => setCanceling(null)}
      />

      <WorkshopDetailDialog
        open={detail !== null}
        task={detail}
        onClose={() => setDetail(null)}
        onPhotosChanged={load}
      />

      <Toast show={toast.open} message={toast.message} kind={toast.kind} onClose={hideToast} />
    </div>
  );
}

function StartPhotoDialog(props: {
  task: ProductionTask | null;
  busy: boolean;
  onClose(): void;
  onSubmit(files: File[]): void;
}) {
  const { task, busy, onClose, onSubmit } = props;
  const [files, setFiles] = useState<File[]>([]);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) setFiles([]);
  }, [task]);

  useEffect(() => {
    if (!task) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [task, busy, onClose]);

  if (!task) return null;

  const who = useAuth.user?.name ?? '-';

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Foto Detail {'\u00b7'} Persiapan</h3>
            <div className="mini">
              {task.order?.invoice_no ?? task.order?.number ?? '-'} {'\u00b7'} dikerjakan oleh {who}
            </div>
          </div>
          <button type="button" className="link" aria-label="Tutup" onClick={onClose}>
            {'\u2715'}
          </button>
        </div>

        {files.length === 0 ? (
          <p className="mini" style={{ marginBottom: 12 }}>
            Foto detail opsional {'\u2014'} boleh ditambahkan atau dilewati.
          </p>
        ) : (
          <p className="mini" style={{ marginBottom: 12 }}>
            {files.length} foto siap diunggah.
          </p>
        )}

        <div className="toolbar">
          <button
            type="button"
            className="btn ghost sm"
            disabled={busy}
            onClick={() => cameraRef.current?.click()}
          >
            <IconCamera />
            Kamera
          </button>
          <button
            type="button"
            className="btn ghost sm"
            disabled={busy}
            onClick={() => galleryRef.current?.click()}
          >
            <IconImage />
            Galeri
          </button>
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          hidden
          onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
        />

        <div className="modal-foot" style={{ marginTop: 18 }}>
          <button type="button" className="btn ghost" disabled={busy} onClick={onClose}>
            Batal
          </button>
          <span style={{ flex: 1 }} />
          <button type="button" className="btn" disabled={busy} onClick={() => onSubmit(files)}>
            {busy ? 'Memproses\u2026' : 'Mulai Proses'}
          </button>
        </div>
      </div>
    </div>
  );
}
