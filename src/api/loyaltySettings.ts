import { api } from './client';
import type { LoyaltySetting, LoyaltySettingPayload } from '../types/loyalty-settings';

export async function getLoyaltySetting(): Promise<{ data: LoyaltySetting }> {
    const res = await api.get<{ data: LoyaltySetting }>('/loyalty-settings');
    return res.data;
}

export async function saveLoyaltySetting(payload: LoyaltySettingPayload): Promise<{ data: LoyaltySetting }> {
    const res = await api.put<{ data: LoyaltySetting }>('/loyalty-settings', payload);
    return res.data;
}
