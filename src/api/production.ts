import { api } from './client';
import type {
  ProductionActionPayload,
  ProductionBoardQuery,
  ProductionBoardResponse,
  ProductionCorrectionRequestListResponse,
  ProductionCorrectionRequestPayload,
  ProductionCorrectionRequestQuery,
  ProductionCorrectionRequestResponse,
  ProductionCorrectionReviewPayload,
  ProductionMovePayload,
  ProductionReportQuery,
  ProductionReportResponse,
  ProductionTaskResponse,
} from '../types/production';

export async function getProductionBoard(params: ProductionBoardQuery = {}) {
  const { data } = await api.get<ProductionBoardResponse>('/production-board', { params });
  return data;
}

export async function startProductionTask(orderId: string, payload: ProductionActionPayload = {}) {
  const { data } = await api.post<ProductionTaskResponse>(
    `/production-board/${encodeURIComponent(orderId)}/start`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function moveProductionTask(orderId: string, payload: ProductionMovePayload) {
  const { data } = await api.post<ProductionTaskResponse>(
    `/production-board/${encodeURIComponent(orderId)}/move`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function finishProductionTask(orderId: string, payload: ProductionActionPayload = {}) {
  const { data } = await api.post<ProductionTaskResponse>(
    `/production-board/${encodeURIComponent(orderId)}/finish`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function listProductionCorrectionRequests(
  params: ProductionCorrectionRequestQuery = {}
) {
  const { data } = await api.get<ProductionCorrectionRequestListResponse>(
    '/production-board/correction-requests',
    { params }
  );

  return data;
}

export async function createProductionCorrectionRequest(
  orderId: string,
  payload: ProductionCorrectionRequestPayload
) {
  const { data } = await api.post<ProductionCorrectionRequestResponse | ProductionTaskResponse>(
    `/production-board/${encodeURIComponent(orderId)}/correction-requests`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function approveProductionCorrectionRequest(
  id: string,
  payload: ProductionCorrectionReviewPayload = {}
) {
  const { data } = await api.post<ProductionCorrectionRequestResponse>(
    `/production-board/correction-requests/${encodeURIComponent(id)}/approve`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function rejectProductionCorrectionRequest(
  id: string,
  payload: ProductionCorrectionReviewPayload = {}
) {
  const { data } = await api.post<ProductionCorrectionRequestResponse>(
    `/production-board/correction-requests/${encodeURIComponent(id)}/reject`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  return data;
}

export async function getProductionStaffDailyReport(params: ProductionReportQuery = {}) {
  const { data } = await api.get<ProductionReportResponse>(
    '/production-board/reports/staff-daily',
    { params }
  );

  return data;
}