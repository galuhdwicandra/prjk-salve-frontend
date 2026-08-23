import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { getOrder } from '../../api/orders';
import { deleteOrderPhoto, uploadOrderPhotos } from '../../api/orderPhotos';
import type { SortingDestination, SortingOrder, SortingTab } from '../../api/sorting';
import type { Order, OrderBackendStatus, OrderPhoto } from '../../types/orders';
import { fmtDate, fmtDateTime } from '../../utils/date';
import { fileUrl } from '../../utils/files';
import { IconCamera, IconImage, IconTag } from '../users/icons';
import { printOrderLabels } from './print';

const WORK_STATUS: Partial<Record<OrderBackendStatus, string>> = {
  QUEUE: 'Antre di workshop',
  WASHING: 'Persiapan',
  DRYING: 'Pengeringan',
  IRONING: 'Finishing',
  READY: 'Selesai \u00b7 siap diambil',
};

const LOG_LABEL: Partial<Record<OrderBackendStatus, string>> = {
  QUEUE: 'Masuk antrean',
  WASHING: 'Persiapan',
  DRYING: 'Pengeringan',
  IRONING: 'Finishing',
  READY: 'Selesai dikerjakan',
};

type Props = {
  open: boolean;
  tab: SortingTab;
  row: SortingOrder | null;
  busy: boolean;
  onClose(): void;
  onSort(destination: SortingDestination): void | Promise<void>;
  onPhotosChanged(): void | Promise<void>;
};

function outletText(row: SortingOrder): string {
  if (!row.branch) return '-';
  return `${row.branch.name} (${row.branch.code} \u00b7 ${row.branch.type === 'droppoint' ? 'drop point' : 'workshop'})`;
}

function headChip(tab: SortingTab, row: SortingOrder): { label: string; cls: string } {
  if (tab === 'delivery-note') {
    return {
      label: `Menunggu Surat Jalan Ke ${row.processing_destination === 'vendor' ? 'Subcon' : 'Workshop'}`,
      cls: 'chip c-masuk',
    };
  }
  if (tab === 'at-subcon') return { label: 'Di Subcon', cls: 'chip c-subcon' };
  return { label: 'Selesai \u00b7 Siap Diambil', cls: 'chip c-ready' };
}

