// src/types/receivables.ts
import type { PaymentMethod, Payment } from "../types/payments";
import type { Order } from "../types/orders";

export type ReceivableStatus = "OPEN" | "PARTIAL" | "SETTLED" | "OVERDUE" | "CANCELLED";

export interface Receivable {
    id: string;
    order_id: string;
    remaining_amount: number;
    status: ReceivableStatus;
    due_date: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    order?: {
        id: string;
        branch_id: string;
        customer_id: string | null;
        invoice_no: string | null;
        grand_total: number;
        paid_amount: number;
        due_amount: number;
        status: string;
        payment_status: string;
        created_at: string;
        customer?: {
            id: string;
            name: string | null;
            phone?: string | null;
            whatsapp?: string | null;
        } | null;
    } | null;
}

export interface ReceivableQuery {
    q?: string;
    status?: ReceivableStatus | "";
    due_before?: string; // YYYY-MM-DD
    customer_id?: string;
    page?: number;
    per_page?: number;
    branch_id?: string;
}

export interface ReceivableSettlePayload {
    amount: number;
    method: PaymentMethod; // CASH | QRIS | TRANSFER
    paid_at?: string;
    note?: string | null;
}

export interface ReceivableSettleResult {
    receivable: Receivable;
    order: Order | { order: Order;[k: string]: unknown };
    payment?: Payment | null;
    order_id?: string;
    receipt_url?: string | null;
    share_url?: string | null;
}
