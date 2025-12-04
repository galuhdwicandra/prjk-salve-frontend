// src/pages/Login.tsx
import { useState, type FormEvent } from 'react';
import type { AxiosError } from 'axios';
import { useAuth, homePathByRole } from '../store/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

/** Ikon mata (show) */
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

/** Ikon mata tertutup (hide) */
function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M1 12s4-7 11-7a12 12 0 0 1 5.6 1.4" />
      <path d="M23 12s-4 7-11 7A12 12 0 0 1 6.4 18.6" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const me = await useAuth.login({ login: loginId.trim(), password });
      const profile = await useAuth.fetchMe();
      const from = (loc.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
      const fallback = homePathByRole(profile?.roles ?? me?.roles ?? []);
      nav(from ?? fallback, { replace: true });
    } catch (err: unknown) {
      const ax = err as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
      const msg =
        ax.response?.data?.errors?.auth?.[0] ??
        ax.response?.data?.message ??
        'Login gagal';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        text-[color:var(--color-text)] overflow-hidden
      "
    >
      {/* Layer gradient halus */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          [background:radial-gradient(1000px_600px_at_50%_-120px,rgba(51,102,255,0.10),transparent_55%)]
        "
      />

      {/* Card autentikasi */}
      <section
        aria-labelledby="auth-title"
        className="
          w-full max-w-[420px] rounded-2xl border
          border-[color:var(--color-border)]
          bg-[color:var(--color-bg)]
          p-6 sm:p-8 shadow-[var(--shadow-2)]
        "
      >
        <header className="mb-6 sm:mb-8 text-center">
          <div className="text-xs font-semibold tracking-[0.18em] text-[color:var(--color-primary)]">
            SALVE
          </div>
          <h1 id="auth-title" className="mt-1 text-2xl font-semibold">Masuk</h1>
        </header>

        {error && (
          <div
            role="alert"
            className="
              mb-4 rounded-md border px-3 py-2 text-sm
              border-[color:var(--color-danger)]
              text-[color:var(--color-danger)]
              bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)]
            "
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} aria-busy={loading} className="space-y-4">
          {/* Email atau Username */}
          <div className="space-y-1.5">
            <label htmlFor="login" className="text-sm font-medium">Email atau Username</label>
            <input
              id="login"
              required
              type="text"
              placeholder="email atau username"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="username"
              disabled={loading}
              aria-invalid={!!error}
              className="
                block w-full rounded-md
                border border-[color:var(--color-border)]
                bg-white/95 text-[color:var(--color-text)]
                placeholder:text-slate-500
                px-3 py-2
                focus:outline-none focus-visible:shadow-[var(--focus-ring)]
                disabled:opacity-60
              "
            />
          </div>

          {/* Password + toggle show/hide */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">Kata sandi</label>
            <div className="relative">
              <input
                id="password"
                required
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                aria-invalid={!!error}
                className="
                  block w-full rounded-md
                  border border-[color:var(--color-border)]
                  bg-white/95 text-[color:var(--color-text)]
                  placeholder:text-slate-500
                  px-3 py-2 pr-12
                  focus:outline-none focus-visible:shadow-[var(--focus-ring)]
                  disabled:opacity-60
                "
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                disabled={loading}
                aria-label={showPwd ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-pressed={showPwd}
                className="
                  absolute right-1.5 top-1/2 -translate-y-1/2
                  rounded-md px-2 py-1
                  text-slate-600 hover:bg-[color:var(--blue-100)]
                  focus:outline-none focus-visible:shadow-[var(--focus-ring)]
                  disabled:opacity-60
                "
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex w-full items-center justify-center rounded-lg
              bg-[color:var(--color-primary)] px-4 py-2.5
              font-medium text-[color:var(--color-on-primary)]
              transition hover:shadow-[var(--shadow-2)] active:scale-[.98]
              focus:outline-none focus-visible:shadow-[var(--focus-ring)]
              disabled:opacity-60
            "
          >
            {loading ? 'Memproses…' : 'Masuk'}
          </button>

        </form>
      </section>
    </main>
  );
}
