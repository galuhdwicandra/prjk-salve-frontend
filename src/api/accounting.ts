import { api, type ApiEnvelope } from './client';
import type {
  AccountingAccount,
  AccountingAccountMapping,
  AccountingAccountMappingPayload,
  AccountingAccountMappingQuery,
  AccountingAccountPayload,
  AccountingAccountQuery,
  AccountingBalanceSheetData,
  AccountingBalanceSheetMeta,
  AccountingBalanceSheetQuery,
  AccountingJournalEntry,
  AccountingJournalPayload,
  AccountingJournalQuery,
  AccountingLedgerMeta,
  AccountingLedgerQuery,
  AccountingLedgerRow,
  AccountingProfitLossData,
  AccountingProfitLossMeta,
  AccountingProfitLossQuery,
  AccountingCashFlowData,
  AccountingCashFlowMeta,
  AccountingCashFlowQuery,
  AccountingDashboardData,
  AccountingDashboardMeta,
  AccountingDashboardQuery,
  PaginationMeta,
} from '../types/accounting';

export async function getAccountingDashboard(params: AccountingDashboardQuery) {
  const { data } = await api.get<ApiEnvelope<AccountingDashboardData, AccountingDashboardMeta>>(
    '/accounting/dashboard',
    { params }
  );

  return data;
}

export async function listAccountingAccounts(params: AccountingAccountQuery = {}) {
  const { data } = await api.get<ApiEnvelope<AccountingAccount[], PaginationMeta>>(
    '/accounting/accounts',
    { params }
  );

  return data;
}

export async function getAccountingAccount(id: string) {
  const { data } = await api.get<ApiEnvelope<AccountingAccount, null>>(
    `/accounting/accounts/${encodeURIComponent(id)}`
  );

  return data;
}

export async function createAccountingAccount(payload: AccountingAccountPayload) {
  const { data } = await api.post<ApiEnvelope<AccountingAccount, null>>(
    '/accounting/accounts',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function updateAccountingAccount(id: string, payload: AccountingAccountPayload) {
  const { data } = await api.put<ApiEnvelope<AccountingAccount, null>>(
    `/accounting/accounts/${encodeURIComponent(id)}`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function deleteAccountingAccount(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(
    `/accounting/accounts/${encodeURIComponent(id)}`
  );

  return data;
}

export async function listAccountingAccountMappings(params: AccountingAccountMappingQuery = {}) {
  const { data } = await api.get<ApiEnvelope<AccountingAccountMapping[], PaginationMeta>>(
    '/accounting/account-mappings',
    { params }
  );

  return data;
}

export async function getAccountingAccountMapping(id: string) {
  const { data } = await api.get<ApiEnvelope<AccountingAccountMapping, null>>(
    `/accounting/account-mappings/${encodeURIComponent(id)}`
  );

  return data;
}

export async function createAccountingAccountMapping(payload: AccountingAccountMappingPayload) {
  const { data } = await api.post<ApiEnvelope<AccountingAccountMapping, null>>(
    '/accounting/account-mappings',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function updateAccountingAccountMapping(id: string, payload: AccountingAccountMappingPayload) {
  const { data } = await api.put<ApiEnvelope<AccountingAccountMapping, null>>(
    `/accounting/account-mappings/${encodeURIComponent(id)}`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function deleteAccountingAccountMapping(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(
    `/accounting/account-mappings/${encodeURIComponent(id)}`
  );

  return data;
}

export async function listAccountingJournals(params: AccountingJournalQuery = {}) {
  const { data } = await api.get<ApiEnvelope<AccountingJournalEntry[], PaginationMeta>>(
    '/accounting/journals',
    { params }
  );

  return data;
}

export async function getAccountingJournal(id: string) {
  const { data } = await api.get<ApiEnvelope<AccountingJournalEntry, null>>(
    `/accounting/journals/${encodeURIComponent(id)}`
  );

  return data;
}

export async function createAccountingJournal(payload: AccountingJournalPayload) {
  const { data } = await api.post<ApiEnvelope<AccountingJournalEntry, null>>(
    '/accounting/journals',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function updateAccountingJournal(id: string, payload: AccountingJournalPayload) {
  const { data } = await api.put<ApiEnvelope<AccountingJournalEntry, null>>(
    `/accounting/journals/${encodeURIComponent(id)}`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function postAccountingJournal(id: string) {
  const { data } = await api.post<ApiEnvelope<AccountingJournalEntry, null>>(
    `/accounting/journals/${encodeURIComponent(id)}/post`,
    {},
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function voidAccountingJournal(id: string, void_reason: string) {
  const { data } = await api.post<ApiEnvelope<AccountingJournalEntry, null>>(
    `/accounting/journals/${encodeURIComponent(id)}/void`,
    { void_reason },
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function getAccountingLedger(params: AccountingLedgerQuery) {
  const { data } = await api.get<ApiEnvelope<AccountingLedgerRow[], AccountingLedgerMeta>>(
    '/accounting/ledger',
    { params }
  );

  return data;
}

export async function getAccountingProfitLoss(params: AccountingProfitLossQuery) {
  const { data } = await api.get<ApiEnvelope<AccountingProfitLossData, AccountingProfitLossMeta>>(
    '/accounting/reports/profit-loss',
    { params }
  );

  return data;
}

export async function getAccountingBalanceSheet(params: AccountingBalanceSheetQuery) {
  const { data } = await api.get<ApiEnvelope<AccountingBalanceSheetData, AccountingBalanceSheetMeta>>(
    '/accounting/reports/balance-sheet',
    { params }
  );

  return data;
}

export async function getAccountingCashFlow(params: AccountingCashFlowQuery) {
  const { data } = await api.get<ApiEnvelope<AccountingCashFlowData, AccountingCashFlowMeta>>(
    '/accounting/reports/cash-flow',
    { params }
  );

  return data;
}