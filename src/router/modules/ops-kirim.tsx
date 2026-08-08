import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const DeliveryIndex = lazy(() => import('../../pages/deliveries/DeliveryIndex'));
const DeliveryDetail = lazy(() => import('../../pages/deliveries/DeliveryDetail'));

export const opsKirimRoutes: RouteObject[] = [
  route('/deliveries', 'ops-kirim', DeliveryIndex),
  route('/deliveries/:id', 'ops-kirim', DeliveryDetail),
];
