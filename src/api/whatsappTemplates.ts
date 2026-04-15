import { api, type ApiEnvelope } from './client';
import type {
    WhatsappTemplate,
    WhatsappTemplateQuery,
    WhatsappTemplateUpsertPayload,
    PaginationMeta,
} from '../types/whatsapp-templates';

export async function listWhatsappTemplates(params: WhatsappTemplateQuery = {}) {
    const { data } = await api.get<ApiEnvelope<WhatsappTemplate[], PaginationMeta | null>>(
        '/whatsapp-templates',
        { params }
    );
    return data;
}

export async function getWhatsappTemplate(id: string) {
    const { data } = await api.get<ApiEnvelope<WhatsappTemplate, null>>(`/whatsapp-templates/${id}`);
    return data;
}

export async function createWhatsappTemplate(payload: WhatsappTemplateUpsertPayload) {
    const { data } = await api.post<ApiEnvelope<WhatsappTemplate, null>>('/whatsapp-templates', payload);
    return data;
}

export async function updateWhatsappTemplate(id: string, payload: Partial<WhatsappTemplateUpsertPayload>) {
    const { data } = await api.put<ApiEnvelope<WhatsappTemplate, null>>(`/whatsapp-templates/${id}`, payload);
    return data;
}

export async function deleteWhatsappTemplate(id: string) {
    const { data } = await api.delete<ApiEnvelope<null, null>>(`/whatsapp-templates/${id}`);
    return data;
}

export async function resolveWhatsappTemplate(
    key: 'receipt_pending' | 'receipt_paid',
    branch_id?: string | null,
) {
    const params: Record<string, string> = { key };
    if (branch_id) params.branch_id = branch_id;

    const { data } = await api.get<ApiEnvelope<WhatsappTemplate | null, { fallback_global: boolean }>>(
        '/whatsapp-templates/resolve',
        { params }
    );
    return data;
}