import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Guarded from '../Guarded';
import LazyBoundary from '../../components/LazyBoundary';
import SettingsLayout from '../../layouts/SettingsLayout';

const WhatsappTemplatesPage = lazy(() => import('../../pages/settings/WhatsappTemplatesPage'));

export const setWaRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: (
      <Guarded module="set-wa">
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
];
