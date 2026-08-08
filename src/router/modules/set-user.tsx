import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const UsersList = lazy(() => import('../../pages/users/UsersList'));
const UserForm = lazy(() => import('../../pages/users/UserForm'));

export const setUserRoutes: RouteObject[] = [
  route('/users', 'set-user', UsersList),
  route('/users/new', 'set-user', UserForm),
  route('/users/:id/edit', 'set-user', UserForm),
];
