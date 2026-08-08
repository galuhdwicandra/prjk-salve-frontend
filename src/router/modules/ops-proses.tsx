import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const ProductionBoard = lazy(() => import('../../pages/production/ProductionBoard'));
const WashNotesIndex = lazy(() => import('../../pages/wash-notes/WashNotesIndex'));
const WashNoteForm = lazy(() => import('../../pages/wash-notes/WashNoteForm'));

export const opsProsesRoutes: RouteObject[] = [
  route('/production-board', 'ops-proses', ProductionBoard),
  route('/wash-notes', 'ops-proses', WashNotesIndex),
  route('/wash-notes/new', 'ops-proses', WashNoteForm),
  route('/wash-notes/:id', 'ops-proses', WashNoteForm),
  route('/wash-notes/:id/edit', 'ops-proses', WashNoteForm),
];
