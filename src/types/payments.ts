import type { AccountingAccount, BranchMini } from './accounting';

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

export interface PaymentMethodAccountRow {
    id: string;
    payment_method_id: string;
    branch_id: string;
    account_id: string;
    branch?: BranchMini | null;
    account?: Pick<AccountingAccount, 'id' | 'code' | 'name' | 'type' | 'is_cash_account'> | null;
}

export interface PaymentMethodMaster {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
    sort_order: number;
    accounts?: PaymentMethodAccountRow[];
}

export interface PaymentMethodUpsertPayload {
    code?: string
    name: string;
    is_active?: boolean;
    sort_order?: number;
}
