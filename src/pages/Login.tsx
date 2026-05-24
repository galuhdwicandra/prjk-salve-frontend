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

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12 18.7 18.5 12 18.5 1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M1.5 12s3.8-6.5 10.5-6.5a11.2 11.2 0 0 1 5.4 1.35" />
      <path d="M22.5 12s-3.8 6.5-10.5 6.5a11.2 11.2 0 0 1-5.4-1.35" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function Sparkle(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={props.className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2 14.7 9.3 22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z" />
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

  const loginError = fieldErrors.login?.[0] || fieldErrors.auth?.[0];
  const passwordError = fieldErrors.password?.[0];

  return (
    <>
      <Toast
        show={toast.open}
        kind={toast.kind}
        message={toast.message}
        onClose={hideToast}
      />

      <main className="relative min-h-dvh w-full overflow-hidden bg-[#84d7f7] text-[#0b1736]">
        {/* Background lembut seperti referensi */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 18% 0%, rgba(255,255,255,.36) 0%, rgba(255,255,255,0) 58%)," +
              "radial-gradient(680px 460px at 78% 55%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 60%)," +
              "linear-gradient(135deg, #74cef1 0%, #8bdcf6 42%, #6fc9f0 100%)",
          }}
        />

        {/* Ornamen 3D bulat kiri atas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-32 h-[390px] w-[520px] rotate-[-10deg] rounded-full opacity-95 blur-0 md:-left-14 md:-top-40 md:h-[470px] md:w-[620px]"
        >
          <div className="absolute left-24 top-16 h-24 w-[420px] rounded-[999px] bg-gradient-to-r from-[#e6f8ff] via-[#0067dd] to-[#0052c7] shadow-[0_24px_50px_rgba(0,71,160,.22)]" />
          <div className="absolute left-10 top-28 h-28 w-[500px] rounded-[999px] bg-gradient-to-r from-[#baf5ff] via-[#0679ed] to-[#0247bc] shadow-[0_30px_55px_rgba(0,69,160,.24)]" />
          <div className="absolute left-28 top-40 h-28 w-[430px] rounded-[999px] bg-gradient-to-r from-[#f2f7ff] via-[#7eddf5] to-[#045ad0] shadow-[0_30px_52px_rgba(0,69,160,.22)]" />
          <div className="absolute left-4 top-52 h-24 w-[450px] rounded-[999px] bg-gradient-to-r from-[#eef5ff] via-[#1156d4] to-[#003a9e] shadow-[0_28px_55px_rgba(0,45,120,.28)]" />
        </div>

        <Sparkle className="absolute bottom-11 right-8 h-12 w-12 text-white/80 md:bottom-14 md:right-10" />
        <Sparkle className="absolute left-[11%] top-[54%] hidden h-5 w-5 text-white/70 md:block" />
        <Sparkle className="absolute left-[9%] top-[57%] hidden h-3 w-3 text-white/60 md:block" />

        <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 place-content-center items-center gap-10 px-5 py-8 md:grid-cols-[1fr_500px] md:place-content-stretch md:px-8 lg:gap-16">
          {/* LEFT CONTENT */}
          <section className="hidden min-h-[560px] flex-col justify-end pb-10 md:flex">
            <div className="max-w-[500px]">
              <div className="mb-7 flex items-center gap-5">

                <div className="text-[54px] font-bold leading-none tracking-[-0.04em] text-blue-800 drop-shadow-[0_4px_12px_rgba(18,73,116,.16)]">
                  Salve
                  <p className="text-4xl text-blue-800">Cleaning Shoes</p>
                </div>
              </div>

              <p className="max-w-[470px] text-[30px] font-semibold leading-[1.35] tracking-[-0.035em] text-white drop-shadow-[0_4px_14px_rgba(18,73,116,.12)]">
                Kelola transaksi, kas, stok, dan operasional cabang dengan workflow yang rapi, cepat, dan terukur.
              </p>

              <p className="mt-8 text-sm font-medium tracking-[-0.01em] text-blue">
                © {new Date().getFullYear()} Galuh Dwi Candra. All rights reserved.
              </p>
            </div>
          </section>

          {/* LOGIN CARD */}
          <section className="mx-auto w-full max-w-[500px] rounded-[28px] border border-white bg-white px-6 py-8 shadow-[0_30px_90px_-50px_rgba(0,40,100,.55)] backdrop-blur-xl sm:px-10 sm:py-11 md:mt-16">
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <img
                src="/logo-salve.png"
                alt="Logo Salve"
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="text-xl font-bold tracking-[-0.03em] text-[#0b1736]">
                  Salve
                </div>
                <div className="text-xs text-[#315672]">
                  Cleaning Shoes
                </div>
              </div>
            </div>

            <h1 className="text-[28px] font-bold tracking-[-0.045em] text-[#032e7a] sm:text-[30px]">
              Log In
            </h1>

            {error ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-200 bg-red-50/85 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} aria-busy={loading} className="mt-9 space-y-6">
              <div>
                <label
                  htmlFor="login"
                  className="mb-2 block text-sm font-semibold text-[#032e7a]"
                >
                  Username
                </label>

                <div
                  className={[
                    "relative overflow-hidden rounded-xl border bg-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,.65)] transition",
                    loginError
                      ? "border-red-400 ring-4 ring-red-100"
                      : "border-[#40677e] focus-within:border-[#0878ee] focus-within:ring-4 focus-within:ring-blue-200/65",
                  ].join(" ")}
                >
                  <input
                    id="login"
                    required
                    type="text"
                    autoComplete="username"
                    inputMode="email"
                    placeholder="Input Username"
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

                      if (error) setError(null);
                    }}
                    disabled={loading}
                    aria-invalid={!!loginError}
                    aria-describedby={loginError ? "login-error" : undefined}
                    className="h-12 w-full border-0 bg-transparent px-4 pr-12 text-[15px] font-medium text-[#10213d] outline-none ring-0 placeholder:text-[#9db0bd] focus:border-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                  />

                  <UserIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6c96a8]" />
                </div>

                {loginError ? (
                  <p id="login-error" className="mt-2 text-xs font-medium text-red-600">
                    {loginError}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#032e7a]"
                >
                  Password
                </label>

                <div
                  className={[
                    "relative overflow-hidden rounded-xl border bg-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,.65)] transition",
                    passwordError
                      ? "border-red-400 ring-4 ring-red-100"
                      : "border-[#40677e] focus-within:border-[#0878ee] focus-within:ring-4 focus-within:ring-blue-200/65",
                  ].join(" ")}
                >
                  <input
                    id="password"
                    required
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your Password"
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

                      if (error) setError(null);
                    }}
                    disabled={loading}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    className="h-12 w-full border-0 bg-transparent px-4 pr-12 text-[15px] font-medium text-[#10213d] outline-none ring-0 placeholder:text-[#9db0bd] focus:border-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPwd((value) => !value)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c96a8] transition hover:text-[#0f6fd8] disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {passwordError ? (
                  <p id="password-error" className="mt-2 text-xs font-medium text-red-600">
                    {passwordError}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex h-[54px] w-full items-center justify-center rounded-xl bg-[#0376f3] px-5 text-sm font-bold text-white shadow-[0_20px_45px_-22px_rgba(0,70,180,.8)] transition hover:-translate-y-[1px] hover:bg-[#006be0] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
              >
                {loading ? "Memproses..." : "Log In"}
              </button>
            </form>
          </section>

          <p className="pointer-events-none absolute bottom-5 left-0 right-0 z-10 px-5 text-center text-xs font-medium text-[#0d2750] md:hidden">
            © {new Date().getFullYear()} Galuh Dwi Candra. All rights reserved.
          </p>
        </div>
      </main>
    </>
  );
}