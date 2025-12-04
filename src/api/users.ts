// src/api/users.ts
import { api } from './client';
import type { Envelope } from '../types/users';
import type { User, UserUpsertPayload, UserQuery, PaginationMeta, } from '../types/users';
import type { RoleName } from './client';

export async function listUsers(params: UserQuery = {}) {
    const { data } = await api.get<Envelope<User[], PaginationMeta>>('/users', { params });
    return data;
}

export async function getUser(id: string) {
    const { data } = await api.get<Envelope<User, null>>(`/users/${encodeURIComponent(id)}`);
    return data;
}

export async function createUser(payload: UserUpsertPayload) {
    const { data } = await api.post<Envelope<User, null>>(
        '/users',
        payload,
        { headers: { 'Content-Type': 'application/json' } } // ⬅️ penting
    );
    return data;
}

export async function updateUser(id: string, payload: Partial<UserUpsertPayload>) {
    const { data } = await api.put(`/users/${encodeURIComponent(id)}`, payload);
    return data;
}

export async function deleteUser(id: string) {
    const { data } = await api.delete<Envelope<null, null>>(`/users/${id}`);
    return data;
}

// Aksi khusus dari backend routes:
export async function setUserActive(id: string, is_active: boolean) {
    const { data } = await api.post<Envelope<User, null>>(`/users/${id}/active`, { is_active });
    return data;
}
export async function setUserRoles(id: string, roles: RoleName[]) {
  const { data } = await api.post<Envelope<User, null>>(
    `/users/${encodeURIComponent(id)}/roles`,
    { roles },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}
export async function resetUserPassword(id: string, new_password: string) {
    const payload = { password: new_password, password_confirmation: new_password };
    const { data } = await api.post<Envelope<null, null>>(`/users/${encodeURIComponent(id)}/reset-password`, payload);
    return data;
}
