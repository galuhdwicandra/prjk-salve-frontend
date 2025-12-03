// src/api/orders.ts
import { api } from './client';
import type {
  Order, OrderCreatePayload, OrderUpdatePayload, OrderQuery,
  Paginated, SingleResponse, OrderBackendStatus
} from '../types/orders';
import type { PaymentCreatePayload, Payment } from '../types/payments';

export async function listOrders(params: OrderQuery = {}) {
  const { data } = await api.get<Paginated<Order>>('/orders', { params });
  return data;
}

export async function getOrder(id: string) {
  const { data } = await api.get<SingleResponse<Order>>(`/orders/${encodeURIComponent(id)}`);
  return data;
}

export async function createOrder(payload: OrderCreatePayload) {
  const { data } = await api.post<SingleResponse<Order>>('/orders', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function updateOrder(id: string, payload: OrderUpdatePayload) {
  const { data } = await api.put<SingleResponse<Order>>(`/orders/${encodeURIComponent(id)}`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function updateOrderStatus(id: string, status: OrderBackendStatus) {
  const { data } = await api.post<
    SingleResponse<{ id: string; status: OrderBackendStatus }>
  >(`/orders/${encodeURIComponent(id)}/status`, { next: status }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function createOrderPayment(
  id: string,
  payload: PaymentCreatePayload
): Promise<{ order: Order; payment?: Payment }> {
  const { data } = await api.post<SingleResponse<{ order: Order; payment?: Payment }>>(
    `/orders/${encodeURIComponent(id)}/payments`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!data?.data) {
    throw new Error('Unexpected server response for payments');
  }
  return {
    order: data.data.order,
    payment: data.data.payment,
  };
}

export async function getOrderReceiptHtml(id: string): Promise<string> {
  const { data } = await api.get(`/orders/${encodeURIComponent(id)}/receipt`, {
    headers: { Accept: 'text/html' },
    responseType: 'text',
    transformResponse: (r) => r, // cegah axios mengutak-atik
  });
  return data as string;
}

export async function openOrderReceipt(id: string, autoPrint = false): Promise<void> {
  const w = window.open("", "_blank");
  if (!w) throw new Error("Popup diblokir browser. Izinkan pop-up untuk situs ini.");

  try {
    const html = await getOrderReceiptHtml(id);
    w.document.open();
    w.document.write(html);
    w.document.close();

    if (autoPrint) {
      w.onload = () => w.print();
    }
  } catch (err) {
    w.close();
    throw err;
  }
}

type ShareLinkPayload = { share_url: string; expires_in_minutes: number };
export async function createOrderShareLink(id: string): Promise<string> {
  const { data } = await api.post<SingleResponse<ShareLinkPayload>>(
    `/orders/${encodeURIComponent(id)}/share-link`
  );
  const url = data?.data?.share_url;
  if (!url) throw new Error('Share link tidak tersedia dari server');
  return url;
}