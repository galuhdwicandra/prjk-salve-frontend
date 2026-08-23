import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const VouchersIndex = lazy(() => import('../../pages/vouchers/VouchersIndex'));

export const kasirPromoRoutes: RouteObject[] = [
  route('/vouchers', 'kasir-promo', VouchersIndex),
];
