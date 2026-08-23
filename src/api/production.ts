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
  ProductionTaskResponse,
  WorkRecapQuery,
  WorkRecapResponse,
  WorkRecapRow,
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

export async function getWorkRecap(params: WorkRecapQuery = {}) {
  const { data } = await api.get<WorkRecapResponse>(
    '/production-board/reports/work-recap',
    { params }
  );

  return data;
}

export async function fetchAllWorkRecapRows(params: WorkRecapQuery): Promise<WorkRecapRow[]> {
  const rows: WorkRecapRow[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await getWorkRecap({ ...params, page, per_page: 100 });
    rows.push(...(res.data ?? []));
    lastPage = res.meta.last_page;
    page += 1;
  } while (page <= lastPage);

  return rows;
}