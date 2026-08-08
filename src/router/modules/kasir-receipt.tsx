import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const OrdersIndex = lazy(() => import('../../pages/orders/OrdersIndex'));
const OrderDetail = lazy(() => import('../../pages/orders/OrderDetail'));
const OrderReceipt = lazy(() => import('../../pages/orders/OrderReceipt'));
const ReceivablesIndex = lazy(() => import('../../pages/receivables/ReceivablesIndex'));

export const kasirReceiptRoutes: RouteObject[] = [
  route('/orders', 'kasir-receipt', OrdersIndex),
  route('/orders/:id', 'kasir-receipt', OrderDetail),
  route('/orders/:id/receipt', 'kasir-receipt', OrderReceipt),
  route('/receivables', 'kasir-receipt', ReceivablesIndex),
];
