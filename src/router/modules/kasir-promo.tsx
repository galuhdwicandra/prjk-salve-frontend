import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const VouchersIndex = lazy(() => import('../../pages/vouchers/VouchersIndex'));
const VoucherForm = lazy(() => import('../../pages/vouchers/VoucherForm'));

export const kasirPromoRoutes: RouteObject[] = [
  route('/vouchers', 'kasir-promo', VouchersIndex),
  route('/vouchers/new', 'kasir-promo', VoucherForm),
  route('/vouchers/:id/edit', 'kasir-promo', VoucherForm),
];
