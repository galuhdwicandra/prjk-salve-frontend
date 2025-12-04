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
        seq: (res.data?.[0]?.seq ?? 0),
      }));
      setPreview(null);
    } catch {
      setError('Gagal memuat konfigurasi invoice');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void refresh(); }, [refresh]);

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
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Invoice Settings</h1>
          <p className="text-xs text-gray-600">
            Branch: <strong>{branch?.code}</strong> — {branch?.name}
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Prefix default: <span className="font-mono">{branch?.invoice_prefix ?? '—'}</span>
        </div>
      </header>

      {/* Error & Loading */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}
      {loading && !rows.length && (
        <div className="text-sm text-gray-500">Memuat…</div>
      )}

      {/* Daftar Counter */}
      <section className="space-y-2">
        <h2 className="font-medium">Daftar Counter</h2>

        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Prefix</Th>
                  <Th>Reset</Th>
                  <Th>Sequence</Th>
                  <Th>Last Month</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading && rows.length === 0 ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-gray-500">Belum ada counter</td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-medium">{r.prefix}</span></Td>
                      <Td className="uppercase">{r.reset_policy}</Td>
                      <Td className="tabular-nums">{r.seq}</Td>
                      <Td>{r.last_reset_month ?? '-'}</Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => {
                              const raw = prompt('Prefix baru (2–8 huruf kapital A–Z):', r.prefix) ?? r.prefix;
                              const prefix = (raw || '').toUpperCase().slice(0, 8);
                              if (!/^[A-Z]{2,8}$/.test(prefix)) { alert('Prefix tidak valid'); return; }
                              try {
                                await updateInvoiceCounter(r.id, { prefix, reset_policy: r.reset_policy, seq: r.seq });
                                await refresh();
                              } catch { alert('Gagal update'); }
                            }}
                          >
                            Ubah Prefix
                          </button>
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => {
                              const policy = (prompt('Reset policy (monthly/never):', r.reset_policy) ?? r.reset_policy) as ResetPolicy;
                              if (!['monthly', 'never'].includes(policy)) { alert('Reset policy tidak valid'); return; }
                              try {
                                await updateInvoiceCounter(r.id, { prefix: r.prefix, reset_policy: policy, seq: r.seq });
                                await refresh();
                              } catch { alert('Gagal update'); }
                            }}
                          >
                            Ubah Reset
                          </button>
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => {
                              const v = prompt('Sequence baru (0–999999):', String(r.seq));
                              if (v == null) return;
                              const n = Number(v);
                              if (!Number.isFinite(n) || n < 0 || n > 999999) { alert('Sequence tidak valid'); return; }
                              try {
                                await updateInvoiceCounter(r.id, { prefix: r.prefix, reset_policy: r.reset_policy, seq: Math.floor(n) });
                                await refresh();
                              } catch { alert('Gagal update sequence'); }
                            }}
                          >
                            Ubah Sequence
                          </button>
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => { await onResetNow(r.id); }}
                          >
                            Reset Now
                          </button>
                          <button
                            className="btn-outline text-xs !text-red-600"
                            onClick={async () => {
                              if (!confirm('Hapus counter ini?')) return;
                              try { await deleteInvoiceCounter(r.id); await refresh(); } catch { alert('Gagal hapus'); }
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tambah Counter */}
      <section className="space-y-2">
        <h2 className="font-medium">Tambah Counter</h2>

        <form className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-3 grid sm:grid-cols-4 gap-3 items-end" onSubmit={onSaveNew}>
          <div className="grid gap-1">
            <label className="text-xs" htmlFor="prefix">Prefix *</label>
            <input
              id="prefix"
              className="input font-mono uppercase"
              value={form.prefix}
              onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase().slice(0, 8) })}
              placeholder="INV"
              aria-invalid={!valid}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs" htmlFor="reset">Reset *</label>
            <select
              id="reset"
              className="input"
              value={form.reset_policy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
              }
            >
              {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-xs" htmlFor="seq">Sequence *</label>
            <input
              id="seq"
              type="number"
              min={0}
              max={999999}
              step={1}
              className="input font-mono"
              value={form.seq ?? 0}
              onChange={(e) => {
                const n = Number(e.target.value);
                const v = Number.isFinite(n) ? Math.max(0, Math.min(999999, Math.floor(n))) : 0;
                setForm({ ...form, seq: v });
              }}
            />
          </div>

          <div className="flex items-end gap-2">
            <button className="btn-primary" disabled={!valid}>Tambah</button>
            <button
              type="button"
              onClick={onPreview}
              className="btn-outline text-xs"
              disabled={loading}
            >
              Preview nomor berikutnya
            </button>
          </div>
        </form>

        {preview && (
          <div className="text-xs">
            Next <code>number</code>: <strong className="font-mono">{preview.number}</strong>
            {' '}— <code>invoice_no</code>: <strong className="font-mono">{preview.invoice_no}</strong>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Kombinasi <code>branch_id + prefix</code> harus unik (constraint DB). Sequence bertambah saat invoice dipakai.
        </p>
      </section>
    </div>
  );
}

/* ---------- Subcomponents (konsisten dengan Customers) ---------- */
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
function RowSkeleton() {
  return (
    <tr>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-40 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}
