import { useEffect, useState } from 'react';
import { createBranch, getBranch, updateBranch } from '../../api/branches';
import type { Branch, BranchUpsertPayload, ResetPolicy } from '../../types/branches';
import { useNavigate, useParams } from 'react-router-dom';

function toResetPolicy(value: string): ResetPolicy {
    return value === 'never' ? 'never' : 'monthly';
}

const POLICIES: ResetPolicy[] = ['monthly', 'never'];

export default function BranchForm() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const editing = Boolean(id);

    const [form, setForm] = useState<BranchUpsertPayload>({
        code: '',
        name: '',
        address: '',
        invoice_prefix: 'SLV',
        reset_policy: 'monthly',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        (async () => {
            if (!editing) return;
            setLoading(true);
            try {
                const res = await getBranch(id!);
                const b = res.data as Branch;
                setForm({
                    code: b.code,
                    name: b.name,
                    address: b.address ?? '',
                    invoice_prefix: b.invoice_prefix,
                    reset_policy: b.reset_policy,
                });
            } catch {
                setError('Gagal memuat data cabang');
            } finally {
                setLoading(false);
            }
        })();
    }, [editing, id]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null); setFieldErrors({});
        // Validasi ringan sisi UI
        if (!form.code.trim() || !form.name.trim() || !form.invoice_prefix.trim()) {
            setLoading(false);
            setError('Kode, Nama, dan Prefix wajib diisi');
            return;
        }
        if (form.invoice_prefix.length > 8) {
            setLoading(false);
            setError('Panjang prefix maksimal 8 karakter');
            return;
        }

        try {
            if (editing) await updateBranch(id!, form);
            else await createBranch(form);
            alert('Tersimpan');
            nav('/branches', { replace: true });
        } catch (err: unknown) {
            // Narrowing aman tanpa any
            const withResp = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
            const fe = withResp.response?.data?.errors ?? {};
            if (fe && typeof fe === 'object') setFieldErrors(fe);
            setError(withResp.response?.data?.message ?? 'Gagal menyimpan');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold">{editing ? 'Edit Branch' : 'New Branch'}</h1>
            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid gap-1">
                <label className="text-xs">Kode *</label>
                <input className="border rounded px-3 py-2" value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })} />
                {fieldErrors.code && <p className="text-xs text-red-600">{fieldErrors.code.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Nama *</label>
                <input className="border rounded px-3 py-2" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Alamat</label>
                <input className="border rounded px-3 py-2" value={form.address ?? ''}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Prefix Invoice (max 8) *</label>
                <input className="border rounded px-3 py-2" value={form.invoice_prefix}
                    onChange={(e) => setForm({ ...form, invoice_prefix: e.target.value.toUpperCase() })} />
                {fieldErrors.invoice_prefix && <p className="text-xs text-red-600">{fieldErrors.invoice_prefix.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Kebijakan Reset *</label>
                <select
                    className="border rounded px-3 py-2"
                    value={form.reset_policy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
                    }
                >
                    {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {fieldErrors.reset_policy && <p className="text-xs text-red-600">{fieldErrors.reset_policy.join(', ')}</p>}
            </div>

            <div className="flex gap-2">
                <button disabled={loading} className="rounded bg-black text-white px-3 py-2">{loading ? 'Menyimpan…' : 'Simpan'}</button>
                <button type="button" className="rounded border px-3 py-2" onClick={() => history.back()}>Batal</button>
            </div>
        </form>
    );
}
