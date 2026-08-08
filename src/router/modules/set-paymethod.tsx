import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const PaymentMethodsPage = lazy(() => import('../../pages/settings/PaymentMethodsPage'));

export const setPaymethodRoutes: RouteObject[] = [
  route('settings/payment-methods', 'set-paymethod', PaymentMethodsPage),
];
