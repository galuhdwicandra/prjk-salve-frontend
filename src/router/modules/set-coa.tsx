import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const AccountIndex = lazy(() => import('../../pages/accounting/AccountIndex'));
const AccountForm = lazy(() => import('../../pages/accounting/AccountForm'));
const TransactionCategoriesPage = lazy(() => import('../../pages/settings/TransactionCategoriesPage'));

export const setCoaRoutes: RouteObject[] = [
  route('settings/transaction-categories', 'set-coa', TransactionCategoriesPage),
  route('accounting/accounts', 'set-coa', AccountIndex),
  route('accounting/accounts/new', 'set-coa', AccountForm),
  route('accounting/accounts/:id/edit', 'set-coa', AccountForm),
];
