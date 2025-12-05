// src/api/loyalty.ts
import { api, type ApiEnvelope } from './client';
import type { LoyaltySummary } from '../types/loyalty';

export async function getLoyaltySummary(customerId: string, branchId?: string) {
    const { data } = await api.get<ApiEnvelope<LoyaltySummary, null>>(
        `/loyalty/${encodeURIComponent(customerId)}`,
        // kirim branch_id agar backend membaca akun loyalti pada cabang aktif
        branchId ? { params: { branch_id: branchId } } : undefined
    );
    // Ikuti pola modul lain yang mengembalikan envelope (lihat branches.ts).
    return data; // ApiEnvelope<LoyaltySummary, null>
}