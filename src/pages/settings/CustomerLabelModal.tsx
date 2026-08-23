import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
  createCustomerLabel,
  deleteCustomerLabel,
  updateCustomerLabel,
} from '../../api/customerLabels';
import {
  CUSTOMER_LABEL_COLORS,
  customerLabelChipClass,
  customerLabelSwatch,
} from '../../hooks/useCustomerLabels';
import type { CustomerLabel } from '../../types/customers';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

type Props = {
  label: CustomerLabel | null;
  onClose: () => void;
  onDone: (message: string) => void;
};

export default function CustomerLabelModal({ label, onClose, onDone }: Props) {
  const editing = Boolean(label);
  const used = (label?.usage_count ?? 0) > 0;

  const [name, setName] = useState(label?.name ?? '');
  const [color, setColor] = useState(label?.color ?? 'blue');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Nama label wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (label) {
        await updateCustomerLabel(label.id, { name: trimmed, color });
        onDone('Label customer diperbarui.');
      } else {
        await createCustomerLabel({ name: trimmed, color, is_active: true });
        onDone('Label customer ditambahkan.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan label customer'));
    } finally {
      setSaving(false);
    }
  }

  async function setActive(value: boolean) {
    if (!label) return;

    setSaving(true);
    setError(null);
    try {
      await updateCustomerLabel(label.id, { is_active: value });
      onDone(value ? 'Label dipulihkan.' : 'Label diarsipkan.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status label'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!label) return;
    if (!window.confirm(`Hapus label ${label.name}?`)) return;

    setSaving(true);
    setError(null);
    try {
      await deleteCustomerLabel(label.id);
      onDone('Label customer dihapus.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus label customer'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? 'Edit Label Customer' : 'Tambah Label Customer'}
    >
      <div className="box">
        <div className="modal-head">
          <h3>{editing ? 'Edit Label Customer' : 'Tambah Label Customer'}</h3>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div
            role="alert"
            style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}
          >
            {error}
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="cl-name">Nama Label</label>
          <input
            id="cl-name"
            value={name}
            maxLength={60}
            placeholder="mis. VIP"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Warna</label>
          <div className="lbl-sws">
            {CUSTOMER_LABEL_COLORS.map((option) => (
              <button
                key={option}
                type="button"
                className={option === color ? 'lbl-sw on' : 'lbl-sw'}
                style={{ background: customerLabelSwatch(option) }}
                aria-label={`Warna ${option}`}
                aria-pressed={option === color}
                onClick={() => setColor(option)}
              />
            ))}
          </div>
        </div>

        <div className="field">
          <label>Pratinjau</label>
          <div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${customerLabelChipClass(color)}`}
            >
              {name.trim() || 'Label'}
            </span>
          </div>
        </div>

        <div className="modal-foot">
          {editing && label ? (
            <>
              <button
                type="button"
                className="btn ghost sm"
                disabled={saving}
                onClick={() => void setActive(!label.is_active)}
              >
                {label.is_active ? <IconArchive /> : <IconUnarchive />}
                {label.is_active ? 'Arsipkan' : 'Pulihkan'}
              </button>
              <button
                type="button"
                className="btn danger sm"
                disabled={saving || used}
                title={used ? 'Label masih dipakai customer' : undefined}
                onClick={() => void remove()}
              >
                <IconTrash />
                Hapus
              </button>
            </>
          ) : null}

          <button
            type="button"
            className="btn"
            style={editing ? { marginLeft: 'auto' } : undefined}
            disabled={saving}
            onClick={() => void submit()}
          >
            {saving ? 'Menyimpan\u2026' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
