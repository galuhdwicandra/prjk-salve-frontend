// src/api/dashboard.ts
import { api } from './client';
import type { ApiEnvelope } from './client';
import type { DashboardSummary, DashboardSummaryMeta } from '../types/dashboard';

export interface DashboardSummaryQuery {
  from: string;
  to: string;
  branch_id?: string | null;
}

export async function getDashboardSummary(params: DashboardSummaryQuery) {
  const { data } = await api.get<ApiEnvelope<DashboardSummary, DashboardSummaryMeta>>(
    '/dashboard/summary',
    { params },
  );
  return data;
}
