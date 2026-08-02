import { useMemo } from "react";
import { useAuth } from "../store/useAuth";
import type { RoleName } from "../api/client";

export type SidebarIconName =
    | "dashboard"
    | "pos"
    | "orders"
    | "receivables"
    | "operations"
    | "production"
    | "washNotes"
    | "delivery"
    | "masterData"
    | "users"
    | "branches"
    | "services"
    | "customers"
    | "finance"
    | "cashBox"
    | "expenses"
    | "cashToday"
    | "vouchers"
    | "reportsSettings"
    | "reports"
    | "settings"
    | "accounting"
    | "profitLoss"
    | "balanceSheet"
    | "cashFlow"
    | "logout";

export type MenuItem = {
    label: string;
    to: string;
    roles: RoleName[];
    icon: SidebarIconName;
    show?: boolean;
};

export type MenuGroup = {
    title: string;
    icon: SidebarIconName;
    items: MenuItem[];
};

export function getTopbarTitle(pathname: string): string {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/pos")) return "Point of Sale";
    if (pathname.startsWith("/orders")) return "Pesanan";
    if (pathname.startsWith("/receivables")) return "Piutang";
    if (pathname.startsWith("/production-board/reports")) return "Laporan Produksi";
    if (pathname.startsWith("/production-board")) return "Live Cucian";
    if (pathname.startsWith("/wash-notes")) return "Catatan Cuci";
    if (pathname.startsWith("/deliveries")) return "Pengiriman";
    if (pathname.startsWith("/users")) return "Pengguna";
    if (pathname.startsWith("/branches")) return "Cabang";
    if (pathname.startsWith("/service-categories")) return "Kategori Layanan";
    if (pathname.startsWith("/services")) return "Layanan";
    if (pathname.startsWith("/customers")) return "Pelanggan";
    if (pathname.startsWith("/cash-sessions")) return "Cash Box";
    if (pathname.startsWith("/cash-today")) return "Kas Hari Ini";
    if (pathname.startsWith("/expenses")) return "Pengeluaran";
    if (pathname.startsWith("/vouchers")) return "Voucher";
    if (pathname.startsWith("/reports")) return "Laporan";
    if (pathname.startsWith("/accounting/dashboard")) return "Dashboard Akuntansi";
    if (pathname.startsWith("/accounting/accounts")) return "COA";
    if (pathname.startsWith("/accounting/account-mappings")) return "Mapping Akun";
    if (pathname.startsWith("/accounting/journals")) return "Jurnal Umum";
    if (pathname.startsWith("/accounting/ledger")) return "Buku Besar";
    if (pathname.startsWith("/accounting/profit-loss")) return "Laba Rugi";
    if (pathname.startsWith("/accounting/balance-sheet")) return "Neraca";
    if (pathname.startsWith("/accounting/cash-flow")) return "Arus Kas";
    if (pathname.startsWith("/accounting")) return "Akuntansi";
    if (pathname.startsWith("/settings")) return "Settings";

    return "Salve POS Laundry";
}

export function isRouteActive(pathname: string, to: string): boolean {
    if (to === "/") {
        return pathname === "/";
    }

    return pathname === to || pathname.startsWith(`${to}/`);
}

const FEATURE = {
    vouchers: import.meta.env.VITE_FEATURE_VOUCHER === "true",
    delivery: import.meta.env.VITE_FEATURE_DELIVERY === "true",
    receivables: import.meta.env.VITE_FEATURE_RECEIVABLES === "true",
};

const MENU_GROUPS: MenuGroup[] = [
    {
        title: "Utama",
        icon: "dashboard",
        items: [
            { label: "Dashboard", to: "/", roles: ["Superadmin", "Admin Cabang"], icon: "dashboard" },
            { label: "POS", to: "/pos", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "pos" },
            { label: "Pesanan", to: "/orders", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "orders" },
            { label: "Piutang", to: "/receivables", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "receivables", show: FEATURE.receivables },
        ],
    },
    {
        title: "Operasional",
        icon: "operations",
        items: [
            { label: "Live Cucian", to: "/production-board", roles: ["Superadmin", "Admin Cabang", "Petugas Cuci"], icon: "production" },
            { label: "Catatan Cuci", to: "/wash-notes", roles: ["Superadmin", "Admin Cabang", "Petugas Cuci"], icon: "washNotes" },
            { label: "Pengiriman", to: "/deliveries", roles: ["Superadmin", "Admin Cabang", "Kasir", "Kurir"], icon: "delivery", show: FEATURE.delivery },
        ],
    },
    {
        title: "Master Data",
        icon: "masterData",
        items: [
            { label: "Pengguna", to: "/users", roles: ["Superadmin", "Admin Cabang"], icon: "users" },
            { label: "Cabang", to: "/branches", roles: ["Superadmin"], icon: "branches" },
            { label: "Layanan", to: "/services", roles: ["Superadmin", "Admin Cabang"], icon: "services" },
            { label: "Pelanggan", to: "/customers", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "customers" },
        ],
    },
    {
        title: "Keuangan",
        icon: "finance",
        items: [
            { label: "Cash Box", to: "/cash-sessions", roles: ["Superadmin", "Admin Cabang"], icon: "cashBox" },
            { label: "Pengeluaran", to: "/expenses", roles: ["Superadmin", "Admin Cabang"], icon: "expenses" },
            { label: "Kas Hari Ini", to: "/cash-today", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "cashToday" },
            { label: "Vouchers", to: "/vouchers", roles: ["Superadmin", "Admin Cabang"], icon: "vouchers", show: FEATURE.vouchers },
        ],
    },
    {
        title: "Akuntansi",
        icon: "accounting",
        items: [
            { label: "Dashboard Akuntansi", to: "/accounting/dashboard", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "dashboard" },
            { label: "COA", to: "/accounting/accounts", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "accounting" },
            { label: "Mapping Akun", to: "/accounting/account-mappings", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "accounting" },
            { label: "Jurnal Umum", to: "/accounting/journals", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "accounting" },
            { label: "Buku Besar", to: "/accounting/ledger", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "accounting" },
            { label: "Laba Rugi", to: "/accounting/profit-loss", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "profitLoss" },
            { label: "Neraca", to: "/accounting/balance-sheet", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "balanceSheet" },
            { label: "Arus Kas", to: "/accounting/cash-flow", roles: ["Superadmin", "Admin Cabang", "Akuntansi"], icon: "cashFlow" },
        ],
    },
    {
        title: "Laporan & Pengaturan",
        icon: "reportsSettings",
        items: [
            { label: "Laporan", to: "/reports", roles: ["Superadmin", "Admin Cabang", "Kasir", "Akuntansi"], icon: "reports" },
            { label: "Settings", to: "/settings", roles: ["Superadmin", "Admin Cabang"], icon: "settings" },
        ],
    },

];

/** Grup menu yang boleh dilihat user aktif, grup kosong dibuang. */
export function useVisibleMenuGroups(): MenuGroup[] {
    const roles = useAuth.roles;

    return useMemo(
        () =>
            MENU_GROUPS
                .map((group) => ({
                    ...group,
                    items: group.items.filter(
                        (m) => (m.show ?? true) && roles.some((r) => m.roles.includes(r)),
                    ),
                }))
                .filter((group) => group.items.length > 0),
        [roles],
    );
}
