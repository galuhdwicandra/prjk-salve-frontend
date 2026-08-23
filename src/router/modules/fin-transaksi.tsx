import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const TransactionsIndex = lazy(() => import('../../pages/transactions/TransactionsIndex'));
const CashTransactionForm = lazy(() => import('../../pages/transactions/CashTransactionForm'));

export const finTransaksiRoutes: RouteObject[] = [
  route('/transactions', 'fin-transaksi', TransactionsIndex),
  route('/transactions/new/:kind', 'fin-transaksi', CashTransactionForm),
  route('/transactions/:id/edit', 'fin-transaksi', CashTransactionForm),
];
