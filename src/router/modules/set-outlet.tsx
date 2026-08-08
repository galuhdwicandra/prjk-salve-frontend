import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const BranchIndex = lazy(() => import('../../pages/branches/BranchIndex'));
const BranchForm = lazy(() => import('../../pages/branches/BranchForm'));

export const setOutletRoutes: RouteObject[] = [
  route('/branches', 'set-outlet', BranchIndex),
  route('/branches/new', 'set-outlet', BranchForm),
  route('/branches/:id/edit', 'set-outlet', BranchForm),
];
