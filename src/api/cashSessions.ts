import { api } from './client';
import type {
  CashSession,
  CashMutation,
  CashSessionQuery,
  Envelope,
  PaginationMeta,
  OpenCashSessionPayload,
  UpdateCashSessionPayload,
  CloseCashSessionPayload,
  WithdrawalPayload,
} from '../types/cash';

export async function listCashSessions(params: CashSessionQuery = {}) {
  const { data } = await api.get<Envelope<CashSession[], PaginationMeta>>('/cash-sessions', { params });
  return data;
}

export async function getCashSession(id: string) {
  const { data } = await api.get<Envelope<CashSession, { system_closing: number }>>(`/cash-sessions/${encodeURIComponent(id)}`);
  return data;
}

export async function openCashSession(payload: OpenCashSessionPayload) {
  const { data } = await api.post<Envelope<CashSession, null>>('/cash-sessions/open', payload);
  return data;
}

export async function updateCashSession(id: string, payload: UpdateCashSessionPayload) {
  const { data } = await api.put<Envelope<CashSession, { system_closing: number }>>(
    `/cash-sessions/${encodeURIComponent(id)}`,
    payload
  );
  return data;
}

export async function closeCashSession(id: string, payload: CloseCashSessionPayload) {
  const { data } = await api.post<Envelope<CashSession, null>>(`/cash-sessions/${encodeURIComponent(id)}/close`, payload);
  return data;
}

export async function createCashWithdrawal(id: string, payload: WithdrawalPayload) {
  const { data } = await api.post<Envelope<CashMutation, null>>(`/cash-sessions/${encodeURIComponent(id)}/withdrawals`, payload);
  return data;
}

export type CashTodayMeta = {
  system_closing: number;
  cash_in_total: number;
  cash_out_total: number;
  withdrawal_total: number;
  has_open_session: boolean;
  business_date?: string;
};

export async function getCashToday(params?: { branch_id?: string; business_date?: string }) {
  const { data } = await api.get<Envelope<CashSession | null, CashTodayMeta>>('/cash-sessions/today', {
    params,
  });
  return data;
}