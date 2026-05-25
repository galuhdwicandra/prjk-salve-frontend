import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listAccountingJournals,
  postAccountingJournal,
  voidAccountingJournal,
} from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import type { AccountingJournalEntry, AccountingJournalStatus } from '../../types/accounting';

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

const STATUS_LABEL: Record<AccountingJournalStatus, string> = {
  DRAFT: 'Draft',
  POSTED: 'Posted',
  VOID: 'Void',
};

export default function JournalIndex() {
  const [rows, setRows] = useState<AccountingJournalEntry[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<AccountingJournalStatus | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const res = await listAccountingJournals({
        q: q || undefined,
        status,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        per_page: 100,
      });

      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat jurnal.'));
    } finally {
      setLoading(false);
    }
  }

  async function postJournal(row: AccountingJournalEntry) {
    if (!confirm(`Posting jurnal ${row.journal_no}? Setelah posted, jurnal tidak bisa diedit langsung.`)) {
      return;
    }

    try {
      await postAccountingJournal(row.id);
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal posting jurnal.'));
    }
  }

  async function voidJournal(row: AccountingJournalEntry) {
    const reason = prompt(`Alasan void jurnal ${row.journal_no}:`);

    if (!reason || !reason.trim()) {
      return;
    }

    try {
      await voidAccountingJournal(row.id, reason.trim());
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal void jurnal.'));
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jurnal Umum</h1>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Kelola jurnal manual, lihat jurnal otomatis, lalu lakukan posting atau void.
          </p>
        </div>

        <Link to="/accounting/journals/new" className="btn-primary">
          Tambah Jurnal
        </Link>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input md:col-span-2"
            placeholder="Cari no jurnal, referensi, deskripsi..."
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AccountingJournalStatus | '')}
            className="input"
          >
            <option value="">Semua Status</option>
            <option value="DRAFT">Draft</option>
            <option value="POSTED">Posted</option>
            <option value="VOID">Void</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input"
          />
        </div>

        <div className="mt-3 flex justify-end">
          <button type="button" onClick={load} disabled={loading} className="btn-outline disabled:opacity-60">
            {loading ? 'Memuat...' : 'Terapkan Filter'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-black/[0.03] text-left text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">No Jurnal</th>
                <th className="px-4 py-3">Cabang</th>
                <th className="px-4 py-3">Sumber</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3 text-right">Debit</th>
                <th className="px-4 py-3 text-right">Kredit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[color:var(--color-text-muted)]">
                    Memuat data...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[color:var(--color-text-muted)]">
                    Belum ada jurnal.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-[color:var(--color-border)] last:border-0">
                    <td className="px-4 py-3">{shortDate(row.journal_date)}</td>
                    <td className="px-4 py-3 font-semibold">{row.journal_no}</td>
                    <td className="px-4 py-3">{row.branch?.name ?? '-'}</td>
                    <td className="px-4 py-3">{row.source_type ?? '-'}</td>
                    <td className="px-4 py-3">{row.description ?? '-'}</td>
                    <td className="px-4 py-3 text-right">{money(row.total_debit)}</td>
                    <td className="px-4 py-3 text-right">{money(row.total_credit)}</td>
                    <td className="px-4 py-3">{STATUS_LABEL[row.status] ?? row.status}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex flex-wrap justify-end gap-2">
                        <Link
                          to={`/accounting/journals/${row.id}`}
                          className="rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-medium"
                        >
                          Detail
                        </Link>

                        {row.status === 'DRAFT' && row.source_type === 'manual' ? (
                          <Link
                            to={`/accounting/journals/${row.id}/edit`}
                            className="rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-medium"
                          >
                            Edit
                          </Link>
                        ) : null}

                        {row.status === 'DRAFT' ? (
                          <button
                            type="button"
                            onClick={() => postJournal(row)}
                            className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700"
                          >
                            Post
                          </button>
                        ) : null}

                        {row.status !== 'VOID' ? (
                          <button
                            type="button"
                            onClick={() => voidJournal(row)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
                          >
                            Void
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}