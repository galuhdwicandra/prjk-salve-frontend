import { useMemo, useSyncExternalStore } from "react";
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
    | "expenses"
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
    desc?: string;
};

export type MenuGroup = {
    title: string;
    icon: SidebarIconName;
    single?: boolean;
    hub?: string;
    items: MenuItem[];
};

export function getTopbarTitle(pathname: string): string {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/pos")) return "POS";
    if (pathname.startsWith("/orders/")) return "Detail Receipt";
    if (pathname.startsWith("/orders")) return "Receipt List";
    if (pathname.startsWith("/receivables")) return "Piutang";
    if (pathname.startsWith("/sorting")) return "Sorting List";
    if (pathname.startsWith("/workshop")) return "Workshop";
    if (pathname.startsWith("/tracker")) return "Tracker";
    if (pathname.startsWith("/production-board/reports")) return "Rekap Pekerjaan";
    if (pathname.startsWith("/production-board")) return "Live Cucian";
    if (pathname.startsWith("/wash-notes")) return "Catatan Cuci";
    if (pathname.startsWith("/deliveries")) return "Pengiriman";
    if (pathname.startsWith("/users")) return "User & Access";
    if (pathname.startsWith("/branches")) return "Cabang";
    if (pathname.startsWith("/services")) return "Master Produk & Layanan";
    if (pathname.startsWith("/customers/")) return "Detail Pelanggan";
    if (pathname.startsWith("/customers")) return "Database Customer";
    if (pathname.startsWith("/contacts")) return "Database Kontak";
    if (pathname.startsWith("/transactions/new/in")) return "Uang Masuk";
    if (pathname.startsWith("/transactions/new/out")) return "Uang Keluar";
    if (pathname.startsWith("/transactions")) return "Transaksi";
    if (pathname.startsWith("/cash-accounts")) return "Kas & Bank";
    if (pathname.startsWith("/vouchers")) return "Master Promo";
    if (pathname.startsWith("/reports/operational")) return "Laporan Operasional";
    if (pathname.startsWith("/reports")) return "Laporan";
    if (pathname.startsWith("/accounting/dashboard")) return "Dashboard Akuntansi";
    if (pathname.startsWith("/accounting/accounts")) return "COA";
    if (pathname.startsWith("/accounting/account-mappings")) return "Mapping Akun";
    if (pathname.startsWith("/accounting/journals")) return "Jurnal Umum";
    if (pathname.startsWith("/accounting/ledger")) return "Buku Besar";
    if (pathname.startsWith("/accounting/profit-loss")) return "Laba Rugi";
    if (pathname.startsWith("/accounting/balance-sheet")) return "Neraca";
    if (pathname.startsWith("/accounting/cash-flow")) return "Cashflow";
    if (pathname.startsWith("/accounting")) return "Akuntansi";
    if (pathname.startsWith("/settings/journal-coa")) return "COA & Mapping Jurnal";
    if (pathname.startsWith("/settings/transaction-categories")) return "Master Kategori Transaksi";
    if (pathname.startsWith("/settings/customer-labels")) return "Master Label Customer";
    if (pathname.startsWith("/settings/payment-methods")) return "Master Metode Pembayaran";
    if (pathname.startsWith("/settings/whatsapp-templates")) return "Konfigurasi Pesan WhatsApp";
    if (pathname.startsWith("/settings/numbering")) return "Penomoran Otomatis";
    if (pathname.startsWith("/settings")) return "Pengaturan";

    return "Salve POS Laundry";
}

