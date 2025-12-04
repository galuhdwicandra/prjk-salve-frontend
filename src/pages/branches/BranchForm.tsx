// src/pages/branches/BranchForm.tsx
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
      const withResp = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      const fe = withResp.response?.data?.errors ?? {};
      if (fe && typeof fe === 'object') setFieldErrors(fe);
      setError(withResp.response?.data?.message ?? 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  }

  return (
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
              onChange={(e) => setForm({ ...form, code: e.target.value })}
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
            <label htmlFor="prefix" className="text-xs font-medium">
              Prefix Invoice (max 8) <span className="text-red-600">*</span>
            </label>
            <input
              id="prefix"
              className="input"
              value={form.invoice_prefix}
              maxLength={8}
              onChange={(e) => setForm({ ...form, invoice_prefix: e.target.value.toUpperCase() })}
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
            <label htmlFor="reset" className="text-xs font-medium">
              Kebijakan Reset <span className="text-red-600">*</span>
            </label>
            <select
              id="reset"
              className="input"
              value={form.reset_policy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
              }
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
  );
}
