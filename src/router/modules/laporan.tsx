import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const ReportsIndex = lazy(() => import('../../pages/reports/ReportsIndex'));
const ReportsHub = lazy(() => import('../../pages/reports/ReportsHub'));
const RekapPekerjaanPage = lazy(() => import('../../pages/reports/RekapPekerjaanPage'));
const AccountingDashboardPage = lazy(() => import('../../pages/accounting/AccountingDashboardPage'));
const BukuBesarPage = lazy(() => import('../../pages/reports/BukuBesarPage'));
const ProfitLossPage = lazy(() => import('../../pages/accounting/ProfitLossPage'));
const BalanceSheetPage = lazy(() => import('../../pages/accounting/BalanceSheetPage'));
const CashFlowPage = lazy(() => import('../../pages/accounting/CashFlowPage'));

export const laporanRoutes: RouteObject[] = [
  route('/reports', 'laporan', ReportsHub),
  route('/reports/operational', 'laporan', ReportsIndex),
  route('/production-board/reports', 'laporan', RekapPekerjaanPage),
  route('accounting/dashboard', 'laporan', AccountingDashboardPage),
  route('accounting/ledger', 'laporan', BukuBesarPage),
  route('accounting/profit-loss', 'laporan', ProfitLossPage),
  route('accounting/balance-sheet', 'laporan', BalanceSheetPage),
  route('accounting/cash-flow', 'laporan', CashFlowPage),
];
