// src/api/reports.ts
import { api } from './client';
import type { ApiEnvelope } from './client';

export type ReportKind = 'sales' | 'payments' | 'orders' | 'receivables' | 'expenses';

export interface ReportQuery {
    from: string; // 'YYYY-MM-DD'
    to: string;   // 'YYYY-MM-DD'
    branch_id?: string | null;
    method?: string | null; // sales
    status?: string | null; // orders/receivables
    per_page?: number;
}

export interface PaginatedMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    kind: ReportKind;
    columns: string[];
}

type PreviewResp = ApiEnvelope<any[], PaginatedMeta>;

export async function getReportPreview(kind: ReportKind, params: ReportQuery): Promise<PreviewResp> {
    const { data } = await api.get<PreviewResp>(`/reports/${kind}`, { params });
    return data;
}

export async function exportReport(kind: ReportKind, params: ReportQuery & { format?: 'csv' | 'xlsx', delimiter?: 'comma' | 'semicolon' | 'tab' }) {
    const { data } = await api.get(`/reports/${kind}/export`, {
        params,
        responseType: 'blob',
    });
    return data as Blob;
}
