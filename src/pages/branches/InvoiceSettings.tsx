import { useEffect, useMemo, useState, useCallback } from 'react';
import { listInvoiceCounters, createInvoiceCounter, updateInvoiceCounter, deleteInvoiceCounter } from '../../api/invoiceCounters';
import { getBranch } from '../../api/branches';
import type { Branch, InvoiceCounter, InvoiceCounterUpsertPayload, ResetPolicy } from '../../types/branches';
import { useParams } from 'react-router-dom';

function toResetPolicy(value: string): ResetPolicy {
    return value === 'never' ? 'never' : 'monthly';
}

const POLICIES: ResetPolicy[] = ['monthly', 'never'];

export default function InvoiceSettings() {
    const { id } = useParams<{ id: string }>(); // branch id
    const [branch, setBranch] = useState<Branch | null>(null);
    const [rows, setRows] = useState<InvoiceCounter[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<InvoiceCounterUpsertPayload>({
        branch_id: id!,
        prefix: '',
        reset_policy: 'monthly',
    });
    const valid = useMemo(() => form.prefix.trim().length > 0 && form.prefix.length <= 8, [form.prefix]);

    const refresh = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const b = await getBranch(id!);
            setBranch(b.data as Branch);
            const res = await listInvoiceCounters({ branch_id: id, per_page: 50 });
            setRows(res.data ?? []);
            // default prefix mengikuti branch
            setForm((f) => ({ ...f, prefix: (b.data as Branch).invoice_prefix, branch_id: id! }));
        } catch {
            setError('Gagal memuat konfigurasi invoice');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function onSaveNew(e: React.FormEvent) {
        e.preventDefault();
        if (!valid) { alert('Prefix wajib dan maksimal 8 karakter'); return; }
        try {
            await createInvoiceCounter(form);
            alert('Counter ditambahkan');
            await refresh();
        } catch {
            alert('Gagal menambah counter');
        }
    }

    return (
        <div className="space-y-4 max-w-2xl">
            <header>
                <h1 className="text-lg font-semibold">Invoice Settings</h1>
                <p className="text-xs text-gray-600">
                    Branch: <strong>{branch?.code}</strong> — {branch?.name}
                </p>
            </header>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}

            <section className="space-y-2">
                <h2 className="font-medium">Daftar Counter</h2>
                <div className="overflow-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left">Prefix</th>
                                <th className="px-3 py-2 text-left">Reset</th>
                                <th className="px-3 py-2 text-left">Sequence</th>
                                <th className="px-3 py-2 text-left">Last Month</th>
                                <th className="px-3 py-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr><td className="px-3 py-3 text-gray-500" colSpan={5}>Belum ada counter</td></tr>
                            )}
                            {rows.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2">{r.prefix}</td>
                                    <td className="px-3 py-2">{r.reset_policy}</td>
                                    <td className="px-3 py-2">{r.seq}</td>
                                    <td className="px-3 py-2">{r.last_reset_month ?? '-'}</td>
                                    <td className="px-3 py-2">
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const prefix = prompt('Prefix baru (max 8):', r.prefix) ?? r.prefix;
                                                if (!prefix || prefix.length > 8) { alert('Prefix tidak valid'); return; }
                                                try { await updateInvoiceCounter(r.id, { prefix }); await refresh(); } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Prefix
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const policy = (prompt('Reset policy (monthly/never):', r.reset_policy) ?? r.reset_policy) as ResetPolicy;
                                                if (!['monthly', 'never'].includes(policy)) { alert('Reset policy tidak valid'); return; }
                                                try { await updateInvoiceCounter(r.id, { reset_policy: policy }); await refresh(); } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Reset
                                        </button>
                                        <button
                                            className="underline text-xs text-red-600"
                                            onClick={async () => {
                                                if (!confirm('Hapus counter ini?')) return;
                                                try { await deleteInvoiceCounter(r.id); await refresh(); } catch { alert('Gagal hapus'); }
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="font-medium">Tambah Counter</h2>
                <form className="flex flex-wrap items-end gap-2" onSubmit={onSaveNew}>
                    <div className="grid gap-1">
                        <label className="text-xs">Prefix *</label>
                        <input className="border rounded px-3 py-2" value={form.prefix}
                            onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase() })} />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Reset *</label>
                        <select
                            className="border rounded px-3 py-2"
                            value={form.reset_policy}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
                            }
                        >
                            {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <button className="rounded bg-black text-white px-3 py-2" disabled={!valid}>Tambah</button>
                </form>
                <p className="text-xs text-gray-500">
                    Kombinasi <code>branch_id + prefix</code> harus unik (lihat constraint DB). Sequence akan bertambah saat invoice dipakai.
                </p>
            </section>
        </div>
    );
}
