import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { SidebarIcon } from "./SidebarIcon";
import { getPageSub, getTopbarTitle, isRouteActive, useVisibleMenuGroups, REPORT_LINKS } from "./menu";
import type { MenuGroup, SidebarIconName } from "./menu";
import { listCustomers } from "../api/customers";
import { listOrders } from "../api/orders";
import { listContacts } from "../api/contacts";
import BranchPicker from "../components/BranchPicker";
import NotificationBell from "../components/NotificationBell";

type NavSheet = MenuGroup | "profile" | null;

type SearchHit = { key: string; label: string; meta: string; to: string; icon: SidebarIconName };
type SearchGroup = { title: string; hits: SearchHit[] };
type InstallPromptEvent = Event & { prompt: () => Promise<void> };

const MAX_HITS_PER_GROUP = 6;

export default function CraftLayout() {
  const me = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const location = useLocation();
  const nav = useNavigate();
  const groups = useVisibleMenuGroups();

  const activeGroupTitle =
    groups.find((group) => group.items.some((m) => isRouteActive(location.pathname, m.to)))?.title ??
    null;

  const navGroups = groups.filter((group) => group.title !== "Pengaturan");

  const activeItem =
    groups.flatMap((group) => group.items).find((m) => m.to === location.pathname) ?? null;

  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupTitle);
  const [meFailed, setMeFailed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sheet, setSheet] = useState<NavSheet>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [fly, setFly] = useState<{ title: string; top: number; left: number } | null>(null);
  const [query, setQuery] = useState("");
  const [dataGroups, setDataGroups] = useState<SearchGroup[]>([]);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const flyRef = useRef<HTMLDivElement | null>(null);

  const staticGroups = useMemo<SearchGroup[]>(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];

    const result: SearchGroup[] = [];

    const menuHits = groups
      .flatMap((group) => group.items.map((item) => ({ item, groupTitle: group.title })))
      .filter(({ item, groupTitle }) =>
        `${item.label} ${groupTitle}`.toLowerCase().includes(keyword),
      )
      .slice(0, MAX_HITS_PER_GROUP)
      .map(({ item, groupTitle }) => ({
        key: `menu-${item.to}`,
        label: item.label,
        meta: groupTitle,
        to: item.to,
        icon: item.icon,
      }));

    if (menuHits.length > 0) result.push({ title: "Menu", hits: menuHits });

    if (useAuth.canModule("laporan")) {
      const reportHits = REPORT_LINKS.filter((link) =>
        link.label.toLowerCase().includes(keyword),
      )
        .slice(0, MAX_HITS_PER_GROUP)
        .map((link) => ({
          key: `report-${link.to}`,
          label: link.label,
          meta: "Laporan",
          to: link.to,
          icon: "reports" as SidebarIconName,
        }));

      if (reportHits.length > 0) result.push({ title: "Laporan", hits: reportHits });
    }

    return result;
  }, [groups, query]);

  const searchGroups = useMemo(
    () => [...staticGroups, ...dataGroups],
    [staticGroups, dataGroups],
  );

  useEffect(() => {
    if (activeGroupTitle) setOpenGroup(activeGroupTitle);
  }, [activeGroupTitle]);

  useEffect(() => {
    setFly(null);
  }, [location.pathname]);

  useEffect(() => {
    void refreshMe();
  }, []);

  useEffect(() => {
    const keyword = query.trim();

    if (!keyword) {
      setDataGroups([]);
      return;
    }

    let alive = true;

    const timer = window.setTimeout(() => {
      const perPage = MAX_HITS_PER_GROUP;

      void Promise.all([
        useAuth.canModule("kasir-customer")
          ? listCustomers({ q: keyword, per_page: perPage })
            .then((res) => res.data)
            .catch(() => [])
          : Promise.resolve([]),
        useAuth.canModule("kasir-receipt")
          ? listOrders({ q: keyword, per_page: perPage })
            .then((res) => res.data)
            .catch(() => [])
          : Promise.resolve([]),
        useAuth.canModule("fin-kontak")
          ? listContacts({ q: keyword, per_page: perPage })
            .then((res) => res.data)
            .catch(() => [])
          : Promise.resolve([]),
      ]).then(([customers, orders, contacts]) => {
        if (!alive) return;

        const next: SearchGroup[] = [];

        if (customers.length > 0) {
          next.push({
            title: "Pelanggan",
            hits: customers.slice(0, perPage).map((row) => ({
              key: `cust-${row.id}`,
              label: row.name,
              meta: row.whatsapp || "pelanggan",
              to: `/customers/${row.id}`,
              icon: "customers",
            })),
          });
        }

        if (orders.length > 0) {
          next.push({
            title: "Order / Receipt",
            hits: orders.slice(0, perPage).map((row) => ({
              key: `order-${row.id}`,
              label: row.invoice_no || row.number,
              meta: row.customer?.name || "order",
              to: `/orders/${row.id}`,
              icon: "orders",
            })),
          });
        }

        if (contacts.length > 0) {
          next.push({
            title: "Kontak",
            hits: contacts.slice(0, perPage).map((row) => ({
              key: `contact-${row.id}`,
              label: row.name,
              meta: row.phone || "kontak",
              to: "/contacts",
              icon: "customers",
            })),
          });
        }

        setDataGroups(next);
      });
    }, 300);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (!fly) return;

    const node = flyRef.current;
    if (node) {
      const maxTop = window.innerHeight - 8 - node.offsetHeight;
      node.style.top = `${Math.max(8, Math.min(fly.top, maxTop))}px`;
    }

    const onMouseDown = (e: MouseEvent) => {
      if (flyRef.current?.contains(e.target as Node)) return;
      setFly(null);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFly(null);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [fly]);

  useEffect(() => {
    const onInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", onInstallPrompt);
  }, []);


  useEffect(() => {
    if (!userMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    if (!sheet) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheet(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [sheet]);

  function refreshMe() {
    return useAuth
      .fetchMe()
      .then(() => setMeFailed(false))
      .catch(() => setMeFailed(true));
  }

  async function handleLogout() {
    setUserMenuOpen(false);
    setSheet(null);
    await useAuth.logout();
    nav("/login", { replace: true });
  }

  function toggleGroup(title: string) {
    setOpenGroup((current) => (current === title ? null : title));
  }

  if (!me) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const roleText = me.role_label ?? "";
  const pageTitle = getTopbarTitle(location.pathname);
  const pageSub = getPageSub(location.pathname) ?? activeItem?.desc ?? null;
  const avatarText = (me.name || "U").slice(0, 1).toUpperCase();
  const settingsGroup = groups.find((group) => group.title === "Pengaturan") ?? null;

  return (
    <div className="craft">
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
          <div className="sb-head">
            <div className="tb-logo">
              <img className="brand-logo" src="/logo-salve.png" alt="" />
              <div className="tb-txt">
                <b>SALVE</b>
                <small>Shoe Care &amp; Laundry</small>
              </div>
            </div>

            <button
              type="button"
              className="sb-collapse"
              title="Perkecil/perbesar menu"
              aria-label="Perkecil/perbesar menu"
              aria-expanded={!collapsed}
              onClick={() => {
                setCollapsed((value) => !value);
                setFly(null);
              }}
            >
              {collapsed ? "\u203A" : "\u2039"}
            </button>
          </div>

          <div className="sb-search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari apa saja..."
              autoComplete="off"
              aria-label="Cari menu"
            />

            <div className={query.trim() ? "nav-results show" : "nav-results"}>
              {searchGroups.length > 0 ? (
                searchGroups.map((group) => (
                  <div key={group.title}>
                    <div className="nav-res-grp">{group.title}</div>
                    {group.hits.map((hit) => (
                      <button
                        key={hit.key}
                        type="button"
                        className="nav-res"
                        onClick={() => {
                          setQuery("");
                          nav(hit.to);
                        }}
                      >
                        <span className="nav-res-ic">
                          <SidebarIcon name={hit.icon} className="" />
                        </span>
                        <span className="nav-res-txt">
                          <span className="nav-res-l">{hit.label}</span>
                          <span className="nav-res-m">{hit.meta}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="nav-res-empty">Tidak ada hasil untuk "{query.trim()}"</div>
              )}
            </div>
          </div>

          <div className="sb-section">Menu</div>

          <nav className="sb-nav">
            {navGroups.length === 0 ? (
              <div className="nav-res-empty">Tidak ada menu yang bisa diakses.</div>
            ) : null}
            {navGroups.map((group) => (
              <div
                key={group.title}
                className={openGroup === group.title ? "nav-group open" : "nav-group"}
              >
                <button
                  type="button"
                  className={activeGroupTitle === group.title ? "ng-btn active" : "ng-btn"}
                  aria-expanded={group.single ? undefined : openGroup === group.title}
                  onClick={(e) => {
                    if (group.single) {
                      setFly(null);
                      nav(group.hub ?? group.items[0].to);
                      return;
                    }

                    if (!collapsed) {
                      toggleGroup(group.title);
                      return;
                    }

                    if (fly?.title === group.title) {
                      setFly(null);
                      return;
                    }
                    const rect = e.currentTarget.getBoundingClientRect(); setFly({ title: group.title, top: rect.top, left: rect.right + 16 });
                  }}
                >
                  <span className="ico">
                    <SidebarIcon name={group.icon} className="" />
                  </span>
                  <span className="lbl">{group.title}</span>
                  {group.single ? null : <i className="chev" />}
                </button>

                {group.single ? null : (
                  <div className="ng-sub">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={
                          isRouteActive(location.pathname, item.to) ? "sub-link active" : "sub-link"
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="sb-foot">
            {settingsGroup ? (
              <button
                type="button"
                className={
                  activeGroupTitle === settingsGroup.title || location.pathname === "/settings"
                    ? "set-btn active"
                    : "set-btn"
                }
                onClick={() => nav("/settings")}
              >
                <span className="ico">
                  <SidebarIcon name="settings" className="" />
                </span>
                <span className="lbl">Pengaturan</span>
              </button>
            ) : null}

            {installPrompt ? (
              <button
                type="button"
                className="btn dark"
                onClick={() => {
                  void installPrompt.prompt();
                  setInstallPrompt(null);
                }}
              >
                <span>Pasang Aplikasi</span>
              </button>
            ) : null}
            <div className="sb-ver">Salve Shoe Care</div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="crumb-top">
              {activeGroupTitle === "Pengaturan" ? (
                <>
                  <Link className="crumb-link" to="/settings">
                    Pengaturan
                  </Link>
                  {" / "}
                </>
              ) : activeGroupTitle ? (
                <>
                  <span>{activeGroupTitle}</span>
                  {" / "}
                </>
              ) : null}
              <b>{pageTitle}</b>
            </div>

            <div className="tb-right">
              <NotificationBell />
              <BranchPicker />
              <div className={userMenuOpen ? "user-menu open" : "user-menu"} ref={userMenuRef}>
                <button
                  type="button"
                  className="avatar"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label="Menu akun"
                  onClick={() => setUserMenuOpen((value) => !value)}
                >
                  {avatarText}
                </button>

                <div className="user-dd">
                  <div className="u-head">
                    <b>{me.name}</b>
                    <span className="mini">{roleText}</span>
                  </div>
                  <button type="button" className="dd-link" onClick={handleLogout}>
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="content">
            <div className="page-head">
              <div>
                <h1>{pageTitle}</h1>
                {pageSub ? <div className="ph-sub">{pageSub}</div> : null}
              </div>
              <div className="pa-row" id="pageActions" />
            </div>

            {meFailed ? (
              <div className="card">
                <div className="empty">
                  Gagal memuat data akses terbaru.{" "}
                  <button type="button" className="btn sm" onClick={() => void refreshMe()}>
                    Coba lagi
                  </button>
                </div>
              </div>
            ) : null}

            <Outlet />
          </main>
        </div>

        <nav className="bottomnav">
          {navGroups.map((group) => (
            <button
              key={group.title}
              type="button"
              className={activeGroupTitle === group.title ? "bn-item active" : "bn-item"}
              onClick={() => (group.single ? nav(group.hub ?? group.items[0].to) : setSheet(group))}
            >
              <SidebarIcon name={group.icon} className="" />
              <span>{group.title}</span>
            </button>
          ))}

          <button type="button" className="bn-item" onClick={() => setSheet("profile")}>
            <SidebarIcon name="users" className="" />
            <span>Profil</span>
          </button>
        </nav>
      </div>

      <div
        className={sheet ? "navsheet show" : "navsheet"}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        inert={!sheet}
      >
        <div className="ns-grab" />

        {sheet === "profile" ? (
          <>
            <div className="ns-title">{me.name}</div>
            <div className="mini" style={{ padding: "0 6px 8px" }}>
              {roleText}
            </div>
            {settingsGroup ? (
              <button
                type="button"
                className="ns-link"
                onClick={() => {
                  setSheet(null);
                  nav("/settings");
                }}
              >
                <b>Pengaturan</b>
                <span className="d">Kelola akun &amp; sistem</span>
              </button>
            ) : null}
            <button type="button" className="ns-link" onClick={handleLogout}>
              <b>Keluar</b>
              <span className="d">Akhiri sesi ini</span>
            </button>
          </>
        ) : null}

        {sheet && sheet !== "profile" ? (
          <>
            <div className="ns-title">{sheet.title}</div>
            {sheet.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={isRouteActive(location.pathname, item.to) ? "ns-link active" : "ns-link"}
                onClick={() => setSheet(null)}
              >
                <b>{item.label}</b>
                {item.desc ? <span className="d">{item.desc}</span> : null}
              </NavLink>
            ))}
          </>
        ) : null}
      </div>

      {fly ? (
        <div ref={flyRef} className="nav-fly show" style={{ top: fly.top, left: fly.left }}>
          <div className="fly-title">{fly.title}</div>
          {(groups.find((group) => group.title === fly.title)?.items ?? []).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={isRouteActive(location.pathname, item.to) ? "fly-link active" : "fly-link"}
              onClick={() => setFly(null)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ) : null}

      <div
        className={sheet ? "overlay show" : "overlay"}
        onClick={() => setSheet(null)}
        aria-hidden="true"
      />
    </div>
  );
}