export default function SortingDetailDialog({
  open,
  tab,
  row,
  busy,
  onClose,
  onSort,
  onPhotosChanged,
}: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const orderId = row?.id ?? null;

  const load = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await getOrder(orderId);
      setOrder(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat detail order.'));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!open) {
      setOrder(null);
      setError(null);
      return;
    }
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy && !uploading) onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, busy, uploading, onClose]);

  if (!open || !row) return null;

  const before: OrderPhoto[] = (order?.photos ?? []).filter(
    (photo) => String(photo.kind).toLowerCase() === 'before',
  );
  const task = order?.production_task ?? null;
  const logs = task?.logs ?? [];
  const isSortMode = tab === 'incoming';
  const chip = headChip(tab, row);

  async function upload(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0 || !orderId) return;

    setUploading(true);
    setError(null);
    try {
      await uploadOrderPhotos(orderId, files, []);
      await load();
      await onPhotosChanged();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengunggah foto.'));
    } finally {
      setUploading(false);
      if (cameraRef.current) cameraRef.current.value = '';
      if (galleryRef.current) galleryRef.current.value = '';
    }
  }

  async function removePhoto(photoId: string) {
    if (!orderId) return;

    setUploading(true);
    setError(null);
    try {
      await deleteOrderPhoto(orderId, photoId);
      await load();
      await onPhotosChanged();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus foto.'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!busy && !uploading) onClose();
      }}
    >
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>
              {isSortMode
                ? `Sortir ${row.invoice_no ?? row.number}`
                : `Detail Kerja \u00b7 ${row.invoice_no ?? row.number}`}
            </h3>
            {isSortMode ? null : (
              <div className="mini">
                {row.customer_name ?? '-'} \u00b7 deadline {fmtDate(row.ready_at)}
              </div>
            )}
          </div>
          <button type="button" className="link" aria-label="Tutup" onClick={onClose}>
            {'\u2715'}
          </button>
        </div>

        {isSortMode ? null : (
          <div style={{ marginBottom: 12 }}>
            <span className={chip.cls}>{chip.label}</span>
          </div>
        )}

        {isSortMode ? (
          <>
            <div className="kv">
              <span>Pelanggan</span>
              <b>{row.customer_name ?? '-'}</b>
            </div>
            <div className="kv">
              <span>Outlet asal</span>
              <b>
                {row.branch?.code ?? '-'} \u00b7{' '}
                {row.branch?.type === 'droppoint' ? 'Drop Point' : 'Workshop'} \u00b7 {row.qty} pasang
              </b>
            </div>
            <div className="kv">
              <span>Deadline</span>
              <b>{fmtDate(row.ready_at)}</b>
            </div>
            <div className="kv">
              <span>Tujuan saat ini</span>
              <b>Belum disortir</b>
            </div>
            <p className="mini" style={{ marginTop: 10 }}>
              Order dari workshop: pilih Workshop {'\u2192'} langsung ke antrean; Vendor {'\u2192'} masuk
              Pengiriman (surat jalan).
            </p>
          </>
        ) : (
          <>
            <div className="kv">
              <span>Outlet asal</span>
              <b>{outletText(row)}</b>
            </div>
            <div className="kv">
              <span>Dikerjakan di</span>
              <b>
                {row.processing_destination === 'vendor'
                  ? `Subcon ${row.destination_contact?.name ?? '-'}`
                  : `Workshop ${row.branch?.code ?? ''}`.trim()}
              </b>
            </div>
            <div className="kv">
              <span>Jumlah</span>
              <b>{row.qty} pasang</b>
            </div>

            <div className="card-title" style={{ marginTop: 16 }}>
              Treatment
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Layanan</th>
                    <th className="num">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2} className="empty">
                        Memuat{'\u2026'}
                      </td>
                    </tr>
                  ) : (order?.items ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={2} className="empty">
                        Tidak ada layanan tercatat.
                      </td>
                    </tr>
                  ) : (
                    (order?.items ?? []).map((item) => (
                      <tr key={item.id}>
                        <td data-label="Layanan">{item.service?.name ?? '-'}</td>
                        <td className="num" data-label="Qty">
                          {item.qty}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="card-title" style={{ marginTop: 16 }}>
          Foto Before
        </div>

        {before.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            {before.map((photo) => (
              <div key={photo.id} style={{ position: 'relative' }}>
                <img
                  src={fileUrl(photo.path)}
                  alt="Foto before"
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid var(--line)',
                  }}
                />
                <button
                  type="button"
                  aria-label="Hapus foto"
                  disabled={uploading || busy}
                  onClick={() => void removePhoto(photo.id)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: 0,
                    background: 'var(--navy)',
                    color: '#fff',
                    fontSize: 11,
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}
                >
                  {'\u2715'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mini" style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: 12 }}>
            Belum ada foto before {'\u2014'} order belum bisa disortir.
          </p>
        )}

        <div className="toolbar">
          <button
            type="button"
            className="btn ghost sm"
            disabled={uploading || busy}
            onClick={() => cameraRef.current?.click()}
          >
            <IconCamera />
            Kamera
          </button>
          <button
            type="button"
            className="btn ghost sm"
            disabled={uploading || busy}
            onClick={() => galleryRef.current?.click()}
          >
            <IconImage />
            Galeri
          </button>
          <button type="button" className="btn ghost sm" onClick={() => printOrderLabels([row])}>
            <IconTag />
            Cetak Label
          </button>
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          hidden
          onChange={(e) => void upload(e.target.files)}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void upload(e.target.files)}
        />

        {error ? (
          <div
            role="alert"
            className="mini"
            style={{ color: 'var(--danger)', fontWeight: 700, marginTop: 10 }}
          >
            {error}
          </div>
        ) : null}

        {isSortMode ? (
          <div className="modal-foot" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
            <button
              type="button"
              className="btn"
              disabled={busy || uploading || before.length === 0}
              onClick={() => void onSort('vendor')}
            >
              Kirim ke Subcon
            </button>
            <button
              type="button"
              className="btn dark"
              disabled={busy || uploading || before.length === 0}
              onClick={() => void onSort('workshop')}
            >
              Kerjakan di Workshop
            </button>
          </div>
        ) : (
          <>
            <div className="kv" style={{ marginTop: 16 }}>
              <span>Status kerja</span>
              <b>{(task && WORK_STATUS[task.current_status]) ?? 'Menunggu proses'}</b>
            </div>

            <div className="card-title" style={{ marginTop: 16 }}>
              Foto Pengerjaan
            </div>

            {logs.length === 0 ? (
              <p className="mini">Belum ada aktivitas pengerjaan.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={{ marginBottom: 10 }}>
                  <div className="mini">
                    <b style={{ color: 'var(--blue)' }}>
                      {LOG_LABEL[log.to_status] ?? log.to_status}
                    </b>{' '}
                    \u00b7 {log.user?.name ?? '-'} \u00b7 {fmtDateTime(log.created_at)}
                    {log.finished_date ? ` \u2192 selesai ${fmtDate(log.finished_date)}` : ''}
                  </div>
                  <div className="mini">{log.note ?? '\u2014'}</div>
                </div>
              ))
            )}

            <p className="mini" style={{ marginTop: 14 }}>
              Aksi Proses/Finishing dilakukan dari daftar Workshop. Harga & pembayaran ada di Receipt
              List.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
