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

  if (!me) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const FF = {
    vouchers: import.meta.env.VITE_FEATURE_VOUCHER === "true",
    delivery: import.meta.env.VITE_FEATURE_DELIVERY === "true",
    receivables: import.meta.env.VITE_FEATURE_RECEIVABLES === "true",
  };

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
    { label: "Piutang", to: "/receivables", roles: ["Superadmin", "Admin Cabang", "Kasir"], show: FF.receivables },
    { label: "Vouchers", to: "/vouchers", roles: ["Superadmin", "Admin Cabang"], show: FF.vouchers },
    { label: "Laporan", to: "/reports", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
  ];

  const VISIBLE = useMemo(
    () =>
      MENU.filter((m) => (m.show ?? true) && (me.roles ?? []).some((r) => m.roles.includes(r as RoleName))),
    [me.roles, FF.delivery, FF.receivables, FF.vouchers],
  );

  const roleText = (me.roles ?? []).join(", ");
  const showSubtitle = roleText && roleText.toLowerCase() !== (me.name ?? "").toLowerCase();

  return (
    <div
      className="min-h-dvh text-[var(--color-text-default)]"
      style={{
        background: "linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 92%, #ffffff) 0%, var(--color-surface) 100%)",
      }}
    >
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur shadow-[0_10px_30px_-25px_rgba(0,0,0,.35)]">
        <div className="container-app flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 min-w-0">
            {/* Toggle drawer (mobile) */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white/80 hover:bg-white transition-colors"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="h-9 w-9 rounded-xl overflow-hidden bg-white shadow-sm border border-[var(--color-border)] flex items-center justify-center">
                <img
                  src="/logo-salve.png"
                  alt="Logo Salve"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-5 truncate">SALVE</div>
                <div className="text-[11px] leading-4 text-black/55 dark:text-white/60 truncate">
                  {"POS Laundry"}
                </div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-2 py-1 shadow-[0_8px_20px_-16px_rgba(0,0,0,.35)]">
              <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold">
                {(me.name ?? "U").slice(0, 1).toUpperCase()}
              </div>

              <div className="hidden sm:block leading-tight pr-1">
                <div className="text-sm font-semibold truncate max-w-[180px]">{me.name}</div>
                {showSubtitle ? (
                  <div className="text-[11px] text-black/55 dark:text-white/60 truncate max-w-[180px]">
                    {roleText}
                  </div>
                ) : null}
              </div>

              <button
                onClick={async () => {
                  await useAuth.logout();
                  nav("/login", { replace: true });
                }}
                className="inline-flex h-8 items-center rounded-lg border border-[var(--color-border)] bg-white px-3 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-app grid grid-cols-1 md:grid-cols-[17rem_1fr] gap-4 md:gap-6 py-4 md:py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
            <UserCard name={me.name} roles={me.roles ?? []} />
            <nav className="mt-4 space-y-1">
              {VISIBLE.map((m) => (
                <NavLink key={m.to} to={m.to} className={({ isActive }) => navItemClass(isActive)}>
                  <span className="truncate">{m.label}</span>
                  <span className="ml-auto text-[10px] opacity-60">{isActiveDot(m.to, location.pathname)}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <button
                onClick={async () => {
                  await useAuth.logout();
                  nav("/login", { replace: true });
                }}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-border)] bg-white/80 px-3 py-2 text-sm hover:bg-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Drawer Sidebar (mobile) */}
        <MobileDrawer open={open} onClose={() => setOpen(false)}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Menu</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white hover:bg-slate-50"
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
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </MobileDrawer>

        {/* Konten */}
        <main className="min-w-0">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white/90 p-4 md:p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function navItemClass(isActive: boolean) {
  return [
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15",
    isActive
      ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-on)] shadow-[0_10px_22px_-18px_rgba(0,0,0,.45)]"
      : "text-[var(--color-text-default)] hover:bg-black/5",
  ].join(" ");
}

// kecil saja, supaya tidak mengubah logika: ini hanya untuk penanda UI
function isActiveDot(_to: string, _pathname: string) {
  return "";
}

function UserCard(props: { name: string; roles: string[] }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-black/10 flex items-center justify-center font-bold">
          {(props.name ?? "U").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-5 truncate">{props.name}</div>
          <div className="mt-0.5 text-xs text-black/60 dark:text-white/70 truncate">
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
          "fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[320px] border-r border-[var(--color-border)] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)] transition-transform md:hidden",
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
