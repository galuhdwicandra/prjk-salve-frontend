import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { listAccountingAccounts, updateAccountingAccount } from '../../api/accounting';
import { listServices } from '../../api/services';
import {
  listTransactionCategories,
  setDefaultTransactionCategory,
} from '../../api/transactionCategories';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useShowBalance } from '../../store/useAuth';
import type { AccountingAccount, AccountingAccountType } from '../../types/accounting';
import type { Service } from '../../types/services';
import type { TransactionCategory } from '../../types/transaction-categories';
import { toIDR } from '../../utils/money';

const DEFAULT_ACCOUNT_CODES = ['1040', '2010', '4090'];

const ACCOUNT_TYPE_LABEL: Record<AccountingAccountType, string> = {
  ASSET: 'Aset',
  LIABILITY: 'Kewajiban',
  EQUITY: 'Ekuitas',
  REVENUE: 'Pendapatan',
  EXPENSE: 'Beban',
};

function typeLabel(account: AccountingAccount): string {
  if (account.type === 'REVENUE' && account.normal_balance === 'DEBIT') {
    return 'Kontra-Pendapatan';
  }

  return ACCOUNT_TYPE_LABEL[account.type];
}

function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function JournalCoaPage() {
  const showBalance = useShowBalance();
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [products, setProducts] = useState<Service[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AccountingAccount | null>(null);
  const [draftName, setDraftName] = useState('');
  const [saving, setSaving] = useState(false);

  const { toast, showSuccess, showError, hideToast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accountRes, serviceRes, categoryRes] = await Promise.all([
        listAccountingAccounts({ is_active: true, per_page: 300 }),
        listServices({ root: true, is_active: true, per_page: 200 }),
        listTransactionCategories({ cash_out: true, is_active: true }),
      ]);

      setAccounts(accountRes.data ?? []);
      setProducts(serviceRes.data ?? []);
      setCategories(categoryRes.data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat COA & mapping jurnal'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const defaultAccounts = useMemo(
    () =>
      DEFAULT_ACCOUNT_CODES.map((code) =>
        accounts.find((row) => row.branch_id === null && row.code === code),
      ).filter((row): row is AccountingAccount => Boolean(row)),
    [accounts],
  );

  const adminCategoryId = useMemo(
    () => categories.find((row) => row.is_default)?.id ?? '',
    [categories],
  );

  async function saveName() {
    if (!editing) return;

    const trimmed = draftName.trim();

    if (!trimmed) {
      showError('Nama wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      await updateAccountingAccount(editing.id, { name: trimmed });
      setEditing(null);
      showSuccess('Nama akun diperbarui.');
      await refresh();
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal menyimpan nama akun'));
    } finally {
      setSaving(false);
    }
  }

  async function changeAdminCategory(id: string) {
    if (!id || id === adminCategoryId) return;

    try {
      await setDefaultTransactionCategory(id);
      showSuccess('Mapping disimpan.');
      await refresh();
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal menyimpan mapping'));
    }
  }

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      {error ? (
        <div
          role="alert"
          style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}
        >
          {error}
        </div>
      ) : null}

      <div className="card">
        <div className="card-title">
          <span>Akun Jurnal Default</span>
          <span className="ct-note">
            akun sistem untuk jurnal otomatis {'\u2014'} tidak bisa dihapus
          </span>
        </div>

        <div className="tbl-wrap" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Akun</th>
                {showBalance ? <th className="num">Saldo</th> : null}
                <th>Tipe</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="empty">
                    <td colSpan={showBalance ? 5 : 4} className="empty"></td>
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : defaultAccounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty">
                    <td colSpan={showBalance ? 5 : 4} className="empty"></td>
                    Akun jurnal default belum tersedia. Jalankan seeder COA.
                  </td>
                </tr>
              ) : (
                defaultAccounts.map((account) => {
                  const balance = toNumber(account.balance);

                  return (
                    <tr key={account.id}>
                      <td data-label="Akun">
                        <b>{account.name}</b>
                      </td>
                      {showBalance ? (
                        <td
                          className="num"
                          data-label="Saldo"
                          style={balance < 0 ? { color: 'var(--danger)' } : undefined}
                        >
                          {toIDR(balance)}
                        </td>
                      ) : null}
                      <td data-label="Tipe">
                        <span className="tag">{typeLabel(account)}</span>
                      </td>
                      <td data-label="Status">
                        <span className="tag solid">terkunci</span>
                      </td>
                      <td className="num">
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => {
                            setEditing(account);
                            setDraftName(account.name);
                          }}
                        >
                          Ubah nama
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mini" style={{ marginTop: 8 }}>
          Kas/Bank tidak dibuat akun sendiri {'\u2014'} jurnal otomatis mengikuti akun kas/bank pada
          transaksi.
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>Pendapatan per Produk</span>
          <span className="ct-note">akun dibuat otomatis saat produk pertama kali terjual</span>
        </div>

        <div className="tbl-wrap" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Nama Akun (otomatis)</th>
                <th>Produk Induk</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={2} className="empty">
                    Belum ada produk induk.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td data-label="Nama Akun (otomatis)">
                      <b>Pendapatan {product.name}</b>
                    </td>
                    <td data-label="Produk Induk" className="mini">
                      {product.name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mini" style={{ marginTop: 8 }}>
          Daftar di atas adalah pratinjau; akun terbentuk saat transaksi penjualan pertama produk
          terkait.
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>Mapping Role Jurnal</span>
          <span className="ct-note">petakan role jurnal ke kategori / akun yang ada</span>
        </div>

        <div className="kv" style={{ marginTop: 12 }}>
          <div>Kas / Bank</div>
          <b>Otomatis {'\u2014'} mengikuti akun transaksi</b>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="jm-admin">
            Biaya Admin Transfer {'\u2192'} Kategori Uang Keluar
          </label>
          <select
            id="jm-admin"
            value={adminCategoryId}
            disabled={loading || categories.length === 0}
            onChange={(e) => void changeAdminCategory(e.target.value)}
          >
            {categories.length === 0 ? (
              <option value="">(belum ada kategori uang keluar)</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mini">
          Beban admin transfer tidak dibuat akun baru; dipetakan ke kategori uang keluar ini
          (default: <b>Biaya Admin</b>, kategori terkunci).
        </div>
      </div>

      {editing ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Ubah Nama Akun">
          <div className="box">
            <div className="modal-head">
              <h3>Ubah Nama Akun</h3>
              <button
                type="button"
                className="mclose"
                aria-label="Tutup"
                onClick={() => setEditing(null)}
              >
                {'\u2715'}
              </button>
            </div>

            <div className="field">
              <label htmlFor="ja-name">Nama Akun</label>
              <input
                id="ja-name"
                value={draftName}
                maxLength={150}
                onChange={(e) => setDraftName(e.target.value)}
              />
            </div>

            <div className="mini" style={{ marginBottom: 10 }}>
              Tipe: {typeLabel(editing)} {'\u00b7'} akun sistem (tidak bisa dihapus)
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn ghost"
                disabled={saving}
                onClick={() => setEditing(null)}
              >
                Batal
              </button>
              <span style={{ flex: 1 }} />
              <button type="button" className="btn" disabled={saving} onClick={() => void saveName()}>
                {saving ? 'Menyimpan\u2026' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
