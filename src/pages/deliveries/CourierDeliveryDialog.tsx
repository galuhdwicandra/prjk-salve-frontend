import { useEffect, useMemo, useRef, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { updateDeliveryStatus } from '../../api/deliveries';
import type { Delivery } from '../../types/deliveries';
import { rp } from '../../utils/money';
import { IconCamera, IconImage } from '../users/icons';

type Props = {
  delivery: Delivery;
  onClose: () => void;
  onDone: (message: string) => void | Promise<void>;
};

export default function CourierDeliveryDialog({
  delivery,
  onClose,
  onDone,
}: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : ''),
    [photo],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [busy, onClose]);

  function selectPhoto(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File bukti harus berupa gambar.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('Ukuran foto maksimal 4 MB.');
      return;
    }

    setPhoto(file);
    setError(null);
  }

  async function completeDelivery() {
    if (!photo) {
      setError('Foto serah-terima wajib ditambahkan.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await updateDeliveryStatus(delivery.id, {
        status: 'COMPLETED',
        note: 'Pengantaran selesai dan diterima pelanggan.',
        photo,
      });

      await onDone(
        `${delivery.number ?? 'Pengantaran'} berhasil diselesaikan.`,
      );
    } catch (err) {
      setError(
        getErrorMessage(err, 'Gagal menyelesaikan pengantaran.'),
      );
    } finally {
      setBusy(false);
    }
  }

  const customerName = delivery.customer?.name ?? '-';
  const orderNumber =
    delivery.order_invoice_no ??
    delivery.order_number ??
    '-';

  const dueAmount = Number(delivery.due_amount ?? 0);
  const terminal = ['COMPLETED', 'FAILED', 'CANCELLED'].includes(
    delivery.status,
  );

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="courier-delivery-title"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        className="box"
        style={{ maxWidth: 846 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3 id="courier-delivery-title">
              Pengantaran {'\u00b7'} {delivery.number ?? '-'}
            </h3>

            <div className="mini">
              {orderNumber} {'\u00b7'} {customerName}
            </div>
          </div>

          <button
            type="button"
            className="mclose"
            aria-label="Tutup"
            disabled={busy}
            onClick={onClose}
          >
            {'\u2715'}
          </button>
        </div>

        <div className="kv">
          <span>Pelanggan</span>
          <b>{customerName}</b>
        </div>

        <div className="kv">
          <span>WA</span>
          <span>{delivery.customer?.whatsapp ?? '-'}</span>
        </div>

        <div className="kv">
          <span>Alamat</span>
          <span>{delivery.customer?.address ?? '-'}</span>
        </div>

        <div className="kv">
          <span>Pasang</span>
          <b>{Number(delivery.qty ?? 0)}</b>
        </div>

        <div className="kv">
          <span>Sisa Bayar</span>
          <b>{dueAmount > 0 ? rp(dueAmount) : 'Lunas'}</b>
        </div>

        {!terminal ? (
          <div style={{ marginTop: 14 }}>
            <div className="card-title">Foto Serah-Terima</div>

            <div className="mini" style={{ marginBottom: 10 }}>
              Wajib foto bukti serah-terima ke customer.
            </div>

            {previewUrl ? (
              <div
                className="photo-grid"
                style={{ marginBottom: 10 }}
              >
                <div className="photo-thumb">
                  <img src={previewUrl} alt="Bukti serah-terima" />

                  <button
                    type="button"
                    className="photo-x"
                    aria-label="Hapus foto"
                    disabled={busy}
                    onClick={() => setPhoto(null)}
                  >
                    {'\u2715'}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="photo-btns">
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
              hidden
              disabled={busy}
              onChange={(event) => {
                selectPhoto(event.currentTarget.files);
                event.currentTarget.value = '';
              }}
            />

            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              hidden
              disabled={busy}
              onChange={(event) => {
                selectPhoto(event.currentTarget.files);
                event.currentTarget.value = '';
              }}
            />
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mini"
            style={{
              marginTop: 10,
              color: 'var(--danger)',
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        ) : null}

        <div className="modal-foot" style={{ marginTop: 18 }}>
          <button
            type="button"
            className="btn ghost"
            disabled={busy}
            onClick={onClose}
          >
            Batal
          </button>

          <span style={{ flex: 1 }} />

          {!terminal ? (
            <button
              type="button"
              className="btn"
              disabled={busy || !photo}
              onClick={() => void completeDelivery()}
            >
              {busy ? 'Memproses\u2026' : 'Selesai \u2014 Terkirim'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}