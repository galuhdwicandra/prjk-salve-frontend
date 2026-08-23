import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { getOrder } from '../../api/orders';
import { deleteOrderPhoto, uploadOrderPhotos } from '../../api/orderPhotos';
import { fmtDate, fmtDateTime } from '../../utils/date';
import { fileUrl } from '../../utils/files';
import { IconCamera, IconImage, IconTag } from '../users/icons';
import { printOrderLabels } from '../sorting/print';
import type { Order, OrderBackendStatus, OrderPhoto } from '../../types/orders';
import type { ProductionTask } from '../../types/production';

const WORK_STATUS: Partial<Record<OrderBackendStatus, string>> = {
  QUEUE: 'Menunggu proses',
  WASHING: 'Persiapan (dikerjakan)',
  DRYING: 'Menunggu finishing',
  IRONING: 'Finishing (dikerjakan)',
  READY: 'Selesai \u00b7 siap diambil',
};

const LOG_LABEL: Partial<Record<OrderBackendStatus, string>> = {
  QUEUE: 'Masuk antrean',
  WASHING: 'Persiapan',
  DRYING: 'Persiapan selesai',
  IRONING: 'Finishing',
  READY: 'Finishing selesai',
};

type Props = {
  open: boolean;
  task: ProductionTask | null;
  onClose(): void;
  onPhotosChanged(): void | Promise<void>;
};

export default function WorkshopDetailDialog({ open, task, onClose, onPhotosChanged }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const orderId = task?.order_id ?? null;

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
      if (e.key === 'Escape' && !uploading) onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, uploading, onClose]);

  if (!open || !task) return null;

  const before: OrderPhoto[] = (order?.photos ?? []).filter(
    (photo) => String(photo.kind).toLowerCase() === 'before',
  );
  const logs = order?.production_task?.logs ?? [];
  const origin = task.order?.branch ?? null;
  const workshop = task.branch ?? null;
  const number = task.order?.invoice_no ?? task.order?.number ?? '-';

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
        if (!uploading) onClose();
      }}
    >
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Detail Kerja {'\u00b7'} {number}</h3>
            <div className="mini">
              {task.order?.customer?.name ?? '-'} {'\u00b7'} deadline {fmtDate(task.order?.ready_at)}
            </div>
          </div>
          <button type="button" className="link" aria-label="Tutup" onClick={onClose}>
            {'\u2715'}
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <span className="chip c-proses">
            Di Workshop {workshop?.code ?? '-'} {'\u00b7'}{' '}
            {WORK_STATUS[task.current_status] ?? task.current_status}
          </span>
        </div>

        <div className="kv">
          <span>Outlet asal</span>
          <b>
            {origin
              ? `${origin.name} (${origin.code} \u00b7 ${origin.type === 'droppoint' ? 'drop point' : 'workshop'})`
              : '-'}
          </b>
        </div>
        <div className="kv">
          <span>Dikerjakan di</span>
          <b>Workshop {workshop?.code ?? '-'}</b>
        </div>
        <div className="kv">
          <span>Jumlah</span>
          <b>{task.qty} pasang</b>
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
                  disabled={uploading}
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
          <p className="mini" style={{ marginBottom: 12 }}>
            Belum ada foto before.
          </p>
        )}

        <div className="toolbar">
          <button
            type="button"
            className="btn ghost sm"
            disabled={uploading}
            onClick={() => cameraRef.current?.click()}
          >
            <IconCamera />
            Kamera
          </button>
          <button
            type="button"
            className="btn ghost sm"
            disabled={uploading}
            onClick={() => galleryRef.current?.click()}
          >
            <IconImage />
            Galeri
          </button>
          <button
            type="button"
            className="btn ghost sm"
            onClick={() =>
              printOrderLabels([
                {
                  number: task.order?.number ?? '-',
                  invoice_no: task.order?.invoice_no ?? null,
                  customer_name: task.order?.customer?.name ?? null,
                  qty: task.qty,
                  ready_at: task.order?.ready_at ?? null,
                  branch: workshop
                    ? {
                        id: workshop.id,
                        name: workshop.name,
                        code: workshop.code,
                        type: workshop.type,
                      }
                    : null,
                },
              ])
            }
          >
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

        <div className="kv" style={{ marginTop: 16 }}>
          <span>Status kerja</span>
          <b>{WORK_STATUS[task.current_status] ?? task.current_status}</b>
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
                <b style={{ color: 'var(--blue)' }}>{LOG_LABEL[log.to_status] ?? log.to_status}</b>{' '}
                {'\u00b7'} {log.user?.name ?? '-'} {'\u00b7'} {fmtDateTime(log.created_at)}
              </div>
              <div className="mini">{log.note ?? '\u2014'}</div>
            </div>
          ))
        )}

        <p className="mini" style={{ marginTop: 14 }}>
          Aksi Proses/Finishing dilakukan dari daftar Workshop. Harga & pembayaran ada di Receipt
          List.
        </p>
      </div>
    </div>
  );
}
