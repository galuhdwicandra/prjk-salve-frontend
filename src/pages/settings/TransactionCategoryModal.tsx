import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { listAccountingAccounts } from '../../api/accounting';
import type { AccountingAccount } from '../../types/accounting';
import {
  createTransactionCategory,
  deleteTransactionCategory,
  updateTransactionCategory,
} from '../../api/transactionCategories';
import { CASHFLOW_LABEL } from '../../types/transaction-categories';
import type { CashflowCriteria, TransactionCategory } from '../../types/transaction-categories';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

type Props = {
  category: TransactionCategory | null;
  onClose: () => void;
  onDone: (message: string) => void;
};

const CASHFLOW_OPTIONS: CashflowCriteria[] = ['OPERATING', 'INVESTING', 'FINANCING'];

export default function TransactionCategoryModal({ category, onClose, onDone }: Props) {
  const editing = Boolean(category);

  const [name, setName] = useState(category?.name ?? '');
  const [cashIn, setCashIn] = useState(category?.cash_in ?? false);
  const [cashOut, setCashOut] = useState(category?.cash_out ?? false);
  const [cashflow, setCashflow] = useState<CashflowCriteria>(category?.cashflow ?? 'OPERATING');
  const [inAccountId, setInAccountId] = useState(category?.in_account_id ?? '');
  const [outAccountId, setOutAccountId] = useState(category?.out_account_id ?? '');
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [description, setDescription] = useState(category?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listAccountingAccounts({ is_active: true, per_page: 300 })
      .then((res) => setAccounts((Array.isArray(res.data) ? res.data : []).filter((row) => !row.is_cash_account)))
      .catch(() => setAccounts([]));
  }, []);

  async function submit() {
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    if (!cashIn && !cashOut) {
      setError('Pilih minimal satu jenis: Cash In atau Cash Out.');
      return;
    }

    const payload = {
      name: trimmed,
      cash_in: cashIn,
      cash_out: cashOut,
      cashflow,
      in_account_id: cashIn ? inAccountId || null : null,
      out_account_id: cashOut ? outAccountId || null : null,
      description: description.trim() || null,
    };

    setSaving(true);
    setError(null);
    try {
      if (category) {
        await updateTransactionCategory(category.id, payload);
        onDone('Kategori transaksi diperbarui.');
      } else {
        await createTransactionCategory(payload);
        onDone('Kategori transaksi ditambahkan.');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan kategori transaksi'));
    } finally {
      setSaving(false);
    }
  }

  async function setActive(value: boolean) {
    if (!category) return;

    setSaving(true);
    setError(null);
    try {
      await updateTransactionCategory(category.id, { is_active: value });
      onDone(value ? 'Kategori dipulihkan.' : 'Kategori diarsipkan.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status kategori'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!category) return;
    if (!window.confirm(`Hapus kategori ${category.name}?`)) return;

    setSaving(true);
    setError(null);
    try {
      await deleteTransactionCategory(category.id);
      onDone('Kategori transaksi dihapus.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus kategori transaksi'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? 'Edit Kategori Transaksi' : 'Tambah Kategori Transaksi'}
    >
      <div className="box">
        <div className="modal-head">
          <h3>{editing ? 'Edit Kategori Transaksi' : 'Tambah Kategori Transaksi'}</h3>
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
          <label htmlFor="tc-name">Nama Kategori</label>
          <input
            id="tc-name"
            value={name}
            maxLength={100}
            placeholder="mis. Pendapatan Lain-lain"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>
            Jenis{' '}
            <span style={{ color: 'var(--blue)', fontWeight: 600 }}>
              (bisa lebih dari satu {'\u2014'} menentukan di menu mana kategori muncul)
            </span>
          </label>
          <div className="toolbar">
            <button
              type="button"
              className={cashIn ? 'btn ghost sm on' : 'btn ghost sm'}
              aria-pressed={cashIn}
              onClick={() => setCashIn((prev) => !prev)}
            >
              Cash In
            </button>
            <button
              type="button"
              className={cashOut ? 'btn ghost sm on' : 'btn ghost sm'}
              aria-pressed={cashOut}
              onClick={() => setCashOut((prev) => !prev)}
            >
              Cash Out
            </button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="tc-cashflow">
            Cashflow Criteria{' '}
            <span style={{ color: 'var(--blue)', fontWeight: 600 }}>(klasifikasi di laporan arus kas)</span>
          </label>
          <select
            id="tc-cashflow"
            value={cashflow}
            onChange={(e) => setCashflow(e.target.value as CashflowCriteria)}
          >
            {CASHFLOW_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {CASHFLOW_LABEL[option]}
              </option>
            ))}
          </select>
        </div>

        {cashIn ? (
          <div className="field">
            <label htmlFor="tc-in-acc">
              Akun Pendapatan (saat Uang Masuk){' '}
              <span style={{ color: 'var(--blue)', fontWeight: 600 }}>(opsional)</span>
            </label>
            <select id="tc-in-acc" value={inAccountId} onChange={(e) => setInAccountId(e.target.value)}>
              <option value="">Otomatis {'\u2014'} Pendapatan Lain-lain</option>
              {accounts.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.code} {'\u00b7'} {row.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {cashOut ? (
          <div className="field">
            <label htmlFor="tc-out-acc">
              Akun Beban (saat Uang Keluar){' '}
              <span style={{ color: 'var(--blue)', fontWeight: 600 }}>(opsional)</span>
            </label>
            <select id="tc-out-acc" value={outAccountId} onChange={(e) => setOutAccountId(e.target.value)}>
              <option value="">Otomatis {'\u2014'} Beban Lain-lain</option>
              {accounts.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.code} {'\u00b7'} {row.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="tc-desc">Keterangan (opsional)</label>
          <textarea
            id="tc-desc"
            rows={2}
            maxLength={200}
            value={description}
            placeholder="deskripsi singkat"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-foot">
          {editing && category ? (
            <>
              <button
                type="button"
                className="btn ghost sm"
                disabled={saving}
                onClick={() => void setActive(!category.is_active)}
              >
                {category.is_active ? <IconArchive /> : <IconUnarchive />}
                {category.is_active ? 'Arsipkan' : 'Pulihkan'}
              </button>
              <button
                type="button"
                className="btn danger sm"
                disabled={saving || category.is_default}
                title={category.is_default ? 'Kategori bawaan tidak bisa dihapus' : undefined}
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
