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
  return isAxiosError<ApiErrBody>(err) && err.response?.data?.errors ? err.response.data.errors : {};
}
function getMessage(err: unknown, fallback = 'Terjadi kesalahan'): string {
  return isAxiosError<ApiErrBody>(err) && err.response?.data?.message ? err.response.data.message : fallback;
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

  const v = useMemo(
    () => ({
      name: form.name ?? '',
      username: form.username ?? '',
      email: form.email ?? '',
      password: form.password ?? '',
      branch_id: form.branch_id === null ? '' : (form.branch_id ?? ''),
      is_active: !!form.is_active,
      roles: Array.isArray(form.roles) ? form.roles : [],
    }),
    [form]
  );

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
          if (status === 403) setError('Anda tidak berhak melihat user ini (beda cabang).');
          else if (status === 404) setError('User tidak ditemukan.');
          else setError(getMessage(err, 'Gagal memuat user'));
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

  const pageTitle = editing ? 'Edit User' : 'New User';
  const pageDesc = 'Kelola identitas, peran (multi-role), dan status aktif';

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">Settings / Users</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">{pageDesc}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => nav('/users')}
            aria-label="Kembali ke daftar users"
          >
            <ArrowLeftIcon />
            Back
          </button>
        </div>
      </header>

      {/* Loading / Error */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Memuat…
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Form card */}
      <form
        className="rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(0,0,0,.35)]"
        onSubmit={onSubmit}
      >
        <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <UserIcon />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {editing ? 'Perbarui data user' : 'Buat user baru'}
                </div>
                <div className="text-xs text-slate-500">
                  {isSuperadmin ? 'Superadmin mode' : me?.branch_id ? `Branch scope #${String(me.branch_id)}` : 'Branch scope'}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span
                className={[
                  'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold border',
                  v.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200',
                ].join(' ')}
                title="Status user"
              >
                <span className={['h-2 w-2 rounded-full', v.is_active ? 'bg-emerald-500' : 'bg-slate-400'].join(' ')} />
                {v.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-6">
          {/* Section: Identity */}
          <Section
            title="Identity"
            subtitle="Informasi dasar akun (nama, username, email)."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Nama *"
                htmlFor="name"
                error={fieldErrors.name}
              >
                <input
                  id="name"
                  className={inputClass(!!fieldErrors.name)}
                  value={v.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'err-name' : undefined}
                />
              </Field>

              <Field
                label={`Username${!editing ? ' *' : ''}`}
                htmlFor="username"
                hint="3–50 karakter: huruf kecil, angka, underscore (_), atau titik (.)"
                error={fieldErrors.username}
              >
                <input
                  id="username"
                  type="text"
                  className={inputClass(!!fieldErrors.username)}
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
              </Field>

              <Field
                label="Email *"
                htmlFor="email"
                error={fieldErrors.email}
              >
                <input
                  id="email"
                  type="email"
                  className={inputClass(!!fieldErrors.email)}
                  value={v.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                />
              </Field>

              {!editing && (
                <Field
                  label="Password *"
                  htmlFor="password"
                  hint="Gunakan password kuat (minimal 8 karakter)."
                  error={fieldErrors.password}
                >
                  <input
                    id="password"
                    type="password"
                    className={inputClass(!!fieldErrors.password)}
                    value={v.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'err-password' : undefined}
                  />
                </Field>
              )}
            </div>
          </Section>

          {/* Section: Assignment */}
          <Section
            title="Assignment"
            subtitle="Cabang dan status aktif user."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Branch" htmlFor="branch" error={fieldErrors.branch_id}>
                <select
                  id="branch"
                  className={inputClass(!!fieldErrors.branch_id)}
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

                {!isSuperadmin && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 border border-slate-200">
                    <LockIcon />
                    Admin Cabang tidak dapat mengubah branch user.
                  </div>
                )}
              </Field>

              <div className="grid gap-2">
                <div className="text-xs font-semibold text-slate-700">Status</div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className={[
                      'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold',
                      v.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setForm({ ...form, is_active: true })}
                    aria-pressed={v.is_active}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active
                  </button>

                  <button
                    type="button"
                    className={[
                      'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold',
                      !v.is_active
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setForm({ ...form, is_active: false })}
                    aria-pressed={!v.is_active}
                  >
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Inactive
                  </button>

                  {/* checkbox tetap ada (aksesibilitas/compat), tapi visualnya pakai tombol */}
                  <label className="sr-only">
                    <input
                      type="checkbox"
                      checked={v.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    Aktif
                  </label>
                </div>

                <div className="text-xs text-slate-500">
                  Nonaktifkan jika user tidak lagi bertugas. User nonaktif tidak seharusnya bisa login (tergantung backend rule).
                </div>
              </div>
            </div>
          </Section>

          {/* Section: Roles */}
          {canManage && (
            <Section
              title="Roles"
              subtitle="Multi-role: pilih minimal satu. Role pertama akan jadi primary saat create."
            >
              <div className="grid grid-cols-1 gap-3">
                <Field label="Roles *" htmlFor="roles" error={fieldErrors.roles} hint="Tahan Ctrl / Cmd untuk memilih lebih dari satu.">
                  <select
                    id="roles"
                    multiple
                    className={[
                      inputClass(!!fieldErrors.roles),
                      'min-h-32 py-2',
                    ].join(' ')}
                    value={v.roles}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions)
                        .map((o) => (o.value || '').trim() as RoleName)
                        .filter(Boolean);
                      const uniq = Array.from(new Set(values)) as RoleName[];
                      setForm({ ...form, roles: uniq });
                    }}
                    required
                    aria-invalid={!!fieldErrors.roles}
                    aria-describedby={fieldErrors.roles ? 'err-roles' : undefined}
                  >
                    {allowedRoles(isSuperadmin).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                {v.roles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {v.roles.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {Object.keys(fieldErrors).length > 0 && (
                  <details className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <summary className="cursor-pointer font-semibold">Detail error (debug)</summary>
                    <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(fieldErrors, null, 2)}</pre>
                  </details>
                )}
              </div>
            </Section>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 px-4 py-3 sm:px-6 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              disabled={saving}
              className="
                inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2
                text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950
                disabled:cursor-not-allowed disabled:opacity-70
              "
            >
              <SaveIcon />
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => nav('/users')}
            >
              Batal
            </button>
          </div>

          {editing && (
            <button
              type="button"
              className="
                inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2
                text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100
              "
              onClick={async () => {
                if (!isSuperadmin && !isAdminCabang) return;
                const p1 = prompt('Password baru (min 8, mix-case+angka)'); if (!p1) return;
                const p2 = prompt('Konfirmasi password baru'); if (p2 !== p1) { alert('Konfirmasi tidak cocok'); return; }
                try { await resetUserPassword(id!, p1); alert('Password direset'); }
                catch { alert('Gagal reset password'); }
              }}
            >
              <KeyIcon />
              Reset Password
            </button>
          )}
        </div>

        {/* local UI-only helper styles */}
        <style>
          {`
            .btn-secondary{
              display:inline-flex; align-items:center; gap:8px;
              border:1px solid rgb(226 232 240);
              background:#fff;
              color: rgb(15 23 42);
              border-radius:10px;
              padding:8px 12px;
              font-size:14px;
              font-weight:600;
            }
            .btn-secondary:hover{ background: rgb(248 250 252); }
            .btn-secondary:active{ background: rgb(241 245 249); }
          `}
        </style>
      </form>
    </div>
  );
}

/* ---------- UI helpers (no logic) ---------- */
function inputClass(isError: boolean): string {
  return [
    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
    'placeholder:text-slate-400 focus:outline-none focus:border-slate-900',
    isError ? 'border-red-300 focus:border-red-500' : 'border-slate-200',
    'disabled:opacity-70 disabled:cursor-not-allowed',
  ].join(' ');
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
      </div>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  const errId = error?.length ? `err-${htmlFor}` : undefined;

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-semibold text-slate-700" htmlFor={htmlFor}>
        {label}
      </label>

      {children}

      {hint && <div className="text-[11px] text-slate-500">{hint}</div>}

      {error?.length ? (
        <p id={errId} className="text-xs text-red-600">
          {error.join(', ')}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Icons (pure visual) ---------- */
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 2l-2 2m-3 3l-2 2" />
      <path d="M7 14a5 5 0 1 1 4-8l2 2 3 3-2 2-2-2" />
      <path d="M7 14l-5 5v3h3l5-5" />
    </svg>
  );
}
