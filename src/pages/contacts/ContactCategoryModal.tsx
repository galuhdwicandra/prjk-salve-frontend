import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
  createContactCategory,
  deleteContactCategory,
  listContactCategories,
  updateContactCategory,
} from '../../api/contactCategories';
import type { ContactCategory } from '../../types/contacts';
import { IconCheck, IconTrash } from '../users/icons';

type Props = {
  onClose: () => void;
  onChanged: () => void;
};

export default function ContactCategoryModal({ onClose, onChanged }: Props) {
  const [items, setItems] = useState<ContactCategory[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      const res = await listContactCategories();
      setItems(res.data ?? []);
      setDrafts({});
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat kategori kontak'));
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      await refresh();
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan kategori'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label="Kategori Kontak">
      <div className="box">
        <div className="modal-head">
          <h3>Kategori Kontak</h3>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="cc-new">Kategori Baru</label>
          <div className="row">
            <input
              id="cc-new"
              value={newName}
              maxLength={100}
              placeholder="mis. Subcon, Karyawan"
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              type="button"
              className="btn sm"
              disabled={busy || !newName.trim()}
              onClick={() =>
                void run(async () => {
                  await createContactCategory({ name: newName.trim() });
                  setNewName('');
                })
              }
            >
              Tambah
            </button>
          </div>
        </div>

        {items.map((row) => {
          const value = drafts[row.id] ?? row.name;
          const dirty = value.trim() !== '' && value.trim() !== row.name;

          return (
            <div className="row" key={row.id} style={{ marginBottom: 8 }}>
              <input
                value={value}
                maxLength={100}
                aria-label={`Nama kategori ${row.name}`}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))}
              />
              <button
                type="button"
                className="btn ghost sm"
                disabled={busy || !dirty}
                aria-label={`Simpan ${row.name}`}
                onClick={() => void run(() => updateContactCategory(row.id, { name: value.trim() }))}
              >
                <IconCheck />
              </button>
              <button
                type="button"
                className="btn danger sm"
                disabled={busy}
                aria-label={`Hapus ${row.name}`}
                onClick={() => {
                  if (window.confirm(`Hapus kategori ${row.name}?`)) void run(() => deleteContactCategory(row.id));
                }}
              >
                <IconTrash />
              </button>
            </div>
          );
        })}

        {items.length === 0 ? <div className="empty">Belum ada kategori.</div> : null}
      </div>
    </div>
  );
}
