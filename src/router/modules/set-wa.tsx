import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const WhatsappTemplatesPage = lazy(() => import('../../pages/settings/WhatsappTemplatesPage'));

export const setWaRoutes: RouteObject[] = [
  route('/settings/whatsapp-templates', 'set-wa', WhatsappTemplatesPage),
];
