import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { createVoucher, deleteVoucher, updateVoucher } from '../../api/vouchers';
import DateRangePicker from '../../components/DateRangePicker';
import { useAuth, useIsManager } from '../../store/useAuth';
import type { Voucher, VoucherType } from '../../types/vouchers';
import { rangeFor } from '../../utils/date';
import { IconArchive, IconTrash, IconUnarchive } from '../users/icons';

type Props = {
    voucher: Voucher | null;
    onClose: () => void;
    onDone: (message: string) => void;
};

type FormState = {
    name: string;
    code: string;
    amount: string;
    mode: VoucherType;
    afterDiscount: boolean;
    active: boolean;
    periodOn: boolean;
    from: string;
    to: string;
    limitOn: boolean;
    max: string;
    stackVoucher: boolean;
    stackDiscount: boolean;
};

function initialForm(voucher: Voucher | null): FormState {
    const [defaultFrom, defaultTo] = rangeFor('month');

    return {
        name: voucher?.name ?? '',
        code: voucher?.code ?? '',
        amount: voucher ? String(Number(voucher.value)) : '',
        mode: voucher?.type ?? 'NOMINAL',
        afterDiscount: voucher?.percent_after_discount ?? true,
        active: voucher?.active ?? true,
        periodOn: Boolean(voucher?.start_at || voucher?.end_at),
        from: voucher?.start_at?.slice(0, 10) ?? defaultFrom,
        to: voucher?.end_at?.slice(0, 10) ?? defaultTo,
        limitOn: voucher?.usage_limit != null,
        max: voucher?.usage_limit != null ? String(voucher.usage_limit) : '',
        stackVoucher: voucher?.stack_voucher ?? false,
        stackDiscount: voucher?.stack_discount ?? true,
    };
}

