import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const ServiceIndex = lazy(() => import('../../pages/services/ServiceIndex'));

export const setMasterRoutes: RouteObject[] = [
  route('/services', 'set-master', ServiceIndex),
];
