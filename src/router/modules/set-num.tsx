import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const DocumentNumberingPage = lazy(() => import('../../pages/settings/DocumentNumberingPage'));

export const setNumRoutes: RouteObject[] = [
  route('/settings/numbering', 'set-num', DocumentNumberingPage),
];
