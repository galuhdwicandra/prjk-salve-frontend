import { api, type ApiEnvelope } from './client';

export type SortingTab = 'incoming' | 'delivery-note' | 'at-subcon' | 'ready';
export type SortingDestination = 'workshop' | 'vendor';
export type DeliveryNoteKind = 'kirim' | 'ambil';
export type DeliveryNoteStatus = 'PENDING' | 'PICKED' | 'COMPLETED';

export interface SortingOrder {
  id: string;
  number: string;
  invoice_no: string | null;
  customer_name: string | null;
  customer_id: string | null;
  customer_address: string | null;
  customer_whatsapp: string | null;
  branch: { id: string; name: string; code: string; type: string } | null;
  qty: number;
  processing_destination: SortingDestination | null;
  destination_contact: { id: string; name: string } | null;
  has_before_photo: boolean;
  photos: { kind: string; path: string }[];
  received_at: string | null;
  ready_at: string | null;
  is_late: boolean;
  completed_at: string | null;
  due_amount: number;
  is_paid: boolean;
  created_at: string | null;
}

export interface SortingMeta {
  tab: SortingTab;
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface SortingQuery {
  q?: string;
  branch_id?: string;
  photo?: 'yes' | 'no';
  processing_destination?: SortingDestination;
  contact_id?: string;
  per_page?: number;
  page?: number;
}

export interface SkippedOrder {
  order_id: string;
  number: string | null;
  customer_id?: string;
  reason: string;
}

export interface DeliveryNoteOrder {
  id: string;
  number: string;
  invoice_no: string | null;
  customer_name: string | null;
  ready_at: string | null;
  branch?: { id: string; name: string; code: string } | null;
  customer?: { id: string; name: string } | null;
  items?: { id: string; qty: number; service?: { id: string; name: string } | null }[];
}

export interface DeliveryNote {
  id: string;
  number: string;
  kind: DeliveryNoteKind;
  note_date: string;
  to_type: SortingDestination;
  status: DeliveryNoteStatus;
  proofs: Record<string, string[]> | null;
  picked_at: string | null;
  completed_at: string | null;
  orders_count?: number;
  orders?: DeliveryNoteOrder[];
  branch?: { id: string; name: string; code: string } | null;
  to_branch?: { id: string; name: string; code: string } | null;
  to_contact?: { id: string; name: string } | null;
  from_contact?: { id: string; name: string } | null;
  creator?: { id: number; name: string } | null;
}

export async function listSorting(tab: SortingTab, params: SortingQuery = {}) {
  const { data } = await api.get<ApiEnvelope<SortingOrder[], SortingMeta>>(`/sorting/${tab}`, { params });
  return data;
}

export async function sortOrders(order_ids: string[], destination: SortingDestination) {
  const { data } = await api.post<
    ApiEnvelope<{ sorted: { order_id: string; number: string }[]; skipped: SkippedOrder[] }, null>
  >('/sorting/sort', { order_ids, destination });
  return data;
}

export async function handoverOrders(order_ids: string[], photos: File[]) {
  const fd = new FormData();
  order_ids.forEach((id) => fd.append('order_ids[]', id));
  photos.forEach((f) => fd.append('photos[]', f));

  const { data } = await api.post<
    ApiEnvelope<{ handed_over: { order_id: string; number: string }[]; skipped: SkippedOrder[] }, null>
  >('/sorting/handover', fd);
  return data;
}

export async function sendOrdersByCourier(order_ids: string[], addresses: Record<string, string> = {}) {
  const { data } = await api.post<
    ApiEnvelope<
      { sent: { order_id: string; number: string; delivery_number: string }[]; skipped: SkippedOrder[] },
      null
    >
  >('/sorting/courier', { order_ids, addresses });
  return data;
}

export async function listDeliveryNotes(
  params: {
    kind?: DeliveryNoteKind;
    status?: string;
    q?: string;
    branch_id?: string;
    per_page?: number;
    page?: number;
  } = {},
) {
  const { data } = await api.get<ApiEnvelope<DeliveryNote[], SortingMeta>>('/delivery-notes', { params });
  return data;
}

export async function getDeliveryNote(id: string) {
  const { data } = await api.get<ApiEnvelope<DeliveryNote, null>>(`/delivery-notes/${encodeURIComponent(id)}`);
  return data;
}

export async function createDeliveryNote(payload: {
  order_ids: string[];
  note_date: string;
  to_type: SortingDestination;
  destination_id: string;
}) {
  const { data } = await api.post<ApiEnvelope<DeliveryNote, null>>('/delivery-notes', payload);
  return data;
}

export async function createPickupNote(payload: { order_ids: string[]; note_date: string; branch_id: string }) {
  const { data } = await api.post<ApiEnvelope<DeliveryNote, null>>('/delivery-notes/pickup', payload);
  return data;
}

async function postProof(id: string, action: 'complete' | 'pick' | 'arrive', photos: File[]) {
  const fd = new FormData();
  photos.forEach((f) => fd.append('photos[]', f));

  const { data } = await api.post<ApiEnvelope<DeliveryNote, null>>(
    `/delivery-notes/${encodeURIComponent(id)}/${action}`,
    fd,
  );
  return data;
}

export const completeDeliveryNote = (id: string, photos: File[]) => postProof(id, 'complete', photos);
export const pickDeliveryNote = (id: string, photos: File[]) => postProof(id, 'pick', photos);
export const arriveDeliveryNote = (id: string, photos: File[]) => postProof(id, 'arrive', photos);
