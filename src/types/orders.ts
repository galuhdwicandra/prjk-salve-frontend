// src/types/orders.ts
import type { Service } from './services';
import type { Customer } from './customers';

export type OrderBackendStatus =
    | 'QUEUE' | 'WASHING' | 'DRYING' | 'IRONING' | 'READY' | 'DELIVERING' | 'PICKED_UP' | 'CANCELED';

export type OrderUiStep = 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';

export type PaymentStatus = 'PENDING' | 'DP' | 'PAID' | 'UNPAID' | 'SETTLED';
export type PaymentMethod = 'PENDING' | 'DP' | 'CASH' | 'QRIS' | 'TRANSFER';

export const UI_TO_BACKEND_STATUS: Record<OrderUiStep, OrderBackendStatus> = {
    QUEUE: 'QUEUE',
    WASH: 'WASHING',
    DRY: 'DRYING',
    FINISHING: 'IRONING',
    COMPLETED: 'READY',
    PICKED_UP: 'PICKED_UP',
};

export const BACKEND_TO_UI_STATUS: Record<OrderBackendStatus, OrderUiStep> = {
    QUEUE: 'QUEUE',
    WASHING: 'WASH',
    DRYING: 'DRY',
    IRONING: 'FINISHING',
    READY: 'COMPLETED',
    DELIVERING: 'COMPLETED',
    PICKED_UP: 'PICKED_UP',
    CANCELED: 'QUEUE',
};

export interface OrderItemInput {
    service_id: string;
    qty: number;
    note?: string | null;
}

export interface OrderItem {
    id: string;
    order_id: string;
    service_id: string;
    qty: number;
    price: number;
    total: number;
    note: string | null;
    service?: Service;
}

export interface Order {
    id: string;
    branch_id: string;
    customer_id: string | null;
    number: string;
    status: OrderBackendStatus;
    subtotal: number;
    discount: number;
    grand_total: number;
    due_amount: number;
    notes: string | null;
    payment_status: PaymentStatus;
    latest_payment_method?: PaymentMethod | null;
    dp_amount: number;
    paid_amount: number;
    paid_at: string | null;
    received_at: string | null;
    ready_at: string | null;
    invoice_no: string | null;
    total: number;
    created_at: string | null;
    updated_at: string | null;
    customer?: Customer | null;
    items?: OrderItem[];
    photos?: OrderPhoto[];
}

export type OrderPhotoKind = 'BEFORE' | 'AFTER';

export interface OrderPhoto {
    id: string;
    order_id: string;
    kind: OrderPhotoKind;
    path: string;
}

export interface OrderCreatePayload {
    branch_id?: string;
    customer_id?: string | null;
    items: OrderItemInput[];
    discount?: number;
    notes?: string | null;
    received_at?: string | null;
    ready_at?: string | null;
}

export interface OrderUpdatePayload {
    customer_id?: string | null;
    items?: OrderItemInput[];
    discount?: number;
    notes?: string | null;
    received_at?: string | null;
    ready_at?: string | null;
}

export interface OrderQuery {
    q?: string;
    status?: OrderBackendStatus;
    payment_status?: PaymentStatus;
    payment_method?: PaymentMethod;
    date_from?: string;
    date_to?: string;
    sort_by?: 'created_at' | 'received_at' | 'ready_at';
    sort_dir?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
    branch_id?: string;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    sort_by?: 'created_at' | 'received_at' | 'ready_at';
    sort_dir?: 'asc' | 'desc';
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
