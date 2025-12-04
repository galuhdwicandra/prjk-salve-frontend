// src/api/deliveries.ts
import { api } from './client';
import type {
  Delivery, DeliveryCreatePayload, DeliveryAssignPayload, DeliveryStatusPayload,
  DeliveryQuery, Paginated, SingleResponse,
} from '../types/deliveries';

/** List deliveries (untuk DeliveryIndex) */
export async function listDeliveries(params: DeliveryQuery = {}) {
  const { data } = await api.get<Paginated<Delivery>>('/deliveries', { params });
  return data;
}

/** Create delivery + auto-assign di backend (M7) */
export async function createDelivery(payload: DeliveryCreatePayload) {
  const { data } = await api.post<SingleResponse<Delivery>>(
    '/deliveries',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

/** Assign/ubah kurir */
export async function assignCourier(id: string, payload: DeliveryAssignPayload) {
  const { data } = await api.put<SingleResponse<Delivery>>(
    `/deliveries/${encodeURIComponent(id)}/assign`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

/** Update status (+ opsional upload bukti serah-terima) */
export async function updateDeliveryStatus(id: string, payload: DeliveryStatusPayload) {
  const hasFile = !!payload.photo;
  if (hasFile) {
    const fd = new FormData();
    fd.append('status', payload.status);
    if (payload.note) fd.append('note', payload.note);
    if (payload.photo) fd.append('photo', payload.photo);
    const { data } = await api.put<SingleResponse<Delivery>>(
      `/deliveries/${encodeURIComponent(id)}/status`,
      fd
    );
    return data;
  }
  const { data } = await api.put<SingleResponse<Delivery>>(
    `/deliveries/${encodeURIComponent(id)}/status`,
    { status: payload.status, note: payload.note ?? null },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}
