// src/api/washNotes.ts
import { api } from './client';
import type { ApiEnvelope } from './client';

export type ProcessStatus = 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';

export interface WashNoteItem {
    id?: string;
    order_id: string;
    qty?: number;
    process_status?: ProcessStatus | null;
    started_at?: string | null;
    finished_at?: string | null;
    note?: string | null;
}

export interface WashNote {
    id: string;
    user_id: number;
    branch_id: string | null;
    note_date: string;
    orders_count: number;
    total_qty: number;
    items?: WashNoteItem[];
}

export interface OrderLite {
    id: string;
    number: string;
    invoice_no?: string | null;
    status?: string;
    customer?: { id: string; name: string } | null;
    default_qty?: number;
}

export interface WashNoteUpsert {
    note_date: string;
    items: WashNoteItem[];
}

export async function listWashNotes(params?: {
    date_from?: string; date_to?: string; page?: number; per_page?: number;
}) {
    const { data } = await api.get<ApiEnvelope<WashNote[]>>('/wash-notes', { params });
    return data;
}

export async function getWashNote(id: string) {
    const { data } = await api.get<ApiEnvelope<WashNote>>(`/wash-notes/${encodeURIComponent(id)}`);
    return data;
}

export async function createWashNote(payload: WashNoteUpsert) {
    const { data } = await api.post<ApiEnvelope<WashNote>>('/wash-notes', payload);
    return data;
}

export async function updateWashNote(id: string, payload: WashNoteUpsert) {
    const { data } = await api.patch<ApiEnvelope<WashNote>>(`/wash-notes/${encodeURIComponent(id)}`, payload);
    return data;
}

export async function deleteWashNote(id: string) {
    const { data } = await api.delete<ApiEnvelope<null>>(`/wash-notes/${encodeURIComponent(id)}`);
    return data;
}

export async function searchOrderCandidates(params: {
    query?: string; date_from?: string; date_to?: string; on_date?: string;
}) {
    const { data } = await api.get<ApiEnvelope<OrderLite[]>>('/wash-notes/candidates', { params });
    return data;
}
