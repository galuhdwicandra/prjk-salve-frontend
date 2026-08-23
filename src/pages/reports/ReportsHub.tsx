import { Link } from "react-router-dom";
import { useVisibleMenuGroups } from "../../layouts/menu";
import { SidebarIcon } from "../../layouts/SidebarIcon";

export default function ReportsHub() {
  const items = useVisibleMenuGroups().find((group) => group.title === "Laporan")?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="card">
        <div className="empty">Kamu belum punya akses ke laporan mana pun.</div>
      </div>
    );
  }

  return (
    <div className="set-grid">
      {items.map((item) => (
        <Link key={item.to} to={item.to} className="set-card" data-module={item.module}>
          <span className="sc-ico">
            <SidebarIcon name={item.icon} className="" />
          </span>
          <h4>{item.label}</h4>
          <p>{item.desc}</p>
        </Link>
      ))}
    </div>
  );
}
