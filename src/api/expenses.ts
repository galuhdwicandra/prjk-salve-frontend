// src/api/expenses.ts
import { api, type ApiEnvelope } from './client';
import type {
    Expense,
    ExpenseCreatePayload,
    ExpenseUpdatePayload,
    ExpenseQuery,
    SingleResponse,
    PaginationMeta,
} from '../types/expenses';

/** Laravel paginator shape (server) */
type Paginator<T> = {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

function isPaginator<T>(v: unknown): v is Paginator<T> {
    return (
        !!v &&
        typeof v === 'object' &&
        Array.isArray((v as { data?: unknown }).data) &&
        typeof (v as { current_page?: unknown }).current_page !== 'undefined'
    );
}

/** GET /expenses */
export async function listExpenses(
    params: ExpenseQuery = {},
): Promise<ApiEnvelope<Expense[], PaginationMeta | null>> {
    const { data: env } = await api.get<unknown>('/expenses', { params });

    if (isPaginator<Expense>(env)) {
        const out: ApiEnvelope<Expense[], PaginationMeta> = {
            data: env.data,
            meta: {
                current_page: env.current_page,
                per_page: env.per_page,
                total: env.total,
                last_page: env.last_page,
            },
            message: null,
            errors: null,
        };
        return out;
    }

    return {
        data: (env as { data?: Expense[] })?.data ?? [],
        meta: null,
        message: (env as { message?: string | null })?.message ?? null,
        errors: (env as { errors?: Record<string, string[]> | null })?.errors ?? null,
    };
}

/** GET /expenses/{id} */
export async function getExpense(id: string): Promise<SingleResponse<Expense>> {
    const { data } = await api.get<SingleResponse<Expense>>(`/expenses/${encodeURIComponent(id)}`);
    return data;
}

/** POST /expenses (multipart jika ada file 'proof', JSON jika tidak) */
export async function createExpense(payload: ExpenseCreatePayload): Promise<SingleResponse<Expense>> {
    if (payload.proof) {
        const fd = new FormData();
        if (payload.branch_id) fd.append('branch_id', payload.branch_id);
        fd.append('category', payload.category);
        fd.append('amount', String(payload.amount ?? 0));
        if (typeof payload.note !== 'undefined') fd.append('note', payload.note ?? '');
        fd.append('proof', payload.proof);
        const { data } = await api.post<SingleResponse<Expense>>('/expenses', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    const json: {
        branch_id?: string;
        category: string;
        amount: number;
        note?: string | null;
    } = {
        category: payload.category,
        amount: payload.amount,
    };
    if (payload.branch_id) json.branch_id = payload.branch_id;
    if (typeof payload.note !== 'undefined') json.note = payload.note;

    const { data } = await api.post<SingleResponse<Expense>>('/expenses', json);
    return data;
}

export async function updateExpense(
    id: string,
    payload: ExpenseUpdatePayload,
): Promise<SingleResponse<Expense>> {
    if (payload.proof) {
        const fd = new FormData();
        fd.append('category', payload.category);
        fd.append('amount', String(payload.amount ?? 0));
        if (typeof payload.note !== 'undefined') fd.append('note', payload.note ?? '');
        fd.append('proof', payload.proof);
        const { data } = await api.put<SingleResponse<Expense>>(`/expenses/${encodeURIComponent(id)}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    const json: {
        category: string;
        amount: number;
        note?: string | null;
    } = {
        category: payload.category,
        amount: payload.amount,
    };
    if (typeof payload.note !== 'undefined') json.note = payload.note;

    const { data } = await api.put<SingleResponse<Expense>>(`/expenses/${encodeURIComponent(id)}`, json);
    return data;
}

export async function deleteExpense(id: string) {
    return api.delete(`/expenses/${encodeURIComponent(id)}`);
}
