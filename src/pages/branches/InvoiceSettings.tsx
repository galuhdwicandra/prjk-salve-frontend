// src/pages/branches/InvoiceSettings.tsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
    listInvoiceCounters, createInvoiceCounter, updateInvoiceCounter, deleteInvoiceCounter,
    previewNextNumber, resetCounterNow,
} from '../../api/invoiceCounters';
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
    const [preview, setPreview] = useState<{ number: string; invoice_no: string } | null>(null);

    const [form, setForm] = useState<InvoiceCounterUpsertPayload>({
        branch_id: id!,
        prefix: '',
        reset_policy: 'monthly',
        seq: 0,
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
            setForm((f) => ({
                ...f,
                prefix: (b.data as Branch).invoice_prefix,
                branch_id: id!,
                seq: (res.data?.[0]?.seq ?? 0)
            }));
            setPreview(null);
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
        if (typeof form.seq !== 'number' || form.seq < 0 || form.seq > 999999) {
            alert('Sequence harus angka 0–999999'); return;
        }
        try {
            await createInvoiceCounter(form);
            alert('Counter ditambahkan');
            await refresh();
        } catch {
            alert('Gagal menambah counter');
        }
    }

    async function onPreview() {
        try {
            const res = await previewNextNumber(id!);
            setPreview(res.data);
        } catch {
            alert('Gagal preview nomor berikutnya');
        }
    }

    async function onResetNow(counterId: string) {
        if (!confirm('Reset sequence ke 0 untuk bulan berjalan?')) return;
        try {
            await resetCounterNow(counterId);
            await refresh();
        } catch {
            alert('Gagal reset counter');
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
                                                const raw = prompt('Prefix baru (2–8 huruf kapital A–Z):', r.prefix) ?? r.prefix;
                                                const prefix = (raw || '').toUpperCase().slice(0, 8);
                                                if (!/^[A-Z]{2,8}$/.test(prefix)) { alert('Prefix tidak valid'); return; }
                                                try {
                                                    await updateInvoiceCounter(r.id, {
                                                        prefix,
                                                        reset_policy: r.reset_policy,
                                                        seq: r.seq,
                                                    });
                                                    await refresh();
                                                } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Prefix
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const policy = (prompt('Reset policy (monthly/never):', r.reset_policy) ?? r.reset_policy) as ResetPolicy;
                                                if (!['monthly', 'never'].includes(policy)) { alert('Reset policy tidak valid'); return; }
                                                try {
                                                    await updateInvoiceCounter(r.id, {
                                                        prefix: r.prefix,
                                                        reset_policy: policy,
                                                        seq: r.seq,
                                                    });
                                                    await refresh();
                                                } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Reset
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const v = prompt('Sequence baru (0–999999):', String(r.seq));
                                                if (v == null) return;
                                                const n = Number(v);
                                                if (!Number.isFinite(n) || n < 0 || n > 999999) { alert('Sequence tidak valid'); return; }
                                                try {
                                                    await updateInvoiceCounter(r.id, {
                                                        prefix: r.prefix,
                                                        reset_policy: r.reset_policy,
                                                        seq: Math.floor(n),
                                                    });
                                                    await refresh();
                                                } catch { alert('Gagal update sequence'); }
                                            }}
                                        >
                                            Ubah Sequence
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => { await onResetNow(r.id); }}
                                        >
                                            Reset Now
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
                            onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase().slice(0, 8) })} />
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
                    <div className="grid gap-1">
                        <label className="text-xs">Sequence *</label>
                        <input
                            type="number"
                            min={0}
                            max={999999}
                            step={1}
                            className="border rounded px-3 py-2 font-mono"
                            value={form.seq ?? 0}
                            onChange={(e) => {
                                const n = Number(e.target.value);
                                const v = Number.isFinite(n) ? Math.max(0, Math.min(999999, Math.floor(n))) : 0;
                                setForm({ ...form, seq: v });
                            }}
                        />
                    </div>
                    <button className="rounded bg-black text-white px-3 py-2" disabled={!valid}>Tambah</button>
                </form>
                <p className="text-xs text-gray-500">
                    Kombinasi <code>branch_id + prefix</code> harus unik (lihat constraint DB). Sequence akan bertambah saat invoice dipakai.
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onPreview}
                        className="rounded border px-3 py-2 text-xs"
                        disabled={loading}
                    >
                        Preview nomor berikutnya
                    </button>
                    {preview && (
                        <div className="text-xs">
                            Next <code>number</code>: <strong className="font-mono">{preview.number}</strong>{' '}
                            — <code>invoice_no</code>: <strong className="font-mono">{preview.invoice_no}</strong>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
