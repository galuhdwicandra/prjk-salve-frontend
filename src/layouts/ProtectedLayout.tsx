// src/layouts/ProtectedLayout.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useAuth, useHasRole } from "../store/useAuth";
import type { RoleName } from "../api/client";

export default function ProtectedLayout() {
  const me = useAuth.user;
  const location = useLocation();
  const nav = useNavigate();

  // Drawer untuk mobile
  const [open, setOpen] = useState(false);

  // Close drawer on route change (UX)
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Esc to close + lock scroll on mobile drawer
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const FF = useMemo(() => ({
    vouchers: import.meta.env.VITE_FEATURE_VOUCHER === "true",
    delivery: import.meta.env.VITE_FEATURE_DELIVERY === "true",
    receivables: import.meta.env.VITE_FEATURE_RECEIVABLES === "true",
  }), []);

  type MenuItem = { label: string; to: string; roles: RoleName[]; show?: boolean };
  const MENU: MenuItem[] = [
    { label: "Dashboard", to: "/", roles: ["Superadmin", "Admin Cabang", "Kasir", "Petugas Cuci", "Kurir"] as RoleName[] },
    { label: "POS", to: "/pos", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Pesanan", to: "/orders", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Pelanggan", to: "/customers", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Layanan", to: "/services", roles: ["Superadmin", "Admin Cabang"] },
    { label: "Pengguna", to: "/users", roles: ["Superadmin", "Admin Cabang"] },
    { label: "Cabang", to: "/branches", roles: ["Superadmin"] },
    { label: "Catatan Cuci", to: "/wash-notes", roles: ["Superadmin", "Admin Cabang", "Petugas Cuci"] },
    { label: "Pengiriman", to: "/deliveries", roles: ["Superadmin", "Admin Cabang", "Kasir", "Kurir"], show: FF.delivery },
    { label: "Pengeluaran", to: "/expenses", roles: ["Superadmin", "Admin Cabang"] },
    { label: "Cash Box", to: "/cash-sessions", roles: ["Superadmin", "Admin Cabang"] },
    { label: "Kas Hari Ini", to: "/cash-today", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Piutang", to: "/receivables", roles: ["Superadmin", "Admin Cabang", "Kasir"], show: FF.receivables },
    { label: "Vouchers", to: "/vouchers", roles: ["Superadmin", "Admin Cabang"], show: FF.vouchers },
    { label: "Laporan", to: "/reports", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Settings", to: "/settings", roles: ["Superadmin", "Admin Cabang"] }
  ];

  const safeRoles = me?.roles ?? [];

  const VISIBLE = useMemo(
    () =>
      MENU.filter((m) => (m.show ?? true) && safeRoles.some((r) => m.roles.includes(r as RoleName))),
    [safeRoles, FF.delivery, FF.receivables, FF.vouchers],
  );

  const roleText = safeRoles.join(", ");
  const showSubtitle = !!roleText && roleText.toLowerCase() !== (me?.name ?? "").toLowerCase();

  if (!me) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-dvh text-[color:var(--color-text-default)]">
      {/* Background canvas (UI only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 420px at 10% 0%, rgba(79,70,229,0.14) 0%, rgba(79,70,229,0.00) 60%)," +
            "radial-gradient(820px 380px at 92% 10%, rgba(6,182,212,0.10) 0%, rgba(6,182,212,0.00) 55%)," +
            "linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 92%, #ffffff) 0%, var(--color-surface) 100%)",
        }}
      />

      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 backdrop-blur">
        <div className="container-app flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 min-w-0">
            {/* Toggle drawer (mobile) */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-colors shadow-[0_10px_30px_-22px_rgba(0,0,0,.45)]"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="relative h-9 w-9 rounded-2xl overflow-hidden border border-[color:var(--color-border)] bg-white/80 dark:bg-white/10 shadow-[0_10px_26px_-22px_rgba(0,0,0,.55)] flex items-center justify-center">
                {/* subtle ring */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-70"
                  style={{
                    background:
                      "radial-gradient(28px 28px at 30% 20%, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0.00) 70%)",
                  }}
                />
                <img src="/logo-salve.png" alt="Logo Salve" className="relative h-7 w-7 object-contain" />
              </div>

              <div className="min-w-0">
                <div className="font-semibold leading-5 truncate">SALVE</div>
                <div className="text-[11px] leading-4 text-[color:var(--color-text-muted)] truncate">{"POS Laundry"}</div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-white/70 dark:bg-white/5 px-2 py-1 shadow-[0_14px_34px_-28px_rgba(0,0,0,.55)]">
              <div className="relative h-8 w-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-70"
                  style={{
                    background:
                      "radial-gradient(24px 24px at 30% 20%, rgba(6,182,212,0.16) 0%, rgba(6,182,212,0.00) 70%)",
                  }}
                />
                <span className="relative">{(me.name ?? "U").slice(0, 1).toUpperCase()}</span>
              </div>

              <div className="hidden sm:block leading-tight pr-1">
                <div className="text-sm font-semibold truncate max-w-[180px]">{me.name}</div>
                {showSubtitle ? (
                  <div className="text-[11px] text-[color:var(--color-text-muted)] truncate max-w-[180px]">
                    {roleText}
                  </div>
                ) : null}
              </div>

              <button
                onClick={async () => {
                  await useAuth.logout();
                  nav("/login", { replace: true });
                }}
                className="inline-flex h-8 items-center rounded-xl border border-[color:var(--color-border)] bg-white/80 dark:bg-white/5 px-3 text-xs font-semibold hover:bg-white dark:hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* subtle bottom shadow */}
        <div
          aria-hidden="true"
          className="h-[1px]"
          style={{ boxShadow: "0 14px 34px -30px rgba(0,0,0,.55)" }}
        />
      </header>

      <div className="container-app grid grid-cols-1 md:grid-cols-[17rem_1fr] gap-4 md:gap-6 py-4 md:py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block">
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white/70 dark:bg-white/5 p-4 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(520px 260px at 20% 0%, rgba(79,70,229,0.10) 0%, rgba(79,70,229,0.00) 60%)",
              }}
            />

            <div className="relative">
              <UserCard name={me.name} roles={me.roles ?? []} />
              <nav className="mt-4 space-y-1">
                {VISIBLE.map((m) => (
                  <NavLink key={m.to} to={m.to} className={({ isActive }) => navItemClass(isActive)}>
                    <span className="truncate">{m.label}</span>
                    <span className="ml-auto text-[10px] opacity-60">{isActiveDot()}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-4 border-t border-[color:var(--color-border)] pt-4">
                <button
                  onClick={async () => {
                    await useAuth.logout();
                    nav("/login", { replace: true });
                  }}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white/70 dark:bg-white/5 px-3 py-2 text-sm hover:bg-white/90 dark:hover:bg-white/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Drawer Sidebar (mobile) */}
        <MobileDrawer open={open} onClose={() => setOpen(false)}>
          <div className="relative h-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(520px 260px at 20% 0%, rgba(79,70,229,0.12) 0%, rgba(79,70,229,0.00) 60%)," +
                  "radial-gradient(520px 260px at 92% 20%, rgba(6,182,212,0.10) 0%, rgba(6,182,212,0.00) 60%)",
              }}
            />

            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Menu</div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4">
                <UserCard name={me.name} roles={me.roles ?? []} />
              </div>

              <nav className="mt-4 space-y-1">
                {VISIBLE.map((m) => (
                  <NavLink key={m.to} to={m.to} className={({ isActive }) => navItemClass(isActive)}>
                    <span className="truncate">{m.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-4">
                <button
                  onClick={async () => {
                    await useAuth.logout();
                    nav("/login", { replace: true });
                  }}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white/80 dark:bg-white/5 px-3 py-2 text-sm hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </MobileDrawer>

        {/* Konten */}
        <main className="min-w-0">
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white/70 dark:bg-white/5 p-4 md:p-6 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-55"
              style={{
                background:
                  "radial-gradient(760px 320px at 20% 0%, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.00) 60%)",
              }}
            />
            <div className="relative">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function navItemClass(isActive: boolean) {
  return [
    "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15",
    isActive
      ? "bg-[color:var(--color-brand-primary)] text-[color:var(--color-brand-on)] shadow-[0_16px_34px_-28px_rgba(0,0,0,.55)]"
      : "text-[color:var(--color-text-default)] hover:bg-black/5 dark:hover:bg-white/5",
  ].join(" ");
}

// kecil saja, supaya tidak mengubah logika: ini hanya untuk penanda UI
function isActiveDot() {
  return "";
}

function UserCard(props: { name: string; roles: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 p-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(520px 220px at 20% 0%, rgba(79,70,229,0.10) 0%, rgba(79,70,229,0.00) 60%)",
        }}
      />
      <div className="relative flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold">
          {(props.name ?? "U").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-5 truncate">{props.name}</div>
          <div className="mt-0.5 text-xs text-[color:var(--color-text-muted)] truncate">
            {props.roles?.join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDrawer(props: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/35 transition-opacity md:hidden",
          props.open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={props.onClose}
        aria-hidden={!props.open}
      />
      {/* Panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[320px] border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_26px_80px_-44px_rgba(0,0,0,.80)] transition-transform md:hidden",
          props.open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        {props.children}
      </aside>
    </>
  );
}

/** Komponen guard untuk tombol/aksi dalam halaman */
export function RequireRole(props: { roles: RoleName[]; children: React.ReactNode; fallback?: React.ReactNode }) {
  const allowed = useHasRole(props.roles);
  if (!allowed) return props.fallback ?? null;
  return <>{props.children}</>;
}
