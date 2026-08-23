import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const CashAccountIndex = lazy(() => import('../../pages/cash/CashAccountIndex'));

export const finKasRoutes: RouteObject[] = [
  route('/cash-accounts', 'fin-kas', CashAccountIndex),
];