export function getPageSub(pathname: string): string | null {
    if (pathname.startsWith("/settings/whatsapp-templates")) return "Template pesan WA ke pelanggan";
    if (pathname.startsWith("/orders/")) return "Rincian struk order";
    if (pathname.startsWith("/customers/")) return "Profil, loyalty & histori pelanggan";
    if (pathname.startsWith("/vouchers")) return "Kelola kode voucher & aturan loyalty card";
    if (pathname.startsWith("/transactions/new/in")) return "Catat pemasukan di luar penjualan";
    if (pathname.startsWith("/transactions/new/out")) return "Catat pengeluaran di luar pengeluaran rutin";
    if (pathname.startsWith("/accounting/cash-flow")) return "Arus kas masuk & keluar";
    return null;
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
        single: true,
        items: [
            { label: "Dashboard", to: "/", module: "dashboard", icon: "dashboard" },
        ],
    },
    {
        title: "Kasir",
        icon: "pos",
        items: [
            { label: "POS", to: "/pos", module: "kasir-pos", icon: "pos", desc: "Buat order dan terima pembayaran" },
            { label: "Receipt List", to: "/orders", module: "kasir-receipt", icon: "orders", desc: "Daftar struk / receipt order" },
            { label: "Database Customer", to: "/customers", module: "kasir-customer", icon: "customers", desc: "Semua pelanggan dan histori kunjungan" },
            { label: "Master Promo", to: "/vouchers", module: "kasir-promo", icon: "vouchers", desc: "Kode voucher & aturan loyalty" },
        ],
    },
    {
        title: "Operasional",
        icon: "operations",
        items: [
            { label: "Sorting List", to: "/sorting", module: "ops-sorting", icon: "operations", desc: "Sortir order ke Workshop atau Subcon" },
            { label: "Workshop", to: "/workshop", module: "ops-proses", icon: "production", desc: "Antrean pengerjaan dan status order" },
            { label: "Pengiriman", to: "/deliveries", module: "ops-kirim", icon: "delivery", desc: "Perpindahan sepatu antar-lokasi & delivery" },
            { label: "Tracker", to: "/tracker", module: "ops-tracker", icon: "orders", desc: "Pelacakan status / progres order" },
        ],
    },
    {
        title: "Keuangan",
        icon: "finance",
        items: [
            { label: "Kas & Bank", to: "/cash-accounts", module: "fin-kas", icon: "finance", desc: "Daftar akun kas & bank" },
            { label: "Transaksi", to: "/transactions", module: "fin-transaksi", icon: "expenses", desc: "Uang masuk & keluar di luar penjualan" },
            { label: "Database Kontak", to: "/contacts", module: "fin-kontak", icon: "customers", desc: "Kontak vendor, karyawan & lainnya" },
        ],
    },
    {
        title: "Laporan",
        icon: "reports",
        single: true,
        hub: "/reports",
        items: [
            { label: "Buku Besar", to: "/accounting/ledger", module: "laporan", icon: "accounting", desc: "Jurnal & mutasi seluruh akun" },
            { label: "Cashflow", to: "/accounting/cash-flow", module: "laporan", icon: "cashFlow", desc: "Arus kas masuk & keluar" },
            { label: "Rekap Pekerjaan", to: "/production-board/reports", module: "laporan", icon: "reports", desc: "Pekerjaan per teknisi dalam satu periode" },
        ],
    },
    {
        title: "Pengaturan",
        icon: "settings",
        items: [
            { label: "User & Access", to: "/users", module: "set-user", icon: "users", desc: "Akun pengguna dan peran akses" },
            { label: "Master Produk & Layanan", to: "/services", module: "set-master", icon: "services", desc: "Katalog, harga per outlet & SLA" },
            { label: "Master Outlet", to: "/branches", module: "set-outlet", icon: "branches", desc: "Data gerai / lokasi Salve" },
            { label: "Master Kategori Transaksi", to: "/settings/transaction-categories", module: "set-coa", icon: "accounting", desc: "Kategori untuk Uang Masuk / Keluar" },
            { label: "COA & Mapping Jurnal", to: "/settings/journal-coa", module: "set-jurnal", icon: "accounting", desc: "Akun jurnal otomatis default & pemetaan" },
            { label: "Master Label Customer", to: "/settings/customer-labels", module: "set-labels", icon: "customers", desc: "Tag/label untuk pelanggan" },
            { label: "Master Metode Pembayaran", to: "/settings/payment-methods", module: "set-paymethod", icon: "finance", desc: "Mapping metode ke akun kas/bank per cabang" },
            { label: "Penomoran Otomatis", to: "/settings/numbering", module: "set-num", icon: "reportsSettings", desc: "Format nomor dokumen otomatis" },
            { label: "Konfigurasi Pesan WhatsApp", to: "/settings/whatsapp-templates", module: "set-wa", icon: "settings", desc: "Atur template pesan WA ke pelanggan" },
        ],
    },
];

export const REPORT_LINKS: { label: string; to: string }[] = [
    { label: "Penjualan", to: "/reports/operational?kind=sales" },
    { label: "Pesanan", to: "/reports/operational?kind=orders" },
    { label: "Pengingat Siap Ambil", to: "/reports/operational?kind=ready-reminders" },
    { label: "Piutang", to: "/reports/operational?kind=receivables" },
    { label: "Pengeluaran", to: "/reports/operational?kind=expenses" },
    { label: "Layanan", to: "/reports/operational?kind=services" },
    { label: "Deep Clean", to: "/reports/operational?kind=deep-clean" },
    { label: "Kas", to: "/reports/operational?kind=cash" },
];

/** Grup menu yang boleh dilihat user aktif, grup kosong dibuang. */
export function useVisibleMenuGroups(): MenuGroup[] {
    const modules = useSyncExternalStore(useAuth.subscribe, () => useAuth.modules);

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
