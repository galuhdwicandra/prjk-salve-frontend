// src/layouts/ProtectedLayout.tsx
import { Navigate, Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth, useHasRole } from '../store/useAuth';
import type { RoleName } from '../api/client';

export default function ProtectedLayout() {
    const me = useAuth.user;
    const location = useLocation();
    const nav = useNavigate();
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
        { label: 'Dashboard', to: '/', roles: ['Superadmin', 'Admin Cabang', 'Kasir', 'Petugas Cuci', 'Kurir'] },
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
    ];

    return (
        <div className="flex min-h-dvh">
            <aside className="w-64 border-r p-4 space-y-4">
                <div>
                    <div className="font-semibold">POS Salve</div>
                    <div className="text-xs text-gray-600">
                        {me.name}<br />{me.roles.join(', ')}
                    </div>
                </div>
                <nav className="space-y-1">
                    {MENU.filter((m) => (m.show ?? true) && (me.roles ?? []).some((r) => m.roles.includes(r)))
                        .map((m) => (
                            <NavLink
                                key={m.to}
                                to={m.to}
                                className={({ isActive }) =>
                                    `block rounded px-3 py-2 text-sm ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`
                                }
                            >
                                {m.label}
                            </NavLink>
                        ))}
                </nav>
                <button
                    onClick={async () => { await useAuth.logout(); nav('/login', { replace: true }); }}
                    className="rounded border px-3 py-2 text-sm"
                >
                    Logout
                </button>
            </aside>
            <section className="flex-1 p-6">
                <Outlet />
            </section>
        </div>
    );
}

/** Komponen guard untuk tombol/aksi dalam halaman */
export function RequireRole(props: { roles: RoleName[]; children: React.ReactNode; fallback?: React.ReactNode }) {
    const allowed = useHasRole(props.roles);
    if (!allowed) return (props.fallback ?? null);
    return <>{props.children}</>;
}
