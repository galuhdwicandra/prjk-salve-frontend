// src/types/customers.ts
export interface Customer {
    id: string;
    branch_id: string;
    name: string;
    whatsapp: string;
    address: string | null;
    notes: string | null;
    tags?: string[] | null;
    is_active: boolean;
    visits_count?: number;
    spend_total?: string | number | null;
    last_order_at?: string | null;
    created_at: string | null;
    updated_at: string | null;
    branch?: {
        id: string;
        name: string;
        code?: string | null;
        address?: string | null;
    } | null;
}

export interface CustomerUpsertPayload {
    branch_id?: string;
    name: string;
    whatsapp: string;
    address?: string | null;
    notes?: string | null;
    tags?: string[] | null;
    is_active?: boolean;
}

export interface CustomerQuery {
    q?: string;
    page?: number;
    per_page?: number;
    branch_id?: string;
    is_active?: boolean;
    visits?: number;
    visits_op?: 'gte' | 'lte';
    sort_by?: 'name' | 'wa' | 'branch' | 'created_at' | 'visits' | 'spend' | 'last_order';
    sort_dir?: 'asc' | 'desc';
}

export interface CustomerLabel {
    id: string;
    name: string;
    color: string | null;
    is_active: boolean;
    usage_count?: number;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface CustomerLabelUpsertPayload {
    name: string;
    color?: string | null;
    is_active?: boolean;
}

export interface CustomerVoucherUsage {
    code: string;
    applied_amount: string;
    applied_at: string | null;
    number: string;
}

export interface CustomerShowResponse {
    data: Customer | null;
    meta: { vouchers: CustomerVoucherUsage[] } | null;
    message: string;
    errors: Record<string, string[] | string> | null;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    active_total?: number;
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
