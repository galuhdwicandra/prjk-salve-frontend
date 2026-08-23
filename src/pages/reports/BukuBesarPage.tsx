import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getAccountingLedgerGrouped } from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import DateRangePicker from '../../components/DateRangePicker';
import { useShowBalance } from '../../store/useAuth';
import { useActiveBranchId } from '../../store/useBranch';
import type { AccountingLedgerGroup, AccountingLedgerGroupRow } from '../../types/accounting';
import { fmtDate, rangeFor } from '../../utils/date';
import { downloadXlsx, printPdf } from '../../utils/export-table';
import { num } from '../../utils/money';
import { IconChevron, IconDownload } from '../users/icons';

const SOURCE_LABEL: Record<string, string> = {
  payment: 'Pembayaran',
  order_discount: 'Diskon Order',
  receivable: 'Piutang Order',
  expense: 'Pengeluaran',
  cash_mutation: 'Mutasi Kas',
  cash_transaction: 'Transaksi Kas',
  manual: 'Jurnal Manual',
  transfer: 'Pindah Dana',
};

const CASH_KIND_LABEL: Record<string, string> = {
  IN: 'Uang Masuk',
  OUT: 'Uang Keluar',
  TRANSFER: 'Pindah Dana',
};

const EXPORT_COLUMNS = ['Akun', 'Tanggal', 'Transaksi', 'Nomor', 'Keterangan', 'Debit', 'Kredit', 'Saldo'];

const DEFAULT_RANGE = rangeFor('month');

function trxLabel(row: AccountingLedgerGroupRow): string {
  if (row.cash_kind) return CASH_KIND_LABEL[row.cash_kind] ?? 'Transaksi Kas';

  return SOURCE_LABEL[row.source_type ?? ''] ?? '\u2014';
}

