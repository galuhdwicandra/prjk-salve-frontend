import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const SortingList = lazy(() => import('../../pages/sorting/SortingList'));

export const opsSortingRoutes: RouteObject[] = [
  route('/sorting', 'ops-sorting', SortingList),
];
