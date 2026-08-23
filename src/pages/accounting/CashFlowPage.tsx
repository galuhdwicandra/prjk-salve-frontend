import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccountingCashFlow } from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import DateRangePicker from '../../components/DateRangePicker';
import { useCanModule } from '../../store/useAuth';
import { useActiveBranchId } from '../../store/useBranch';
import type {
  AccountingCashFlowData,
  AccountingCashFlowGroup,
  AccountingCashFlowLink,
  AccountingCashFlowLinkType,
  AccountingCashFlowSection,
} from '../../types/accounting';
import { fmtDate, rangeFor } from '../../utils/date';
import { downloadXlsx, printPdf } from '../../utils/export-table';
import { rp } from '../../utils/money';
import { IconDownload } from '../users/icons';

const SECTION_SHORT: Record<string, string> = {
  OPERATING: 'Operasi',
  INVESTING: 'Investasi',
  FINANCING: 'Pendanaan',
};

const EXPORT_COLUMNS = [
  'Bagian',
  'Arus',
  'Kategori',
  'No. Transaksi',
  'Tanggal',
  'Akun',
  'Keterangan',
  'Nominal',
];

const DEFAULT_RANGE = rangeFor('month');

function linkPath(link: AccountingCashFlowLink): string {
  if (link.type === 'order') return `/orders/${link.id}`;
  if (link.type === 'cash_transaction') return `/transactions/${link.id}/edit`;

  return `/accounting/journals/${link.id}`;
}

type FlowLabel = 'Penerimaan' | 'Pengeluaran';

type FlowRow = {
  section: AccountingCashFlowSection;
  group: AccountingCashFlowGroup;
  flow: FlowLabel;
};

