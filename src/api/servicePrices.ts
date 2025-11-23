// src/api/servicePrices.ts
import { api, type ApiEnvelope } from './client';
import type { ServicePrice, ServicePriceSetPayload } from '../types/services';

export async function setServicePrice(payload: ServicePriceSetPayload) {
  const { data } = await api.post<ApiEnvelope<ServicePrice, null>>('/service-prices/set', payload);
  return data;
}

export async function listServicePricesByService(service_id: string, branch_id?: string) {
  const params = { service_id, branch_id };
  const { data } = await api.get<ApiEnvelope<ServicePrice[], null>>('/service-prices/by-service', { params });
  return data;
}

/** Helper sinkron (disarankan): hitung harga efektif dari rows yang sudah di-fetch */
export function computeEffectivePrice(
  rows: ServicePrice[] | undefined,
  branch_id: string | null | undefined,
  defaultPrice: number | string
): number {
  const fallback = typeof defaultPrice === 'string' ? parseFloat(defaultPrice) : (defaultPrice ?? 0);
  if (!rows || !rows.length || !branch_id) return fallback;
  const hit = rows.find(p => String(p.branch_id) === String(branch_id));
  return hit ? Number(hit.price) : fallback;
}

/** Helper async (kompatibilitas): tetap ada, tetapi utamakan computeEffectivePrice di loop */
export async function getEffectivePrice(service: { id: string; price_default: number }, branch_id: string): Promise<number> {
  const res = await listServicePricesByService(service.id, branch_id);
  return computeEffectivePrice(res.data, branch_id, service.price_default);
}
