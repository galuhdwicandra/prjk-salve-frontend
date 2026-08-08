import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const ReportsIndex = lazy(() => import('../../pages/reports/ReportsIndex'));
const ProductionReport = lazy(() => import('../../pages/production/ProductionReport'));
const AccountingDashboardPage = lazy(() => import('../../pages/accounting/AccountingDashboardPage'));
const LedgerPage = lazy(() => import('../../pages/accounting/LedgerPage'));
const ProfitLossPage = lazy(() => import('../../pages/accounting/ProfitLossPage'));
const BalanceSheetPage = lazy(() => import('../../pages/accounting/BalanceSheetPage'));
const CashFlowPage = lazy(() => import('../../pages/accounting/CashFlowPage'));

export const laporanRoutes: RouteObject[] = [
  route('/reports', 'laporan', ReportsIndex),
  route('/production-board/reports', 'laporan', ProductionReport),
  route('accounting/dashboard', 'laporan', AccountingDashboardPage),
  route('accounting/ledger', 'laporan', LedgerPage),
  route('accounting/profit-loss', 'laporan', ProfitLossPage),
  route('accounting/balance-sheet', 'laporan', BalanceSheetPage),
  route('accounting/cash-flow', 'laporan', CashFlowPage),
];
