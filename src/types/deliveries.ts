// src/types/deliveries.ts
export type DeliveryType = 'pickup' | 'delivery' | 'return';

export type DeliveryStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'ON_THE_WAY'
  | 'PICKED'
  | 'HANDOVER'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface Delivery {
  id: string;
  order_id: string;
  type: string;
  zone_id: string | null;
  fee: number;
  assigned_to: string | number | null;
  auto_assigned: boolean;
  status: DeliveryStatus;
  handover_photo?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DeliveryEvent {
  id: string;
  delivery_id: string;
  status: DeliveryStatus;
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DeliveryCreatePayload {
  order_id: string;
  type: DeliveryType | string;
  zone_id?: string | null;
  fee?: number;
}

export interface DeliveryAssignPayload {
  user_id: string | number;
}

export interface DeliveryStatusPayload {
  status: DeliveryStatus;
  note?: string | null;
  /** Optional; hanya diperlukan saat HANDOVER */
  photo?: File | null;
}

export interface DeliveryQuery {
  q?: string;
  status?: DeliveryStatus;
  courier_id?: string | number;
  page?: number;
  per_page?: number;
  branch_id?: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
  errors: Record<string, string[] | string> | null;
}

export interface SingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown> | null;
  message: string;
  errors: Record<string, string[] | string> | null;
}
