// src/api/customers.ts
import { api } from './client';
import { isAxiosError } from 'axios';
import type {
    Customer,
    CustomerQuery,
    CustomerUpsertPayload,
    Paginated,
    SingleResponse,
} from '../types/customers';

export async function listCustomers(params: CustomerQuery): Promise<Paginated<Customer>> {
    const { data } = await api.get<Paginated<Customer>>('/customers', { params });
    return data;
}

export async function getCustomer(id: string): Promise<SingleResponse<Customer>> {
    const { data } = await api.get<SingleResponse<Customer>>(`/customers/${id}`);
    return data;
}

export async function createCustomer(payload: CustomerUpsertPayload): Promise<SingleResponse<Customer>> {
    const { data } = await api.post<SingleResponse<Customer>>('/customers', payload);
    return data;
}

export async function updateCustomer(id: string, payload: Partial<CustomerUpsertPayload>): Promise<SingleResponse<Customer>> {
    const { data } = await api.put<SingleResponse<Customer>>(`/customers/${id}`, payload);
    return data;
}

export async function deleteCustomer(id: string): Promise<SingleResponse<null>> {
    const { data } = await api.delete<SingleResponse<null>>(`/customers/${id}`);
    return data;
}

/**
 * Cari pelanggan berdasarkan nomor WhatsApp persis (spasi akan dihilangkan di backend).
 * GET /customers/search-wa?wa=08123...
 */
export async function searchCustomerByWA(wa: string, branch_id?: string): Promise<SingleResponse<Customer>> {
    const params: Record<string, string> = { wa };
    if (branch_id) params.branch_id = branch_id; // hanya dihormati untuk Superadmin
    const { data } = await api.get<SingleResponse<Customer>>('/customers/search-wa', { params });
    return data;
}

/**
 * Helper otomasi checkout:
 * - Coba cari by WA.
 * - Jika 404, buat customer baru dengan nama yang diberikan (fallback ke 'Pelanggan').
 */
export async function resolveOrCreateCustomerByWA(
    wa: string,
    name: string,
    branch_id?: string,
    address?: string | null,
): Promise<Customer> {
    try {
        const found = await searchCustomerByWA(wa, branch_id);
        if (found.data) return found.data;
    } catch (err: unknown) {
        // Abaikan hanya 404 (not found); error lain tetap dilempar
        if (!isAxiosError(err) || err.response?.status !== 404) {
            throw err;
        }
    }
    const created = await createCustomer({
        branch_id,
        name: name?.trim() || 'Pelanggan',
        whatsapp: wa,
        address: address ?? null,
    });
    if (!created.data) {
        throw new Error('Gagal membuat pelanggan');
    }
    return created.data;
}
