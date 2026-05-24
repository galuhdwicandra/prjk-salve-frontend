// src/layouts/ProtectedLayout.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useAuth, useHasRole } from "../store/useAuth";
import type { RoleName } from "../api/client";
import { listOrders } from "../api/orders";
import type { Order } from "../types/orders";
import { buildWhatsAppLink } from "../utils/wa";

type SidebarIconName =
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
  | "logout";

type MenuItem = {
  label: string;
  to: string;
  roles: RoleName[];
  icon: SidebarIconName;
  show?: boolean;
};

type MenuGroup = {
  title: string;
  icon: SidebarIconName;
  items: MenuItem[];
};

type TopbarSearchResult = {
  label: string;
  to: string;
  group: string;
  icon: SidebarIconName;
};

function SidebarIcon(props: { name: SidebarIconName; className?: string }) {
  const commonProps = {
    className: props.className ?? "h-4 w-4 shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (props.name) {
    case "dashboard":
      return (
        <svg {...commonProps}>
          <path d="M3 13h8V3H3v10Z" />
          <path d="M13 21h8V11h-8v10Z" />
          <path d="M13 3v6h8V3h-8Z" />
          <path d="M3 21h8v-6H3v6Z" />
        </svg>
      );

    case "pos":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16" />
          <path d="M6 7v12h12V7" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M8 12h8" />
          <path d="M8 16h4" />
        </svg>
      );

    case "orders":
      return (
        <svg {...commonProps}>
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
      );

    case "receivables":
      return (
        <svg {...commonProps}>
          <path d="M4 5h16v14H4z" />
          <path d="M4 9h16" />
          <path d="M8 14h4" />
          <path d="M16 14h.01" />
        </svg>
      );

    case "operations":
      return (
        <svg {...commonProps}>
          <path d="M12 3v4" />
          <path d="M12 17v4" />
          <path d="M3 12h4" />
          <path d="M17 12h4" />
          <path d="M5.6 5.6l2.8 2.8" />
          <path d="M18.4 5.6l-2.8 2.8" />
          <path d="M5.6 18.4l2.8-2.8" />
          <path d="M18.4 18.4l-2.8-2.8" />
        </svg>
      );

    case "production":
      return (
        <svg {...commonProps}>
          <path d="M4 16V8l8-4 8 4v8l-8 4-8-4Z" />
          <path d="M4 8l8 4 8-4" />
          <path d="M12 12v8" />
        </svg>
      );

    case "washNotes":
      return (
        <svg {...commonProps}>
          <path d="M6 3h9l3 3v15H6V3Z" />
          <path d="M14 3v4h4" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );

    case "delivery":
      return (
        <svg {...commonProps}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 11h3l3 3v3h-6v-6Z" />
          <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
      );

    case "masterData":
      return (
        <svg {...commonProps}>
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
          <path d="M8 3v4" />
          <path d="M16 10v4" />
          <path d="M10 17v4" />
        </svg>
      );

    case "users":
      return (
        <svg {...commonProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "branches":
      return (
        <svg {...commonProps}>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
        </svg>
      );

    case "services":
      return (
        <svg {...commonProps}>
          <path d="M12 3l2.2 4.5 4.8.7-3.5 3.4.8 4.8L12 14.1l-4.3 2.3.8-4.8L5 8.2l4.8-.7L12 3Z" />
          <path d="M4 21h16" />
        </svg>
      );

    case "customers":
      return (
        <svg {...commonProps}>
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "finance":
      return (
        <svg {...commonProps}>
          <path d="M3 10h18" />
          <path d="M5 10V7l7-4 7 4v3" />
          <path d="M6 10v8" />
          <path d="M10 10v8" />
          <path d="M14 10v8" />
          <path d="M18 10v8" />
          <path d="M4 18h16" />
          <path d="M3 21h18" />
        </svg>
      );

    case "cashBox":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16v12H4z" />
          <path d="M4 11h16" />
          <path d="M8 15h.01" />
          <path d="M12 15h4" />
        </svg>
      );

    case "expenses":
      return (
        <svg {...commonProps}>
          <path d="M6 2h12v20H6z" />
          <path d="M9 6h6" />
          <path d="M9 10h6" />
          <path d="M9 14h3" />
          <path d="M15 18h.01" />
        </svg>
      );

    case "cashToday":
      return (
        <svg {...commonProps}>
          <path d="M12 8v5l3 2" />
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 3v6h-6" />
        </svg>
      );

    case "vouchers":
      return (
        <svg {...commonProps}>
          <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z" />
          <path d="M9 9h.01" />
          <path d="M15 15h.01" />
          <path d="M16 8l-8 8" />
        </svg>
      );

    case "reportsSettings":
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 16v-5" />
          <path d="M12 16V8" />
          <path d="M16 16v-3" />
        </svg>
      );

    case "reports":
      return (
        <svg {...commonProps}>
          <path d="M5 3h14v18H5z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h3" />
        </svg>
      );

    case "logout":
      return (
        <svg {...commonProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );

    case "settings":
      return (
        <svg {...commonProps}>
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.36.15.67.36.93.62.26.26.47.57.62.93H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.45Z" />
        </svg>
      );

    default:
      return null;
  }
}

function getTopbarTitle(pathname: string): string {
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
  if (pathname.startsWith("/settings")) return "Settings";

  return "Salve POS Laundry";
}

function TopbarCircleButton(props: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={props.label}
      onClick={props.onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-default)] shadow-[0_10px_24px_-22px_rgba(0,0,0,.55)] transition hover:-translate-y-[1px] hover:bg-white dark:hover:bg-white/10"
    >
      {props.children}
    </button>
  );
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function buildTopbarSearchResults(groups: MenuGroup[]): TopbarSearchResult[] {
  return groups.flatMap((group) =>
    group.items.map((item) => ({
      label: item.label,
      to: item.to,
      group: group.title,
      icon: item.icon,
    })),
  );
}

