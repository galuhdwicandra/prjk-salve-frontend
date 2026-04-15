// src/pages/branches/BranchForm.tsx
import { useEffect, useMemo, useState } from 'react';
import { createBranch, getBranch, updateBranch } from '../../api/branches';
import type { Branch, BranchUpsertPayload, ResetPolicy } from '../../types/branches';
import { useNavigate, useParams } from 'react-router-dom';
import { normalizeApiError } from '../../api/client';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

function toResetPolicy(value: string): ResetPolicy {
  return value === 'never' ? 'never' : 'monthly';
}

const POLICIES: ResetPolicy[] = ['monthly', 'never'];
type BranchFieldErrors = Record<string, string[]>;

function focusFirstErrorField(errors: BranchFieldErrors) {
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

function validateBranchForm(form: BranchUpsertPayload): BranchFieldErrors {
  const errors: BranchFieldErrors = {};

  const code = form.code.trim();
  const name = form.name.trim();
  const invoicePrefix = form.invoice_prefix.trim();

  if (!code) {
    errors.code = ['Kode cabang wajib diisi'];
  } else if (code.length > 32) {
    errors.code = ['Kode cabang maksimal 32 karakter'];
  }

  if (!name) {
    errors.name = ['Nama cabang wajib diisi'];
  } else if (name.length > 150) {
    errors.name = ['Nama cabang maksimal 150 karakter'];
  }

  if (form.address && form.address.trim().length > 255) {
    errors.address = ['Alamat maksimal 255 karakter'];
  }

  if (!invoicePrefix) {
    errors.invoice_prefix = ['Prefix invoice wajib diisi'];
  } else if (invoicePrefix.length > 8) {
    errors.invoice_prefix = ['Prefix invoice maksimal 8 karakter'];
  }

  if (!POLICIES.includes(form.reset_policy)) {
    errors.reset_policy = ['Reset policy tidak valid'];
  }

  return errors;
}

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
  const { toast, showSuccess, showError, hideToast } = useToast();

  const v = useMemo(
    () => ({
      code: form.code ?? '',
      name: form.name ?? '',
      address: form.address ?? '',
      invoice_prefix: form.invoice_prefix ?? '',
      reset_policy: form.reset_policy ?? 'monthly',
    }),
    [form]
  );

  useEffect(() => {
    (async () => {
      if (!editing) return;

      setLoading(true);
      setError(null);

      try {
        const res = await getBranch(id!);
        const b = res.data as Branch;

        setForm({
          code: b.code ?? '',
          name: b.name ?? '',
          address: b.address ?? '',
          invoice_prefix: b.invoice_prefix ?? 'SLV',
          reset_policy: b.reset_policy ?? 'monthly',
        });
      } catch (err) {
        const e = normalizeApiError(err);
        setError(e.message || 'Gagal memuat data cabang');
        showError(e.message || 'Gagal memuat data cabang');
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, id, showError]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const payload: BranchUpsertPayload = {
      code: v.code.trim(),
      name: v.name.trim(),
      address: v.address.trim() || null,
      invoice_prefix: v.invoice_prefix.trim().toUpperCase(),
      reset_policy: v.reset_policy,
    };

    const clientErrors = validateBranchForm(payload);

    if (Object.keys(clientErrors).length > 0) {
      setLoading(false);
      setFieldErrors(clientErrors);
      setError('Masih ada data yang belum benar. Silakan periksa form.');
      showError('Masih ada data yang belum benar. Silakan periksa form.');
      focusFirstErrorField(clientErrors);
      return;
    }

    try {
      if (editing) {
        await updateBranch(id!, payload);
      } else {
        await createBranch(payload);
      }

      showSuccess(editing ? 'Cabang berhasil diperbarui.' : 'Cabang berhasil disimpan.');

      window.setTimeout(() => {
        nav('/branches', { replace: true });
      }, 700);
    } catch (err) {
      const e = normalizeApiError(err);

      setError(e.message || 'Gagal menyimpan data cabang');
      setFieldErrors(e.errors);

      showError(e.message || 'Gagal menyimpan data cabang');

      if (Object.keys(e.errors).length > 0) {
        focusFirstErrorField(e.errors);
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
      <div className="space-y-4">
        {/* Header */}
        <header>
          <h1 className="text-lg font-semibold tracking-tight">
            {editing ? 'Edit Branch' : 'New Branch'}
          </h1>
          <p className="text-xs text-gray-600">
            Lengkapi informasi cabang untuk penomoran invoice & identitas struk.
          </p>
        </header>

        {/* Alert error global */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
          >
            {error}
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={onSubmit} className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 max-w-xl">
          <div className="p-4 grid gap-4">
            {/* Kode */}
            <div className="grid gap-1">
              <label htmlFor="code" className="text-xs font-medium">
                Kode <span className="text-red-600">*</span>
              </label>
              <input
                id="code"
                className="input"
                value={form.code}
                onChange={(e) => {
                  setForm({ ...form, code: e.target.value });
                  setFieldErrors((prev) => ({ ...prev, code: [] }));
                }}
                aria-invalid={Boolean(fieldErrors.code)}
                aria-describedby={fieldErrors.code ? 'err-code' : undefined}
              />
              {fieldErrors.code && (
                <p id="err-code" className="text-xs text-red-600">{fieldErrors.code.join(', ')}</p>
              )}
            </div>

            {/* Nama */}
            <div className="grid gap-1">
              <label htmlFor="name" className="text-xs font-medium">
                Nama <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'err-name' : undefined}
              />
              {fieldErrors.name && (
                <p id="err-name" className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>
              )}
            </div>

            {/* Alamat */}
            <div className="grid gap-1">
              <label htmlFor="address" className="text-xs font-medium">Alamat</label>
              <input
                id="address"
                className="input"
                value={form.address ?? ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* Prefix Invoice */}
            <div className="grid gap-1">
              <label htmlFor="invoice_prefix" className="text-xs font-medium">
                Prefix Invoice (max 8) <span className="text-red-600">*</span>
              </label>
              <input
                id="invoice_prefix"
                className="input"
                value={form.invoice_prefix}
                maxLength={8}
                onChange={(e) => {
                  setForm({ ...form, invoice_prefix: e.target.value.toUpperCase() });
                  setFieldErrors((prev) => ({ ...prev, invoice_prefix: [] }));
                }}
                aria-invalid={Boolean(fieldErrors.invoice_prefix)}
                aria-describedby={fieldErrors.invoice_prefix ? 'err-prefix' : undefined}
              />
              {fieldErrors.invoice_prefix && (
                <p id="err-prefix" className="text-xs text-red-600">{fieldErrors.invoice_prefix.join(', ')}</p>
              )}
              <p className="text-[11px] text-gray-500">
                Contoh: <span className="font-mono">SLV</span>, <span className="font-mono">BRN</span>. Gunakan huruf/angka tanpa spasi.
              </p>
            </div>

            {/* Kebijakan Reset */}
            <div className="grid gap-1">
              <label htmlFor="reset_policy" className="text-xs font-medium">
                Kebijakan Reset <span className="text-red-600">*</span>
              </label>
              <select
                id="reset_policy"
                className="input"
                value={form.reset_policy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setForm({ ...form, reset_policy: toResetPolicy(e.target.value) });
                  setFieldErrors((prev) => ({ ...prev, reset_policy: [] }));
                }}
                aria-invalid={Boolean(fieldErrors.reset_policy)}
                aria-describedby={fieldErrors.reset_policy ? 'err-reset' : undefined}
              >
                {POLICIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {fieldErrors.reset_policy && (
                <p id="err-reset" className="text-xs text-red-600">{fieldErrors.reset_policy.join(', ')}</p>
              )}
              <p className="text-[11px] text-gray-500">
                <span className="font-medium">monthly</span>: penomoran invoice direset setiap bulan. <span className="font-medium">never</span>: tidak pernah direset.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-[color:var(--color-border)] px-4 py-3 flex items-center gap-2">
            <button
              disabled={loading}
              className="btn-primary disabled:opacity-60"
              aria-busy={loading ? 'true' : 'false'}
            >
              {loading ? 'Menyimpan…' : 'Simpan'}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => history.back()}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
