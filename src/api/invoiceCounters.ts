// src/api/invoiceCounters.ts
import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
  InvoiceCounter, InvoiceCounterUpsertPayload, InvoiceCounterQuery, PaginationMeta,
} from '../types/branches';

export async function listInvoiceCounters(params: InvoiceCounterQuery) {
  const { data } = await api.get<ApiEnvelope<InvoiceCounter[], PaginationMeta | null>>(
    '/invoice-counters',
    { params }
  );
  return data;
}

export async function getInvoiceCounter(id: string) {
  const { data } = await api.get<ApiEnvelope<InvoiceCounter, null>>(`/invoice-counters/${id}`);
  return data;
}

export async function createInvoiceCounter(payload: InvoiceCounterUpsertPayload) {
  const { data } = await api.post<ApiEnvelope<InvoiceCounter, null>>('/invoice-counters', payload);
  return data;
}

export async function updateInvoiceCounter(id: string, payload: Partial<InvoiceCounterUpsertPayload>) {
  const { data } = await api.put<ApiEnvelope<InvoiceCounter, null>>(`/invoice-counters/${id}`, payload);
  return data;
}

export async function deleteInvoiceCounter(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/invoice-counters/${id}`);
  return data;
}

export interface PreviewNumber {
  number: string;     // contoh: SLV-202511-000019
  invoice_no: string; // contoh: INV-21-11-0019
}

/** GET /invoice-counters/preview?branch_id=... */
export async function previewNextNumber(branch_id: string) {
  const { data } = await api.get<ApiEnvelope<PreviewNumber, null>>(
    '/invoice-counters/preview',
    { params: { branch_id } },
  );
  return data; // ApiEnvelope<PreviewNumber, null>
}

/** POST /invoice-counters/{id}/reset-now */
export async function resetCounterNow(id: string) {
  const { data } = await api.post<ApiEnvelope<InvoiceCounter, null>>(
    `/invoice-counters/${id}/reset-now`,
    {},
  );
  return data; // ApiEnvelope<InvoiceCounter, null>
}