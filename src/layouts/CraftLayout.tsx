import { useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { SidebarIcon } from "./SidebarIcon";
import { getTopbarTitle, isRouteActive, useVisibleMenuGroups } from "./menu";
import type { MenuGroup } from "./menu";

type NavSheet = MenuGroup | "profile" | null;

export default function CraftLayout() {
  const me = useAuth.user;
  const location = useLocation();
  const nav = useNavigate();
  const groups = useVisibleMenuGroups();

  const activeGroupTitle =
    groups.find((group) => group.items.some((m) => isRouteActive(location.pathname, m.to)))?.title ??
    null;

  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupTitle);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sheet, setSheet] = useState<NavSheet>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeGroupTitle) setOpenGroup(activeGroupTitle);
  }, [activeGroupTitle]);

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

  const roleText = (me.roles ?? []).join(", ");
  const pageTitle = getTopbarTitle(location.pathname);
  const avatarText = (me.name || "U").slice(0, 1).toUpperCase();

  return (
    <div className="craft">
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside className="sidebar">
          <div className="sb-head">
            <div className="tb-logo">
              <img className="brand-logo" src="/logo-salve.png" alt="" />
              <span>Salve</span>
            </div>
          </div>

          <div className="sb-section">Menu</div>

          <nav className="sb-nav">
            {groups.map((group) => (
              <div
                key={group.title}
                className={openGroup === group.title ? "nav-group open" : "nav-group"}
              >
                <button
                  type="button"
                  className={activeGroupTitle === group.title ? "ng-btn active" : "ng-btn"}
                  aria-expanded={openGroup === group.title}
                  onClick={() => toggleGroup(group.title)}
                >
                  <span className="ico">
                    <SidebarIcon name={group.icon} className="" />
                  </span>
                  <span className="lbl">{group.title}</span>
                  <i className="chev" />
                </button>

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
              </div>
            ))}
          </nav>

          <div className="sb-foot">
            <button type="button" className="btn ghost" onClick={handleLogout}>
              <SidebarIcon name="logout" className="" />
              <span>Keluar</span>
            </button>
            <div className="sb-ver">Salve Shoe Care</div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="crumb-top">
              <b>{pageTitle}</b>
            </div>

            <div className="tb-right">
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
              </div>
            </div>

            <Outlet />
          </main>
        </div>

        <nav className="bottomnav">
          {groups.map((group) => (
            <button
              key={group.title}
              type="button"
              className={activeGroupTitle === group.title ? "bn-item active" : "bn-item"}
              onClick={() => setSheet(group)}
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
        aria-hidden={!sheet}
      >
        <div className="ns-grab" />

        {sheet === "profile" ? (
          <>
            <div className="ns-title">{me.name}</div>
            <div className="mini" style={{ padding: "0 6px 8px" }}>
              {roleText}
            </div>
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
              </NavLink>
            ))}
          </>
        ) : null}
      </div>

      <div
        className={sheet ? "overlay show" : "overlay"}
        onClick={() => setSheet(null)}
        aria-hidden="true"
      />
    </div>
  );
}
