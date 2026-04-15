import axios from 'axios';
import type { AxiosError } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: { 'Content-Type': 'application/json' },
});

import type { BranchMini } from '../types/users';
export type RoleName = 'Superadmin' | 'Admin Cabang' | 'Kasir' | 'Petugas Cuci' | 'Kurir';
export interface MeUser {
    id: number | string;
    name: string;
    email: string;
    branch_id: number | string | null;
    branch?: BranchMini | null;
    is_active: boolean;
    roles: RoleName[];
}
export interface ApiEnvelope<T = unknown, M = unknown> {
    data: T;
    meta: M;
    message: string | null;
    errors: Record<string, string[]> | null;
}
export interface LoginPayload { login: string; password: string; }
type LoginResp = ApiEnvelope<{ user: MeUser }, { token: string }>;
type MeResp = ApiEnvelope<{ user: MeUser }, null>;
type LogoutResp = ApiEnvelope<null, null>;

// Lazy getter agar tidak coupling langsung ke store (hindari import sirkular)
function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        return window.localStorage.getItem('pos-salve:token');
    } catch {
        // fallback aman saat localStorage diblok
        return null;
    }
}

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.VITE_DEBUG_HTTP === 'true') {
        console.debug('[HTTP]', config.method?.toUpperCase(), config.baseURL, config.url, config.params ?? '', config.data ?? '');
    }
    return config;
});

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

export type FieldErrors = Record<string, string[]>;

export interface NormalizedApiError {
    status: number | null;
    message: string;
    errors: FieldErrors;
    isNetworkError: boolean;
    isValidationError: boolean;
    isUnauthorized: boolean;
    isForbidden: boolean;
    isNotFound: boolean;
    raw: unknown;
}

function firstErrorMessage(errors?: FieldErrors | null): string | null {
    if (!errors) return null;

    for (const messages of Object.values(errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
            const first = messages.find((msg) => typeof msg === 'string' && msg.trim() !== '');
            if (first) return first;
        }
    }

    return null;
}

export function normalizeApiError(err: unknown): NormalizedApiError {
    if (!axios.isAxiosError(err)) {
        return {
            status: null,
            message: 'Terjadi kesalahan yang tidak dikenali.',
            errors: {},
            isNetworkError: false,
            isValidationError: false,
            isUnauthorized: false,
            isForbidden: false,
            isNotFound: false,
            raw: err,
        };
    }

    const status = err.response?.status ?? null;
    const data = err.response?.data as ApiErrorResponse | undefined;
    const errors = data?.errors ?? {};
    const messageFromField = firstErrorMessage(errors);

    let message =
        data?.message?.trim() ||
        messageFromField ||
        err.message ||
        'Terjadi kesalahan pada permintaan.';

    // Rapikan pesan untuk kasus umum
    if (!err.response) {
        message = 'Tidak dapat terhubung ke server. Periksa koneksi atau backend Anda.';
    } else if (status === 401 && !data?.message) {
        message = 'Sesi Anda telah berakhir. Silakan login kembali.';
    } else if (status === 403 && !data?.message) {
        message = 'Anda tidak memiliki izin untuk melakukan aksi ini.';
    } else if (status === 404 && !data?.message) {
        message = 'Data yang diminta tidak ditemukan.';
    } else if (status === 422 && !data?.message && messageFromField) {
        message = messageFromField;
    } else if (status !== null && status >= 500) {
        message = data?.message?.trim() || 'Terjadi kesalahan pada server.';
    }

    return {
        status,
        message,
        errors,
        isNetworkError: !err.response,
        isValidationError: status === 422,
        isUnauthorized: status === 401,
        isForbidden: status === 403,
        isNotFound: status === 404,
        raw: err,
    };
}

export function getFieldErrors(err: unknown): FieldErrors {
    return normalizeApiError(err).errors;
}

export function getErrorMessage(err: unknown, fallback = 'Terjadi kesalahan.'): string {
    const normalized = normalizeApiError(err);
    return normalized.message || fallback;
}

function clearAuthSideEffects(): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem('pos-salve:token');
        window.localStorage.removeItem('pos-salve:user');
    } catch {
        // jika storage tidak tersedia (mode private/SSO), cukup hentikan
        return;
    }
}

api.interceptors.response.use(
    (res) => res,
    (err: AxiosError<ApiErrorResponse>) => {
        const status = err.response?.status;
        if (status === 401) {
            // Bersihkan token & lempar ke /login
            clearAuthSideEffects();
            if (location.pathname !== '/login') {
                location.replace('/login');
            }
        }
        // 422: biarkan caller menampilkan field errors
        return Promise.reject(err);
    }
);

// === Auth API (typed) ===
export async function apiLogin(payload: LoginPayload) {
    const { data } = await api.post<LoginResp>('/auth/login', payload);
    return data;
}
export async function apiMe() {
    const { data } = await api.get<MeResp>('/auth/me');
    return data;
}
export async function apiLogout() {
    const { data } = await api.post<LogoutResp>('/auth/logout');
    return data;
}

export { api };