export default function VoucherModal({ voucher, onClose, onDone }: Props) {
    const editing = Boolean(voucher);
    const isManager = useIsManager();
    const [form, setForm] = useState<FormState>(() => initialForm(voucher));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function submit() {
        const name = form.name.trim();
        const code = form.code.trim().toUpperCase();
        const amount = Number(form.amount.replace(/\D/g, ''));
        const max = Number(form.max);

        if (!name) {
            setError('Isi nama voucher.');
            return;
        }
        if (!/^[A-Z0-9]{4,10}$/.test(code)) {
            setError('Kode voucher 4-10 karakter (huruf/angka).');
            return;
        }
        if (amount <= 0) {
            setError('Isi besar voucher.');
            return;
        }
        if (form.mode === 'PERCENT' && amount > 100) {
            setError('Persentase maksimal 100%.');
            return;
        }
        if (form.limitOn && (!Number.isFinite(max) || max < 1)) {
            setError('Isi maksimal pemakaian.');
            return;
        }

        const branchId = isManager ? null : (useAuth.user?.branch_id ?? null);

        const payload = {
            branch_id: branchId ? String(branchId) : null,
            code,
            name,
            type: form.mode,
            value: amount,
            start_at: form.periodOn ? form.from : null,
            end_at: form.periodOn ? `${form.to} 23:59:59` : null,
            usage_limit: form.limitOn ? max : null,
            active: form.active,
            stack_voucher: form.stackVoucher,
            stack_discount: form.stackDiscount,
            percent_after_discount: form.afterDiscount,
        };

        setSaving(true);
        setError(null);
        try {
            if (editing && voucher) {
                await updateVoucher(voucher.id, payload);
                onDone('Voucher diperbarui.');
            } else {
                await createVoucher(payload);
                onDone('Voucher ditambah.');
            }
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menyimpan voucher'));
        } finally {
            setSaving(false);
        }
    }

    async function setArchived(value: boolean) {
        if (!voucher) return;

        setSaving(true);
        try {
            await updateVoucher(voucher.id, { is_archived: value } as never);
            onDone(value ? 'Voucher diarsipkan.' : 'Voucher dipulihkan.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal mengubah arsip'));
        } finally {
            setSaving(false);
        }
    }

    async function remove() {
        if (!voucher) return;
        if (!window.confirm(`Hapus voucher "${voucher.name}"?`)) return;

        setSaving(true);
        try {
            await deleteVoucher(voucher.id);
            onDone('Voucher dihapus.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menghapus voucher'));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Form voucher">
            <div className="box">
                <div className="modal-head">
                    <h3>{editing ? 'Edit' : 'Tambah'} Voucher</h3>
                    <button type="button" className="mclose" aria-label="Tutup" onClick={onClose}>
                        {'\u2715'}
                    </button>
                </div>

                <div className="row">
                    <div className="field" style={{ flex: 1.4 }}>
                        <label htmlFor="vc-name">
                            Nama Voucher <span className="req">*</span>
                        </label>
                        <input
                            id="vc-name"
                            value={form.name}
                            placeholder="mis. Promo Grand Opening"
                            onChange={(e) => set('name', e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="vc-code">
                            Kode Voucher <span className="req">*</span>
                        </label>
                        <input
                            id="vc-code"
                            value={form.code}
                            maxLength={10}
                            placeholder="4-10 KARAKTER"
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => set('code', e.target.value.toUpperCase())}
                        />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="vc-value">Besar Voucher</label>
                    <div className="disc-row">
                        <input
                            id="vc-value"
                            inputMode="numeric"
                            value={form.amount}
                            placeholder="0"
                            onChange={(e) => set('amount', e.target.value.replace(/\D/g, ''))}
                        />
                        <div className="seg2">
                            <button
                                type="button"
                                className={form.mode === 'NOMINAL' ? 'on' : undefined}
                                onClick={() => set('mode', 'NOMINAL')}
                            >
                                Rp
                            </button>
                            <button
                                type="button"
                                className={form.mode === 'PERCENT' ? 'on' : undefined}
                                onClick={() => set('mode', 'PERCENT')}
                            >
                                %
                            </button>
                        </div>
                    </div>

                    {form.mode === 'PERCENT' ? (
                        <div className="loy-basis" style={{ display: 'flex' }}>
                            <span className="mini">Dasar % dari:</span>
                            <div className="seg2">
                                <button
                                    type="button"
                                    className={form.afterDiscount ? undefined : 'on'}
                                    onClick={() => set('afterDiscount', false)}
                                >
                                    Sebelum diskon
                                </button>
                                <button
                                    type="button"
                                    className={form.afterDiscount ? 'on' : undefined}
                                    onClick={() => set('afterDiscount', true)}
                                >
                                    Setelah diskon
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                <label className="tgl">
                    <span className="switch gr">
                        <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
                        <span className="slider" />
                    </span>
                    <span>
                        Aktifkan Voucher <span className="mini">(hijau = aktif {'\u00b7'} merah = nonaktif)</span>
                    </span>
                </label>

                <label className="tgl">
                    <span className="switch">
                        <input type="checkbox" checked={form.periodOn} onChange={(e) => set('periodOn', e.target.checked)} />
                        <span className="slider" />
                    </span>
                    <span>
                        Masa Promo <span className="mini">(batasi tanggal berlaku)</span>
                    </span>
                </label>

                {form.periodOn ? (
                    <div className="field">
                        <label>Periode Berlaku</label>
                        <DateRangePicker
                            from={form.from}
                            to={form.to}
                            onChange={(from, to) => setForm((prev) => ({ ...prev, from, to }))}
                        />
                    </div>
                ) : null}

                <label className="tgl">
                    <span className="switch">
                        <input type="checkbox" checked={form.limitOn} onChange={(e) => set('limitOn', e.target.checked)} />
                        <span className="slider" />
                    </span>
                    <span>
                        Batasi Jumlah Pemakaian{' '}
                        <span className="mini">(mati = tak terbatas, siapa saja bisa pakai)</span>
                    </span>
                </label>

                {form.limitOn ? (
                    <div className="field">
                        <label htmlFor="vc-max">Maksimal pemakaian</label>
                        <input
                            id="vc-max"
                            type="number"
                            min={1}
                            value={form.max}
                            placeholder="mis. 100"
                            onChange={(e) => set('max', e.target.value)}
                        />
                    </div>
                ) : null}

                <label style={{ margin: '6px 0 8px', display: 'block', fontWeight: 800, fontSize: 12.5 }}>
                    Aturan Promo
                </label>

                <label className="tgl">
                    <span className="switch">
                        <input
                            type="checkbox"
                            checked={form.stackVoucher}
                            onChange={(e) => set('stackVoucher', e.target.checked)}
                        />
                        <span className="slider" />
                    </span>
                    <span>Bisa digabung dengan voucher lain</span>
                </label>

                <label className="tgl">
                    <span className="switch">
                        <input
                            type="checkbox"
                            checked={form.stackDiscount}
                            onChange={(e) => set('stackDiscount', e.target.checked)}
                        />
                        <span className="slider" />
                    </span>
                    <span>Bisa digabung dengan diskon</span>
                </label>

                {error ? (
                    <div role="alert" style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
                        {error}
                    </div>
                ) : null}

                <div className="modal-foot">
                    {editing && voucher ? (
                        <>
                            <button
                                type="button"
                                className="btn ghost sm"
                                disabled={saving}
                                onClick={() => void setArchived(!voucher.is_archived)}
                            >
                                {voucher.is_archived ? <IconUnarchive /> : <IconArchive />}
                                {voucher.is_archived ? 'Pulihkan' : 'Arsipkan'}
                            </button>
                            <button type="button" className="btn danger sm" disabled={saving} onClick={() => void remove()}>
                                <IconTrash />
                                Hapus
                            </button>
                        </>
                    ) : null}

                    <button
                        type="button"
                        className="btn"
                        style={editing ? { marginLeft: 'auto' } : undefined}
                        disabled={saving}
                        onClick={() => void submit()}
                    >
                        {saving ? 'Menyimpan\u2026' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
