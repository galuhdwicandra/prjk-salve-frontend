import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const CustomerLabelsPage = lazy(() => import('../../pages/settings/CustomerLabelsPage'));

export const setLabelsRoutes: RouteObject[] = [
  route('settings/customer-labels', 'set-labels', CustomerLabelsPage),
];
