// src/types/users.ts
import type { ModuleKey } from '../api/client';

export interface BranchMini {
    id: string;
    code: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    branch_id: string | null;
    is_active: boolean;
    roles: string[];
    branches?: BranchMini[];
    role_label?: string | null;
    modules?: ModuleKey[];
    manager?: boolean;
    show_balance?: boolean;
    custom_price?: boolean;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface UserUpsertPayload {
    name: string;
    username?: string;
    email: string;
    password?: string;
    is_active?: boolean;
    branch_id?: string | null;
    role?: string;
    roles?: string[];
    role_label?: string | null;
    modules?: ModuleKey[];
    manager?: boolean;
    all_branches?: boolean;
    show_balance?: boolean;
    custom_price?: boolean;
    branch_ids?: string[];
}

export interface UserQuery {
    q?: string;
    role?: string;
    branch_id?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface Envelope<T, M = unknown> {
    data: T;
    meta: M;
    message: string | null;
    errors: Record<string, string[]> | null;
}
