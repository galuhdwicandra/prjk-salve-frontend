import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const AccountIndex = lazy(() => import('../../pages/accounting/AccountIndex'));
const AccountForm = lazy(() => import('../../pages/accounting/AccountForm'));

export const setCoaRoutes: RouteObject[] = [
  route('accounting/accounts', 'set-coa', AccountIndex),
  route('accounting/accounts/new', 'set-coa', AccountForm),
  route('accounting/accounts/:id/edit', 'set-coa', AccountForm),
];
