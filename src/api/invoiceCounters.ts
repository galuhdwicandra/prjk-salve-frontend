import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
  InvoiceCounter, DocumentNumber, DocumentNumberPreviewMeta, DocumentNumberSavePayload,
} from '../types/branches';

export async function previewDocumentNumbers(branch_id: string) {
  const { data } = await api.get<ApiEnvelope<DocumentNumber[], DocumentNumberPreviewMeta>>(
    '/invoice-counters/preview',
    { params: { branch_id } },
  );
  return data;
}

export async function saveDocumentNumber(id: string | null, payload: DocumentNumberSavePayload) {
  const { data } = id
    ? await api.put<ApiEnvelope<InvoiceCounter, null>>(`/invoice-counters/${id}`, payload)
    : await api.post<ApiEnvelope<InvoiceCounter, null>>('/invoice-counters', payload);
  return data;
}
