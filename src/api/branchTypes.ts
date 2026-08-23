import { api, type ApiEnvelope } from './client';
import type { OutletType, PaginationMeta } from '../types/branches';

export async function listBranchTypes(params: { per_page?: number } = {}) {
  const { data } = await api.get<ApiEnvelope<OutletType[], PaginationMeta | null>>('/branch-types', { params });
  return data;
}

export async function createBranchType(payload: { name: string }) {
  const { data } = await api.post<ApiEnvelope<OutletType, null>>('/branch-types', payload);
  return data;
}

export async function updateBranchType(id: string, payload: { name: string }) {
  const { data } = await api.put<ApiEnvelope<OutletType, null>>(`/branch-types/${id}`, payload);
  return data;
}

export async function deleteBranchType(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/branch-types/${id}`);
  return data;
}
