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
import { opsKirimRoutes } from './modules/ops-kirim';
import { finKasRoutes } from './modules/fin-kas';
import { finTransaksiRoutes } from './modules/fin-transaksi';
import { setUserRoutes } from './modules/set-user';
import { setMasterRoutes } from './modules/set-master';
import { setOutletRoutes } from './modules/set-outlet';
import { setCoaRoutes } from './modules/set-coa';
import { setJurnalRoutes } from './modules/set-jurnal';
import { setNumRoutes } from './modules/set-num';
import { setPaymethodRoutes } from './modules/set-paymethod';
import { setLabelsRoutes } from './modules/set-labels';

const OrderReceipt = lazy(() => import('../pages/orders/OrderReceipt'));
const OrderTracker = lazy(() => import('../pages/orders/OrderTracker'));
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
        path: '/track/:number',
        element: (
          <LazyBoundary>
            <OrderTracker />
          </LazyBoundary>
        ),
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      ...dashboardRoutes,
      ...kasirPosRoutes,
      ...kasirReceiptRoutes,
      ...kasirCustomerRoutes,
      ...kasirPromoRoutes,
      ...opsProsesRoutes,
      ...opsKirimRoutes,
      ...finKasRoutes,
      ...finTransaksiRoutes,
      ...laporanRoutes,
      ...setUserRoutes,
      ...setMasterRoutes,
      ...setOutletRoutes,
      ...setCoaRoutes,
      ...setJurnalRoutes,
      ...setNumRoutes,
      ...setPaymethodRoutes,
      ...setLabelsRoutes,
    ],
  },
]);
