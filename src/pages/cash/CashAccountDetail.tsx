import { useState } from 'react';
import {
  createAccountingAccount,
  deleteAccountingAccount,
  updateAccountingAccount,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import type { AccountingAccount } from '../../types/accounting';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

type Props = {
  account: AccountingAccount | null;
  onClose: () => void;
  onDone: (message: string) => void;
};

export default function CashAccountModal({ account, onClose, onDone }: Props) {
  const editing = account !== null;

  const [name, setName] = useState(account?.name ?? '');
  const [description, setDescription] = useState(account?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Nama akun wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (account) {
        await updateAccountingAccount(account.id, {
          name: trimmed,
          description: description.trim() || null,
        });
        onDone('Akun diperbarui.');
      } else {
        await createAccountingAccount({
          name: trimmed,
          description: description.trim() || null,
          is_cash_account: true,
          is_active: true,
        });
        onDone('Akun ditambahkan.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan akun kas / bank'));
    } finally {
      setSaving(false);
    }
  }

  async function setActive(value: boolean) {
    if (!account) return;

    setSaving(true);
    setError(null);
    try {
      await updateAccountingAccount(account.id, { is_active: value });
      onDone(value ? 'Akun dipulihkan.' : 'Akun diarsipkan.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status akun'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!account) return;
    if (!window.confirm(`Hapus akun ${account.name}?`)) return;

    setSaving(true);
    setError(null);
    try {
      await deleteAccountingAccount(account.id);
      onDone('Akun dihapus.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus akun kas / bank'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? 'Edit Akun Kas / Bank' : 'Tambah Akun Kas / Bank'}
    >
      <div className="box">
        <div className="modal-head">
          <h3>{editing ? 'Edit Akun Kas / Bank' : 'Tambah Akun Kas / Bank'}</h3>
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
          <label htmlFor="kas-name">Nama Akun</label>
          <input
            id="kas-name"
            value={name}
            maxLength={150}
            placeholder="mis. Kas Tunai / BCA Salve"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="kas-desc">Keterangan (opsional)</label>
          <textarea
            id="kas-desc"
            rows={2}
            maxLength={500}
            value={description}
            placeholder="deskripsi singkat"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-foot">
          {editing && account ? (
            <>
              <button
                type="button"
                className="btn ghost sm"
                disabled={saving}
                onClick={() => void setActive(!account.is_active)}
              >
                {account.is_active ? <IconArchive /> : <IconUnarchive />}
                {account.is_active ? 'Arsipkan' : 'Pulihkan'}
              </button>
              <button type="button" className="btn danger sm" disabled={saving} onClick={() => void remove()}>
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
