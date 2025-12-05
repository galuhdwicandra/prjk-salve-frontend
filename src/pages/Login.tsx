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

/** Ilustrasi sederhana perangkat + grafik (SVG ringan, purely visual) */
function PhoneChart() {
  return (
    <svg viewBox="0 0 280 160" className="w-[260px] h-auto drop-shadow-sm">
      <rect x="40" y="20" rx="20" ry="20" width="200" height="120" fill="white" opacity="0.92" />
      <rect x="60" y="50" width="8" height="55" fill="currentColor" opacity="0.75" />
      <rect x="85" y="40" width="8" height="65" fill="currentColor" opacity="0.75" />
      <rect x="110" y="60" width="8" height="45" fill="currentColor" opacity="0.75" />
      <rect x="135" y="35" width="8" height="70" fill="currentColor" opacity="0.75" />
      <rect x="160" y="55" width="8" height="50" fill="currentColor" opacity="0.75" />
      <circle cx="210" cy="90" r="20" fill="currentColor" opacity="0.15" />
      <path d="M60 110 L100 80 L140 95 L180 70 L210 75" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9" />
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
      className="relative min-h-dvh w-full bg-[var(--color-bg)] text-[var(--color-text)]"
      style={{
        ['--color-primary' as any]: '#00007a',
        ['--color-on-primary' as any]: '#ffffff',
        ['--focus-ring' as any]: '0 0 0 3px color-mix(in srgb, #00007a 32%, transparent)'
      }}
    >
      {/* Centered container */}
      <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-4 sm:p-8">
        {/* Auth Card: 2 columns on md+ */}
        <section
          className="
            w-full grid grid-cols-1 md:grid-cols-[1.1fr_1fr]
            overflow-hidden rounded-2xl bg-[var(--color-surface)]
            shadow-[var(--shadow-2)]
          "
        >
          {/* Left Visual Panel */}
          <div
            className="
              relative hidden md:flex items-center justify-center
              text-[var(--color-on-primary)]
              bg-[var(--color-primary)]
            "
          >
            {/* Curved accent layer */}
            <div
              aria-hidden
              className="
                absolute inset-0
                [background:radial-gradient(140%_120%_at_0%_100%,rgba(255,255,255,.24),transparent_60%)]
              "
            />
            {/* White curved panel to emulate mockup wave */}
            <div
              aria-hidden
              className="
                absolute -right-20 top-0 h-full w-[65%]
                bg-[var(--color-surface)]
                opacity-[.96]
                rounded-l-[56px]
              "
              style={{ clipPath: 'ellipse(90% 70% at 0% 50%)' }}
            />
            {/* Vertical 'Welcome' */}
            <div
              className="
                absolute left-6 top-1/2 -translate-y-1/2
                -rotate-90 text-[40px] leading-none tracking-[0.12em]
                font-bold text-white/70 select-none
              "
            >
              Welcome
            </div>
            {/* Device + chart illustration */}
            <div className="relative z-10 text-[var(--color-on-primary)]">
              <PhoneChart />
            </div>
            {/* Tagline */}
            <div className="absolute bottom-6 left-6 z-10 text-white/80 text-xs tracking-wide">
              SYSTEM POS LAUNDRY SALVE
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <header className="mb-8">
              <h1 className="text-3xl font-semibold tracking-wide text-[color:var(--color-text)]">
                LOGIN
              </h1>
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

            <form onSubmit={onSubmit} aria-busy={loading} className="space-y-5">
              {/* Username / Email */}
              <div>
                <label htmlFor="login" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <div className="relative">
                  {/* left icon */}
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {/* user icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21a8 8 0 1 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="login"
                    required
                    type="text"
                    placeholder="Email atau username"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                    aria-invalid={!!error}
                    className="input pl-10 py-2"
                  />
                </div>
              </div>

              {/* Password + toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {/* lock icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <rect x="4" y="11" width="16" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                    </svg>
                  </span>
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
                    className="input pl-10 pr-12 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    disabled={loading}
                    aria-label={showPwd ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    aria-pressed={showPwd}
                    className="
                      absolute right-1.5 top-1/2 -translate-y-1/2
                      rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100
                      focus:outline-none focus-visible:focus-ring disabled:opacity-60
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
                className="btn-primary w-full py-2.5 focus-ring"
              >
                {loading ? 'Memproses…' : 'Login'}
              </button>

              {/* Links (visual only, optional)
              <div className="mt-2 flex items-center justify-end gap-6 text-sm">
                <a href="#" className="hover:underline">Forgot</a>
                <a href="#" className="hover:underline">Help</a>
              </div> */}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
