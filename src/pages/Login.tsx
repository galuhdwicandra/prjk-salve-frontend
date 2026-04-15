// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import {
  normalizeApiError,
  type FieldErrors,
  type LoginPayload,
} from "../api/client";
import { useAuth, homePathByRole } from "../store/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

/** Ikon mata (show) */
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}
/** Ikon mata tertutup (hide) */
function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M1 12s4-7 11-7a12 12 0 0 1 5.6 1.4" />
      <path d="M23 12s-4 7-11 7A12 12 0 0 1 6.4 18.6" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}

function focusFirstErrorField(errors: FieldErrors) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;

  const idMap: Record<string, string> = {
    login: "login",
    password: "password",
    auth: "login",
  };

  const targetId = idMap[firstKey] ?? firstKey;

  const el = document.getElementById(targetId) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;

  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    el.focus();
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.select?.();
    }
  }, 150);
}

function validateLoginForm(payload: LoginPayload): FieldErrors {
  const errors: FieldErrors = {};

  if (!payload.login.trim()) {
    errors.login = ["Email atau username wajib diisi"];
  }

  if (!payload.password.trim()) {
    errors.password = ["Password wajib diisi"];
  }

  return errors;
}

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();

  const [form, setForm] = useState<LoginPayload>({
    login: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const { toast, showSuccess, showError, hideToast } = useToast();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const payload: LoginPayload = {
      login: form.login.trim(),
      password: form.password,
    };

    const clientErrors = validateLoginForm(payload);

    if (Object.keys(clientErrors).length > 0) {
      setLoading(false);
      setFieldErrors(clientErrors);
      setError("Masih ada data yang belum benar. Silakan periksa form.");
      showError("Masih ada data yang belum benar. Silakan periksa form.");
      focusFirstErrorField(clientErrors);
      return;
    }

    try {
      const me = await useAuth.login(payload);
      const profile = await useAuth.fetchMe();

      const from = (loc.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
      const fallback = homePathByRole(profile?.roles ?? me?.roles ?? []);

      showSuccess("Login berhasil.");

      window.setTimeout(() => {
        nav(from ?? fallback, { replace: true });
      }, 500);
    } catch (err: unknown) {
      const e = normalizeApiError(err);

      setError(e.message || "Login gagal");
      setFieldErrors(e.errors);

      showError(e.message || "Login gagal");

      if (Object.keys(e.errors).length > 0) {
        focusFirstErrorField(e.errors);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast
        show={toast.open}
        kind={toast.kind}
        message={toast.message}
        onClose={hideToast}
      />
      <main className="min-h-dvh w-full bg-slate-100 text-slate-900">
        <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-8">
          <section className="grid w-full overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,.35)] md:grid-cols-2">
            {/* LEFT PANEL (visual) */}
            <div className="relative hidden min-h-[560px] md:block">
              {/* gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-950" />

              {/* subtle line pattern */}
              <svg
                aria-hidden
                className="absolute inset-0 h-full w-full opacity-20"
                viewBox="0 0 800 800"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop stopColor="#ffffff" stopOpacity="0.35" offset="0" />
                    <stop stopColor="#ffffff" stopOpacity="0" offset="1" />
                  </linearGradient>
                </defs>
                <path d="M80,760 C200,560 300,520 520,420 C650,360 720,260 760,80" stroke="url(#g)" strokeWidth="2" fill="none" />
                <path d="M40,720 C200,520 320,480 520,380 C660,310 720,220 740,60" stroke="url(#g)" strokeWidth="2" fill="none" />
                <path d="M120,800 C220,590 340,540 520,450 C640,390 720,290 800,120" stroke="url(#g)" strokeWidth="2" fill="none" />
              </svg>

              <div className="relative z-10 flex h-full flex-col justify-between p-10">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo-salve.png"
                    alt="Logo Salve"
                    className="h-10 w-auto object-contain"
                  />
                </div>

                <div className="max-w-sm">
                  <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white">
                    Hello
                    <br />
                    Salve! <span className="align-middle">👋</span>
                  </h2>
                  <p className="mt-5 text-sm leading-6 text-white/80">
                    Kelola transaksi, kas, stok, dan operasional cabang dengan workflow yang rapi, cepat, dan terukur.
                  </p>
                </div>

                <div className="text-xs tracking-wide text-white/60">© {new Date().getFullYear()} Galuh. All rights reserved.</div>
              </div>
            </div>

            {/* RIGHT PANEL (form) */}
            <div className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-10">
              <div className="mx-auto w-full max-w-sm">
                {/* top small brand (mobile) */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="font-semibold text-slate-900">Salve</div>
                  <div className="text-xs text-slate-500 md:hidden">Login</div>
                </div>

                <h1 className="text-2xl font-semibold text-slate-900">Welcome!</h1>

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={onSubmit} aria-busy={loading} className="mt-7 space-y-5">
                  {/* Email / Username */}
                  <div>
                    <label htmlFor="login" className="sr-only">
                      Email / Username
                    </label>
                    <input
                      id="login"
                      required
                      type="text"
                      placeholder="Email / Username"
                      value={form.login}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((prev) => ({ ...prev, login: value }));

                        if (fieldErrors.login || fieldErrors.auth) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next.login;
                            delete next.auth;
                            return next;
                          });
                        }
                      }}
                      autoComplete="username"
                      disabled={loading}
                      aria-invalid={Boolean(fieldErrors.login || fieldErrors.auth)}
                      aria-describedby={fieldErrors.login || fieldErrors.auth ? "login-error" : undefined}
                      className={`
    w-full border-0 border-b bg-transparent px-0 py-3 text-sm
    text-slate-900 placeholder:text-slate-400
    focus:outline-none disabled:opacity-70
    ${fieldErrors.login || fieldErrors.auth
                          ? "border-red-500 focus:border-red-600"
                          : "border-slate-300 focus:border-slate-900"
                        }
  `}
                    />
                    {(fieldErrors.login?.[0] || fieldErrors.auth?.[0]) && (
                      <p id="login-error" className="mt-2 text-xs text-red-600">
                        {fieldErrors.login?.[0] || fieldErrors.auth?.[0]}
                      </p>
                    )}
                  </div>

                  {/* Password + toggle */}
                  <div>
                    <div className="relative">
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        required
                        type={showPwd ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm((prev) => ({ ...prev, password: value }));

                          if (fieldErrors.password) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.password;
                              return next;
                            });
                          }
                        }}
                        autoComplete="current-password"
                        disabled={loading}
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={fieldErrors.password ? "password-error" : undefined}
                        className={`
        w-full border-0 border-b bg-transparent px-0 py-3 text-sm
        text-slate-900 placeholder:text-slate-400
        focus:outline-none disabled:opacity-70
        ${fieldErrors.password
                            ? "border-red-500 focus:border-red-600"
                            : "border-slate-300 focus:border-slate-900"
                          }
      `}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        disabled={loading}
                        aria-label={showPwd ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        aria-pressed={showPwd}
                        className="
        absolute right-0 top-1/2 -translate-y-1/2
        rounded-md p-2 text-slate-600 hover:bg-slate-100
        focus:outline-none focus:ring-2 focus:ring-slate-300
        disabled:opacity-60
      "
                      >
                        {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {fieldErrors.password?.[0] && (
                      <p id="password-error" className="mt-2 text-xs text-red-600">
                        {fieldErrors.password[0]}
                      </p>
                    )}
                  </div>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                    mt-2 w-full rounded-md bg-slate-900 py-3 text-sm font-semibold text-white
                    hover:bg-slate-800 active:bg-slate-950
                    disabled:cursor-not-allowed disabled:opacity-70
                  "
                  >
                    {loading ? "Memproses…" : "Login Now"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
