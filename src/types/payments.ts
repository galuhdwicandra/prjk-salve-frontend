export type PaymentMethod = string;

export type PaymentCreatePayload = {
    method: PaymentMethod;
    amount: number;
    paid_at?: string | null;
    note?: string | null;
};

export type Payment = {
    id: string;
    order_id: string;
    method: PaymentMethod;
    amount: number;
    paid_at: string | null;
    note: string | null;
    created_at: string;
};

export interface PaymentMethodMaster {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
    sort_order: number;
}

export interface PaymentMethodUpsertPayload {
    code: string;
    name: string;
    is_active?: boolean;
    sort_order?: number;
}