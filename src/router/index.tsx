// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import LoginPage from '../pages/Login';
import { lazy } from 'react';
import Guarded from './Guarded';
import LazyBoundary from '../components/LazyBoundary';

const BranchIndex = lazy(() => import('../pages/branches/BranchIndex'));
const BranchForm = lazy(() => import('../pages/branches/BranchForm'));
const InvoiceSettings = lazy(() => import('../pages/branches/InvoiceSettings'));
const CategoryIndex = lazy(() => import('../pages/services/CategoryIndex'));
const ServiceIndex = lazy(() => import('../pages/services/ServiceIndex'));
const ServiceForm = lazy(() => import('../pages/services/ServiceForm'));
const CustomersIndex = lazy(() => import('../pages/customers/CustomersIndex'));
const CustomerDetail = lazy(() => import('../pages/customers/CustomerDetail'));
const UsersList = lazy(() => import('../pages/users/UsersList'));
const UserForm = lazy(() => import('../pages/users/UserForm'));
const POSPage = lazy(() => import('../pages/pos/POSPage'));
const OrdersIndex = lazy(() => import('../pages/orders/OrdersIndex'));
const OrderDetail = lazy(() => import('../pages/orders/OrderDetail'));
const OrderReceipt = lazy(() => import('../pages/orders/OrderReceipt'));
const DeliveryIndex = lazy(() => import('../pages/deliveries/DeliveryIndex'));
const DeliveryDetail = lazy(() => import('../pages/deliveries/DeliveryDetail'));
const VouchersIndex = lazy(() => import('../pages/vouchers/VouchersIndex'));
const VoucherForm = lazy(() => import('../pages/vouchers/VoucherForm'));
const ReceivablesIndex = lazy(() => import('../pages/receivables/ReceivablesIndex'));
const ExpensesIndex = lazy(() => import('../pages/expenses/ExpensesIndex'));
const ExpenseForm = lazy(() => import('../pages/expenses/ExpenseForm'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));

export const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Petugas Cuci', 'Kurir']}>
            <LazyBoundary>
              <DashboardHome />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/customers',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <CustomersIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/customers/:id',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <CustomerDetail />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/service-categories',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <CategoryIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/services',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ServiceIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/services/new',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ServiceForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/services/:id/edit',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ServiceForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/users',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <UsersList />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/users/new',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <UserForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/users/:id/edit',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <UserForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <BranchIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches/new',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <BranchForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches/:id/edit',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <BranchForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches/:id/invoice-settings',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <InvoiceSettings />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/pos',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <POSPage />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/orders',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <OrdersIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/orders/:id',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <OrderDetail />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/orders/:id/receipt',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <OrderReceipt />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/deliveries',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
            <LazyBoundary>
              <DeliveryIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/deliveries/:id',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
            <LazyBoundary>
              <DeliveryDetail />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/expenses',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ExpensesIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/expenses/new',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ExpenseForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/expenses/:id/edit',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ExpenseForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/receivables',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <ReceivablesIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      ...(import.meta.env.VITE_FEATURE_VOUCHER === 'true'
        ? [
            {
              path: '/vouchers',
              element: (
                <Guarded roles={['Superadmin', 'Admin Cabang']}>
                  <LazyBoundary>
                    <VouchersIndex />
                  </LazyBoundary>
                </Guarded>
              ),
            },
            {
              path: '/vouchers/new',
              element: (
                <Guarded roles={['Superadmin', 'Admin Cabang']}>
                  <LazyBoundary>
                    <VoucherForm />
                  </LazyBoundary>
                </Guarded>
              ),
            },
            {
              path: '/vouchers/:id/edit',
              element: (
                <Guarded roles={['Superadmin', 'Admin Cabang']}>
                  <LazyBoundary>
                    <VoucherForm />
                  </LazyBoundary>
                </Guarded>
              ),
            },
          ]
        : []),
    ],
  },
]);
