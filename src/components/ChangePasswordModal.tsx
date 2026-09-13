import { useState } from 'react';
import { apiChangePassword, getErrorMessage } from '../api/client';
import { PASSWORD_HINT, passwordError } from '../utils/password';

type Props = {
  onClose: () => void;
  onDone: (message: string) => void;
};

export default function ChangePasswordModal({ onClose, onDone }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!currentPassword.trim()) {
      setError('Password saat ini wajib diisi.');
      return;
    }

    const invalid = passwordError(newPassword);
    if (invalid) {
      setError(invalid);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await apiChangePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      onDone('Password berhasil diubah.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah password'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label="Ubah Password">
      <div className="box">
        <div className="modal-head">
          <h3>Ubah Password</h3>
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
          <label htmlFor="cp-current">Password Saat Ini</label>
          <input
            id="cp-current"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="cp-new">
            Password Baru{' '}
            <span style={{ color: 'var(--blue)', fontWeight: 600 }}>
              ({PASSWORD_HINT})
            </span>
          </label>
          <input
            id="cp-new"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="cp-confirm">Konfirmasi Password Baru</label>
          <input
            id="cp-confirm"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="modal-foot">
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 'auto' }}
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
