import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createAccountingJournal,
  getAccountingJournal,
  listAccountingAccounts,
  updateAccountingJournal,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import type {
  AccountingAccount,
  AccountingJournalLinePayload,
  AccountingJournalPayload,
} from '../../types/accounting';

type JournalLineForm = AccountingJournalLinePayload & {
  row_id: string;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function newLine(): JournalLineForm {
  return {
    row_id: crypto.randomUUID(),
    account_id: '',
    description: '',
    debit: 0,
    credit: 0,
  };
}

const initialForm: AccountingJournalPayload = {
  branch_id: null,
  journal_date: today(),
  description: '',
  lines: [],
};

function money(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function JournalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<AccountingJournalPayload>(initialForm);
  const [lines, setLines] = useState<JournalLineForm[]>([newLine(), newLine()]);
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pageTitle = useMemo(() => (isEdit ? 'Edit Jurnal' : 'Tambah Jurnal'), [isEdit]);

  const totalDebit = useMemo(
    () => lines.reduce((sum, line) => sum + Number(line.debit || 0), 0),
    [lines]
  );

  const totalCredit = useMemo(
    () => lines.reduce((sum, line) => sum + Number(line.credit || 0), 0),
    [lines]
  );

  const isBalance = totalDebit > 0 && totalCredit > 0 && totalDebit === totalCredit;

  function setValue<K extends keyof AccountingJournalPayload>(key: K, value: AccountingJournalPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateLine<K extends keyof JournalLineForm>(rowId: string, key: K, value: JournalLineForm[K]) {
    setLines((prev) =>
      prev.map((line) => {
        if (line.row_id !== rowId) return line;

        const next = { ...line, [key]: value };

        if (key === 'debit' && Number(value || 0) > 0) {
          next.credit = 0;
        }

        if (key === 'credit' && Number(value || 0) > 0) {
          next.debit = 0;
        }

        return next;
      })
    );
  }

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLine(rowId: string) {
    setLines((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((line) => line.row_id !== rowId);
    });
  }

  async function loadOptions() {
    const res = await listAccountingAccounts({ per_page: 300, is_active: true });
    setAccounts(Array.isArray(res.data) ? res.data : []);
  }

  async function loadDetail(journalId: string) {
    setLoading(true);

    try {
      const res = await getAccountingJournal(journalId);
      const row = res.data;

      if (row.status !== 'DRAFT') {
        alert('Hanya jurnal DRAFT yang dapat diedit.');
        navigate(`/accounting/journals/${row.id}`);
        return;
      }

      if (row.source_type !== 'manual') {
        alert('Jurnal otomatis tidak boleh diedit manual.');
        navigate(`/accounting/journals/${row.id}`);
        return;
      }

      setForm({
        branch_id: row.branch_id,
        journal_date: String(row.journal_date).slice(0, 10),
        description: row.description ?? '',
        lines: [],
      });

      setLines(
        (row.lines ?? []).map((line) => ({
          row_id: crypto.randomUUID(),
          account_id: line.account_id,
          description: line.description ?? '',
          debit: Number(line.debit ?? 0),
          credit: Number(line.credit ?? 0),
        }))
      );
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal memuat jurnal.'));
      navigate('/accounting/journals');
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();

    const payload: AccountingJournalPayload = {
      ...form,
      lines: lines.map((line) => ({
        account_id: line.account_id,
        description: line.description || null,
        debit: Number(line.debit || 0),
        credit: Number(line.credit || 0),
      })),
    };

    if (!isBalance) {
      alert('Total debit harus sama dengan total kredit dan lebih dari nol.');
      return;
    }

    setSaving(true);

    try {
      if (isEdit && id) {
        await updateAccountingJournal(id, payload);
      } else {
        await createAccountingJournal(payload);
      }

      navigate('/accounting/journals');
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menyimpan jurnal.'));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void loadOptions();

    if (id) {
      void loadDetail(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
        Memuat jurnal...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Input jurnal manual dengan minimal dua baris dan total debit-kredit harus balance.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Tanggal Jurnal</span>
            <input
              type="date"
              value={form.journal_date}
              onChange={(e) => setValue('journal_date', e.target.value)}
              className="input"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Deskripsi</span>
            <input
              value={form.description ?? ''}
              onChange={(e) => setValue('description', e.target.value)}
              className="input"
              placeholder="Contoh: Penyesuaian saldo awal"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
          <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
            <div>
              <h2 className="font-semibold">Detail Debit Kredit</h2>
              <p className="text-xs text-[color:var(--color-text-muted)]">
                Satu baris hanya boleh berisi debit atau kredit.
              </p>
            </div>

            <button type="button" onClick={addLine} className="btn-outline">
              Tambah Baris
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-black/[0.03] text-left text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">
                <tr>
                  <th className="px-4 py-3">Akun</th>
                  <th className="px-4 py-3">Deskripsi Line</th>
                  <th className="px-4 py-3 text-right">Debit</th>
                  <th className="px-4 py-3 text-right">Kredit</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {lines.map((line) => (
                  <tr key={line.row_id} className="border-b border-[color:var(--color-border)] last:border-0">
                    <td className="px-4 py-3">
                      <select
                        value={line.account_id}
                        onChange={(e) => updateLine(line.row_id, 'account_id', e.target.value)}
                        className="input"
                        required
                      >
                        <option value="">Pilih akun</option>
                        {accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.code} - {account.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <input
                        value={line.description ?? ''}
                        onChange={(e) => updateLine(line.row_id, 'description', e.target.value)}
                        className="input"
                        placeholder="Opsional"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={line.debit ?? 0}
                        onChange={(e) => updateLine(line.row_id, 'debit', Number(e.target.value || 0))}
                        className="input text-right"
                        min={0}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={line.credit ?? 0}
                        onChange={(e) => updateLine(line.row_id, 'credit', Number(e.target.value || 0))}
                        className="input text-right"
                        min={0}
                      />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeLine(line.row_id)}
                        disabled={lines.length <= 2}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 disabled:opacity-40"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-black/[0.02] font-semibold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right">{money(totalDebit)}</td>
                  <td className="px-4 py-3 text-right">{money(totalCredit)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={isBalance ? 'text-green-700' : 'text-red-600'}>
                      {isBalance ? 'Balance' : 'Belum balance'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[color:var(--color-border)] pt-4">
          <Link to="/accounting/journals" className="btn-outline">
            Batal
          </Link>

          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
        </div>
      </form>
    </div>
  );
}