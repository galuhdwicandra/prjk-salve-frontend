import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAccountingJournal,
  postAccountingJournal,
  voidAccountingJournal,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import type { AccountingJournalEntry } from '../../types/accounting';

function money(value: string | number | null | undefined): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function shortDate(value?: string | null): string {
  if (!value) return '-';

  return String(value).slice(0, 10);
}

export default function JournalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journal, setJournal] = useState<AccountingJournalEntry | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!id) return;

    setLoading(true);

    try {
      const res = await getAccountingJournal(id);
      setJournal(res.data);
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal memuat jurnal.'));
      navigate('/accounting/journals');
    } finally {
      setLoading(false);
    }
  }

  async function postJournal() {
    if (!journal) return;

    if (!confirm(`Posting jurnal ${journal.journal_no}?`)) {
      return;
    }

    try {
      await postAccountingJournal(journal.id);
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal posting jurnal.'));
    }
  }

  async function voidJournal() {
    if (!journal) return;

    const reason = prompt(`Alasan void jurnal ${journal.journal_no}:`);

    if (!reason || !reason.trim()) {
      return;
    }

    try {
      await voidAccountingJournal(journal.id, reason.trim());
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal void jurnal.'));
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !journal) {
    return (
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6">
        Memuat jurnal...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{journal.journal_no}</h1>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Detail jurnal umum dan baris debit-kredit.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/accounting/journals" className="btn-outline">
            Kembali
          </Link>

          {journal.status === 'DRAFT' && journal.source_type === 'manual' ? (
            <Link to={`/accounting/journals/${journal.id}/edit`} className="btn-outline">
              Edit
            </Link>
          ) : null}

          {journal.status === 'DRAFT' ? (
            <button type="button" onClick={postJournal} className="btn-primary">
              Post
            </button>
          ) : null}

          {journal.status !== 'VOID' ? (
            <button type="button" onClick={voidJournal} className="btn-outline text-red-600">
              Void
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 md:grid-cols-4">
        <div>
          <div className="text-xs text-[color:var(--color-text-muted)]">Tanggal</div>
          <div className="font-semibold">{shortDate(journal.journal_date)}</div>
        </div>

        <div>
          <div className="text-xs text-[color:var(--color-text-muted)]">Cabang</div>
          <div className="font-semibold">{journal.branch?.name ?? '-'}</div>
        </div>

        <div>
          <div className="text-xs text-[color:var(--color-text-muted)]">Sumber</div>
          <div className="font-semibold">{journal.source_type ?? '-'}</div>
        </div>

        <div>
          <div className="text-xs text-[color:var(--color-text-muted)]">Status</div>
          <div className="font-semibold">{journal.status}</div>
        </div>

        <div className="md:col-span-4">
          <div className="text-xs text-[color:var(--color-text-muted)]">Deskripsi</div>
          <div className="font-semibold">{journal.description ?? '-'}</div>
        </div>

        {journal.void_reason ? (
          <div className="md:col-span-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Alasan void: {journal.void_reason}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-black/[0.03] text-left text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Akun</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3 text-right">Debit</th>
                <th className="px-4 py-3 text-right">Kredit</th>
              </tr>
            </thead>

            <tbody>
              {(journal.lines ?? []).map((line) => (
                <tr key={line.id} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    {line.account ? `${line.account.code} - ${line.account.name}` : line.account_id}
                  </td>
                  <td className="px-4 py-3">{line.description ?? '-'}</td>
                  <td className="px-4 py-3 text-right">{money(line.debit)}</td>
                  <td className="px-4 py-3 text-right">{money(line.credit)}</td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-black/[0.02] font-semibold">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-right">
                  Total
                </td>
                <td className="px-4 py-3 text-right">{money(journal.total_debit)}</td>
                <td className="px-4 py-3 text-right">{money(journal.total_credit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}