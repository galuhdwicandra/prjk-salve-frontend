import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { listAccountingAccounts } from '../../api/accounting';
import { listCashTransactions } from '../../api/cashTransactions';
import { getErrorMessage } from '../../api/client';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useActiveBranchId } from '../../store/useBranch';
import type { AccountingAccount } from '../../types/accounting';
import type { CashTransaction, CashTransactionKind, PaginationMeta } from '../../types/cash-transactions';
import { fmtDate } from '../../utils/date';
import { downloadXlsx } from '../../utils/export-table';
import { rp } from '../../utils/money';
import { IconDownload, IconKebab, IconPlus } from '../users/icons';
import FundTransferModal from './FundTransferModal';

const PAGE_SIZES = [25, 50, 100];

const TABS: { key: CashTransactionKind; label: string }[] = [
  { key: 'IN', label: 'Uang Masuk' },
  { key: 'OUT', label: 'Uang Keluar' },
  { key: 'TRANSFER', label: 'Pindah Dana' },
];

function counterparty(row: CashTransaction): string {
  return row.lines?.map((line) => line.category?.name).filter(Boolean).join(', ') || '\u2014';
}

function rowTotal(row: CashTransaction): number {
  return Number(row.kind === 'TRANSFER' ? row.fee_amount : row.amount) || 0;
}

