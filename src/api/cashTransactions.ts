import { api, type ApiEnvelope } from './client';
import type {
  CashTransaction,
  CashTransactionPayload,
  CashTransactionQuery,
  CashTransferPayload,
  PaginationMeta,
} from '../types/cash-transactions';

function toFormData(payload: CashTransactionPayload): FormData {
  const fd = new FormData();

  if (payload.branch_id) fd.append('branch_id', payload.branch_id);
  fd.append('kind', payload.kind);
  fd.append('trx_date', payload.trx_date);
  fd.append('cash_account_id', payload.cash_account_id);
  if (payload.contact_id) fd.append('contact_id', payload.contact_id);
  if (payload.description) fd.append('description', payload.description);
  if (payload.attachment) fd.append('attachment', payload.attachment);

  payload.lines.forEach((line, index) => {
    fd.append(`lines[${index}][transaction_category_id]`, line.transaction_category_id);
    fd.append(`lines[${index}][description]`, line.description ?? '');
    fd.append(`lines[${index}][amount]`, String(line.amount));
  });

  return fd;
}

export async function listCashTransactions(params: CashTransactionQuery = {}) {
  const { data } = await api.get<ApiEnvelope<CashTransaction[], PaginationMeta>>('/cash-transactions', { params });
  return data;
}

export async function getCashTransaction(id: string) {
  const { data } = await api.get<ApiEnvelope<CashTransaction, unknown>>(`/cash-transactions/${encodeURIComponent(id)}`);
  return data;
}

export async function createCashTransaction(payload: CashTransactionPayload) {
  const { data } = await api.post<ApiEnvelope<CashTransaction, unknown>>('/cash-transactions', toFormData(payload));
  return data;
}

export async function updateCashTransaction(id: string, payload: CashTransactionPayload) {
  const fd = toFormData(payload);
  fd.append('_method', 'PUT');

  const { data } = await api.post<ApiEnvelope<CashTransaction, unknown>>(
    `/cash-transactions/${encodeURIComponent(id)}`,
    fd,
  );

  return data;
}

export async function createCashTransfer(payload: CashTransferPayload) {
  const { data } = await api.post<ApiEnvelope<CashTransaction, unknown>>(
    '/cash-transactions/transfer',
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  );

  return data;
}

export async function deleteCashTransaction(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/cash-transactions/${encodeURIComponent(id)}`);
  return data;
}
