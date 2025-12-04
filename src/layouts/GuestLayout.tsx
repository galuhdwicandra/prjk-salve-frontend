// src/layouts/GuestLayout.tsx
import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
    return (
        <main className="min-h-dvh grid place-items-center p-6">
            <div className="w-full max-w-[420px] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-2)] bg-[color:var(--color-surface)]">
                <Outlet />
            </div>
        </main>
    );
}