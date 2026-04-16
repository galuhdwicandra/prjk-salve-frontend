import type { OrderBackendStatus } from '../types/orders';

export const ALL_ORDER_STATUSES: OrderBackendStatus[] = [
  'QUEUE',
  'WASHING',
  'DRYING',
  'IRONING',
  'READY',
  'DELIVERING',
  'PICKED_UP',
  'CANCELED',
];

export function getAllowedNext(current: OrderBackendStatus): OrderBackendStatus[] {
  return ALL_ORDER_STATUSES.filter((status) => status !== current);
}