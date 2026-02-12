// src/store/useAuth.ts
import { apiLogin, apiMe, apiLogout } from '../api/client';
import type { MeUser, RoleName, LoginPayload } from '../api/client';
import { useSyncExternalStore } from 'react';

interface AuthState {
    token: string | null;
    user: MeUser | null;
}

const state: AuthState = {
    token: null,
    user: null,
};

const isDev = typeof import.meta !== 'undefined' && !!import.meta.env?.DEV;

export function homePathByRole(roles: RoleName[]): string {
    // Kasir → POS ; Admin Cabang & Superadmin → Dashboard
    if (roles.includes('Kasir')) return '/pos';
    return '/';
}

const subscribers = new Set<() => void>();
function notify() { subscribers.forEach((fn) => fn()); }

function load() {
    try {
        state.token = localStorage.getItem('pos-salve:token');
        const raw = localStorage.getItem('pos-salve:user');
        state.user = raw ? (JSON.parse(raw) as MeUser) : null;
    } catch (e) {
        state.token = null;
        state.user = null;
        if (isDev) console.warn('Auth load failed:', e);
    }
}

function persist() {
    try {
        if (state.token) localStorage.setItem('pos-salve:token', state.token);
        if (state.user) localStorage.setItem('pos-salve:user', JSON.stringify(state.user));
    } catch (e) {
        if (isDev) console.warn('Auth persist failed:', e);
    }
}

load();

export const useAuth = {
    get token() {
        return state.token;
    },
    get user() {
        return state.user;
    },
    get roles(): RoleName[] {
        return state.user?.roles ?? [];
    },
    hasRole(role: RoleName | RoleName[]): boolean {
        const list = Array.isArray(role) ? role : [role];
        const roles = state.user?.roles ?? [];
        return roles.some((r) => list.includes(r));
    },
    async login(payload: LoginPayload) {
        const res = await apiLogin(payload);
        // backend: { data: { user }, meta: { token } }
        state.token = res?.meta?.token ?? null;
        state.user = res?.data?.user ?? null;
        persist();
        notify();
        if (state.token) {
            // pastikan user lengkap (termasuk branch_id) dari endpoint /me
            await useAuth.fetchMe();
        }
        return state.user;
    },
    async fetchMe() {
        const res = await apiMe();
        state.user = res?.data?.user ?? null;
        persist();
        notify();
        return state.user;
    },
    async logout() {
        try {
            await apiLogout();
        } finally {
            state.token = null;
            state.user = null;
            try {
                localStorage.removeItem('pos-salve:token');
                localStorage.removeItem('pos-salve:user');
            } catch (e) {
                if (isDev) console.warn('Auth localStorage clear failed:', e);
            }
            notify();
        }
    },
    subscribe(fn: () => void) {
        subscribers.add(fn);
        return () => subscribers.delete(fn);
    },
};

/**
* Hook ringan untuk cek role yang reaktif terhadap perubahan auth.
* Penggunaan: const can = useHasRole(['Superadmin','Admin Cabang'])
*/
export function useHasRole(required: RoleName | RoleName[]): boolean {
    // re-render saat auth state berubah
    useSyncExternalStore(
        useAuth.subscribe,
        () => String(useAuth.user?.id ?? '0') + '|' + (useAuth.user?.roles ?? []).join(','),
    );
    const roles = Array.isArray(required) ? required : [required];
    return (useAuth.user?.roles ?? []).some((r) => roles.includes(r));
}