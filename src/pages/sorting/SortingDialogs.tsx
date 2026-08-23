import { useEffect, useMemo, useRef, useState } from 'react';
import { listBranches } from '../../api/branches';
import { listContacts } from '../../api/contacts';
import { listContactCategories } from '../../api/contactCategories';
import { createDeliveryNote, createPickupNote } from '../../api/sorting';
import type { DeliveryNote, SortingOrder } from '../../api/sorting';
import { getErrorMessage } from '../../api/client';
import { rp } from '../../utils/money';

type Option = { value: string; label: string };

export function Modal({
  open,
  title,
  subtitle,
  busy = false,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  busy?: boolean;
  onClose(): void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

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
  }, [open, busy, onClose]);

  if (!open) return null;

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
            <h3>{title}</h3>
            {subtitle ? <div className="mini">{subtitle}</div> : null}
          </div>
          <button type="button" className="link" aria-label="Tutup" disabled={busy} onClick={onClose}>
            {'\u2715'}
          </button>
        </div>

        {children}

        <div className="modal-foot" style={{ justifyContent: 'flex-end', marginTop: 18 }}>{footer}</div>
      </div>
    </div>
  );
}

function OrderTable({
  orders,
  showDue = false,
}: {
  orders: SortingOrder[];
  showDue?: boolean;
}) {
  return (
    <div className="tbl-wrap" style={{ maxHeight: 210, overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Pelanggan</th>
            <th>Asal</th>
            <th className="num">Pasang</th>
            {showDue ? <th className="num">Sisa Bayar</th> : null}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td data-label="No">{o.invoice_no ?? o.number}</td>
              <td data-label="Pelanggan">{o.customer_name ?? '-'}</td>
              <td data-label="Asal">{o.branch?.code ?? o.branch?.name ?? '-'}</td>
              <td className="num" data-label="Pasang">{o.qty}</td>
              {showDue ? (
                <td className="num" data-label="Sisa Bayar">
                  {o.is_paid ? (
                    <span className="mini">lunas</span>
                  ) : (
                    <b style={{ color: 'var(--warn)' }}>{rp(o.due_amount)}</b>
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhotoPicker({
  files,
  busy,
  hint,
  onChange,
}: {
  files: File[];
  busy: boolean;
  hint: string;
  onChange(next: File[]): void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMemo(
    () => /android|iphone|ipad|ipod/i.test(navigator.userAgent),
    [],
  );

  const previews = useMemo(
    () => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [files],
  );

  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews],
  );

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="mb-2 text-sm font-semibold text-slate-900">Foto Bukti</div>
      <p className="mb-3 text-xs text-slate-500">{hint}</p>

      {previews.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {previews.map((p, i) => (
            <div
              key={`${p.file.name}-${i}`}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200"
            >
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                disabled={busy}
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="absolute right-0 top-0 bg-black/60 px-1.5 text-xs text-white"
                aria-label="Hapus foto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-3 text-xs text-rose-600">
          Wajib minimal 1 foto sebelum aksi bisa dilanjutkan.
        </p>
      )}

      <button
        type="button"
        className="btn-outline"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {isMobile ? 'Buka Kamera' : 'Pilih Foto'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={isMobile ? 'environment' : undefined}
        multiple
        className="hidden"
        onChange={(e) => {
          onChange([...files, ...Array.from(e.target.files ?? [])]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

export function CreateNoteDialog({
  open,
  orders,
  defaultDate,
  onClose,
  onCreated,
  onError,
}: {
  open: boolean;
  orders: SortingOrder[];
  defaultDate: string;
  onClose(): void;
  onCreated(note: DeliveryNote): void | Promise<void>;
  onError(message: string): void;
}) {
  const toType = orders[0]?.processing_destination ?? 'workshop';
  const [options, setOptions] = useState<Option[]>([]);
  const [destinationId, setDestinationId] = useState('');
  const [noteDate, setNoteDate] = useState(defaultDate);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setNoteDate(defaultDate);
    setDestinationId('');
    setNote(null);

    void (async () => {
      try {
        if (toType === 'workshop') {
          const res = await listBranches({ per_page: 200 });
          const opts = (res.data ?? [])
            .filter((b) => b.type === 'workshop')
            .map((b) => ({ value: b.id, label: `${b.name} (${b.code})` }));

          setOptions(opts);
          if (!opts.length) setNote('Belum ada outlet bertipe Workshop.');
          return;
        }

        const cats = await listContactCategories();
        const subcon = (cats.data ?? []).find(
          (c) => c.name.trim().toLowerCase() === 'subcon',
        );

        if (!subcon) {
          setOptions([]);
          setNote('Belum ada kategori kontak bernama "Subcon". Tambahkan di Database Kontak.');
          return;
        }

        const res = await listContacts({
          category_id: subcon.id,
          is_active: true,
          per_page: 200,
        });
        const opts = (res.data ?? []).map((c) => ({
          value: c.id,
          label: c.phone ? `${c.name} — ${c.phone}` : c.name,
        }));

        setOptions(opts);
        if (!opts.length) setNote('Belum ada kontak berlabel "Subcon".');
      } catch (e) {
        setOptions([]);
        setNote(getErrorMessage(e, 'Gagal memuat daftar tujuan.'));
      }
    })();
  }, [open, toType, defaultDate]);

  const submit = async () => {
    if (!destinationId) {
      onError('Pilih tujuan dulu.');
      return;
    }

    setBusy(true);
    try {
      const res = await createDeliveryNote({
        order_ids: orders.map((o) => o.id),
        note_date: noteDate,
        to_type: toType,
        destination_id: destinationId,
      });
      await onCreated(res.data);
    } catch (e) {
      onError(getErrorMessage(e, 'Gagal membuat surat jalan.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      busy={busy}
      title="Buat Surat Jalan"
      subtitle={`${orders.length} order · tujuan ${toType === 'vendor' ? 'Subcon' : 'Workshop'}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-outline" disabled={busy} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={busy || !destinationId}
            onClick={() => void submit()}
          >
            {busy ? 'Memproses...' : 'Buat Surat Jalan'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <OrderTable orders={orders} />

        {note && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {note}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span>Tanggal Pengiriman</span>
            <input
              type="date"
              className="input bg-white px-2 py-2"
              value={noteDate}
              disabled={busy}
              onChange={(e) => setNoteDate(e.target.value)}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span>Tujuan ({toType === 'vendor' ? 'Subcon' : 'Workshop'})</span>
            <select
              className="input bg-white px-2 py-2"
              value={destinationId}
              disabled={busy || options.length === 0}
              onChange={(e) => setDestinationId(e.target.value)}
            >
              <option value="">pilih tujuan...</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </Modal>
  );
}

export function CreatePickupDialog({
  open,
  orders,
  defaultDate,
  onClose,
  onCreated,
  onError,
}: {
  open: boolean;
  orders: SortingOrder[];
  defaultDate: string;
  onClose(): void;
  onCreated(note: DeliveryNote): void | Promise<void>;
  onError(message: string): void;
}) {
  const [options, setOptions] = useState<Option[]>([]);
  const [branchId, setBranchId] = useState('');
  const [noteDate, setNoteDate] = useState(defaultDate);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const subconName = orders[0]?.destination_contact?.name ?? 'Subcon';

  useEffect(() => {
    if (!open) return;

    setNoteDate(defaultDate);
    setBranchId('');
    setNote(null);

    void (async () => {
      try {
        const res = await listBranches({ per_page: 200 });
        const opts = (res.data ?? [])
          .filter((b) => b.type === 'workshop')
          .map((b) => ({ value: b.id, label: `${b.name} (${b.code})` }));

        setOptions(opts);
        if (!opts.length) setNote('Belum ada outlet bertipe Workshop.');
      } catch (e) {
        setOptions([]);
        setNote(getErrorMessage(e, 'Gagal memuat daftar workshop.'));
      }
    })();
  }, [open, defaultDate]);

  const submit = async () => {
    if (!branchId) {
      onError('Pilih workshop tujuan dulu.');
      return;
    }

    setBusy(true);
    try {
      const res = await createPickupNote({
        order_ids: orders.map((o) => o.id),
        note_date: noteDate,
        branch_id: branchId,
      });
      await onCreated(res.data);
    } catch (e) {
      onError(getErrorMessage(e, 'Gagal membuat surat jalan ambil.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      busy={busy}
      title="Buat Surat Jalan Ambil"
      subtitle={`Menjemput ${orders.length} order dari ${subconName} kembali ke workshop.`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-outline" disabled={busy} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={busy || !branchId}
            onClick={() => void submit()}
          >
            {busy ? 'Memproses...' : 'Buat Surat Jalan Ambil'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <OrderTable orders={orders} />

        {note && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {note}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span>Tanggal Ambil</span>
            <input
              type="date"
              className="input bg-white px-2 py-2"
              value={noteDate}
              disabled={busy}
              onChange={(e) => setNoteDate(e.target.value)}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span>Kembali ke Workshop</span>
            <select
              className="input bg-white px-2 py-2"
              value={branchId}
              disabled={busy || options.length === 0}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="">pilih workshop...</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </Modal>
  );
}

export function HandoverDialog({
  open,
  orders,
  busy,
  onClose,
  onSubmit,
}: {
  open: boolean;
  orders: SortingOrder[];
  busy: boolean;
  onClose(): void;
  onSubmit(files: File[]): void | Promise<void>;
}) {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (open) setFiles([]);
  }, [open]);

  const unpaid = orders.filter((o) => !o.is_paid);

  return (
    <Modal
      open={open}
      busy={busy}
      title="Serah-Terima ke Customer"
      subtitle={`${orders.length} order · foto bukti wajib sebelum diserahkan`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-outline" disabled={busy} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={busy || files.length === 0}
            onClick={() => void onSubmit(files)}
          >
            {busy ? 'Memproses...' : 'Konfirmasi Diambil'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <OrderTable orders={orders} showDue />

        {unpaid.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {unpaid.length} order belum lunas dan akan dilewati. Selesaikan
            pembayaran dulu di Receipt List.
          </div>
        )}

        <PhotoPicker
          files={files}
          busy={busy}
          hint="Foto serah-terima ke customer. Akan tersimpan sebagai foto handover di setiap order."
          onChange={setFiles}
        />
      </div>
    </Modal>
  );
}

export function AddressDialog({
  open,
  orders,
  busy,
  onClose,
  onSubmit,
}: {
  open: boolean;
  orders: SortingOrder[];
  busy: boolean;
  onClose(): void;
  onSubmit(
    addresses: Record<string, string>,
    orderIds: string[],
  ): void | Promise<void>;
}) {
  const customers = useMemo(() => {
    const map = new Map<string, string>();
    orders.forEach((o) => {
      if (o.customer_id) map.set(o.customer_id, o.customer_name ?? '-');
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [orders]);

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) setValues({});
  }, [open]);

  const complete =
    customers.length > 0 &&
    customers.every((c) => (values[c.id] ?? '').trim() !== '');

  return (
    <Modal
      open={open}
      busy={busy}
      title="Lengkapi Alamat Customer"
      subtitle="Alamat wajib untuk pengantaran kurir dan otomatis tersimpan ke Database Customer."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-outline" disabled={busy} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={busy || !complete}
            onClick={() =>
              void onSubmit(
                values,
                orders.map((o) => o.id),
              )
            }
          >
            {busy ? 'Memproses...' : 'Simpan & Kirim'}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {customers.map((c) => (
          <label key={c.id} className="grid gap-1 text-sm">
            <span className="font-medium">{c.name}</span>
            <input
              type="text"
              className="input bg-white px-2 py-2"
              placeholder="alamat lengkap untuk pengantaran"
              value={values[c.id] ?? ''}
              disabled={busy}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [c.id]: e.target.value }))
              }
            />
          </label>
        ))}
      </div>
    </Modal>
  );
}
