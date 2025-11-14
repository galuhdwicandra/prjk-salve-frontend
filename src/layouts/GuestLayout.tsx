import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
    return (
        <main className="min-h-dvh grid place-items-center p-6">
            <div className="w-full max-w-sm rounded-xl border p-6 shadow-sm bg-white">
                <Outlet />
            </div>
        </main>
    );
}