export default function BukuBesarPage() {
  const branchId = useActiveBranchId();
  const showBalance = useShowBalance();

  const [from, setFrom] = useState(DEFAULT_RANGE[0]);
  const [to, setTo] = useState(DEFAULT_RANGE[1]);
  const [groups, setGroups] = useState<AccountingLedgerGroup[]>([]);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAccountingLedgerGrouped({
        branch_id: branchId || undefined,
        date_from: from,
        date_to: to,
      });

      setGroups(Array.isArray(res.data) ? res.data : []);
      setOpenIds([]);
    } catch (err) {
      setGroups([]);
      setError(getErrorMessage(err, 'Gagal memuat buku besar.'));
    } finally {
      setLoading(false);
    }
  }, [branchId, from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalRows = useMemo(
    () => groups.reduce((sum, group) => sum + group.rows.length, 0),
    [groups],
  );

  const columnCount = showBalance ? 7 : 6;
  const allOpen = groups.length > 0 && openIds.length === groups.length;

  function toggleAll() {
    setOpenIds(allOpen ? [] : groups.map((group) => group.account.id));
  }

  function toggleGroup(id: string) {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  }

  function buildAoa(): unknown[][] {
    const aoa: unknown[][] = [EXPORT_COLUMNS];

    groups.forEach((group) => {
      const name = group.account.name;

      aoa.push([name, '', 'Saldo Awal', '', '', '', '', showBalance ? (group.opening_balance ?? 0) : '']);

      group.rows.forEach((row) => {
        aoa.push([
          name,
          row.journal_date ?? '',
          trxLabel(row),
          row.source_no ?? row.journal_no ?? '',
          row.description ?? '',
          row.debit,
          row.credit,
          showBalance ? (row.balance ?? 0) : '',
        ]);
      });

      aoa.push([
        name,
        '',
        'Saldo Akhir',
        '',
        '',
        group.total_debit,
        group.total_credit,
        showBalance ? (group.ending_balance ?? 0) : '',
      ]);
    });

    return aoa;
  }

  function runExport(format: 'xlsx' | 'pdf') {
    const aoa = buildAoa();
    const subtitle = `Periode ${fmtDate(from)} \u2013 ${fmtDate(to)}`;

    if (format === 'xlsx') {
      downloadXlsx(`buku-besar-${from}-${to}.xlsx`, 'Buku Besar', aoa);
    } else if (!printPdf('Buku Besar', subtitle, aoa)) {
      setError('Popup diblokir browser. Izinkan popup untuk export PDF.');
    }

    setExportOpen(false);
  }

  return (
    <div className="card">
      <div className="card-hd">
        <div className="card-title">Buku Besar</div>

        <div className="bb-hd-r">
          <span className="ct-note">jurnal otomatis &amp; saldo per akun (in IDR)</span>
          <button type="button" className="btn ghost sm" onClick={toggleAll} disabled={groups.length === 0}>
            {allOpen ? 'Tutup semua' : 'Buka semua'}
          </button>
        </div>
      </div>

      <div className="bb-bar">
        <div>
          <span className="bb-lbl">Periode</span>
          <DateRangePicker
            from={from}
            to={to}
            onChange={(nextFrom, nextTo) => {
              setFrom(nextFrom);
              setTo(nextTo);
            }}
          />
        </div>

        <button type="button" className="btn" onClick={() => setExportOpen(true)} disabled={groups.length === 0}>
          <IconDownload />
          <span>Export</span>
        </button>
      </div>

      {error ? <div className="login-err">{error}</div> : null}

      <div className="bb-tbl">
        <table>
          <thead>
            <tr>
              <th>Akun / Tanggal</th>
              <th>Transaksi</th>
              <th>Nomor</th>
              <th>Keterangan</th>
              <th className="num">Debit</th>
              <th className="num">Kredit</th>
              {showBalance ? <th className="num">Saldo</th> : null}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="empty" colSpan={columnCount}>Memuat buku besar...</td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td className="empty" colSpan={columnCount}>Belum ada mutasi pada periode ini.</td>
              </tr>
            ) : (
              groups.map((group) => {
                const isOpen = openIds.includes(group.account.id);

                return (
                  <Fragment key={group.account.id}>
                    <tr className="bb-acc">
                      <td className="bb-tog-cell">
                        <button
                          type="button"
                          className={isOpen ? 'bb-tog open' : 'bb-tog'}
                          aria-expanded={isOpen}
                          aria-label={`Rincian akun ${group.account.name}`}
                          onClick={() => toggleGroup(group.account.id)}
                        >
                          <IconChevron />
                        </button>
                      </td>
                      <td>{group.account.name}</td>
                      <td />
                      <td />
                      <td className="num">{num(group.total_debit)}</td>
                      <td className="num">{num(group.total_credit)}</td>
                      {showBalance ? <td className="num">{num(group.ending_balance ?? 0)}</td> : null}
                    </tr>

                    {isOpen ? (
                      <Fragment>
                        <tr className="bb-sub">
                          <td colSpan={showBalance ? columnCount - 1 : columnCount}>Saldo Awal</td>
                          {showBalance ? <td className="num">{num(group.opening_balance ?? 0)}</td> : null}
                        </tr>

                        {group.rows.map((row) => (
                          <tr key={row.id}>
                            <td>{fmtDate(row.journal_date)}</td>
                            <td>{trxLabel(row)}</td>
                            <td className="bb-no">{row.source_no ?? row.journal_no ?? '\u2014'}</td>
                            <td>{row.description ?? '\u2014'}</td>
                            <td className="num">{num(row.debit)}</td>
                            <td className="num">{num(row.credit)}</td>
                            {showBalance ? <td className="num">{num(row.balance ?? 0)}</td> : null}
                          </tr>
                        ))}

                        <tr className="bb-end">
                          <td colSpan={4}>Saldo Akhir</td>
                          <td className="num">{num(group.total_debit)}</td>
                          <td className="num">{num(group.total_credit)}</td>
                          {showBalance ? <td className="num">{num(group.ending_balance ?? 0)}</td> : null}
                        </tr>
                      </Fragment>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {exportOpen ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Pilih format export">
          <div className="box">
            <div className="modal-head">
              <h3>Pilih Format Export</h3>
              <button type="button" className="mclose" onClick={() => setExportOpen(false)}>
                {'\u2715'}
              </button>
            </div>

            <div className="mini" style={{ marginBottom: 12 }}>
              {totalRows} baris data. {'\u00B7'} Periode {fmtDate(from)} {'\u2013'} {fmtDate(to)}
            </div>

            <button type="button" className="txn-choice" onClick={() => runExport('xlsx')}>
              <b>Export ke Excel</b>
              <span>Berkas .xlsx untuk diolah lebih lanjut</span>
            </button>

            <button type="button" className="txn-choice" onClick={() => runExport('pdf')}>
              <b>Export ke PDF</b>
              <span>Berkas siap cetak / dibagikan</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
