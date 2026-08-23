import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { createContactCategory, listContactCategories } from '../../api/contactCategories';
import { createContact, deleteContact, updateContact } from '../../api/contacts';
import type { Contact, ContactCategory } from '../../types/contacts';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

type Props = {
  contact: Contact | null;
  onClose: () => void;
  onSaved: (contact: Contact, message: string) => void;
  onRemoved?: (message: string) => void;
};

export default function ContactModal({ contact, onClose, onSaved, onRemoved }: Props) {
  const editing = contact !== null;

  const [name, setName] = useState(contact?.name ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [address, setAddress] = useState(contact?.address ?? '');
  const [categories, setCategories] = useState<ContactCategory[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>((contact?.categories ?? []).map((row) => row.id));
  const [draftCategory, setDraftCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listContactCategories()
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]));
  }

  async function addCategory() {
    const trimmed = (draftCategory ?? '').trim();

    if (!trimmed) {
      setDraftCategory(null);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await createContactCategory({ name: trimmed });
      setCategories((prev) => [...prev, res.data]);
      setCategoryIds((prev) => [...prev, res.data.id]);
      setDraftCategory(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menambah kategori'));
    } finally {
      setSaving(false);
    }
  }

  async function submit() {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Nama kontak wajib diisi.');
      return;
    }

    const payload = {
      name: trimmed,
      phone: phone.trim() || null,
      address: address.trim() || null,
      category_ids: categoryIds,
    };

    setSaving(true);
    setError(null);
    try {
      if (contact) {
        const res = await updateContact(contact.id, payload);
        onSaved(res.data, 'Kontak diperbarui.');
      } else {
        const res = await createContact(payload);
        onSaved(res.data, 'Kontak ditambahkan.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan kontak'));
    } finally {
      setSaving(false);
    }
  }

  async function setActive(value: boolean) {
    if (!contact) return;

    setSaving(true);
    setError(null);
    try {
      const res = await updateContact(contact.id, { is_active: value });
      onSaved(res.data, value ? 'Kontak dipulihkan.' : 'Kontak diarsipkan.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status kontak'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!contact) return;
    if (!window.confirm(`Hapus kontak ${contact.name}?`)) return;

    setSaving(true);
    setError(null);
    try {
      await deleteContact(contact.id);
      onRemoved?.('Kontak dihapus.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus kontak'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label={editing ? 'Edit Kontak' : 'Tambah Kontak'}>
      <div className="box lg">
        <div className="modal-head">
          <h3>{editing ? 'Edit Kontak' : 'Tambah Kontak'}</h3>
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
            <label htmlFor="ct-name">
              Nama <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              id="ct-name"
              value={name}
              maxLength={150}
              placeholder="nama kontak"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="ct-phone">Nomor Telepon (opsional)</label>
            <input
              id="ct-phone"
              value={phone}
              maxLength={32}
              placeholder="08xxxxxxxxxx"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="ct-code">Vendor ID</label>
          <input id="ct-code" value={contact?.code ?? ''} placeholder="(otomatis saat simpan)" readOnly disabled />
        </div>

        <div className="field">
          <label>
            Kategori <span style={{ color: 'var(--blue)', fontWeight: 600 }}>(bisa lebih dari satu)</span>
          </label>
          <div className="toolbar">
            {categories.map((row) => (
              <button
                key={row.id}
                type="button"
                className={categoryIds.includes(row.id) ? 'btn ghost sm on' : 'btn ghost sm'}
                aria-pressed={categoryIds.includes(row.id)}
                onClick={() => toggleCategory(row.id)}
              >
                {row.name}
              </button>
            ))}

            {draftCategory === null ? (
              <button type="button" className="btn ghost sm" onClick={() => setDraftCategory('')}>
                + Tambah Kategori
              </button>
            ) : (
              <input
                autoFocus
                value={draftCategory}
                maxLength={100}
                placeholder="nama kategori"
                style={{ maxWidth: 200 }}
                onChange={(e) => setDraftCategory(e.target.value)}
                onBlur={() => void addCategory()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                  if (e.key === 'Escape') setDraftCategory(null);
                }}
              />
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="ct-addr">Alamat (opsional)</label>
          <textarea
            id="ct-addr"
            rows={2}
            value={address}
            placeholder="alamat lengkap"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="modal-foot">
          {editing && contact ? (
            <>
              <button
                type="button"
                className="btn ghost sm"
                disabled={saving}
                onClick={() => void setActive(!contact.is_active)}
              >
                {contact.is_active ? <IconArchive /> : <IconUnarchive />}
                {contact.is_active ? 'Arsipkan' : 'Pulihkan'}
              </button>
              <button type="button" className="btn danger sm" disabled={saving} onClick={() => void remove()}>
                <IconTrash />
                Hapus
              </button>
            </>
          ) : null}

          <button
            type="button"
            className="btn ghost"
            style={editing ? { marginLeft: 'auto' } : undefined}
            disabled={saving}
            onClick={onClose}
          >
            Batal
          </button>
          <button type="button" className="btn" disabled={saving} onClick={() => void submit()}>
            {saving ? 'Menyimpan\u2026' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
