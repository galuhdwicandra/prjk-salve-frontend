import { useRef, useState } from 'react';
import { deleteOrderPhoto, uploadOrderPhotos } from '../../api/orderPhotos';
import { getErrorMessage } from '../../api/client';
import { fileUrl } from '../../utils/files';
import type { OrderPhoto } from '../../types/orders';

type Props = {
  orderId: string;
  photos: OrderPhoto[];
  readOnly?: boolean;
  onChanged: () => void | Promise<void>;
};

export default function OrderBeforePhotos({ orderId, photos, readOnly = false, onChanged }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const before = photos.filter((photo) => String(photo.kind).toLowerCase() === 'before');

  async function upload(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;

    setBusy(true);
    setError(null);

    try {
      await uploadOrderPhotos(orderId, files, []);
      await onChanged();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengunggah foto.'));
    } finally {
      setBusy(false);
      if (cameraRef.current) cameraRef.current.value = '';
      if (galleryRef.current) galleryRef.current.value = '';
    }
  }

  async function remove(photoId: string) {
    setBusy(true);
    setError(null);

    try {
      await deleteOrderPhoto(orderId, photoId);
      await onChanged();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus foto.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        className="mini"
        style={{
          background: before.length > 0 ? 'var(--ok-bg)' : 'var(--warn-bg)',
          color: before.length > 0 ? 'var(--ok)' : 'var(--warn)',
          fontWeight: 700,
          borderRadius: 'var(--r-sm)',
          padding: '10px 12px',
          marginBottom: 12,
        }}
      >
        {before.length > 0
          ? '\u2713 Foto lengkap \u2014 order masuk Workshop'
          : 'Belum ada foto \u2014 order belum bisa disortir ke Workshop'}
      </div>

      {before.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          {before.map((photo) => (
            <div key={photo.id} style={{ position: 'relative' }}>
              <img
                src={fileUrl(photo.path)}
                alt="Foto before"
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)' }}
              />
              {readOnly ? null : (
                <button
                  type="button"
                  aria-label="Hapus foto"
                  disabled={busy}
                  onClick={() => void remove(photo.id)}
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
              )}
            </div>
          ))}
        </div>
      ) : null}

      {readOnly ? null : (
        <div className="toolbar">
          <button type="button" className="btn ghost sm" disabled={busy} onClick={() => cameraRef.current?.click()}>
            Kamera
          </button>
          <button type="button" className="btn ghost sm" disabled={busy} onClick={() => galleryRef.current?.click()}>
            Galeri
          </button>
        </div>
      )}

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
        <div role="alert" className="mini" style={{ color: 'var(--danger)', fontWeight: 700, marginTop: 10 }}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
