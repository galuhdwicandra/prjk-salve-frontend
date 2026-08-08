import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const ExpensesIndex = lazy(() => import('../../pages/expenses/ExpensesIndex'));
const ExpenseForm = lazy(() => import('../../pages/expenses/ExpenseForm'));

export const finTransaksiRoutes: RouteObject[] = [
  route('/expenses', 'fin-transaksi', ExpensesIndex),
  route('/expenses/new', 'fin-transaksi', ExpenseForm),
  route('/expenses/:id/edit', 'fin-transaksi', ExpenseForm),
];
