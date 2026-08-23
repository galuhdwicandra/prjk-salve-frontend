import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const UsersList = lazy(() => import('../../pages/users/UsersList'));

export const setUserRoutes: RouteObject[] = [
  route('/users', 'set-user', UsersList),
];
