import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const TrackerIndex = lazy(() => import('../../pages/tracker/TrackerIndex'));

export const opsTrackerRoutes: RouteObject[] = [
  route('/tracker', 'ops-tracker', TrackerIndex),
];
