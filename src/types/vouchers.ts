// src/types/vouchers.ts
export type ID = string;

export type VoucherType = 'PERCENT' | 'NOMINAL';

export type Voucher = {
    id: ID;
    branch_id: ID | null;
    code: string;
    type: VoucherType;
    value: number;
    start_at: string | null;
    end_at: string | null;  
    min_total: number;
    usage_limit: number | null;
    active: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VoucherQuery = {
    q?: string;
    page?: number;
    per_page?: number;
    active?: boolean;
    branch_id?: ID | null;
};

export type VoucherUpsertPayload = {
    branch_id?: ID | null;
    code: string;
    type: VoucherType;
    value: number;
    start_at?: string | null;
    end_at?: string | null;
    min_total?: number;
    usage_limit?: number | null;
    active?: boolean;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type ListResponse<T> = { data: T[]; meta: PaginationMeta };
export type ItemResponse<T> = { data: T };

export type ApplyVoucherPayload = { code: string };
export type ApplyVoucherResponse = {
    applied_amount: number;
    order: unknown;
};
