// src/pages/vouchers/VoucherForm.tsx
import { useEffect, useState } from 'react';
import { createVoucher, getVoucher, updateVoucher } from '../../api/vouchers';
import type { Voucher, VoucherUpsertPayload, VoucherType } from '../../types/vouchers';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { normalizeApiError } from '../../api/client';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

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
  const { toast, showSuccess, showError, hideToast } = useToast();

  function focusFirstErrorField(errors: Record<string, string[]>) {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;

    const el = document.getElementById(firstKey) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;

    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      el.focus();
    }, 150);
  }

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
      } catch (err) {
        const e = normalizeApiError(err);
        setError(e.message || 'Gagal memuat data voucher');
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, id]);

  function validateUI(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    if (!form.code?.trim()) {
      errors.code = ['Kode voucher wajib diisi'];
    } else if (!/^[A-Z0-9-]+$/.test(form.code.trim().toUpperCase())) {
      errors.code = ['Kode wajib huruf besar, angka, atau tanda strip'];
    }

    if (!form.type) {
      errors.type = ['Tipe voucher wajib dipilih'];
    }

    const value = Number(form.value ?? 0);
    if (Number.isNaN(value) || value < 0) {
      errors.value = ['Nilai voucher tidak valid'];
    } else if (form.type === 'PERCENT' && value > 100) {
      errors.value = ['Persentase harus 0–100'];
    }

    if (form.start_at && form.end_at && new Date(form.start_at) > new Date(form.end_at)) {
      errors.end_at = ['Tanggal akhir harus sama atau setelah tanggal mulai'];
    }

    const minTotal = Number(form.min_total ?? 0);
    if (Number.isNaN(minTotal) || minTotal < 0) {
      errors.min_total = ['Minimum total tidak boleh negatif'];
    }

    if (form.usage_limit !== null && form.usage_limit !== undefined) {
      const usageLimit = Number(form.usage_limit);
      if (!Number.isInteger(usageLimit) || usageLimit < 1) {
        errors.usage_limit = ['Batas penggunaan minimal 1'];
      }
    }

    return errors;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const clientErrors = validateUI();

    if (Object.keys(clientErrors).length > 0) {
      setLoading(false);
      setFieldErrors(clientErrors);
      setError('Masih ada data yang belum benar. Silakan periksa form.');
      focusFirstErrorField(clientErrors);
      return;
    }

    try {
      const payload: VoucherUpsertPayload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        min_total: Number(form.min_total ?? 0),
        value: Number(form.value ?? 0),
        usage_limit:
          form.usage_limit === null || form.usage_limit === undefined
            ? null
            : Number(form.usage_limit),
      };

      if (editing) {
        await updateVoucher(id!, payload);
      } else {
        await createVoucher(payload);
      }

      showSuccess(editing ? 'Voucher berhasil diperbarui.' : 'Voucher berhasil disimpan.');

      window.setTimeout(() => {
        nav('/vouchers', { replace: true });
      }, 700);
    } catch (err) {
      const e = normalizeApiError(err);

      setFieldErrors(e.errors);
      setError(e.message || 'Gagal menyimpan voucher');

      if (Object.keys(e.errors).length > 0) {
        focusFirstErrorField(e.errors);
      } else {
        showError(e.message || 'Gagal menyimpan voucher');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast
        show={toast.open}
        kind={toast.kind}
        message={toast.message}
        onClose={hideToast}
      />
      <form className="space-y-4 max-w-2xl" onSubmit={onSubmit} aria-busy={loading ? 'true' : 'false'}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {editing ? 'Edit Voucher' : 'Buat Voucher'}
            </h1>
            <p className="text-xs text-gray-600">
              Atur kode, tipe, nilai, periode, dan status voucher.
            </p>
          </div>
        </div>

        {/* Alert error */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
          >
            {error}
          </div>
        )}

        {/* Card form */}
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kode */}
            <label className="md:col-span-2">
              <div className="text-xs text-gray-600 mb-1">Kode</div>
              <input
                id="code"
                className="input w-full"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
                placeholder="Contoh: NEWUSER-10"
                aria-invalid={!!fieldErrors.code}
                aria-describedby={fieldErrors.code ? 'err-code' : undefined}
              />
              <div className="text-[10px] text-gray-500 mt-1">
                Hanya huruf besar, angka, dan strip. Contoh: <span className="font-mono">SALVE-25</span>
              </div>
              {fieldErrors.code && (
                <div id="err-code" className="text-xs text-red-600 mt-1">
                  {fieldErrors.code.join(', ')}
                </div>
              )}
            </label>

            {/* Tipe */}
            <label>
              <div className="text-xs text-gray-600 mb-1">Tipe</div>
              <select
                id="type"
                className="input w-full"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as VoucherType })}
                aria-invalid={!!fieldErrors.type}
                aria-describedby={fieldErrors.type ? 'err-type' : undefined}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {fieldErrors.type && (
                <div id="err-type" className="text-xs text-red-600 mt-1">
                  {fieldErrors.type.join(', ')}
                </div>
              )}
            </label>

            {/* Nilai */}
            <label>
              <div className="text-xs text-gray-600 mb-1">Nilai</div>
              <input
                id="value"
                type="number"
                className="input w-full"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                required
                aria-invalid={!!fieldErrors.value}
                aria-describedby={fieldErrors.value ? 'err-value' : undefined}
              />
              <div className="text-[10px] text-gray-500 mt-1">
                {form.type === 'PERCENT' ? '0–100 (%)' : 'Nominal rupiah'}
              </div>
              {fieldErrors.value && (
                <div id="err-value" className="text-xs text-red-600 mt-1">
                  {fieldErrors.value.join(', ')}
                </div>
              )}
            </label>

            {/* Min Total */}
            <label>
              <div className="text-xs text-gray-600 mb-1">Min Total</div>
              <input
                id="min_total"
                type="number"
                className="input w-full"
                value={form.min_total ?? 0}
                onChange={(e) => setForm({ ...form, min_total: Number(e.target.value) })}
                aria-invalid={!!fieldErrors.min_total}
                aria-describedby={fieldErrors.min_total ? 'err-min_total' : undefined}
              />
              {fieldErrors.min_total && (
                <div id="err-min_total" className="text-xs text-red-600 mt-1">
                  {fieldErrors.min_total.join(', ')}
                </div>
              )}
            </label>

            {/* Usage Limit */}
            <label>
              <div className="text-xs text-gray-600 mb-1">Usage Limit</div>
              <input
                id="usage_limit"
                type="number"
                className="input w-full"
                value={form.usage_limit ?? ''}
                onChange={(e) =>
                  setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })
                }
                aria-invalid={!!fieldErrors.usage_limit}
                aria-describedby={fieldErrors.usage_limit ? 'err-usage_limit' : undefined}
              />
              <div className="text-[10px] text-gray-500 mt-1">Kosongkan untuk tidak dibatasi.</div>
              {fieldErrors.usage_limit && (
                <div id="err-usage_limit" className="text-xs text-red-600 mt-1">
                  {fieldErrors.usage_limit.join(', ')}
                </div>
              )}
            </label>

            {/* Start At */}
            <label>
              <div className="text-xs text-gray-600 mb-1">Start At</div>
              <input
                id="start_at"
                type="datetime-local"
                className="input w-full"
                value={form.start_at ?? ''}
                onChange={(e) => setForm({ ...form, start_at: e.target.value || null })}
              />
            </label>

            {/* End At */}
            <label>
              <div className="text-xs text-gray-600 mb-1">End At</div>
              <input
                id="end_at"
                type="datetime-local"
                className="input w-full"
                value={form.end_at ?? ''}
                onChange={(e) => setForm({ ...form, end_at: e.target.value || null })}
                aria-invalid={!!fieldErrors.end_at}
                aria-describedby={fieldErrors.end_at ? 'err-end_at' : undefined}
              />
              {fieldErrors.end_at && (
                <div id="err-end_at" className="text-xs text-red-600 mt-1">
                  {fieldErrors.end_at.join(', ')}
                </div>
              )}
            </label>

            {/* Aktif */}
            <label className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <span className="text-sm">Aktif</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => nav(-1)}
          >
            Batal
          </button>
        </div>
      </form>
    </>
  );
}
