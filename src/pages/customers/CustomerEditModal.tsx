import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { updateCustomer } from '../../api/customers';
import { useCustomerLabels } from '../../hooks/useCustomerLabels';
import type { Customer } from '../../types/customers';

type Props = {
  customer: Customer;
  onClose: () => void;
  onDone: (updated: Customer) => void;
};

export default function CustomerEditModal({ customer, onClose, onDone }: Props) {
  const { labels } = useCustomerLabels();
  const [name, setName] = useState(customer.name);
  const [whatsapp, setWhatsapp] = useState(customer.whatsapp);
  const [address, setAddress] = useState(customer.address ?? '');
  const [label, setLabel] = useState(customer.tags?.[0] ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const trimmedName = name.trim();
    const digits = whatsapp.replace(/\D+/g, '');

    if (!trimmedName) {
      setError('Nama wajib diisi.');
      return;
    }

    if (!digits) {
      setError('Nomor WA wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await updateCustomer(customer.id, {
        name: trimmedName,
        whatsapp: digits,
        address: address.trim() || null,
        tags: label ? [label] : [],
      });

      if (!res.data) {
        setError('Gagal menyimpan data pelanggan.');
        return;
      }

      onDone(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan data pelanggan'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label="Edit Pelanggan">
      <div className="box">
        <div className="modal-head">
          <h3>Edit Pelanggan</h3>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="row">
          <div className="field">
            <label htmlFor="cust-edit-name">
              Nama <span className="req">*</span>
            </label>
            <input
              id="cust-edit-name"
              value={name}
              maxLength={150}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="cust-edit-wa">
              Nomor WA <span className="req">*</span>
            </label>
            <input
              id="cust-edit-wa"
              value={whatsapp}
              maxLength={32}
              inputMode="numeric"
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="cust-edit-address">
            Alamat <span className="mini">(opsional)</span>
          </label>
          <textarea
            id="cust-edit-address"
            rows={2}
            maxLength={255}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="cust-edit-label">Label Customer</label>
          <select id="cust-edit-label" value={label} onChange={(e) => setLabel(e.target.value)}>
            <option value="">pilih label{'\u2026'}</option>
            {labels.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-foot" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn" disabled={saving} onClick={() => void submit()}>
            {saving ? 'Menyimpan\u2026' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
