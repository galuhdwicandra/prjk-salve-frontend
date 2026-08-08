import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const POSPage = lazy(() => import('../../pages/pos/POSPage'));

export const kasirPosRoutes: RouteObject[] = [route('/pos', 'kasir-pos', POSPage)];
