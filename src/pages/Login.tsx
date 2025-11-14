import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AxiosError } from 'axios';
import { useAuth, homePathByRole } from '../store/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
    const nav = useNavigate();
    const loc = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            const me = await useAuth.login({ email, password });
            // refresh /auth/me agar branch/roles pasti sesuai presentasi backend
            const profile = await useAuth.fetchMe();
            const from = (loc.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
            const fallback = homePathByRole(profile?.roles ?? me?.roles ?? []);
            nav(from ?? fallback, { replace: true });
        } catch (err: unknown) {
            const ax = err as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
            const msg =
                ax.response?.data?.errors?.auth?.[0] ??
                ax.response?.data?.message ??
                'Login gagal';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-3">
            <h1 className="text-xl font-semibold">Masuk</h1>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2" />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2" />
            <button disabled={loading} className="rounded bg-black text-white px-3 py-2">
                {loading ? 'Memproses…' : 'Login'}
            </button>
        </form>
    );
}