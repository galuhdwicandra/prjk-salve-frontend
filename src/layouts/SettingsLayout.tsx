import { NavLink, Outlet } from 'react-router-dom';

export default function SettingsLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-500">Kelola konfigurasi sistem.</p>
      </div>

      <div className="flex gap-3 border-b pb-3">
        <NavLink to="/settings/whatsapp-templates">
          WhatsApp Templates
        </NavLink>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}