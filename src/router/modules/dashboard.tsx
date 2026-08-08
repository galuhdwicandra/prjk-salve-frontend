import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const DashboardHome = lazy(() => import('../../pages/dashboard/DashboardHome'));

export const dashboardRoutes: RouteObject[] = [route('/', 'dashboard', DashboardHome)];
