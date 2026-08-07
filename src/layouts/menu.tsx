import { useMemo } from "react";
import { useAuth } from "../store/useAuth";
import type { ModuleKey } from "../api/client";

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
    module: ModuleKey;
    icon: SidebarIconName;
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
    if (pathname.startsWith("/settings/customer-labels")) return "Master Label Customer";
    if (pathname.startsWith("/settings/payment-methods")) return "Master Metode Pembayaran";
    if (pathname.startsWith("/settings")) return "Settings";

    return "Salve POS Laundry";
}

export function isRouteActive(pathname: string, to: string): boolean {
    if (to === "/") {
        return pathname === "/";
    }

    return pathname === to || pathname.startsWith(`${to}/`);
}

const MENU_GROUPS: MenuGroup[] = [
    {
        title: "Dashboard",
        icon: "dashboard",
        items: [
            { label: "Dashboard", to: "/", module: "dashboard", icon: "dashboard" },
        ],
    },
    {
        title: "Kasir",
        icon: "pos",
        items: [
            { label: "POS", to: "/pos", module: "kasir-pos", icon: "pos" },
            { label: "Receipt List", to: "/orders", module: "kasir-receipt", icon: "orders" },
            { label: "Database Customer", to: "/customers", module: "kasir-customer", icon: "customers" },
            { label: "Master Promo", to: "/vouchers", module: "kasir-promo", icon: "vouchers" },
        ],
    },
    {
        title: "Operasional",
        icon: "operations",
        items: [
            { label: "Workshop", to: "/production-board", module: "ops-proses", icon: "production" },
            { label: "Pengiriman", to: "/deliveries", module: "ops-kirim", icon: "delivery" },
        ],
    },
    {
        title: "Keuangan",
        icon: "finance",
        items: [
            { label: "Transaksi", to: "/expenses", module: "fin-transaksi", icon: "expenses" },
        ],
    },
    {
        title: "Laporan",
        icon: "reports",
        items: [
            { label: "Buku Besar", to: "/accounting/ledger", module: "laporan", icon: "accounting" },
            { label: "Cashflow", to: "/accounting/cash-flow", module: "laporan", icon: "cashFlow" },
            { label: "Rekap Pekerjaan", to: "/production-board/reports", module: "laporan", icon: "reports" },
        ],
    },
    {
        title: "Pengaturan",
        icon: "settings",
        items: [
            { label: "User & Access", to: "/users", module: "set-user", icon: "users" },
            { label: "Master Produk & Layanan", to: "/services", module: "set-master", icon: "services" },
            { label: "Master Outlet", to: "/branches", module: "set-outlet", icon: "branches" },
            { label: "COA & Mapping Jurnal", to: "/accounting/account-mappings", module: "set-jurnal", icon: "accounting" },
            { label: "Master Label Customer", to: "/settings/customer-labels", module: "set-labels", icon: "customers" },
            { label: "Master Metode Pembayaran", to: "/settings/payment-methods", module: "set-paymethod", icon: "finance" },
            { label: "Konfigurasi Pesan WhatsApp", to: "/settings", module: "set-wa", icon: "settings" },
        ],
    },
];


/** Grup menu yang boleh dilihat user aktif, grup kosong dibuang. */
export function useVisibleMenuGroups(): MenuGroup[] {
    const modules = useAuth.modules;

    return useMemo(
        () =>
            MENU_GROUPS
                .map((group) => ({
                    ...group,
                    items: group.items.filter((m) => modules.includes(m.module)),
                }))
                .filter((group) => group.items.length > 0),
        [modules],
    );
}

export function firstAccessiblePath(modules: ModuleKey[]): string {
    const item = MENU_GROUPS.flatMap((group) => group.items).find((m) => modules.includes(m.module));

    return item ? item.to : "/login";
}
