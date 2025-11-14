import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
    InvoiceCounter, InvoiceCounterUpsertPayload, InvoiceCounterQuery, PaginationMeta,
} from '../types/branches';

export async function listInvoiceCounters(params: InvoiceCounterQuery = {}) {
    const { data } = await api.get<ApiEnvelope<InvoiceCounter[], PaginationMeta | null>>('/invoice-counters', { params });
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
