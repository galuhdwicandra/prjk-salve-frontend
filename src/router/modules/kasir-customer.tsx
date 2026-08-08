import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const CustomersIndex = lazy(() => import('../../pages/customers/CustomersIndex'));
const CustomerDetail = lazy(() => import('../../pages/customers/CustomerDetail'));

export const kasirCustomerRoutes: RouteObject[] = [
  route('/customers', 'kasir-customer', CustomersIndex),
  route('/customers/:id', 'kasir-customer', CustomerDetail),
];
