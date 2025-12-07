// src/pages/wash-notes/WashNotesIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { listWashNotes, deleteWashNote } from '../../api/washNotes';
import { useHasRole } from '../../store/useAuth';
import { todayLocalYMD } from '../../utils/date';

function InfoTips() {
  const [open, setOpen] = useState(true);
  return (
    <aside className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
      <div className="flex items-center justify-between p-3">
        <strong className="text-sm">Tips / Keterangan</strong>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="text-xs underline"
          aria-expanded={open}
          aria-controls="wash-tips"
        >
          {open ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>
      {open && (
        <div id="wash-tips" className="px-3 pb-3 text-sm leading-relaxed">
          <ul className="list-disc ml-5 space-y-1">
            <li>Pilih <em>rentang tanggal</em> untuk menampilkan catatan cuci pada periode tersebut.</li>
            <li>Tekan <strong>Tambah</strong> untuk membuat catatan cuci harian (default tanggal hari ini).</li>
            <li><strong>Rekap</strong> menunjukkan jumlah order dan total <code>qty</code> yang dicuci pada tiap catatan.</li>
            <li>Hanya <strong>Superadmin</strong> dan <strong>Admin Cabang</strong> yang bisa menghapus catatan.</li>
            <li>Gunakan tombol <strong>Detail</strong> untuk melihat item/order, dan <strong>Ubah</strong> untuk memperbarui.</li>
          </ul>
        </div>
      )}
    </aside>
  );
}

export default function WashNotesIndex() {
  const today = todayLocalYMD();
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const canDelete = useHasRole(['Superadmin', 'Admin Cabang']);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listWashNotes({ date_from: from, date_to: to });
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setErr('Gagal memuat catatan cuci.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [from, to]);

  const recap = useMemo(
    () => meta?.recap ?? { orders_count: 0, total_qty: 0 },
    [meta]
  );

  const resetDates = () => {
    const t = todayLocalYMD(); // hitung ulang saat tombol ditekan (jika lewat tengah malam)
    setFrom(t);
    setTo(t);
  };

  return (
    <div className="space-y-4">
      {/* Header + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Catatan Cuci Harian</h1>
          <p className="text-xs text-gray-600">Rekap order & qty yang dicuci per tanggal</p>
        </div>
        <NavLink to="/wash-notes/new" className="btn-primary">Tambah</NavLink>
      </div>

      {/* FilterBar */}
      <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1" aria-label="Filter catatan cuci">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[repeat(3,auto)_1fr] gap-3 items-end">
          <label className="grid gap-1 text-sm">
            <span>Dari Tanggal</span>
            <input
              type="date"
              className="input px-2 py-2 bg-white"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Sampai Tanggal</span>
            <input
              type="date"
              className="input px-2 py-2 bg-white"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={resetDates}
            className="btn-outline"
            disabled={loading}
            title="Kembalikan ke hari ini"
          >
            Reset
          </button>
          <div className="sm:ml-auto text-sm text-gray-700">
            <strong>Rekap:</strong> {recap.orders_count} order • {recap.total_qty} qty
          </div>
        </div>
      </section>

      {/* Info Tips */}
      <InfoTips />

      {/* Error */}
      {err && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {err}
        </div>
      )}

      {/* Tabel konsisten seperti CustomersIndex */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Tanggal</Th>
                  <Th>Petugas</Th>
                  <Th className="text-right">Order</Th>
                  <Th className="text-right">Total Qty</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                      Tidak ada data pada rentang tanggal ini.{' '}
                      <NavLink className="underline" to="/wash-notes/new">Buat catatan cuci baru</NavLink>.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td>{r.note_date}</Td>
                      <Td><span className="line-clamp-1">{r.user?.name ?? r.user_id}</span></Td>
                      <Td className="text-right tabular-nums">{r.orders_count}</Td>
                      <Td className="text-right tabular-nums">{r.total_qty}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <NavLink className="btn-outline" to={`/wash-notes/${r.id}`}>Detail</NavLink>
                          <NavLink className="btn-outline" to={`/wash-notes/${r.id}/edit`}>Ubah</NavLink>
                          {canDelete && (
                            <button
                              onClick={async () => {
                                if (confirm('Hapus catatan ini?')) {
                                  await deleteWashNote(r.id);
                                  load();
                                }
                              }}
                              className="btn-outline text-red-600 border-red-300"
                            >
                              Hapus
                            </button>
                          )}
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
    </div>
  );
}

/* ---------- Subcomponents ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="ml-auto h-4 w-10 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="ml-auto h-4 w-12 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}
