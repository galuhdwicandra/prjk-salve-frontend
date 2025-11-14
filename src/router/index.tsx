// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import LoginPage from '../pages/Login';
import { lazy, Suspense } from 'react';
import Guarded from './Guarded';
// import DashboardHome from '../pages/DashboardHome';

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
                element: <div className="text-sm text-gray-600">Dashboard</div>,
            },
            {
                path: '/customers',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <CustomersIndex />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/customers/:id',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <CustomerDetail />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/service-categories',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <CategoryIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/services',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ServiceIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/services/new',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ServiceForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/services/:id/edit',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ServiceForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/users',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <UsersList />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/users/new',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <UserForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/users/:id/edit',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <UserForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <BranchIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches/new',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <BranchForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches/:id/edit',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <BranchForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches/:id/invoice-settings',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <InvoiceSettings />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/pos',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <POSPage />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/orders',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <OrdersIndex />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/orders/:id',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <OrderDetail />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/orders/:id/receipt',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <OrderReceipt />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/deliveries',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <DeliveryIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/deliveries/:id',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <DeliveryDetail />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/expenses',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <div>Expenses (placeholder)</div>
                    </Guarded>
                )
            },
            {
                path: '/receivables',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ReceivablesIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            ...(import.meta.env.VITE_FEATURE_VOUCHER === 'true'
                ? [
                    {
                        path: '/vouchers',
                        element: (
                            <Guarded roles={['Superadmin', 'Admin Cabang']}>
                                <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                                    <VouchersIndex />
                                </Suspense>
                            </Guarded>
                        ),
                    },
                    {
                        path: '/vouchers/new',
                        element: (
                            <Guarded roles={['Superadmin', 'Admin Cabang']}>
                                <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                                    <VoucherForm />
                                </Suspense>
                            </Guarded>
                        ),
                    },
                    {
                        path: '/vouchers/:id/edit',
                        element: (
                            <Guarded roles={['Superadmin', 'Admin Cabang']}>
                                <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                                    <VoucherForm />
                                </Suspense>
                            </Guarded>
                        ),
                    },
                ]
                : []),
        ],
    },
]);