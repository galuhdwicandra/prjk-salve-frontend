import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const AccountMappingIndex = lazy(() => import('../../pages/accounting/AccountMappingIndex'));
const AccountMappingForm = lazy(() => import('../../pages/accounting/AccountMappingForm'));
const JournalIndex = lazy(() => import('../../pages/accounting/JournalIndex'));
const JournalForm = lazy(() => import('../../pages/accounting/JournalForm'));
const JournalDetail = lazy(() => import('../../pages/accounting/JournalDetail'));
const JournalTransferForm = lazy(() => import('../../pages/accounting/JournalTransferForm'));
const JournalCoaPage = lazy(() => import('../../pages/accounting/JournalCoaPage'));

export const setJurnalRoutes: RouteObject[] = [
  route('settings/journal-coa', 'set-jurnal', JournalCoaPage),
  route('accounting/account-mappings', 'set-jurnal', AccountMappingIndex),
  route('accounting/account-mappings/new', 'set-jurnal', AccountMappingForm),
  route('accounting/account-mappings/:id/edit', 'set-jurnal', AccountMappingForm),
  route('accounting/journals', 'set-jurnal', JournalIndex),
  route('accounting/journals/new', 'set-jurnal', JournalForm),
  route('accounting/journals/transfer', 'set-jurnal', JournalTransferForm),
  route('accounting/journals/:id', 'set-jurnal', JournalDetail),
  route('accounting/journals/:id/edit', 'set-jurnal', JournalForm),
];
