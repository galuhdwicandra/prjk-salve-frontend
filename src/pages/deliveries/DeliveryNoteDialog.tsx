import { useEffect, useMemo, useRef, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { arriveDeliveryNote, completeDeliveryNote, pickDeliveryNote } from '../../api/sorting';
import type { DeliveryNote, DeliveryNoteOrder, DeliveryNoteStatus } from '../../api/sorting';
import { fmtDate } from '../../utils/date';
import { printDeliveryNote } from '../sorting/print';
import { IconCamera, IconFile, IconImage, IconTruck } from '../users/icons';

type Props = {
  note: DeliveryNote | null;
  onClose(): void;
  onDone(message: string): void | Promise<void>;
  onError(message: string): void;
};

type Action = {
  label: string;
  run(id: string, photos: File[]): Promise<unknown>;
};

const STATUS_CHIP: Record<DeliveryNoteStatus, { label: string; cls: string }> = {
  PENDING: { label: 'Belum Selesai', cls: 'chip c-masuk' },
  PICKED: { label: 'Sudah Diambil', cls: 'chip c-proses' },
  COMPLETED: { label: 'Selesai', cls: 'chip c-diambil' },
};

function actionFor(note: DeliveryNote): Action | null {
  if (note.status === 'COMPLETED') return null;
  if (note.kind === 'kirim') return { label: 'Selesaikan Pengiriman', run: completeDeliveryNote };
  if (note.status === 'PENDING') return { label: 'Sudah Diambil dari Subcon', run: pickDeliveryNote };
  return { label: 'Tiba di Workshop', run: arriveDeliveryNote };
}

function orderQty(order: DeliveryNoteOrder): number {
  return (order.items ?? []).reduce((sum, item) => sum + Number(item.qty ?? 0), 0);
}

export default function DeliveryNoteDialog({ note, onClose, onDone, onError }: Props) {
  const [proofMode, setProofMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  useEffect(() => {
    setProofMode(false);
    setFiles([]);
    setError(null);
  }, [note]);

  useEffect(() => {
    if (!note) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [note, busy, onClose]);

  if (!note) return null;

  const orders = note.orders ?? [];
  const action = actionFor(note);
  const chip = STATUS_CHIP[note.status];
  const fromText = note.from_contact?.name ?? note.branch?.code ?? note.branch?.name ?? '-';
  const toText = note.to_contact?.name ?? note.to_branch?.code ?? note.to_branch?.name ?? '-';

  const addFiles = (list: FileList | null) => {
    setFiles((prev) => [...prev, ...Array.from(list ?? [])]);
  };

  const submit = async () => {
    if (!action) return;

    setBusy(true);
    setError(null);
    try {
      await action.run(note.id, files);
      await onDone(`${note.number} \u2014 ${action.label.toLowerCase()}.`);
    } catch (e) {
      setError(getErrorMessage(e, 'Gagal memproses surat jalan.'));
    } finally {
      setBusy(false);
    }
  };

  const print = () => {
    try {
      printDeliveryNote(note);
    } catch (e) {
      onError(getErrorMessage(e, 'Gagal membuka jendela cetak.'));
    }
  };

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
            <h3>
              {proofMode ? 'Bukti Pengiriman' : 'Surat Jalan'} {'\u00b7'} {note.number}
            </h3>
            {proofMode ? null : <div className="mini">{fmtDate(note.note_date)}</div>}
          </div>
          <button type="button" className="link" aria-label="Tutup" disabled={busy} onClick={onClose}>
            {'\u2715'}
          </button>
        </div>

        {proofMode ? (
          <>
            <p className="mini">Foto bukti serah-terima, lalu selesaikan pengiriman.</p>

            {previews.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '12px 0' }}>
                {previews.map((p, i) => (
                  <div key={`${p.file.name}-${i}`} style={{ position: 'relative' }}>
                    <img
                      src={p.url}
                      alt="Foto bukti"
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
                      disabled={busy}
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
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
              <p className="mini" style={{ margin: '12px 0' }}>
                Belum ada foto. Foto bukti dulu.
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
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <span className={chip.cls}>{chip.label}</span>
            </div>

            <div className="kv">
              <span>Dari</span>
              <b>{fromText}</b>
            </div>
            <div className="kv">
              <span>Ke</span>
              <b>{toText}</b>
            </div>
            <div className="kv">
              <span>Dibuat</span>
              <b>
                {note.creator?.name ?? '-'} {'\u00b7'} {fmtDate(note.note_date)}
              </b>
            </div>

            <div className="card-title" style={{ marginTop: 16 }}>
              Order ({orders.length})
            </div>

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Pelanggan</th>
                    <th>Asal</th>
                    <th className="num">Pasang</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty">
                        Tidak ada order.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td data-label="No">{o.invoice_no ?? o.number}</td>
                        <td data-label="Pelanggan">{o.customer?.name ?? o.customer_name ?? '-'}</td>
                        <td data-label="Asal">{o.branch?.code ?? o.branch?.name ?? '-'}</td>
                        <td className="num" data-label="Pasang">
                          {orderQty(o)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {error ? (
          <div role="alert" className="mini" style={{ color: 'var(--danger)', fontWeight: 700, marginTop: 10 }}>
            {error}
          </div>
        ) : null}

        <div className="modal-foot" style={{ marginTop: 18 }}>
          {proofMode ? (
            <button type="button" className="btn ghost" disabled={busy} onClick={() => setProofMode(false)}>
              Kembali
            </button>
          ) : (
            <button type="button" className="btn ghost" disabled={busy} onClick={print}>
              <IconFile />
              Cetak Surat Jalan
            </button>
          )}

          <span style={{ flex: 1 }} />

          {action ? (
            <button
              type="button"
              className="btn"
              disabled={busy || (proofMode && files.length === 0)}
              onClick={() => (proofMode ? void submit() : setProofMode(true))}
            >
              <IconTruck />
              {busy ? 'Memproses\u2026' : action.label}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
