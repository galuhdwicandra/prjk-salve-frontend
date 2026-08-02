import type { Order } from '../types/orders';

export type OrderMoney = Pick<Order, 'grand_total' | 'paid_amount'>;

export type PayStatus = 'belum' | 'dp' | 'lunas';

export function orderPaid(order: OrderMoney): number {
    return Math.max(0, order.paid_amount);
}

export function orderOutstanding(order: OrderMoney): number {
    return Math.max(0, order.grand_total - orderPaid(order));
}

export function payStatus(order: OrderMoney): PayStatus {
    const paid = orderPaid(order);
    if (paid <= 0) return 'belum';
    if (paid >= order.grand_total) return 'lunas';
    return 'dp';
}
