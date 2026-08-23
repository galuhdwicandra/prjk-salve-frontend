import { api, type ApiEnvelope } from './client';
import type { Contact, ContactUpsertPayload, ContactQuery, PaginationMeta } from '../types/contacts';

export async function listContacts(params: ContactQuery = {}) {
  const { data } = await api.get<ApiEnvelope<Contact[], PaginationMeta | null>>('/contacts', { params });
  return data;
}
export async function createContact(payload: ContactUpsertPayload) {
  const { data } = await api.post<ApiEnvelope<Contact, null>>('/contacts', payload);
  return data;
}
export async function updateContact(id: string, payload: Partial<ContactUpsertPayload>) {
  const { data } = await api.put<ApiEnvelope<Contact, null>>(`/contacts/${id}`, payload);
  return data;
}
export async function deleteContact(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/contacts/${id}`);
  return data;
}