export default function CashFlowPage() {
  const branchId = useActiveBranchId();
  const canOrder = useCanModule('kasir-receipt');
  const canTransaction = useCanModule('fin-transaksi');
  const canJournal = useCanModule('set-jurnal');

  const [from, setFrom] = useState(DEFAULT_RANGE[0]);
  const [to, setTo] = useState(DEFAULT_RANGE[1]);
  const [report, setReport] = useState<AccountingCashFlowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [detail, setDetail] = useState<FlowRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAccountingCashFlow({
        branch_id: branchId || undefined,
        date_from: from,
        date_to: to,
      });

      setReport(res.data);
      setDetail(null);
    } catch (err) {
      setReport(null);
      setError(getErrorMessage(err, 'Gagal memuat laporan arus kas.'));
    } finally {
      setLoading(false);
    }
  }, [branchId, from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const sections = useMemo(() => report?.sections ?? [], [report]);
  const summary = report?.summary ?? null;

  const flowRows = useMemo<FlowRow[]>(
    () =>
      sections.flatMap((section) => [
        ...section.inflows.map((group) => ({ section, group, flow: 'Penerimaan' as const })),
        ...section.outflows.map((group) => ({ section, group, flow: 'Pengeluaran' as const })),
      ]),
    [sections],
  );

  const totalItems = useMemo(
    () => flowRows.reduce((sum, row) => sum + row.group.items.length, 0),
    [flowRows],
  );

  const linkAllowed = useMemo<Record<AccountingCashFlowLinkType, boolean>>(
    () => ({
      order: canOrder,
      cash_transaction: canTransaction,
      journal: canJournal,
    }),
    [canOrder, canTransaction, canJournal],
  );

  function buildAoa(): unknown[][] {
    const aoa: unknown[][] = [EXPORT_COLUMNS];

    flowRows.forEach(({ section, group, flow }) => {
      group.items.forEach((item) => {
        aoa.push([
          SECTION_SHORT[section.key] ?? section.key,
          flow,
          group.label,
          item.no ?? '',
          item.date ?? '',
          item.account ?? '',
          item.description ?? '',
          item.amount,
        ]);
      });
    });

    return aoa;
  }

  function runExport(format: 'xlsx' | 'pdf') {
    const aoa = buildAoa();
    const subtitle = `Periode ${fmtDate(from)} \u2013 ${fmtDate(to)}`;

    if (format === 'xlsx') {
      downloadXlsx(`cashflow-${from}-${to}.xlsx`, 'Cashflow', aoa);
    } else if (!printPdf('Laporan Arus Kas', subtitle, aoa)) {
      setError('Popup diblokir browser. Izinkan popup untuk export PDF.');
    }

    setExportOpen(false);
  }

  function renderGroups(
    section: AccountingCashFlowSection,
    groups: AccountingCashFlowGroup[],
    flow: FlowLabel,
  ) {
    if (groups.length === 0) return null;

    return (
      <Fragment>
        <tr className="cf-flow">
          <td colSpan={2}>{flow.toUpperCase()}</td>
        </tr>

        {groups.map((group) => (
          <tr key={group.key}>
            <td>
              <button
                type="button"
                className="cf-lnk"
                onClick={() => setDetail({ section, group, flow })}
              >
                {group.label}
              </button>
            </td>
            <td className="num">{rp(group.amount)}</td>
          </tr>
        ))}
      </Fragment>
    );
  }

  return (
    <div className="card">
      <div className="card-hd">
        <div className="card-title">Laporan Arus Kas</div>

        <div className="bb-hd-r">
          <span className="ct-note">
            metode langsung {'\u00B7'} klik tiap baris untuk melihat transaksinya
          </span>
          <button
            type="button"
            className="btn"
            onClick={() => setExportOpen(true)}
            disabled={totalItems === 0}
          >
            <IconDownload />
            <span>Export</span>
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
      </div>

      {error ? <div className="login-err">{error}</div> : null}

      {loading ? (
        <div className="empty">Memuat laporan arus kas...</div>
      ) : (
        <Fragment>
          <div className="cf-tbl">
            <table>
              <tbody>
                {sections.map((section) => (
                  <Fragment key={section.key}>
                    <tr className="cf-sec">
                      <td colSpan={2}>{section.label}</td>
                    </tr>

                    {section.inflows.length === 0 && section.outflows.length === 0 ? (
                      <tr className="cf-none">
                        <td colSpan={2}>Tidak ada arus kas.</td>
                      </tr>
                    ) : null}

                    {renderGroups(section, section.inflows, 'Penerimaan')}
                    {renderGroups(section, section.outflows, 'Pengeluaran')}

                    <tr className="cf-net">
                      <td>
                        Kas bersih {(SECTION_SHORT[section.key] ?? section.key).toLowerCase()}
                      </td>
                      <td className="num">{rp(section.net)}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {summary ? (
            <div className="cf-sum">
              <table>
                <tbody>
                  <tr className="cf-total">
                    <td>KENAIKAN (PENURUNAN) KAS BERSIH</td>
                    <td className="num">{rp(summary.net_change)}</td>
                  </tr>
                  <tr>
                    <td>Saldo kas awal periode</td>
                    <td className="num">{rp(summary.opening_balance)}</td>
                  </tr>
                  <tr className="cf-end">
                    <td>Saldo kas akhir periode</td>
                    <td className="num">{rp(summary.ending_balance)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </Fragment>
      )}

      {detail ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={detail.group.label}>
          <div className="box lg">
            <div className="modal-head">
              <div>
                <h3>{detail.group.label}</h3>
                <div className="mini">
                  {detail.flow} {'\u00B7'} {SECTION_SHORT[detail.section.key] ?? detail.section.key}{' '}
                  {'\u00B7'} total {rp(Math.abs(detail.group.amount))}
                </div>
              </div>
              <button type="button" className="mclose" onClick={() => setDetail(null)}>
                {'\u2715'}
              </button>
            </div>

            <div className="cf-dtl">
              <table>
                <thead>
                  <tr>
                    <th>No. Transaksi</th>
                    <th>Tanggal</th>
                    <th>Akun</th>
                    <th>Keterangan</th>
                    <th className="num">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.group.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.link && linkAllowed[item.link.type] ? (
                          <Link className="lnk" to={linkPath(item.link)}>
                            {item.no ?? '\u2014'}
                          </Link>
                        ) : (
                          item.no ?? '\u2014'
                        )}
                      </td>
                      <td>{fmtDate(item.date)}</td>
                      <td>{item.account ?? '\u2014'}</td>
                      <td>{item.description ?? '\u2014'}</td>
                      <td className="num">{rp(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

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
              {totalItems} baris data. {'\u00B7'} Periode {fmtDate(from)} {'\u2013'} {fmtDate(to)}
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
