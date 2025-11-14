import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
    Branch, BranchUpsertPayload, BranchQuery, PaginationMeta,
} from '../types/branches';

export async function listBranches(params: BranchQuery = {}) {
    const { data } = await api.get<ApiEnvelope<Branch[], PaginationMeta | null>>('/branches', { params });
    return data;
}

export async function getBranch(id: string) {
    const { data } = await api.get<ApiEnvelope<Branch, null>>(`/branches/${id}`);
    return data;
}

export async function createBranch(payload: BranchUpsertPayload) {
    const { data } = await api.post<ApiEnvelope<Branch, null>>('/branches', payload);
    return data;
}

export async function updateBranch(id: string, payload: Partial<BranchUpsertPayload>) {
    const { data } = await api.put<ApiEnvelope<Branch, null>>(`/branches/${id}`, payload);
    return data;
}

export async function deleteBranch(id: string) {
    const { data } = await api.delete<ApiEnvelope<null, null>>(`/branches/${id}`);
    return data;
}