function getTodayDateString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatShortDate(input?: string | null): string {
  if (!input) return "-";

  const value = String(input).slice(0, 10);
  const parts = value.split("-");

  if (parts.length !== 3) return value;

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

function getCustomerName(order: Order): string {
  return order.customer?.name?.trim() || "Tanpa nama";
}

function getCustomerWhatsapp(order: Order): string {
  return order.customer?.whatsapp?.trim() || "";
}

function getOrderNote(order: Order): string {
  return order.notes?.trim() || "Tidak ada catatan barang.";
}

export default function ProtectedLayout() {
  const me = useAuth.user;
  const location = useLocation();
  const nav = useNavigate();

  // Drawer untuk mobile
  const [open, setOpen] = useState(false);

  // Collapse khusus sidebar desktop
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Search topbar
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // User menu topbar
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Notification topbar
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [completedTodayOrders, setCompletedTodayOrders] = useState<Order[]>([]);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // Close drawer/search/user menu/notification on route change (UX)
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setSearchKeyword("");
    setUserMenuOpen(false);
    setNotificationOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchKeyword("");
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchKeyword("");
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    if (!notificationOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotificationOpen(false);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!notificationRef.current) return;
      if (!notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [notificationOpen]);

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

  const MENU_GROUPS: MenuGroup[] = [
    {
      title: "Utama",
      icon: "dashboard",
      items: [
        { label: "Dashboard", to: "/", roles: ["Superadmin", "Admin Cabang"], icon: "dashboard" },
        { label: "POS", to: "/pos", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "pos" },
        { label: "Pesanan", to: "/orders", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "orders" },
        { label: "Piutang", to: "/receivables", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "receivables", show: FF.receivables },
      ],
    },
    {
      title: "Operasional",
      icon: "operations",
      items: [
        { label: "Live Cucian", to: "/production-board", roles: ["Superadmin", "Admin Cabang", "Petugas Cuci"], icon: "production" },
        { label: "Catatan Cuci", to: "/wash-notes", roles: ["Superadmin", "Admin Cabang", "Petugas Cuci"], icon: "washNotes" },
        { label: "Pengiriman", to: "/deliveries", roles: ["Superadmin", "Admin Cabang", "Kasir", "Kurir"], icon: "delivery", show: FF.delivery },
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
        { label: "Vouchers", to: "/vouchers", roles: ["Superadmin", "Admin Cabang"], icon: "vouchers", show: FF.vouchers },
      ],
    },
    {
      title: "Laporan & Pengaturan",
      icon: "reportsSettings",
      items: [
        { label: "Laporan", to: "/reports", roles: ["Superadmin", "Admin Cabang", "Kasir"], icon: "reports" },
        { label: "Settings", to: "/settings", roles: ["Superadmin", "Admin Cabang"], icon: "settings" },
      ],
    },
  ];

  const safeRoles = me?.roles ?? [];

  const VISIBLE_GROUPS = useMemo(
    () =>
      MENU_GROUPS
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (m) => (m.show ?? true) && safeRoles.some((r) => m.roles.includes(r as RoleName)),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [safeRoles, FF.delivery, FF.receivables, FF.vouchers],
  );

  const topbarSearchResults = useMemo(
    () => buildTopbarSearchResults(VISIBLE_GROUPS),
    [VISIBLE_GROUPS],
  );

  const filteredTopbarSearchResults = useMemo(() => {
    const keyword = normalizeSearchValue(searchKeyword);

    if (!keyword) {
      return topbarSearchResults;
    }

    return topbarSearchResults.filter((item) => {
      const haystack = normalizeSearchValue(`${item.label} ${item.group} ${item.to}`);
      return haystack.includes(keyword);
    });
  }, [searchKeyword, topbarSearchResults]);

  function openTopbarSearch() {
    setSearchOpen((value) => !value);
  }

  function goToSearchResult(item: TopbarSearchResult) {
    nav(item.to);
    setSearchOpen(false);
    setSearchKeyword("");
  }

  function submitTopbarSearch() {
    const first = filteredTopbarSearchResults[0];

    if (first) {
      goToSearchResult(first);
    }
  }

  async function handleTopbarLogout() {
    setUserMenuOpen(false);
    await useAuth.logout();
    nav("/login", { replace: true });
  }

  async function loadCompletedTodayNotifications() {
    const today = getTodayDateString();

    setNotificationLoading(true);
    setNotificationError(null);

    try {
      const res = await listOrders({
        date_to: today,
        sort_by: "ready_at",
        sort_dir: "desc",
        per_page: 100,
      });

      const rows = Array.isArray(res.data) ? res.data : [];

      const todayRows = rows.filter((order) => {
        return String(order.ready_at ?? "").slice(0, 10) === today;
      });

      setCompletedTodayOrders(todayRows);
    } catch {
      setCompletedTodayOrders([]);
      setNotificationError("Gagal memuat notifikasi pesanan selesai.");
    } finally {
      setNotificationLoading(false);
    }
  }

  async function toggleNotificationDropdown() {
    const nextOpen = !notificationOpen;

    setNotificationOpen(nextOpen);

    if (nextOpen) {
      setUserMenuOpen(false);
      setSearchOpen(false);
      setSearchKeyword("");
      await loadCompletedTodayNotifications();
    }
  }

  function openOrderFromNotification(orderId: string) {
    setNotificationOpen(false);
    nav(`/orders/${encodeURIComponent(orderId)}`);
  }

  const roleText = safeRoles.join(", ");
  const pageTitle = useMemo(() => getTopbarTitle(location.pathname), [location.pathname]);

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
      <header className="sticky top-0 z-30 px-3 pt-2 sm:px-4 lg:px-6">
        <div className="container-app">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-[1.7rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/85 p-1.5 shadow-[0_16px_34px_-28px_rgba(0,0,0,.45)] backdrop-blur sm:p-2">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-default)] shadow-[0_10px_24px_-22px_rgba(0,0,0,.55)] transition hover:bg-white dark:hover:bg-white/10"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              >
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current mt-1" />
                <span className="block h-0.5 w-4 bg-current mt-1" />
              </button>

              <div className="flex min-w-0 items-center gap-2.5 rounded-[1.45rem] bg-[#032e7a] px-3 py-1.5 text-white shadow-[0_16px_32px_-26px_rgba(0,0,0,.7)] sm:px-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                  <img
                    src="/logo-salve.png"
                    alt="Logo Salve"
                    className="h-6 w-6 object-contain"
                  />
                </div>

                <div className="min-w-0 hidden sm:block">
                  <div className="truncate text-[12px] font-semibold uppercase tracking-[0.10em] text-white">
                    Salve Cleaning Shoes
                  </div>
                </div>
              </div>

              <div ref={searchBoxRef} className="relative shrink-0">
                <TopbarCircleButton label="Cari" onClick={openTopbarSearch}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </TopbarCircleButton>

                {searchOpen ? (
                  <div className="fixed left-3 right-3 top-[4.5rem] z-[999] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_26px_80px_-44px_rgba(0,0,0,.8)] lg:absolute lg:left-0 lg:right-auto lg:top-12 lg:w-[320px]">
                    <div className="border-b border-[color:var(--color-border)] p-2.5">
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              submitTopbarSearch();
                            }
                          }}
                          className="w-full rounded-xl border border-[color:var(--color-border)] bg-white px-9 py-2 text-sm text-[color:var(--color-text-default)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-primary)] dark:bg-white/10"
                          placeholder="Cari menu..."
                          aria-label="Cari menu"
                        />

                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto p-2">
                      {filteredTopbarSearchResults.length > 0 ? (
                        <div className="space-y-1">
                          {filteredTopbarSearchResults.map((item) => (
                            <button
                              key={`${item.group}-${item.to}`}
                              type="button"
                              onClick={() => goToSearchResult(item)}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
                            >
                              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/5 text-[color:var(--color-brand-primary)] dark:bg-white/10">
                                <SidebarIcon name={item.icon} className="h-4 w-4" />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold text-[color:var(--color-text-default)]">
                                  {item.label}
                                </span>
                                <span className="block truncate text-xs text-[color:var(--color-text-muted)]">
                                  {item.group}
                                </span>
                              </span>

                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="shrink-0 text-[color:var(--color-text-muted)]"
                                aria-hidden="true"
                              >
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-[color:var(--color-border)] px-3 py-6 text-center text-sm text-[color:var(--color-text-muted)]">
                          Menu tidak ditemukan.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

            </div>

            <div className="min-w-0 px-2">
              <div className="truncate text-center text-base font-semibold text-[color:var(--color-text-default)] sm:text-xl">
                {pageTitle}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center gap-2">
                <div ref={notificationRef} className="relative">
                  <div className="relative">
                    <TopbarCircleButton label="Notifikasi" onClick={toggleNotificationDropdown}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17a2 2 0 0 1-.59 1.41L4 17h5" />
                        <path d="M10 21a2 2 0 0 0 4 0" />
                      </svg>
                    </TopbarCircleButton>

                    {completedTodayOrders.length > 0 ? (
                      <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-[color:var(--color-surface)]">
                        {completedTodayOrders.length > 99 ? "99+" : completedTodayOrders.length}
                      </span>
                    ) : null}
                  </div>

                  {notificationOpen ? (
                    <div
                      role="menu"
                      className="fixed left-3 right-3 top-[4.5rem] z-[999] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_26px_80px_-44px_rgba(0,0,0,.8)] sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[360px]"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-[color:var(--color-border)] px-4 py-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[color:var(--color-text-default)]">
                            Notif Pesanan Selesai
                          </div>
                          <div className="mt-0.5 text-xs text-[color:var(--color-text-muted)]">
                            Semua pesanan dengan tanggal selesai hari ini
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={loadCompletedTodayNotifications}
                          disabled={notificationLoading}
                          className="rounded-lg border border-[color:var(--color-border)] px-2 py-1 text-xs font-medium text-[color:var(--color-text-muted)] transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/10"
                        >
                          {notificationLoading ? "Memuat..." : "Refresh"}
                        </button>
                      </div>

                      <div className="max-h-[430px] overflow-y-auto p-2">
                        {notificationLoading ? (
                          <div className="rounded-xl border border-dashed border-[color:var(--color-border)] px-3 py-6 text-center text-sm text-[color:var(--color-text-muted)]">
                            Memuat notifikasi...
                          </div>
                        ) : notificationError ? (
                          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                            {notificationError}
                          </div>
                        ) : completedTodayOrders.length > 0 ? (
                          <div className="space-y-2">
                            {completedTodayOrders.map((order) => {
                              const customerName = getCustomerName(order);
                              const customerWhatsapp = getCustomerWhatsapp(order);
                              const note = getOrderNote(order);

                              return (
                                <div
                                  key={order.id}
                                  className="rounded-2xl border border-[color:var(--color-border)] bg-white/70 p-3 text-sm shadow-[0_14px_34px_-30px_rgba(0,0,0,.7)] dark:bg-white/5"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => openOrderFromNotification(order.id)}
                                        className="block max-w-[220px] truncate text-left font-semibold text-[color:var(--color-text-default)] hover:text-[color:var(--color-brand-primary)]"
                                        title={customerName}
                                      >
                                        {customerName}
                                      </button>

                                      <div className="mt-0.5 truncate text-xs text-[color:var(--color-text-muted)]">
                                        {order.invoice_no || order.number}
                                      </div>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                      {order.status}
                                    </span>
                                  </div>

                                  <div className="mt-3 space-y-2 text-xs text-[color:var(--color-text-muted)]">
                                    <div className="flex items-center justify-between gap-3">
                                      <span>No HP</span>
                                      {customerWhatsapp ? (
                                        <a
                                          href={buildWhatsAppLink(customerWhatsapp, "")}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="max-w-[210px] truncate font-semibold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
                                          onClick={(e) => e.stopPropagation()}
                                          title={customerWhatsapp}
                                        >
                                          {customerWhatsapp}
                                        </a>
                                      ) : (
                                        <span>-</span>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                      <span>Tgl masuk-selesai</span>
                                      <span className="text-right font-medium text-[color:var(--color-text-default)]">
                                        {formatShortDate(order.received_at)} - {formatShortDate(order.ready_at)}
                                      </span>
                                    </div>

                                    <div>
                                      <div className="mb-1">Catatan Barang Konsumen</div>
                                      <div className="whitespace-pre-line rounded-xl bg-black/5 px-3 py-2 text-[color:var(--color-text-default)] dark:bg-white/10">
                                        {note}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-[color:var(--color-border)] px-3 py-6 text-center text-sm text-[color:var(--color-text-muted)]">
                            Belum ada pesanan selesai hari ini.
                          </div>
                        )}
                      </div>

                      <div className="border-t border-[color:var(--color-border)] p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNotificationOpen(false);
                            nav("/orders");
                          }}
                          className="flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--color-brand-primary)] transition hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          Lihat semua pesanan
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-1 text-left shadow-[0_10px_24px_-22px_rgba(0,0,0,.55)] transition hover:-translate-y-[1px] hover:bg-white dark:hover:bg-white/10"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label="Buka menu pengguna"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[color:var(--color-brand-primary)] dark:bg-white/10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                      <path d="M4 20a8 8 0 0 1 16 0" />
                    </svg>
                  </div>

                  <div className="hidden md:block min-w-0">
                    <div className="max-w-[180px] truncate text-sm font-semibold text-[color:var(--color-text-default)]">
                      {me.name}
                    </div>
                    <div className="max-w-[180px] truncate text-[11px] text-[color:var(--color-text-muted)]">
                      {roleText || "Pengguna aktif"}
                    </div>
                  </div>

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={[
                      "hidden shrink-0 text-[color:var(--color-text-muted)] transition-transform md:block",
                      userMenuOpen ? "rotate-180" : "",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {userMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 z-[999] w-[220px] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 shadow-[0_26px_80px_-44px_rgba(0,0,0,.8)]"
                  >
                    <div className="border-b border-[color:var(--color-border)] px-3 py-2">
                      <div className="truncate text-sm font-semibold text-[color:var(--color-text-default)]">
                        {me.name}
                      </div>
                      <div className="truncate text-xs text-[color:var(--color-text-muted)]">
                        {roleText || "Pengguna aktif"}
                      </div>
                    </div>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleTopbarLogout}
                      className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <SidebarIcon name="logout" className="h-4 w-4 shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={[
          "container-app grid grid-cols-1 gap-4 md:gap-6 py-3 md:py-4 transition-[grid-template-columns] duration-300",
          desktopCollapsed ? "md:grid-cols-[4.75rem_1fr]" : "md:grid-cols-[17rem_1fr]",
        ].join(" ")}
      >
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block sticky top-[5.75rem] self-start z-50">
          <div
            className={[
              "relative max-h-[calc(100dvh-6.75rem)] overflow-visible rounded-2xl border border-[color:var(--color-border)] bg-white/70 dark:bg-white/5 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)] transition-all duration-300",
              desktopCollapsed ? "p-3" : "p-4",
            ].join(" ")}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
              style={{
                background:
                  "radial-gradient(420px 220px at 15% 0%, color-mix(in srgb, var(--color-brand-primary) 14%, transparent) 0%, transparent 60%)",
              }}
            />

            <div className="relative flex min-h-[calc(100dvh-8.75rem)] flex-col">
              <div
                className={[
                  "flex items-center",
                  desktopCollapsed ? "justify-center" : "justify-between",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex items-center min-w-0",
                    desktopCollapsed ? "justify-center" : "gap-3",
                  ].join(" ")}
                >
                  <div
                    className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl flex items-center justify-center shadow-[0_16px_34px_-24px_color-mix(in_srgb,var(--color-brand-primary)_70%,transparent)]"
                    style={{
                      background: "var(--color-brand-primary)",
                      color: "var(--color-brand-on)",
                    }}
                  >
                    <img src="/logo-salve.png" alt="Logo Salve" className="h-7 w-7 object-contain" />
                  </div>

                  {!desktopCollapsed ? (
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-5 text-[color:var(--color-text-default)] truncate">
                        SALVE
                      </div>
                      <div className="text-[11px] leading-4 text-[color:var(--color-text-muted)] truncate">
                        System Point Of Sale
                      </div>
                    </div>
                  ) : null}
                </div>

                {!desktopCollapsed ? (
                  <button
                    type="button"
                    onClick={() => setDesktopCollapsed((value) => !value)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-default)] shadow-[0_16px_34px_-26px_rgba(0,0,0,.45)] transition hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="Collapse sidebar"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                ) : null}
              </div>

              {desktopCollapsed ? (
                <button
                  type="button"
                  onClick={() => setDesktopCollapsed(false)}
                  className="mt-4 inline-flex h-8 w-full items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-default)] transition hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Expand sidebar"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ) : null}

              <nav className="mt-7 flex-1">
                <SidebarGroups groups={VISIBLE_GROUPS} variant="desktop" collapsed={desktopCollapsed} />
              </nav>

              <div className="mt-6 space-y-2 border-t border-[color:var(--color-border)] pt-4">
                {!desktopCollapsed ? (
                  <UserCard name={me.name} roles={me.roles ?? []} />
                ) : (
                  <div className="flex justify-center">
                    <div className="h-9 w-9 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-[color:var(--color-text-default)]">
                      {(me.name ?? "U").slice(0, 1).toUpperCase()}
                    </div>
                  </div>
                )}

                <button
                  onClick={async () => {
                    await useAuth.logout();
                    nav("/login", { replace: true });
                  }}
                  className={[
                    "inline-flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--color-text-muted)] transition",
                    "hover:bg-black/5 hover:text-[color:var(--color-text-default)] dark:hover:bg-white/10",
                    desktopCollapsed ? "justify-center" : "justify-start gap-3",
                  ].join(" ")}
                  title={desktopCollapsed ? "Logout" : undefined}
                >
                  <SidebarIcon name="logout" className="h-4 w-4 shrink-0" />
                  {!desktopCollapsed ? <span>Logout</span> : null}
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

            <div className="relative p-4 pb-6">
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

              <nav className="mt-4">
                <SidebarGroups groups={VISIBLE_GROUPS} variant="mobile" />
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
        <main className="relative z-0 min-w-0">
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

function SidebarGroups(props: { groups: MenuGroup[]; variant?: "desktop" | "mobile"; collapsed?: boolean }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const variant = props.variant ?? "mobile";
  const collapsed = props.collapsed ?? false;

  function isMenuActive(to: string): boolean {
    if (to === "/") {
      return location.pathname === "/";
    }

    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  }

  function isGroupActive(group: MenuGroup): boolean {
    return group.items.some((item) => isMenuActive(item.to));
  }

  function isGroupOpen(group: MenuGroup): boolean {
    return openGroup === group.title;
  }

  function toggleGroup(title: string) {
    setOpenGroup((current) => (current === title ? null : title));
  }

  if (variant === "desktop") {
    return (
      <div className="space-y-1.5">
        {props.groups.map((group) => {
          const activeGroup = isGroupActive(group);
          const open = isGroupOpen(group);

          return (
            <section key={group.title} className="relative">
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                className={[
                  "group flex w-full items-center rounded-xl text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15",
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                  activeGroup || open
                    ? "bg-[color:var(--color-brand-primary)] text-[color:var(--color-brand-on)] shadow-[0_18px_34px_-28px_rgba(0,0,0,.55)]"
                    : "text-[color:var(--color-text-muted)] hover:bg-black/5 hover:text-[color:var(--color-text-default)] dark:hover:bg-white/10",
                ].join(" ")}
                aria-expanded={open}
                title={collapsed ? group.title : undefined}
              >
                <span
                  className={[
                    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                    activeGroup || open ? "bg-black/10 text-current dark:bg-white/10" : "bg-transparent text-current",
                  ].join(" ")}
                >
                  <SidebarIcon name={group.icon} className="h-4 w-4" />
                </span>

                {!collapsed ? <span className="truncate">{group.title}</span> : null}

                {!collapsed ? (
                  <svg
                    className={[
                      "ml-auto h-4 w-4 shrink-0 transition-transform",
                      open ? "rotate-90" : "",
                    ].join(" ")}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 5.23a.75.75 0 0 1 1.06-.02l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08L11.168 10 7.23 6.29a.75.75 0 0 1-.02-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
              </button>

              {open ? (
                collapsed ? (
                  <div className="absolute left-full top-0 z-[999] ml-3 hidden min-w-[230px] rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 shadow-[0_26px_80px_-44px_rgba(0,0,0,.80)] md:block">
                    <div className="mb-1 px-3 py-2 text-xs font-semibold text-[color:var(--color-text-muted)]">
                      {group.title}
                    </div>

                    <div className="space-y-1">
                      {group.items.map((m) => (
                        <NavLink
                          key={m.to}
                          to={m.to}
                          onClick={() => setOpenGroup(null)}
                          className={({ isActive }) => desktopSubNavItemClass(isActive)}
                        >
                          <SidebarIcon name={m.icon} className="h-4 w-4 shrink-0" />
                          <span className="truncate">{m.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 space-y-1 pl-2">
                    {group.items.map((m) => (
                      <NavLink
                        key={m.to}
                        to={m.to}
                        onClick={() => setOpenGroup(null)}
                        className={({ isActive }) => desktopSubNavItemClass(isActive)}
                      >
                        <SidebarIcon name={m.icon} className="h-4 w-4 shrink-0" />
                        <span className="truncate">{m.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )
              ) : null}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {props.groups.map((group) => {
        const activeGroup = isGroupActive(group);
        const open = isGroupOpen(group);

        return (
          <section key={group.title} className="relative">
            <button
              type="button"
              onClick={() => toggleGroup(group.title)}
              className={[
                "group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15",
                activeGroup || open
                  ? "bg-[color:var(--color-brand-primary)] text-[color:var(--color-brand-on)] shadow-[0_16px_34px_-28px_rgba(0,0,0,.55)]"
                  : "text-[color:var(--color-text-default)] hover:bg-black/5 dark:hover:bg-white/5",
              ].join(" ")}
              aria-expanded={open}
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/5 text-current dark:bg-white/10">
                <SidebarIcon name={group.icon} className="h-4 w-4" />
              </span>

              <span className="truncate">{group.title}</span>

              <svg
                className={[
                  "ml-auto h-4 w-4 shrink-0 transition-transform",
                  open ? "translate-x-0.5" : "",
                ].join(" ")}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 5.23a.75.75 0 0 1 1.06-.02l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08L11.168 10 7.23 6.29a.75.75 0 0 1-.02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {open ? (
              <>
                <div className="absolute left-full top-0 z-[999] ml-2 hidden min-w-[240px] rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 shadow-[0_26px_80px_-44px_rgba(0,0,0,.80)] md:block">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold text-[color:var(--color-text-muted)]">
                    {group.title}
                  </div>

                  <div className="space-y-1">
                    {group.items.map((m) => (
                      <NavLink
                        key={m.to}
                        to={m.to}
                        onClick={() => setOpenGroup(null)}
                        className={({ isActive }) => subNavItemClass(isActive)}
                      >
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/5 text-current dark:bg-white/10">
                          <SidebarIcon name={m.icon} className="h-4 w-4" />
                        </span>

                        <span className="truncate">{m.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>

                <div className="mt-1 space-y-1 border-l border-[color:var(--color-border)] pl-3 md:hidden">
                  {group.items.map((m) => (
                    <NavLink
                      key={m.to}
                      to={m.to}
                      onClick={() => setOpenGroup(null)}
                      className={({ isActive }) => subNavItemClass(isActive)}
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/5 text-current dark:bg-white/10">
                        <SidebarIcon name={m.icon} className="h-4 w-4" />
                      </span>

                      <span className="truncate">{m.label}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function desktopSubNavItemClass(isActive: boolean) {
  return [
    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15",
    isActive
      ? "bg-black/5 text-[color:var(--color-brand-primary)] dark:bg-white/10"
      : "text-[color:var(--color-text-muted)] hover:bg-black/5 hover:text-[color:var(--color-text-default)] dark:hover:bg-white/10",
  ].join(" ");
}

function subNavItemClass(isActive: boolean) {
  return [
    "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15",
    isActive
      ? "bg-black/5 text-[color:var(--color-brand-primary)] dark:bg-white/10"
      : "text-[color:var(--color-text-muted)] hover:bg-black/5 hover:text-[color:var(--color-text-default)] dark:hover:bg-white/5",
  ].join(" ");
}

function UserCard(props: { name: string; roles: string[]; variant?: "default" | "dark" }) {
  const isDark = props.variant === "dark";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border p-3",
        isDark
          ? "border-white/10 bg-white/5"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: isDark
            ? "radial-gradient(520px 220px at 20% 0%, color-mix(in srgb, var(--color-brand-primary) 14%, transparent) 0%, transparent 60%)"
            : "radial-gradient(520px 220px at 20% 0%, color-mix(in srgb, var(--color-brand-primary) 10%, transparent) 0%, transparent 60%)",
        }}
      />
      <div className="relative flex items-center gap-3">
        <div
          className={[
            "h-10 w-10 rounded-2xl flex items-center justify-center font-bold",
            isDark ? "bg-white/10 text-white" : "bg-black/10 dark:bg-white/10",
          ].join(" ")}
        >
          {(props.name ?? "U").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className={["font-semibold leading-5 truncate", isDark ? "text-white" : ""].join(" ")}>
            {props.name}
          </div>
          <div
            className={[
              "mt-0.5 text-xs truncate",
              isDark ? "text-slate-400" : "text-[color:var(--color-text-muted)]",
            ].join(" ")}
          >
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
          "fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[320px] overflow-hidden border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_26px_80px_-44px_rgba(0,0,0,.80)] transition-transform md:hidden",
          props.open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="h-dvh overflow-y-auto overscroll-contain">
          {props.children}
        </div>
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
