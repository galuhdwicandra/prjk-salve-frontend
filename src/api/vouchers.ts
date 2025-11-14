// src/api/vouchers.ts
import { api } from '../api/client';
import type {
    ID, Voucher, VoucherQuery, VoucherUpsertPayload,
    ListResponse, ItemResponse, ApplyVoucherPayload, ApplyVoucherResponse
} from '../types/vouchers';

export async function listVouchers(query: VoucherQuery = {}): Promise<ListResponse<Voucher>> {
    const res = await api.get<ListResponse<Voucher>>('/vouchers', { params: query });
    return res.data;
}

export async function getVoucher(id: ID): Promise<ItemResponse<Voucher>> {
    const res = await api.get<ItemResponse<Voucher>>(`/vouchers/${id}`);
    return res.data;
}

export async function createVoucher(payload: VoucherUpsertPayload): Promise<ItemResponse<Voucher>> {
    const res = await api.post<ItemResponse<Voucher>>('/vouchers', payload);
    return res.data;
}

export async function updateVoucher(id: ID, payload: VoucherUpsertPayload): Promise<ItemResponse<Voucher>> {
    const res = await api.put<ItemResponse<Voucher>>(`/vouchers/${id}`, payload);
    return res.data;
}

export async function deleteVoucher(id: ID): Promise<void> {
    await api.delete(`/vouchers/${id}`);
}

export async function applyVoucherToOrder(orderId: ID, payload: ApplyVoucherPayload): Promise<ApplyVoucherResponse> {
    const res = await api.post<ApplyVoucherResponse>(`/orders/${orderId}/apply-voucher`, payload);
    return res.data;
}
