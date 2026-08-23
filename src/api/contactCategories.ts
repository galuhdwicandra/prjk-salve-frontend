import { api, type ApiEnvelope } from './client';
import type { ContactCategory, ContactCategoryUpsertPayload } from '../types/contacts';

export async function listContactCategories(params: { q?: string } = {}) {
  const { data } = await api.get<ApiEnvelope<ContactCategory[], null>>('/contact-categories', { params });
  return data;
}
export async function createContactCategory(payload: ContactCategoryUpsertPayload) {
  const { data } = await api.post<ApiEnvelope<ContactCategory, null>>('/contact-categories', payload);
  return data;
}

export async function updateContactCategory(id: string, payload: ContactCategoryUpsertPayload) {
  const { data } = await api.put<ApiEnvelope<ContactCategory, null>>(`/contact-categories/${id}`, payload);
  return data;
}

export async function deleteContactCategory(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/contact-categories/${id}`);
  return data;
}
