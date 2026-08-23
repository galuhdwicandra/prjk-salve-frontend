import { useMemo, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
  createPaymentMethod,
  deletePaymentMethod,
  setPaymentMethodAccount,
  updatePaymentMethod,
} from '../../api/paymentMethods';
import type { AccountingAccount } from '../../types/accounting';
import type { Branch } from '../../types/branches';
import type { PaymentMethodMaster } from '../../types/payments';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

type Props = {
  method: PaymentMethodMaster | null;
  branches: Branch[];
  accounts: AccountingAccount[];
  onClose: () => void;
  onDone: (message: string) => void;
};

function initialMapping(
  method: PaymentMethodMaster | null,
  branches: Branch[],
): Record<string, string> {
  const result: Record<string, string> = {};

  branches.forEach((branch) => {
    const found = (method?.accounts ?? []).find((item) => item.branch_id === branch.id);
    result[branch.id] = found?.account_id ?? '';
  });

  return result;
}

export default function PaymentMethodModal({
  method,
  branches,
  accounts,
  onClose,
  onDone,
}: Props) {
  const editing = Boolean(method);
  const saved = useMemo(() => initialMapping(method, branches), [method, branches]);

  const [name, setName] = useState(method?.name ?? '');
  const [mapping, setMapping] = useState<Record<string, string>>(saved);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function optionsFor(branchId: string): AccountingAccount[] {
    return accounts.filter(
      (account) => account.branch_id === null || account.branch_id === branchId,
    );
  }

  async function syncMapping(id: string) {
    for (const branch of branches) {
      const next = mapping[branch.id] ?? '';
      if (next === (saved[branch.id] ?? '')) continue;
      await setPaymentMethodAccount(id, { branch_id: branch.id, account_id: next || null });
    }
  }

  async function submit() {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Nama metode wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (method) {
        await updatePaymentMethod(method.id, { name: trimmed });
        await syncMapping(method.id);
        onDone('Metode pembayaran diperbarui.');
      } else {
        const res = await createPaymentMethod({ name: trimmed });
        await syncMapping(res.data.id);
        onDone('Metode pembayaran ditambahkan.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan metode pembayaran'));
    } finally {
      setSaving(false);
    }
  }

  async function setActive(value: boolean) {
    if (!method) return;

    setSaving(true);
    setError(null);
    try {
      await updatePaymentMethod(method.id, { is_active: value });
      onDone(value ? 'Metode pembayaran dipulihkan.' : 'Metode pembayaran diarsipkan.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status metode pembayaran'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!method) return;
    if (!window.confirm(`Hapus metode pembayaran ${method.name}?`)) return;

    setSaving(true);
    setError(null);
    try {
      await deletePaymentMethod(method.id);
      onDone('Metode pembayaran dihapus.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus metode pembayaran'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
    >
      <div className="box">
        <div className="modal-head">
          <h3>{editing ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}</h3>
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
          <label htmlFor="pm-name">Nama Metode</label>
          <input
            id="pm-name"
            value={name}
            maxLength={100}
            placeholder="mis. QRIS, Transfer BCA, Tunai"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mini" style={{ margin: '10px 0 8px' }}>
          Uang masuk ke akun {'\u2014'} per cabang{' '}
          <span style={{ color: 'var(--blue)' }}>(kas tunai tiap cabang biasanya beda)</span>
        </div>

        {branches.map((branch) => (
          <div className="field" key={branch.id}>
            <label htmlFor={`pm-acc-${branch.id}`}>
              {branch.name} <span className="tag">{branch.code}</span>
            </label>
            <select
              id={`pm-acc-${branch.id}`}
              value={mapping[branch.id] ?? ''}
              onChange={(e) => setMapping((prev) => ({ ...prev, [branch.id]: e.target.value }))}
            >
              <option value="">pilih akun kas/bank{'\u2026'}</option>
              {optionsFor(branch.id).map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="modal-foot">
          {editing && method ? (
            <>
              <button
                type="button"
                className="btn ghost sm"
                disabled={saving}
                onClick={() => void setActive(!method.is_active)}
              >
                {method.is_active ? <IconArchive /> : <IconUnarchive />}
                {method.is_active ? 'Arsipkan' : 'Pulihkan'}
              </button>
              <button
                type="button"
                className="btn danger sm"
                disabled={saving}
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
