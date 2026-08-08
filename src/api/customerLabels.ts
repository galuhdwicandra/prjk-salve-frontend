import { api } from './client';
import type { ApiEnvelope } from './client';
import type { CustomerLabel, CustomerLabelUpsertPayload } from '../types/customers';

export async function listCustomerLabels(params: { is_active?: boolean } = {}) {
    const { data } = await api.get<ApiEnvelope<CustomerLabel[], unknown>>('/customer-labels', { params });
    return data;
}

export async function createCustomerLabel(payload: CustomerLabelUpsertPayload) {
    const { data } = await api.post<ApiEnvelope<CustomerLabel, null>>('/customer-labels', payload);
    return data;
}

export async function updateCustomerLabel(id: string, payload: Partial<CustomerLabelUpsertPayload>) {
    const { data } = await api.put<ApiEnvelope<CustomerLabel, null>>(`/customer-labels/${id}`, payload);
    return data;
}

export async function deleteCustomerLabel(id: string) {
    const { data } = await api.delete<ApiEnvelope<null, null>>(`/customer-labels/${id}`);
    return data;
}
