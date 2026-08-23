// src/types/vouchers.ts
export type ID = string;

export type VoucherType = 'PERCENT' | 'NOMINAL';
export type VoucherStatus = 'aktif' | 'belum' | 'kadaluwarsa' | 'nonaktif';

export type Voucher = {
    id: ID;
    branch_id: ID | null;
    code: string;
    name: string;
    type: VoucherType;
    value: number;
    start_at: string | null;
    end_at: string | null;
    min_total: number;
    usage_limit: number | null;
    active: boolean;
    is_archived: boolean;
    stack_voucher: boolean;
    stack_discount: boolean;
    percent_after_discount: boolean;
    orders_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type VoucherQuery = {
    q?: string;
    type?: VoucherType;
    status?: VoucherStatus;
    archived?: boolean;
    page?: number;
    per_page?: number;
    branch_id?: ID | null;
};

export type VoucherUpsertPayload = {
    branch_id?: ID | null;
    code: string;
    name: string;
    type: VoucherType;
    value: number;
    start_at?: string | null;
    end_at?: string | null;
    min_total?: number;
    usage_limit?: number | null;
    active?: boolean;
    is_archived?: boolean;
    stack_voucher?: boolean;
    stack_discount?: boolean;
    percent_after_discount?: boolean;
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
