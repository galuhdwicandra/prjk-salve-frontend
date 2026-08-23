import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
    PaymentMethodAccountRow,
    PaymentMethodMaster,
    PaymentMethodUpsertPayload,
} from '../types/payments';

export async function listPaymentMethods(params: { is_active?: boolean } = {}) {
    const { data } = await api.get<ApiEnvelope<PaymentMethodMaster[], unknown>>('/payment-methods', { params });
    return data;
}

export async function createPaymentMethod(payload: PaymentMethodUpsertPayload) {
    const { data } = await api.post<ApiEnvelope<PaymentMethodMaster, null>>('/payment-methods', payload);
    return data;
}

export async function updatePaymentMethod(id: string, payload: Partial<PaymentMethodUpsertPayload>) {
    const { data } = await api.put<ApiEnvelope<PaymentMethodMaster, null>>(`/payment-methods/${id}`, payload);
    return data;
}

export async function deletePaymentMethod(id: string) {
    const { data } = await api.delete<ApiEnvelope<null, null>>(`/payment-methods/${id}`);
    return data;
}

export async function setPaymentMethodAccount(
    id: string,
    payload: { branch_id: string; account_id: string | null },
) {
    const { data } = await api.post<ApiEnvelope<PaymentMethodAccountRow | null, null>>(
        `/payment-methods/${id}/account`,
        payload,
    );
    return data;
}