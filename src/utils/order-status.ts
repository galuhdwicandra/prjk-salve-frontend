// src/utils/order-status.ts
import type { OrderBackendStatus } from '../types/orders';

export const ALLOWED_NEXT: Record<OrderBackendStatus, OrderBackendStatus[]> = {
  QUEUE: ['WASHING', 'CANCELED'],
  WASHING: ['DRYING', 'CANCELED'],
  DRYING: ['IRONING', 'READY', 'CANCELED'],
  IRONING: ['READY', 'CANCELED'],
  READY: ['DELIVERING', 'PICKED_UP', 'CANCELED'],
  DELIVERING: ['PICKED_UP', 'CANCELED'],
  PICKED_UP: [],
  CANCELED: [],
};

export function getAllowedNext(current: OrderBackendStatus): OrderBackendStatus[] {
  return ALLOWED_NEXT[current] ?? [];
}
