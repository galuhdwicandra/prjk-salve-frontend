// src/types/users.ts
import type { RoleName } from '../api/client';

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    branch_id: string | null;
    is_active: boolean;
    roles: RoleName[];
    created_at?: string | null;
    updated_at?: string | null;
}

export interface UserUpsertPayload {
    name: string;
    username?: string;
    email: string;
    password?: string;
    branch_id?: string | null;
    is_active?: boolean;
    role?: RoleName;        // ⬅️ single role untuk kompatibel create
    roles?: RoleName[];     // ⬅️ multi roles (dipakai via endpoint khusus)
}

export interface UserQuery {
    q?: string;
    role?: RoleName;
    branch_id?: string; // efektif untuk Superadmin
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
