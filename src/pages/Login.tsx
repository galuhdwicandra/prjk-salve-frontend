// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import {
  normalizeApiError,
  type FieldErrors,
  type LoginPayload,
} from "../api/client";
import { useAuth, firstAccessiblePath } from "../store/useAuth";
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

function focusFirstErrorField(errors: FieldErrors) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;

  const idMap: Record<string, string> = {
    login: "lgUser",
    password: "lgPass",
    auth: "lgUser",
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
      const fallback = firstAccessiblePath(profile?.modules ?? me?.modules ?? []);

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

      <div className="craft">
        <div id="login">
          <div className="login-brand">
            <div className="lb-top">
              <img className="brand-logo" src="/logo-salve.png" alt="" />
              <div className="tb-txt">
                <b>SALVE</b>
                <small>Shoe Care &amp; Laundry</small>
              </div>
            </div>

            <div>
              <h2>Kelola seluruh operasional Salve dalam satu aplikasi.</h2>
              <p>
                Mulai dari mencatat order di kasir, memantau pengerjaan sepatu, hingga mengelola
                keuangan. Semuanya terhubung dalam satu tempat, sehingga tidak ada lagi catatan
                yang tercecer di berbagai buku atau file.
              </p>
            </div>

            <div className="lb-foot">
              &copy; {new Date().getFullYear()} Galuh Dwi Candra. All rights reserved.
            </div>
          </div>

          <div className="login-form">
            <div className="login-card">
              <img className="login-logo" src="/logo-salve.png" alt="Salve Shoe Care" />
              <div className="brand-name">SALVE</div>
              <div className="brand-acr">Shoe Care &amp; Laundry</div>

              <div className="lc-title" style={{ marginTop: 22 }}>Masuk</div>
              <div className="lc-sub">Masuk menggunakan email atau username Anda.</div>

              {error ? (
                <div className="login-err" role="alert">{error}</div>
              ) : null}

              <form onSubmit={onSubmit} aria-busy={loading}>
                <div className="field">
                  <label htmlFor="lgUser">Email / Username</label>
                  <input
                    id="lgUser"
                    required
                    type="text"
                    autoComplete="username"
                    placeholder="email atau username"
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
                    aria-describedby={loginError ? "lgUser-error" : undefined}
                  />
                  {loginError ? (
                    <div id="lgUser-error" className="mini" style={{ color: "var(--danger)", marginTop: 6 }}>
                      {loginError}
                    </div>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="lgPass">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="lgPass"
                      required
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="password"
                      style={{ paddingRight: 40 }}
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
                      aria-describedby={passwordError ? "lgPass-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((value) => !value)}
                      disabled={loading}
                      aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
                      style={{
                        position: "absolute",
                        right: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: 0,
                        background: "none",
                        padding: 0,
                        color: "var(--muted)",
                      }}
                    >
                      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {passwordError ? (
                    <div id="lgPass-error" className="mini" style={{ color: "var(--danger)", marginTop: 6 }}>
                      {passwordError}
                    </div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="btn block"
                  disabled={loading}
                  style={loading ? { opacity: 0.65 } : undefined}
                >
                  {loading ? "Memproses..." : "Masuk"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}