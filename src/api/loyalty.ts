// src/api/loyalty.ts
import { api, type ApiEnvelope } from './client';
import type {
  LoyaltySummary,
  LoyaltyHistoryItem,
  LoyaltyHistoryMeta,
  LoyaltyManualAdjustPayload,
} from '../types/loyalty';

export async function getLoyaltySummary(customerId: string, branchId?: string) {
  const { data } = await api.get<ApiEnvelope<LoyaltySummary, null>>(
    `/loyalty/${encodeURIComponent(customerId)}`,
    branchId ? { params: { branch_id: branchId } } : undefined
  );
  return data;
}

export async function getLoyaltyHistory(customerId: string, branchId?: string, page = 1) {
  const { data } = await api.get<ApiEnvelope<LoyaltyHistoryItem[], LoyaltyHistoryMeta>>(
    `/loyalty/${encodeURIComponent(customerId)}/history`,
    {
      params: {
        page,
        ...(branchId ? { branch_id: branchId } : {}),
      },
    }
  );
  return data;
}

export async function adjustLoyaltyManual(customerId: string, payload: LoyaltyManualAdjustPayload) {
  const { data } = await api.post<ApiEnvelope<LoyaltySummary, null>>(
    `/loyalty/${encodeURIComponent(customerId)}/adjust-manual`,
    payload
  );
  return data;
}