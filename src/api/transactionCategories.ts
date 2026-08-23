import { api } from './client';
import type { ApiEnvelope } from './client';
import type { TransactionCategory, TransactionCategoryPayload } from '../types/transaction-categories';

export async function listTransactionCategories(
    params: { is_active?: boolean; cash_in?: boolean; cash_out?: boolean; q?: string } = {},
) {
    const { data } = await api.get<ApiEnvelope<TransactionCategory[], unknown>>('/transaction-categories', { params });
    return data;
}

export async function createTransactionCategory(payload: TransactionCategoryPayload) {
    const { data } = await api.post<ApiEnvelope<TransactionCategory, null>>('/transaction-categories', payload);
    return data;
}

export async function updateTransactionCategory(id: string, payload: Partial<TransactionCategoryPayload>) {
    const { data } = await api.put<ApiEnvelope<TransactionCategory, null>>(`/transaction-categories/${id}`, payload);
    return data;
}

export async function deleteTransactionCategory(id: string) {
    const { data } = await api.delete<ApiEnvelope<null, null>>(`/transaction-categories/${id}`);
    return data;
}
