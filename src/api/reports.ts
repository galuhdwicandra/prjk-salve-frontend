// src/api/reports.ts
import { api } from './client';
import type { ApiEnvelope } from './client';

export type ReportKind =
    | 'sales'
    | 'orders'
    | 'ready-reminders'
    | 'receivables'
    | 'expenses'
    | 'services'
    | 'deep-clean'
    | 'cash';

export interface ReportQuery {
    from: string;
    to: string;  
    branch_id?: string | null;
    method?: string | null;
    status?: string | null;
    page?: number;
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

export type ReportRow = Record<string, unknown>;

type PreviewResp = ApiEnvelope<ReportRow[], PaginatedMeta>;

export async function getReportPreview(kind: ReportKind, params: ReportQuery): Promise<PreviewResp> {
    const { data } = await api.get<PreviewResp>(`/reports/${kind}`, { params });
    return data;
}

export async function exportReport(
    kind: ReportKind,
    params: ReportQuery & {
        format?: 'csv';
        delimiter?: 'comma' | 'semicolon' | 'tab';
    }
): Promise<Blob> {
    const { data } = await api.get(`/reports/${kind}/export`, {
        params,
        responseType: 'blob',
    });

    return data as Blob;
}

export async function fetchAllReportRows(kind: ReportKind, params: ReportQuery): Promise<ReportRow[]> {
    const rows: ReportRow[] = [];
    let page = 1;
    let lastPage = 1;

    do {
        const resp = await getReportPreview(kind, { ...params, page, per_page: 100 });
        rows.push(...(resp.data ?? []));
        lastPage = resp.meta.last_page;
        page += 1;
    } while (page <= lastPage);

    return rows;
}