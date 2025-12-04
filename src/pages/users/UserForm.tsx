// src/pages/users/UserForm.tsx
import { useEffect, useMemo, useState } from 'react';
import { createUser, getUser, updateUser, setUserRoles, resetUserPassword } from '../../api/users';
import type { UserUpsertPayload } from '../../types/users';
import type { RoleName } from '../../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import { listBranches } from '../../api/branches';
import type { Branch } from '../../types/branches';
import { useAuth, useHasRole } from '../../store/useAuth';
import { isAxiosError } from 'axios';

const ALL_ROLES: RoleName[] = ['Superadmin', 'Admin Cabang', 'Kasir', 'Petugas Cuci', 'Kurir'];
function allowedRoles(isSuperadmin: boolean): RoleName[] {
  return isSuperadmin ? ALL_ROLES : (ALL_ROLES.filter(r => r !== 'Superadmin') as RoleName[]);
}

type ApiErrBody = { message?: string; errors?: Record<string, string[]> };
function getHttpStatus(err: unknown): number | null {
  return isAxiosError<ApiErrBody>(err) ? (err.response?.status ?? null) : null;
}
function getFieldErrors(err: unknown): Record<string, string[]> {
  return isAxiosError<ApiErrBody>(err) && err.response?.data?.errors
    ? err.response.data.errors
    : {};
}
function getMessage(err: unknown, fallback = 'Terjadi kesalahan'): string {
  return isAxiosError<ApiErrBody>(err) && err.response?.data?.message
    ? err.response.data.message
    : fallback;
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);
  const nav = useNavigate();

  const me = useAuth.user;
  const isSuperadmin = useHasRole('Superadmin');
  const isAdminCabang = useHasRole('Admin Cabang');
  const canManage = useHasRole(['Superadmin', 'Admin Cabang']);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState<UserUpsertPayload>({
    name: '',
    username: '',
    email: '',
    branch_id: isSuperadmin ? null : (me?.branch_id ? String(me.branch_id) : ('' as unknown as null)),
    is_active: true,
    roles: [],
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // debug awal (dipertahankan)
  console.log('[UserForm] mount:', { editing, id, me, isSuperadmin, isAdminCabang, canManage });

  const v = useMemo(() => ({
    name: form.name ?? '',
    username: form.username ?? '',
    email: form.email ?? '',
    password: form.password ?? '',
    branch_id: form.branch_id === null ? '' : (form.branch_id ?? ''),
    is_active: !!form.is_active,
    roles: Array.isArray(form.roles) ? form.roles : [],
  }), [form]);

  useEffect(() => {
    (async () => {
      console.log('[UserForm] useEffect triggered', { editing, id });

      try {
        const br = await listBranches({ per_page: 100 });
        console.log('[UserForm] fetched branches:', br.data);
        setBranches(br.data ?? []);
      } catch (err) {
        console.warn('[UserForm] gagal load branches:', err);
      }

      if (editing) {
        setLoading(true);
        try {
          const res = await getUser(id!);
          const u = res.data;
          console.log('[UserForm] fetched user for edit:', u);

          setForm({
            name: u?.name ?? '',
            username: u?.username ?? '',
            email: u?.email ?? '',
            branch_id: (u?.branch_id ?? null),
            is_active: typeof u?.is_active === 'boolean' ? u.is_active : true,
            roles: Array.isArray(u?.roles) ? (u.roles as RoleName[]) : [],
            password: '',
          });
        } catch (err: unknown) {
          console.error('[UserForm] gagal load user:', err);
          const status = getHttpStatus(err);
          if (status === 403) {
            setError('Anda tidak berhak melihat user ini (beda cabang).');
          } else if (status === 404) {
            setError('User tidak ditemukan.');
          } else {
            setError(getMessage(err, 'Gagal memuat user'));
          }
        } finally {
          setLoading(false);
        }
      } else {
        if (!isSuperadmin && me?.branch_id) {
          console.log('[UserForm] new user mode, auto-assign branch_id:', me.branch_id);
          setForm((f) => ({ ...f, branch_id: String(me.branch_id) }));
        }
      }
    })();
  }, [editing, id, isSuperadmin, me?.branch_id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canManage) {
      console.warn('[UserForm] submit blocked, user tidak punya akses');
      return;
    }

    console.log('[UserForm] submitting...', { editing, v });

    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      if (editing) {
        const payload: Partial<UserUpsertPayload> = {
          name: v.name,
          username: v.username,
          email: v.email,
          branch_id: isSuperadmin ? (v.branch_id || null) : (me?.branch_id ? String(me.branch_id) : null),
          is_active: v.is_active,
        };
        console.log('[UserForm] updateUser payload:', payload);
        await updateUser(id!, payload);

        if (!editing && v.roles.length === 0) {
          console.warn('[UserForm] role kosong saat update');
          setFieldErrors({ roles: ['Pilih minimal satu role'] });
          return;
        }

        try {
          console.log('[UserForm] setUserRoles', v.roles);
          await setUserRoles(id!, v.roles ?? []);
        } catch (err: unknown) {
          console.error('[UserForm] gagal setUserRoles:', err);
          if (getHttpStatus(err) === 403) {
            alert('Perubahan roles ditolak (kewenangan/cabang tidak sesuai). Data lain tetap tersimpan.');
          } else throw err;
        }
      } else {
        if (v.roles.length === 0) {
          console.warn('[UserForm] role kosong saat create');
          setFieldErrors({ roles: ['Pilih minimal satu role'] });
          setSaving(false);
          return;
        }

        const primaryRole = v.roles[0] as RoleName;
        const payload: UserUpsertPayload = {
          name: v.name,
          username: v.username,
          email: v.email,
          password: v.password,
          branch_id: isSuperadmin ? (v.branch_id || null) : (me?.branch_id ? String(me.branch_id) : null),
          is_active: v.is_active,
          role: primaryRole,
        };
        console.log('[UserForm] createUser payload:', payload);

        const created = await createUser(payload);
        const newUserId = String(created.data.id);
        console.log('[UserForm] created user:', created.data);

        try {
          console.log('[UserForm] setUserRoles (after create):', v.roles);
          await setUserRoles(newUserId, v.roles);
        } catch (err: unknown) {
          console.error('[UserForm] gagal setUserRoles setelah create:', err);
          if (getHttpStatus(err) === 403) {
            alert('User berhasil dibuat, tetapi perubahan roles sebagian ditolak (kewenangan/cabang).');
          } else throw err;
        }
      }

      alert('Tersimpan');
      console.log('[UserForm] selesai simpan, redirect ke /users');
      nav('/users', { replace: true });
    } catch (err: unknown) {
      console.error('[UserForm] error saat submit:', err);
      setFieldErrors(getFieldErrors(err));
      setError(getMessage(err, 'Gagal menyimpan'));
    } finally {
      console.log('[UserForm] submit selesai');
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{editing ? 'Edit User' : 'New User'}</h1>
          <p className="text-xs text-gray-600">Kelola identitas, peran (multi-role), dan status aktif</p>
        </div>
      </header>

      {/* Error/Loading info */}
      {loading && <div className="text-sm text-gray-500">Memuat…</div>}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {/* Form card */}
      <form className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1" onSubmit={onSubmit}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama */}
          <div className="grid gap-1">
            <label className="text-xs font-medium" htmlFor="name">Nama *</label>
            <input
              id="name"
              className="input"
              value={v.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'err-name' : undefined}
            />
            {fieldErrors.name && (
              <p id="err-name" className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>
            )}
          </div>

          {/* Username */}
          <div className="grid gap-1">
            <label className="text-xs font-medium" htmlFor="username">Username{!editing ? ' *' : ''}</label>
            <input
              id="username"
              type="text"
              className="input"
              value={v.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value.toLowerCase(), // normalisasi ringan
                })
              }
              autoComplete="username"
              pattern="^[a-z0-9_.]{3,50}$"
              title="3–50 karakter: huruf kecil, angka, underscore (_), atau titik (.)"
              required={!editing}
              aria-invalid={!!fieldErrors.username}
              aria-describedby={fieldErrors.username ? 'err-username' : undefined}
            />
            {fieldErrors.username && (
              <p id="err-username" className="text-xs text-red-600">{fieldErrors.username.join(', ')}</p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <label className="text-xs font-medium" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              className="input"
              value={v.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'err-email' : undefined}
            />
            {fieldErrors.email && (
              <p id="err-email" className="text-xs text-red-600">{fieldErrors.email.join(', ')}</p>
            )}
          </div>

          {/* Password (create only) */}
          {!editing && (
            <div className="grid gap-1">
              <label className="text-xs font-medium" htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                className="input"
                value={v.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'err-password' : undefined}
              />
              {fieldErrors.password && (
                <p id="err-password" className="text-xs text-red-600">{fieldErrors.password.join(', ')}</p>
              )}
            </div>
          )}

          {/* Branch */}
          <div className="grid gap-1">
            <label className="text-xs font-medium" htmlFor="branch">Branch</label>
            <select
              id="branch"
              className="input"
              value={v.branch_id} // '' == null
              onChange={(e) =>
                setForm({
                  ...form,
                  branch_id: isSuperadmin ? (e.target.value || null) : (me?.branch_id ? String(me.branch_id) : null),
                })
              }
              disabled={!isSuperadmin} // Admin Cabang tidak boleh ganti cabang
              aria-invalid={!!fieldErrors.branch_id}
              aria-describedby={fieldErrors.branch_id ? 'err-branch' : undefined}
            >
              {isSuperadmin && <option value="">(Tanpa branch)</option>}
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.code} — {b.name}
                </option>
              ))}
            </select>
            {fieldErrors.branch_id && (
              <p id="err-branch" className="text-xs text-red-600">{fieldErrors.branch_id.join(', ')}</p>
            )}
          </div>

          {/* Status aktif */}
          <div className="grid gap-1">
            <label className="text-xs font-medium">Status</label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={v.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Aktif
            </label>
          </div>

          {/* Roles (full width) */}
          {canManage && (
            <div className="md:col-span-2 grid gap-1">
              <label className="text-xs font-medium" htmlFor="roles">Roles *</label>
              <select
                id="roles"
                multiple
                className="input min-h-28"
                value={v.roles}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions)
                    .map(o => (o.value || '').trim() as RoleName)
                    .filter(Boolean);
                  const uniq = Array.from(new Set(values)) as RoleName[];
                  setForm({ ...form, roles: uniq });
                }}
                required
                aria-invalid={!!fieldErrors.roles}
                aria-describedby={fieldErrors.roles ? 'err-roles' : undefined}
              >
                {allowedRoles(isSuperadmin).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {v.roles.length > 0 && (
                <p className="text-[11px] text-green-700">Dipilih: {v.roles.join(', ')}</p>
              )}
              <p className="text-[11px] text-gray-500">Tahan Ctrl / Cmd untuk memilih lebih dari satu.</p>

              {fieldErrors.roles && (
                <p id="err-roles" className="text-xs text-red-600">{fieldErrors.roles.join(', ')}</p>
              )}

              {Object.keys(fieldErrors).length > 0 && (
                <pre className="text-[11px] text-red-700 bg-red-50 p-2 rounded">{JSON.stringify(fieldErrors, null, 2)}</pre>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-[color:var(--color-border)] p-4 flex flex-wrap gap-2">
          <button disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>

          <button
            type="button"
            className="btn-outline"
            onClick={() => nav('/users')}
          >
            Batal
          </button>

          {editing && (
            <button
              type="button"
              className="btn-outline"
              onClick={async () => {
                if (!isSuperadmin && !isAdminCabang) return;
                const p1 = prompt('Password baru (min 8, mix-case+angka)'); if (!p1) return;
                const p2 = prompt('Konfirmasi password baru'); if (p2 !== p1) { alert('Konfirmasi tidak cocok'); return; }
                try { await resetUserPassword(id!, p1); alert('Password direset'); }
                catch { alert('Gagal reset password'); }
              }}
            >
              Reset Password
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
