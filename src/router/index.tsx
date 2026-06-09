// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import LoginPage from '../pages/Login';
import { lazy } from 'react';
import Guarded from './Guarded';
import LazyBoundary from '../components/LazyBoundary';
import SettingsLayout from '../layouts/SettingsLayout';

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
const CashSessionsIndex = lazy(() => import('../pages/cash/CashSessionsIndex'));
const CashTodayPage = lazy(() => import('../pages/cash/CashTodayPage'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const ReportsIndex = lazy(() => import('../pages/reports/ReportsIndex'));
const WashNotesIndex = lazy(() => import('../pages/wash-notes/WashNotesIndex'));
const ProductionBoard = lazy(() => import('../pages/production/ProductionBoard'));
const ProductionReport = lazy(() => import('../pages/production/ProductionReport'));
const WashNoteForm = lazy(() => import('../pages/wash-notes/WashNoteForm'));
const WhatsappTemplatesPage = lazy(() => import('../pages/settings/WhatsappTemplatesPage'));
const AccountIndex = lazy(() => import('../pages/accounting/AccountIndex'));
const AccountForm = lazy(() => import('../pages/accounting/AccountForm'));
const AccountMappingIndex = lazy(() => import('../pages/accounting/AccountMappingIndex'));
const AccountMappingForm = lazy(() => import('../pages/accounting/AccountMappingForm'));
const JournalIndex = lazy(() => import('../pages/accounting/JournalIndex'));
const JournalForm = lazy(() => import('../pages/accounting/JournalForm'));
const JournalDetail = lazy(() => import('../pages/accounting/JournalDetail'));
const LedgerPage = lazy(() => import('../pages/accounting/LedgerPage'));
const ProfitLossPage = lazy(() => import('../pages/accounting/ProfitLossPage'));
const BalanceSheetPage = lazy(() => import('../pages/accounting/BalanceSheetPage'));
const CashFlowPage = lazy(() => import('../pages/accounting/CashFlowPage'));
const AccountingDashboardPage = lazy(() => import('../pages/accounting/AccountingDashboardPage'));

export const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        path: '/r/receipt/:id',
        element: (
          <LazyBoundary>
            <OrderReceipt />
          </LazyBoundary>
        ),
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <DashboardHome />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/reports',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Akuntansi']}>
            <LazyBoundary>
              <ReportsIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/production-board',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Petugas Cuci']}>
            <LazyBoundary>
              <ProductionBoard />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/production-board/reports',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Petugas Cuci']}>
            <LazyBoundary>
              <ProductionReport />
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
      {
        path: '/cash-sessions',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <CashSessionsIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/cash-today',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <CashTodayPage />
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
          {
            path: '/wash-notes',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Petugas Cuci']}>
                <LazyBoundary>
                  <WashNotesIndex />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: '/wash-notes/new',
            element: (
              <Guarded roles={['Petugas Cuci']}>
                <LazyBoundary>
                  <WashNoteForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: '/wash-notes/:id',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Petugas Cuci']}>
                <LazyBoundary>
                  <WashNoteForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: '/wash-notes/:id/edit',
            element: (
              <Guarded roles={['Petugas Cuci']}>
                <LazyBoundary>
                  <WashNoteForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: '/settings',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang']}>
                <LazyBoundary>
                  <SettingsLayout />
                </LazyBoundary>
              </Guarded>
            ),
            children: [
              { index: true, element: <Navigate to="whatsapp-templates" replace /> },
              {
                path: 'whatsapp-templates',
                element: (
                  <LazyBoundary>
                    <WhatsappTemplatesPage />
                  </LazyBoundary>
                ),
              },
            ],
          },
          {
            path: 'accounting/dashboard',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <AccountingDashboardPage />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/accounts',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <AccountIndex />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/accounts/new',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <AccountForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/accounts/:id/edit',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <AccountForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/account-mappings',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <AccountMappingIndex />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/account-mappings/new',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <AccountMappingForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/account-mappings/:id/edit',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <AccountMappingForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/journals',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <JournalIndex />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/journals/new',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <JournalForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/journals/:id',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <JournalDetail />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/journals/:id/edit',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <JournalForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/ledger',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <LedgerPage />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/profit-loss',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <ProfitLossPage />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/balance-sheet',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <BalanceSheetPage />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: 'accounting/cash-flow',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Akuntansi']}>
                <LazyBoundary>
                  <CashFlowPage />
                </LazyBoundary>
              </Guarded>
            ),
          },

        ]
        : []),
    ],
  },
]);
