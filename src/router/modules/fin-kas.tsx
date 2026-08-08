import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const CashSessionsIndex = lazy(() => import('../../pages/cash/CashSessionsIndex'));
const CashTodayPage = lazy(() => import('../../pages/cash/CashTodayPage'));

export const finKasRoutes: RouteObject[] = [
  route('/cash-sessions', 'fin-kas', CashSessionsIndex),
  route('/cash-today', 'fin-kas', CashTodayPage),
];
