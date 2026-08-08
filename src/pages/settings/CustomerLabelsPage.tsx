import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
  createCustomerLabel,
  deleteCustomerLabel,
  listCustomerLabels,
  updateCustomerLabel,
} from '../../api/customerLabels';
import { CUSTOMER_LABEL_COLORS, customerLabelChipClass } from '../../hooks/useCustomerLabels';
import type { CustomerLabel, CustomerLabelUpsertPayload } from '../../types/customers';

const EMPTY_FORM: CustomerLabelUpsertPayload = {
  name: '',
  color: 'slate',
  is_active: true,
};

export default function CustomerLabelsPage() {
  const [rows, setRows] = useState<CustomerLabel[]>([]);
  const [form, setForm] = useState<CustomerLabelUpsertPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCustomerLabels();
      setRows(res.data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat label customer'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function startEdit(row: CustomerLabel) {
    setEditingId(row.id);
    setForm({
      name: row.name,
      color: row.color ?? 'slate',
      is_active: row.is_active,
    });
  }

  async function onSubmit() {
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateCustomerLabel(editingId, form);
      } else {
        await createCustomerLabel(form);
      }
      resetForm();
      await fetchRows();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan label customer'));
    } finally {
      setSaving(false);
    }
  }

  async function onToggleActive(row: CustomerLabel) {
    setError(null);
    try {
      await updateCustomerLabel(row.id, { is_active: !row.is_active });
      await fetchRows();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status label'));
    }
  }

  async function onDelete(row: CustomerLabel) {
    if (!confirm(`Hapus label ${row.name}?`)) return;
    setError(null);
    try {
      await deleteCustomerLabel(row.id);
      if (editingId === row.id) resetForm();
      await fetchRows();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus label customer'));
    }
  }

  const canSubmit = (form.name ?? '').trim() !== '' && !saving;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Master Label Customer</h1>
        <p className="text-xs text-gray-500">
          Label yang aktif muncul sebagai pilihan tag di POS dan database customer.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
        <div className="p-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto_auto]">
          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="cl-name">Nama Label</label>
            <input
              id="cl-name"
              className="input w-full py-2"
              placeholder="VIP"
              maxLength={60}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="cl-color">Warna</label>
            <select
              id="cl-color"
              className="input w-36 py-2 capitalize"
              value={form.color ?? 'slate'}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            >
              {CUSTOMER_LABEL_COLORS.map((color) => (
                <option key={color} value={color} className="capitalize">
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-medium mb-1">Pratinjau</span>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${customerLabelChipClass(form.color)}`}
            >
              {(form.name ?? '').trim() || 'Label'}
            </span>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm pb-2">
              <input
                type="checkbox"
                checked={form.is_active ?? true}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Aktif
            </label>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              className="btn-primary disabled:opacity-60"
              disabled={!canSubmit}
              onClick={() => void onSubmit()}
            >
              {saving ? 'Menyimpan…' : editingId ? 'Simpan' : 'Tambah'}
            </button>
            {editingId && (
              <button type="button" className="btn-outline" onClick={resetForm} disabled={saving}>
                Batal
              </button>
            )}
          </div>
        </div>
      </section>

      {!loading && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada label customer.
        </div>
      )}

      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Label</Th>
                  <Th>Warna</Th>
                  <Th>Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-black/5 transition-colors">
                    <Td>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${customerLabelChipClass(row.color)}`}
                      >
                        {row.name}
                      </span>
                    </Td>
                    <Td className="capitalize">{row.color ?? 'slate'}</Td>
                    <Td>
                      <span className={row.is_active ? 'text-green-700' : 'text-gray-500'}>
                        {row.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="btn-outline px-2 py-1 text-xs"
                          onClick={() => void onToggleActive(row)}
                          aria-label={`Ubah status ${row.name}`}
                        >
                          {row.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          className="btn-outline px-2 py-1 text-xs"
                          onClick={() => startEdit(row)}
                          aria-label={`Edit ${row.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-outline px-2 py-1 text-xs text-red-600"
                          onClick={() => void onDelete(row)}
                          aria-label={`Hapus ${row.name}`}
                        >
                          Hapus
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
