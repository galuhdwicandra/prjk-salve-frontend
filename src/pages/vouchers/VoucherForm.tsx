import { useEffect, useState } from 'react';
import { createVoucher, getVoucher, updateVoucher } from '../../api/vouchers';
import type { Voucher, VoucherUpsertPayload, VoucherType } from '../../types/vouchers';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import type { AxiosError } from 'axios';

const TYPES: VoucherType[] = ['PERCENT', 'NOMINAL'];

export default function VoucherForm() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const editing = Boolean(id);
    const { user: me } = useAuth;

    const [form, setForm] = useState<VoucherUpsertPayload>({
        branch_id: me?.branch_id != null ? String(me.branch_id) : null,
        code: '',
        type: 'PERCENT',
        value: 0,
        start_at: null,
        end_at: null,
        min_total: 0,
        usage_limit: null,
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        (async () => {
            if (!editing) return;
            setLoading(true);
            try {
                const res = await getVoucher(id!);
                const v = res.data as Voucher;
                setForm({
                    branch_id: v.branch_id,
                    code: v.code,
                    type: v.type,
                    value: v.value,
                    start_at: v.start_at,
                    end_at: v.end_at,
                    min_total: v.min_total ?? 0,
                    usage_limit: v.usage_limit,
                    active: v.active,
                });
            } catch {
                setError('Gagal memuat data voucher');
            } finally {
                setLoading(false);
            }
        })();
    }, [editing, id]);

    function validateUI(): string | null {
        if (!form.code || !/^[A-Z0-9-]+$/.test(form.code)) return 'Kode wajib huruf/angka/strip dan huruf besar';
        if (form.type === 'PERCENT' && (form.value < 0 || form.value > 100)) return 'Nilai persentase harus 0–100';
        if ((form.start_at && form.end_at) && new Date(form.start_at) > new Date(form.end_at)) return 'Periode tidak valid (start > end)';
        if ((form.min_total ?? 0) < 0) return 'Min total tidak boleh negatif';
        return null;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null); setFieldErrors({});
        const uiErr = validateUI();
        if (uiErr) { setLoading(false); setError(uiErr); return; }

        try {
            if (editing) {
                await updateVoucher(id!, form);
            } else {
                await createVoucher(form);
            }
            nav('/vouchers');
        } catch (ex: unknown) {
            const err = ex as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
            const resp = err.response;
            if (resp?.status === 422) {
                setFieldErrors(resp.data?.errors ?? {});
                setError(resp.data?.message ?? 'Validasi gagal');
            } else if (resp?.status === 403) {
                setError('Tidak berwenang');
            } else {
                setError('Gagal menyimpan voucher');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="space-y-4 max-w-xl" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold">{editing ? 'Edit Voucher' : 'Buat Voucher'}</h1>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2">
                    <div className="text-xs text-gray-600 mb-1">Kode</div>
                    <input className="border rounded px-3 py-2 w-full" value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
                    {fieldErrors.code && <div className="text-xs text-red-600">{fieldErrors.code.join(', ')}</div>}
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Tipe</div>
                    <select className="border rounded px-3 py-2 w-full" value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as VoucherType })}>
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Nilai</div>
                    <input type="number" className="border rounded px-3 py-2 w-full" value={form.value}
                        onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
                    <div className="text-[10px] text-gray-500">{form.type === 'PERCENT' ? '0–100 (%)' : 'Nominal rupiah'}</div>
                    {fieldErrors.value && <div className="text-xs text-red-600">{fieldErrors.value.join(', ')}</div>}
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Min Total</div>
                    <input type="number" className="border rounded px-3 py-2 w-full" value={form.min_total ?? 0}
                        onChange={(e) => setForm({ ...form, min_total: Number(e.target.value) })} />
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Usage Limit</div>
                    <input type="number" className="border rounded px-3 py-2 w-full" value={form.usage_limit ?? 0}
                        onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })} />
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Start At</div>
                    <input type="datetime-local" className="border rounded px-3 py-2 w-full" value={form.start_at ?? ''}
                        onChange={(e) => setForm({ ...form, start_at: e.target.value || null })} />
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">End At</div>
                    <input type="datetime-local" className="border rounded px-3 py-2 w-full" value={form.end_at ?? ''}
                        onChange={(e) => setForm({ ...form, end_at: e.target.value || null })} />
                </label>

                <label className="col-span-2">
                    <input type="checkbox" checked={!!form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })} /> <span className="text-sm">Aktif</span>
                </label>
            </div>

            <div className="flex items-center gap-2">
                <button disabled={loading} className="rounded border px-3 py-2">{loading ? 'Menyimpan…' : 'Simpan'}</button>
                <button type="button" className="rounded border px-3 py-2" onClick={() => history.back()}>Batal</button>
            </div>
        </form>
    );
}
