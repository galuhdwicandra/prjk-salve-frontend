import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import CraftLayout from '../layouts/CraftLayout';
import LoginPage from '../pages/Login';
import LazyBoundary from '../components/LazyBoundary';
import { dashboardRoutes } from './modules/dashboard';
import { laporanRoutes } from './modules/laporan';
import { kasirPosRoutes } from './modules/kasir-pos';
import { kasirReceiptRoutes } from './modules/kasir-receipt';
import { kasirCustomerRoutes } from './modules/kasir-customer';
import { kasirPromoRoutes } from './modules/kasir-promo';
import { opsProsesRoutes } from './modules/ops-proses';
import { opsSortingRoutes } from './modules/ops-sorting';
import { opsKirimRoutes } from './modules/ops-kirim';
import { opsTrackerRoutes } from './modules/ops-tracker';
import { finTransaksiRoutes } from './modules/fin-transaksi';
import { finKasRoutes } from './modules/fin-kas';
import { setUserRoutes } from './modules/set-user';
import { setMasterRoutes } from './modules/set-master';
import { setOutletRoutes } from './modules/set-outlet';
import { setCoaRoutes } from './modules/set-coa';
import { setJurnalRoutes } from './modules/set-jurnal';
import { setNumRoutes } from './modules/set-num';
import { setPaymethodRoutes } from './modules/set-paymethod';
import { setLabelsRoutes } from './modules/set-labels';
import { finKontakRoutes } from './modules/fin-kontak';
import { setWaRoutes } from './modules/set-wa';

const OrderReceipt = lazy(() => import('../pages/orders/OrderReceipt'));
const CustomerTracker = lazy(() => import('../pages/tracker/CustomerTracker'));
const SettingsHub = lazy(() => import('../pages/settings/SettingsHub'));
const AppLayout = import.meta.env.VITE_CRAFT_SHELL === 'true' ? CraftLayout : ProtectedLayout;

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
      {
        path: '/t/:token',
        element: (
          <LazyBoundary>
            <CustomerTracker />
          </LazyBoundary>
        ),
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      ...dashboardRoutes,
      {
        path: '/settings',
        element: (
          <LazyBoundary>
            <SettingsHub />
          </LazyBoundary>
        ),
      },
      ...kasirPosRoutes,
      ...kasirReceiptRoutes,
      ...kasirCustomerRoutes,
      ...kasirPromoRoutes,
      ...opsSortingRoutes,
      ...opsProsesRoutes,
      ...opsKirimRoutes,
      ...opsTrackerRoutes,
      ...finTransaksiRoutes,
      ...finKasRoutes,
      ...finKontakRoutes,
      ...laporanRoutes,
      ...setUserRoutes,
      ...setMasterRoutes,
      ...setOutletRoutes,
      ...setCoaRoutes,
      ...setJurnalRoutes,
      ...setNumRoutes,
      ...setPaymethodRoutes,
      ...setLabelsRoutes,
      ...setWaRoutes,
    ],
  },
]);
