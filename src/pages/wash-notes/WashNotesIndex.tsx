// src/pages/wash-notes/WashNotesIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { listWashNotes, deleteWashNote } from '../../api/washNotes';
import { useHasRole } from '../../store/useAuth';

function InfoTips() {
  const [open, setOpen] = useState(true);
  return (
    <aside className="rounded border p-3 bg-gray-50">
      <div className="flex items-center justify-between">
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
        <div id="wash-tips" className="mt-2 text-sm leading-relaxed">
          <ul className="list-disc ml-5 space-y-1">
            <li>Pilih <em>rentang tanggal</em> untuk menampilkan catatan cuci pada periode tersebut.</li>
            <li>Tekan <strong>Tambah</strong> untuk membuat catatan cuci harian (default tanggal hari ini).</li>
            <li><strong>Rekap</strong> menunjukkan jumlah order dan total <code>qty</code> yang dicuci pada tiap catatan.</li>
            <li>Hanya <strong>Superadmin</strong> dan <strong>Admin Cabang</strong> yang bisa menghapus catatan. Petugas Cuci tidak bisa menghapus.</li>
            <li>Gunakan tombol <strong>Detail</strong> untuk melihat item/order yang dicatat pada hari tersebut, dan <strong>Ubah</strong> untuk memperbarui.</li>
          </ul>
        </div>
      )}
    </aside>
  );
}

export default function WashNotesIndex() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const canDelete = useHasRole(['Superadmin', 'Admin Cabang']); // kontrol tombol Hapus

  const load = async () => {
    setLoading(true);
    try {
      const res = await listWashNotes({ date_from: from, date_to: to });
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const recap = useMemo(
    () => meta?.recap ?? { orders_count: 0, total_qty: 0 },
    [meta]
  );

  const resetDates = () => {
    setFrom(today);
    setTo(today);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-end gap-2">
        <div>
          <label className="block text-sm">Dari Tanggal</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Sampai Tanggal</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={resetDates}
          className="inline-block px-3 py-2 border rounded"
          disabled={loading}
          title="Kembalikan ke hari ini"
        >
          Reset
        </button>

        <NavLink
          to="/wash-notes/new"
          className="ml-auto inline-block bg-black text-white px-3 py-2 rounded"
        >
          Tambah
        </NavLink>
      </div>

      <InfoTips />

      <div className="text-sm" aria-live="polite">
        <strong>Rekap:</strong> {recap.orders_count} order, total qty {recap.total_qty}
      </div>

      {loading ? (
        <div>Memuat…</div>
      ) : (
        <div className="border rounded divide-y">
          {rows.map(r => (
            <div key={r.id} className="p-3 flex items-center gap-3">
              <div className="w-40">
                <div className="text-xs text-gray-500">Tanggal</div>
                <div className="font-medium">{r.note_date}</div>
              </div>
              <div className="w-40">
                <div className="text-xs text-gray-500">Petugas</div>
                <div className="font-medium">{r.user?.name ?? r.user_id}</div>
              </div>
              <div className="w-40">
                <div className="text-xs text-gray-500">Rekap</div>
                <div>
                  {r.orders_count} order • {r.total_qty}
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <NavLink className="underline" to={`/wash-notes/${r.id}`}>
                  Detail
                </NavLink>
                <NavLink className="underline" to={`/wash-notes/${r.id}/edit`}>
                  Ubah
                </NavLink>
                {canDelete && (
                  <button
                    onClick={async () => {
                      if (confirm('Hapus catatan ini?')) {
                        await deleteWashNote(r.id);
                        load();
                      }
                    }}
                    className="text-red-600"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              Tidak ada data pada rentang tanggal ini.{' '}
              <NavLink className="underline" to="/wash-notes/new">
                Buat catatan cuci baru
              </NavLink>
              .
            </div>
          )}
        </div>
      )}
    </div>
  );
}
