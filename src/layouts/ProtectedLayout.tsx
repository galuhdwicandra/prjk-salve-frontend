// src/layouts/ProtectedLayout.tsx
import { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth, useHasRole } from '../store/useAuth';
import type { RoleName } from '../api/client';

export default function ProtectedLayout() {
  const me = useAuth.user;
  const location = useLocation();
  const nav = useNavigate();

  // Drawer untuk mobile
  const [open, setOpen] = useState(false);

  if (!me) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const FF = {
    vouchers: import.meta.env.VITE_FEATURE_VOUCHER === 'true',
    delivery: import.meta.env.VITE_FEATURE_DELIVERY === 'true',
    receivables: import.meta.env.VITE_FEATURE_RECEIVABLES === 'true',
  };

  type MenuItem = { label: string; to: string; roles: RoleName[]; show?: boolean };
  const MENU: MenuItem[] = [
    { label: 'Dashboard', to: '/', roles: ['Superadmin', 'Admin Cabang,', 'Kasir', 'Petugas Cuci', 'Kurir'] as RoleName[] },
    { label: 'POS', to: '/pos', roles: ['Superadmin', 'Admin Cabang', 'Kasir'] },
    { label: 'Orders', to: '/orders', roles: ['Superadmin', 'Admin Cabang', 'Kasir'] },
    { label: 'Customers', to: '/customers', roles: ['Superadmin', 'Admin Cabang', 'Kasir'] },
    { label: 'Services', to: '/services', roles: ['Superadmin', 'Admin Cabang'] },
    { label: 'Users', to: '/users', roles: ['Superadmin', 'Admin Cabang'] },
    { label: 'Branches', to: '/branches', roles: ['Superadmin'] },
    { label: 'Delivery', to: '/deliveries', roles: ['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir'], show: FF.delivery },
    { label: 'Expenses', to: '/expenses', roles: ['Superadmin', 'Admin Cabang'] },
    { label: 'Receivables', to: '/receivables', roles: ['Superadmin', 'Admin Cabang', 'Kasir'], show: FF.receivables },
    { label: 'Vouchers', to: '/vouchers', roles: ['Superadmin', 'Admin Cabang'], show: FF.vouchers },
    { label: 'Reports', to: '/reports', roles: ['Superadmin', 'Admin Cabang', 'Kasir'] },
  ];

  const VISIBLE = MENU.filter(
    (m) => (m.show ?? true) && (me.roles ?? []).some((r) => m.roles.includes(r as RoleName)),
  );

  return (
    <div className="min-h-dvh bg-[var(--color-surface)] text-[var(--color-text-default)]">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="container-app flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Toggle drawer (mobile) */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[#E6EDFF] transition-colors"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              {/* ikon burger sederhana */}
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
            </button>
            <div className="font-semibold">SALVE</div>
          </div>

          {/* Aksi cepat sederhana (placeholder) */}
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await useAuth.logout();
                nav('/login', { replace: true });
              }}
              className="hidden md:inline-flex h-9 items-center rounded-lg border border-[var(--color-border)] px-3 text-sm hover:bg-[#E6EDFF] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container-app grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6 py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block rounded-lg border border-[var(--color-border)] bg-white/90 p-4 shadow-elev-1">
          <UserCard name={me.name} roles={me.roles} />
          <nav className="mt-4 space-y-1">
            {VISIBLE.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                className={({ isActive }) =>
                  [
                    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)] shadow-elev-1'
                      : 'hover:bg-[#E6EDFF]',
                  ].join(' ')
                }
              >
                {m.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={async () => {
              await useAuth.logout();
              nav('/login', { replace: true });
            }}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[#E6EDFF] transition-colors"
          >
            Logout
          </button>
        </aside>

        {/* Drawer Sidebar (mobile) */}
        <MobileDrawer open={open} onClose={() => setOpen(false)}>
          <div className="p-4">
            <UserCard name={me.name} roles={me.roles} />
            <nav className="mt-4 space-y-1">
              {VISIBLE.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)] shadow-elev-1'
                        : 'hover:bg-[#E6EDFF]',
                    ].join(' ')
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={async () => {
                await useAuth.logout();
                nav('/login', { replace: true });
              }}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[#E6EDFF] transition-colors"
            >
              Logout
            </button>
          </div>
        </MobileDrawer>

        {/* Konten */}
        <main className="min-w-0">
          <div className="rounded-lg border border-[var(--color-border)] bg-white/90 p-4 shadow-elev-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function UserCard(props: { name: string; roles: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="font-semibold">{props.name}</div>
      <div className="mt-0.5 text-xs text-black/60 dark:text-white/70">
        {props.roles?.join(', ')}
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
          'fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden',
          props.open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={props.onClose}
        aria-hidden={!props.open}
      />
      {/* Panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--color-border)] bg-white p-0 shadow-elev-2 transition-transform md:hidden',
          props.open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
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
