import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const ContactsIndex = lazy(() => import('../../pages/contacts/ContactsIndex'));

export const finKontakRoutes: RouteObject[] = [
  route('/contacts', 'fin-kontak', ContactsIndex),
];