export default function TransactionsIndex() {
  const nav = useNavigate();
  const branchId = useActiveBranchId();
  const { toast, showSuccess, hideToast } = useToast();

  const [tab, setTab] = useState<CashTransactionKind>('IN');
  const [rows, setRows] = useState<CashTransaction[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCashTransactions({
        kind: tab,
        q: q.trim() || undefined,
        branch_id: branchId || undefined,
        page,
        per_page: perPage,
      });

      setRows(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta ?? null);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat transaksi'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q, branchId, page, perPage]);

  useEffect(() => {
    setSlot(document.getElementById('pageActions'));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 250);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  useEffect(() => {
    setPage(1);
  }, [tab, q, perPage, branchId]);

  useEffect(() => {
    void listAccountingAccounts({ is_cash_account: true, is_active: true, branch_id: branchId || undefined, per_page: 200 })
      .then((res) => setAccounts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAccounts([]));
  }, [branchId]);

  useEffect(() => {
    if (!kebabOpen) return;
    const close = () => setKebabOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [kebabOpen]);

  const columns = useMemo(
    () =>
      tab === 'TRANSFER'
        ? ['No. Transaksi', 'Tanggal', 'Dari', 'Ke', 'Nominal', 'Biaya Admin']
        : ['No. Transaksi', 'Tanggal', 'Akun Kas/Bank', tab === 'IN' ? 'Diterima Dari' : 'Dibayar Ke', 'Kontak', 'Total'],
    [tab],
  );

  function exportRows() {
    const aoa: unknown[][] = [columns];

    rows.forEach((row) => {
      aoa.push(
        tab === 'TRANSFER'
          ? [row.no, row.trx_date, row.cash_account?.name ?? '', row.to_account?.name ?? '', Number(row.amount), Number(row.fee_amount)]
          : [row.no, row.trx_date, row.cash_account?.name ?? '', counterparty(row), row.contact?.name ?? '', rowTotal(row)],
      );
    });

    downloadXlsx(`transaksi-${tab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.xlsx`, 'Transaksi', aoa);
  }

  const pageActions = (
    <>
      <button type="button" className="btn sm" onClick={() => nav('/transactions/new/in')}>
        <IconPlus />
        <span>Catat Uang Masuk</span>
      </button>

      <button type="button" className="btn sm" onClick={() => nav('/transactions/new/out')}>
        <IconPlus />
        <span>Catat Uang Keluar</span>
      </button>

      <button type="button" className="btn ghost sm" onClick={() => setTransferOpen(true)}>
        <span>{'\u21C5'} Pindah Dana</span>
      </button>

      <div className={kebabOpen ? 'kebab open' : 'kebab'}>
        <button
          type="button"
          className="kebab-btn"
          aria-label="Menu"
          aria-expanded={kebabOpen}
          onClick={(e) => {
            e.stopPropagation();
            setKebabOpen((prev) => !prev);
          }}
        >
          <IconKebab />
        </button>
        <div className="kebab-menu">
          <button
            type="button"
            className="kebab-item"
            onClick={() => {
              setKebabOpen(false);
              exportRows();
            }}
          >
            <IconDownload />
            <span>Export</span>
          </button>
        </div>
      </div>
    </>
  );

  const total = meta?.total ?? rows.length;
  const lastPage = meta?.last_page ?? 1;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <>
      <Toast show={toast.open} kind={toast.kind} message={toast.message} onClose={hideToast} />

      {slot ? createPortal(pageActions, slot) : null}

      <div className="card">
        <div className="seg no-thumb" style={{ marginBottom: 16 }}>
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={tab === item.key ? 'seg-btn active' : 'seg-btn'}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="field">
          <label htmlFor="trx-q">Cari</label>
          <input
            id="trx-q"
            type="search"
            placeholder={tab === 'TRANSFER' ? 'no transaksi / akun' : 'no / kontak / akun'}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={column} className={index >= columns.length - (tab === 'TRANSFER' ? 2 : 1) ? 'num' : undefined}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="empty">
                    Memuat{'\u2026'}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="empty">
                    Belum ada transaksi pada tab ini.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td data-label="No. Transaksi">
                      <Link className="lnk" to={`/transactions/${row.id}/edit`}>
                        {row.no}
                      </Link>
                    </td>
                    <td data-label="Tanggal">{fmtDate(row.trx_date)}</td>

                    {tab === 'TRANSFER' ? (
                      <>
                        <td data-label="Dari">{row.cash_account?.name ?? '\u2014'}</td>
                        <td data-label="Ke">{row.to_account?.name ?? '\u2014'}</td>
                        <td className="num" data-label="Nominal">
                          {rp(Number(row.amount))}
                        </td>
                        <td className="num" data-label="Biaya Admin">
                          {rp(Number(row.fee_amount))}
                          {row.fee_bearer ? (
                            <span className="mini"> ({row.fee_bearer === 'SENDER' ? 'Pengirim' : 'Penerima'})</span>
                          ) : null}
                        </td>
                      </>
                    ) : (
                      <>
                        <td data-label="Akun Kas/Bank">{row.cash_account?.name ?? '\u2014'}</td>
                        <td data-label={tab === 'IN' ? 'Diterima Dari' : 'Dibayar Ke'}>{counterparty(row)}</td>
                        <td data-label="Kontak">{row.contact?.name ?? '\u2014'}</td>
                        <td className="num" data-label="Total">
                          {rp(rowTotal(row))}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 0 ? (
          <div className="dt-pager">
            <div className="dt-pager-size">
              Tampilkan{' '}
              <select value={perPage} aria-label="Jumlah baris per halaman" onChange={(e) => setPerPage(Number(e.target.value))}>
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>{' '}
              per halaman
            </div>
            <div className="dt-pager-nav">
              <span className="mini">
                {from}
                {'\u2013'}
                {to} dari {total}
              </span>
              <button type="button" className="pg-btn" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                {'\u2039'}
              </button>
              <span className="mini">
                {page}/{lastPage}
              </span>
              <button type="button" className="pg-btn" aria-label="Halaman berikutnya" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
                {'\u203a'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {transferOpen ? (
        <FundTransferModal
          accounts={accounts}
          branchId={branchId}
          onClose={() => setTransferOpen(false)}
          onDone={(message) => {
            setTransferOpen(false);
            showSuccess(message);
            void refresh();
          }}
        />
      ) : null}
    </>
  );
}
