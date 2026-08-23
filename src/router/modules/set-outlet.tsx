import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const BranchIndex = lazy(() => import('../../pages/branches/BranchIndex'));

export const setOutletRoutes: RouteObject[] = [
  route('/branches', 'set-outlet', BranchIndex),
];
