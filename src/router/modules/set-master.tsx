import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const CategoryIndex = lazy(() => import('../../pages/services/CategoryIndex'));
const ServiceIndex = lazy(() => import('../../pages/services/ServiceIndex'));
const ServiceForm = lazy(() => import('../../pages/services/ServiceForm'));

export const setMasterRoutes: RouteObject[] = [
  route('/service-categories', 'set-master', CategoryIndex),
  route('/services', 'set-master', ServiceIndex),
  route('/services/new', 'set-master', ServiceForm),
  route('/services/:id/edit', 'set-master', ServiceForm),
];
