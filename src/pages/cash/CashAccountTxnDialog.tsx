import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccountingLedger, updateAccountingAccount } from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import DateRangePicker from '../../components/DateRangePicker';
import { useShowBalance } from '../../store/useAuth';
import type { AccountingAccount, AccountingLedgerMeta, AccountingLedgerRow } from '../../types/accounting';
import { fmtDate, rangeFor } from '../../utils/date';
import { toIDR } from '../../utils/money';
import { IconArchive, IconEdit, IconUnarchive } from '../users/icons';

type Props = {
  account: AccountingAccount;
  onClose: () => void;
  onEdit: (account: AccountingAccount) => void;
  onDone: (message: string) => void;
};

function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sourceLink(row: AccountingLedgerRow): string | null {
  switch (row.source_type) {
    case 'manual':
    case 'transfer':
      return `/accounting/journals/${row.journal_entry_id}`;
    case 'expense':
      return row.source_id ? `/expenses/${row.source_id}/edit` : null;
    case 'payment':
    case 'receivable':
    case 'order_discount':
      return row.source_no ? `/orders?q=${encodeURIComponent(row.source_no)}` : null;
    default:
      return null;
  }
}

export default function CashAccountTxnDialog({ account, onClose, onEdit, onDone }: Props) {
  const showBalance = useShowBalance();
  const [defaultFrom, defaultTo] = rangeFor('month');

  const [rows, setRows] = useState<AccountingLedgerRow[]>([]);
  const [meta, setMeta] = useState<AccountingLedgerMeta | null>(null);
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountId = account.id;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAccountingLedger({
        account_id: accountId,
        date_from: dateFrom,
        date_to: dateTo,
        per_page: 500,
      });

      setRows(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat transaksi akun'));
      setRows([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [accountId, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function setActive(value: boolean) {
    setSaving(true);
    setError(null);
    try {
      await updateAccountingAccount(accountId, { is_active: value });
      onDone(value ? 'Akun dipulihkan.' : 'Akun diarsipkan.');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status akun'));
    } finally {
      setSaving(false);
    }
  }

  const currentBalance = toNumber(account.balance);
  const endingBalance = toNumber(meta?.ending_balance);
  const columnCount = showBalance ? 6 : 5;

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label={`Mutasi ${account.name}`}>
      <div className="box lg">
        <div className="modal-head">
          <div>
            <h3>{account.name}</h3>
            {showBalance ? (
              <div
                className="ct-note"
                style={currentBalance < 0 ? { color: 'var(--danger)' } : undefined}
              >
                Saldo saat ini: {toIDR(currentBalance)}
              </div>
            ) : (
              <div className="ct-note">Mutasi transaksi per periode</div>
            )}
          </div>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        <div className="field">
          <label>Periode</label>
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onChange={(from, to) => {
              setDateFrom(from);
              setDateTo(to);
            }}
          />
        </div>

        {error ? (
          <div
            role="alert"
            style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}
          >
            {error}
          </div>
        ) : null}

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>No. Transaksi</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th className="num">Masuk</th>
                <th className="num">Keluar</th>
                {showBalance ? <th className="num">Saldo</th> : null}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columnCount} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columnCount} className="empty">
                    Belum ada transaksi pada periode ini.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const link = sourceLink(row);
                  const label = row.journal_no ?? row.source_no ?? '\u2014';
                  const debit = toNumber(row.debit);
                  const credit = toNumber(row.credit);
                  const balance = toNumber(row.balance);

                  return (
                    <tr key={row.id}>
                      <td data-label="No. Transaksi">
                        {link ? (
                          <Link className="lnk" to={link}>
                            {label}
                          </Link>
                        ) : (
                          label
                        )}
                      </td>
                      <td data-label="Tanggal">{fmtDate(row.journal_date)}</td>
                      <td data-label="Keterangan">{row.description ?? '\u2014'}</td>
                      <td className="num" data-label="Masuk">
                        {debit > 0 ? <span className="lnk">{toIDR(debit)}</span> : ''}
                      </td>
                      <td className="num" data-label="Keluar">
                        {credit > 0 ? toIDR(credit) : ''}
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
                    </tr>
                  );
                })
              )}
            </tbody>

            {meta && rows.length > 0 ? (
              <tfoot>
                <tr style={{ fontWeight: 800 }}>
                  <td colSpan={3} className="num">
                    Total
                  </td>
                  <td className="num">{toIDR(toNumber(meta.total_debit))}</td>
                  <td className="num">{toIDR(toNumber(meta.total_credit))}</td>
                  {showBalance ? (
                    <td className="num" style={endingBalance < 0 ? { color: 'var(--danger)' } : undefined}>
                      {toIDR(endingBalance)}
                    </td>
                  ) : null}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>

        <div className="modal-foot">
          <button
            type="button"
            className="btn ghost sm"
            disabled={saving}
            onClick={() => void setActive(!account.is_active)}
          >
            {account.is_active ? <IconArchive /> : <IconUnarchive />}
            {account.is_active ? 'Arsipkan' : 'Pulihkan'}
          </button>

          <button type="button" className="btn" style={{ marginLeft: 'auto' }} onClick={() => onEdit(account)}>
            <IconEdit />
            Edit Akun
          </button>
        </div>
      </div>
    </div>
  );
}
