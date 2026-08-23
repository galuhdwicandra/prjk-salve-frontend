import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listAccountingAccounts } from '../../api/accounting';
import {
  createCashTransaction,
  deleteCashTransaction,
  getCashTransaction,
  updateCashTransaction,
} from '../../api/cashTransactions';
import { getErrorMessage } from '../../api/client';
import { listContacts } from '../../api/contacts';
import { listTransactionCategories } from '../../api/transactionCategories';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useShowBalance } from '../../store/useAuth';
import { useActiveBranchId } from '../../store/useBranch';
import type { AccountingAccount } from '../../types/accounting';
import type { Contact } from '../../types/contacts';
import type { TransactionCategory } from '../../types/transaction-categories';
import { todayLocalYMD } from '../../utils/date';
import { rp } from '../../utils/money';
import Combo, { type ComboOption } from './Combo';
import ContactModal from '../contacts/ContactModal';

type Line = { key: string; categoryId: string; description: string; amount: number };

function newLine(): Line {
  return { key: crypto.randomUUID(), categoryId: '', description: '', amount: 0 };
}

function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function CashTransactionForm() {
  const params = useParams();
  const nav = useNavigate();
  const branchId = useActiveBranchId();
  const showBalance = useShowBalance();
  const { toast, showError, hideToast } = useToast();

  const editingId = params.id ?? null;
  const [kind, setKind] = useState<'IN' | 'OUT'>((params.kind ?? 'in').toUpperCase() === 'OUT' ? 'OUT' : 'IN');

  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [cashAccountId, setCashAccountId] = useState('');
  const [contactId, setContactId] = useState('');
  const [trxDate, setTrxDate] = useState(todayLocalYMD());
  const [docNo, setDocNo] = useState('');
  const [lines, setLines] = useState<Line[]>([newLine()]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIn = kind === 'IN';
  const title = isIn ? 'Uang Masuk' : 'Uang Keluar';

  const loadContacts = useCallback(async () => {
    const res = await listContacts({ is_active: true, per_page: 200 });
    setContacts(res.data ?? []);
  }, []);

  useEffect(() => {
    void listAccountingAccounts({ is_cash_account: true, is_active: true, branch_id: branchId || undefined, per_page: 200 })
      .then((res) => setAccounts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAccounts([]));

    void loadContacts().catch(() => setContacts([]));
  }, [branchId, loadContacts]);

  useEffect(() => {
    void listTransactionCategories({ is_active: true, ...(isIn ? { cash_in: true } : { cash_out: true }) })
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
  }, [isIn]);

  useEffect(() => {
    if (!editingId) return;

    void getCashTransaction(editingId)
      .then((res) => {
        const row = res.data;
        if (!row) return;

        setKind(row.kind === 'OUT' ? 'OUT' : 'IN');
        setCashAccountId(row.cash_account_id);
        setContactId(row.contact_id ?? '');
        setTrxDate(row.trx_date.slice(0, 10));
        setDocNo(row.no);
        setLines(
          (row.lines ?? []).map((line) => ({
            key: line.id,
            categoryId: line.transaction_category_id,
            description: line.description ?? '',
            amount: toNumber(line.amount),
          })),
        );
      })
      .catch((err) => setError(getErrorMessage(err, 'Gagal memuat transaksi')));
  }, [editingId]);

  const accountOptions = useMemo<ComboOption[]>(
    () => accounts.map((row) => ({ value: row.id, label: row.name, hint: row.code })),
    [accounts],
  );

  const categoryOptions = useMemo<ComboOption[]>(
    () => categories.map((row) => ({ value: row.id, label: row.name, hint: row.description ?? undefined })),
    [categories],
  );

  const contactOptions = useMemo<ComboOption[]>(
    () =>
      contacts.map((row) => ({
        value: row.id,
        label: `${row.code ? `[${row.code}] ` : ''}${row.name}`,
        hint: row.phone ?? undefined,
      })),
    [contacts],
  );

  const total = useMemo(() => lines.reduce((sum, line) => sum + line.amount, 0), [lines]);
  const currentBalance = toNumber(accounts.find((row) => row.id === cashAccountId)?.balance);

  function patchLine(key: string, patch: Partial<Line>) {
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, ...patch } : line)));
  }

  async function submit() {
    if (!cashAccountId) {
      setError('Akun kas/bank wajib dipilih.');
      return;
    }

    const payloadLines = lines
      .filter((line) => line.categoryId && line.amount > 0)
      .map((line) => ({
        transaction_category_id: line.categoryId,
        description: line.description.trim() || null,
        amount: line.amount,
      }));

    if (payloadLines.length === 0) {
      setError('Minimal satu baris dengan kategori dan nominal wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        branch_id: branchId || null,
        kind,
        trx_date: trxDate,
        cash_account_id: cashAccountId,
        contact_id: contactId || null,
        description: null,
        lines: payloadLines,
        attachment,
      };

      if (editingId) {
        await updateCashTransaction(editingId, payload);
      } else {
        await createCashTransaction(payload);
      }

      nav('/transactions');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan transaksi'));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!editingId) return;
    if (!window.confirm(`Hapus transaksi ${docNo}?`)) return;

    setSaving(true);
    try {
      await deleteCashTransaction(editingId);
      nav('/transactions');
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal menghapus transaksi'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      <div className="card">
        <div className="modal-head" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" className="kebab-btn" aria-label="Kembali" onClick={() => nav('/transactions')}>
              {'\u2190'}
            </button>
            <div>
              <div className="trx-lh">Transaksi</div>
              <h3>{title}</h3>
            </div>
          </div>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className={isIn ? 'trx-head in' : 'trx-head out'}>
          <div style={{ flex: 1, maxWidth: 520 }}>
            <label className="trx-lh" htmlFor="trx-acc">
              {isIn ? 'Masuk ke (Kas / Bank)' : 'Keluar dari (Kas / Bank)'}
            </label>
            <Combo
              value={cashAccountId}
              options={accountOptions}
              placeholder="cari akun kas/bank\u2026"
              onChange={setCashAccountId}
            />
            {showBalance ? (
              <div className="mini" style={{ marginTop: 6 }}>
                Saldo saat ini: {cashAccountId ? rp(currentBalance) : '\u2014'}
              </div>
            ) : null}
          </div>

          <div>
            <div className="trx-lh">Total</div>
            <div className="trx-total">{rp(total)}</div>
          </div>
        </div>

        <div className="grid2">
          <div className="field">
            <label>{isIn ? 'Payer (kontak)' : 'Payee (kontak)'}</label>
            <Combo
              value={contactId}
              options={contactOptions}
              placeholder="cari kontak\u2026"
              addLabel="+ Kontak baru"
              onAdd={() => setContactModal(true)}
              onChange={setContactId}
            />
          </div>

          <div className="field">
            <label htmlFor="trx-date">Tanggal</label>
            <input id="trx-date" type="date" value={trxDate} onChange={(e) => setTrxDate(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="trx-no">No. Transaksi</label>
            <input id="trx-no" value={docNo} readOnly placeholder="(otomatis saat simpan)" />
          </div>
        </div>

        <div className="trx-lines">
          <div className="trx-line">
            <span className="trx-lh">{isIn ? 'Diterima Dari' : 'Dibayar Ke'}</span>
            <span className="trx-lh">Deskripsi</span>
            <span className="trx-lh" style={{ textAlign: 'right' }}>
              Nominal
            </span>
            <span />
          </div>

          {lines.map((line) => (
            <div className="trx-line" key={line.key}>
              <Combo
                value={line.categoryId}
                options={categoryOptions}
                placeholder="cari akun\u2026"
                onChange={(value) => patchLine(line.key, { categoryId: value })}
              />

              <input
                value={line.description}
                maxLength={200}
                placeholder="deskripsi"
                onChange={(e) => patchLine(line.key, { description: e.target.value })}
              />

              <input
                inputMode="numeric"
                style={{ textAlign: 'right' }}
                value={line.amount.toLocaleString('id-ID')}
                onChange={(e) => patchLine(line.key, { amount: Number(e.target.value.replace(/\D/g, '')) || 0 })}
              />

              <button
                type="button"
                className="kebab-btn"
                aria-label="Hapus baris"
                disabled={lines.length <= 1}
                onClick={() => setLines((prev) => prev.filter((row) => row.key !== line.key))}
              >
                {'\u2212'}
              </button>
            </div>
          ))}

          <button type="button" className="btn ghost sm" onClick={() => setLines((prev) => [...prev, newLine()])}>
            <span>+ Add More Data</span>
          </button>
        </div>

        <div className="grid2">
          <div className="field">
            <label htmlFor="trx-file">Lampiran</label>
            <label className="trx-drop" htmlFor="trx-file">
              <b>{attachment ? attachment.name : 'Tarik & lepas file'}</b>
              <small>atau klik untuk pilih (jpg/png/pdf, max 10MB/file)</small>
            </label>
            <input
              id="trx-file"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              hidden
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </div>

          <div>
            <div className="trx-sum">
              <span>SubTotal</span>
              <span>{rp(total)}</span>
            </div>
            <div className="trx-sum total">
              <span>Total</span>
              <span>{rp(total)}</span>
            </div>
          </div>
        </div>

        <div className="modal-foot" style={{ justifyContent: 'flex-end' }}>
          {editingId ? (
            <button type="button" className="btn danger sm" style={{ marginRight: 'auto' }} disabled={saving} onClick={() => void remove()}>
              Hapus
            </button>
          ) : null}

          <button type="button" className="btn ghost" disabled={saving} onClick={() => nav('/transactions')}>
            Batal
          </button>

          <button type="button" className={isIn ? 'btn' : 'btn orange'} disabled={saving} onClick={() => void submit()}>
            {saving ? 'Menyimpan\u2026' : 'Simpan'}
          </button>
        </div>
      </div>

      {contactModal ? (
        <ContactModal
          contact={null}
          onClose={() => setContactModal(false)}
           onSaved={(contact) => {
            setContactModal(false);
            setContacts((prev) => [contact, ...prev]);
            setContactId(contact.id);
          }}
        />
      ) : null}
    </>
  );
}
