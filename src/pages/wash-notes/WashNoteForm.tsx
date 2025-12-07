// src/pages/wash-notes/WashNoteForm.tsx
import { useEffect, useMemo, useState } from 'react';
import { createWashNote, updateWashNote, getWashNote, searchOrderCandidates, listWashNotes } from '../../api/washNotes';
import { useNavigate, useParams } from 'react-router-dom';

type ItemDraft = {
    order_id: string;
    number: string;
    customer?: string;
    qty: number;
    process_status?: 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';
    started_at?: string | null;
    finished_at?: string | null;
    note?: string | null;
};

function InfoTipsForm({ noteDate }: { noteDate: string }) {
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
                    aria-controls="wash-tips-form"
                >
                    {open ? 'Sembunyikan' : 'Tampilkan'}
                </button>
            </div>
            {open && (
                <div id="wash-tips-form" className="mt-2 text-sm leading-relaxed">
                    <ul className="list-disc ml-5 space-y-1">
                        <li>Catatan dibuat per <strong>Petugas Cuci</strong> per <strong>tanggal</strong>. Tanggal aktif: <b>{noteDate}</b>.</li>
                        <li>Gunakan <em>rentang tanggal</em> di bagian pencarian untuk menyaring order yang akan ditambahkan.</li>
                        <li>Ketik lengkap <strong>huruf atau nomor order</strong> pada kolom “Cari Order”, lalu <strong>Tambah</strong> untuk memasukkan ke daftar.</li>
                        <li>Isi <code>qty</code>, pilih status proses, dan (opsional) jam mulai–selesai. Jam selesai harus ≥ jam mulai bila keduanya diisi.</li>
                        <li>Duplikasi order pada catatan yang sama akan otomatis dicegah.</li>
                        <li>Tekan <strong>Simpan</strong> setelah minimal satu order terisi.</li>
                        <li>Bila <em>Auto-isi qty</em> aktif, kolom qty terisi otomatis dari total item pada order; Anda tetap dapat mengubahnya.</li>
                    </ul>
                </div>
            )}
        </aside>
    );
}

export default function WashNoteForm() {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [noteDate, setNoteDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState<ItemDraft[]>([]);
    const [q, setQ] = useState('');
    const [candidates, setCandidates] = useState<any[]>([]);
    const today = new Date().toISOString().slice(0, 10);
    const [from, setFrom] = useState<string>(today);
    const [to, setTo] = useState<string>(today);
    const [loading, setLoading] = useState(false);
    const [autoQty, setAutoQty] = useState<boolean>(true);

    const toLocalYMD = (s?: string): string => {
        if (!s) return '';
        // jika s sudah 'YYYY-MM-DD'
        if (s.length >= 10 && s[4] === '-' && s[7] === '-') return s.slice(0, 10);
        const ms = Date.parse(s);           // -> number (milliseconds)
        if (Number.isNaN(ms)) return s.slice(0, 10);
        const d = new Date(ms);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
    };
    const hhmm = (t?: string | null) => (t ? String(t).slice(0, 5) : null);

    const loadDetail = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getWashNote(id);
            const n = res.data;
            setNoteDate(toLocalYMD(n.note_date));
            const mapped = (n.items ?? []).map((it: any) => ({
                order_id: it.order_id,
                number: it.order?.number ?? it.order_id,
                customer: it.order?.customer?.name ?? '',
                qty: Number(it.qty ?? 0),
                process_status: it.process_status ?? undefined,
                started_at: it.started_at ?? null,
                finished_at: it.finished_at ?? null,
                note: it.note ?? null,
            }));
            setItems(mapped);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDetail(); }, [id]);

    const norm = (v?: string) => (v ?? '').trim().toLowerCase();
    const selectedIds = useMemo<Set<string>>(
        () => new Set(items.map(i => norm(i.order_id))),
        [items]
    );
    const selectedNumbers = useMemo<Set<string>>(
        () => new Set(items.map(i => norm(i.number))),
        [items]
    );

    const search = async () => {
        setLoading(true);
        try {
            const od = toLocalYMD(noteDate);
            const res = await searchOrderCandidates({
                query: q,
                date_from: from,
                date_to: to,
                on_date: od,
            });
            const rows = (res.data ?? []) as any[];
            // Saring di sumber data: buang yang sudah dipilih (id maupun number)
            const filtered = rows.filter(o => {
                const oid = norm(String(o.id));
                const onum = norm(String(o.number));
                return !selectedIds.has(oid) && !selectedNumbers.has(onum);
            });
            setCandidates(filtered);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (q.length >= 2) search(); else setCandidates([]);
    }, [q, from, to, noteDate, items]);

    const addItem = (o: any) => {
        const oid = norm(String(o.id));
        const onum = norm(String(o.number));
        // Cegah duplikasi baik via id maupun number
        if (items.some(x => norm(x.order_id) === oid || norm(x.number) === onum)) return;
        const dqty = Number(o?.default_qty ?? 0);
        setItems(prev => [...prev, {
            order_id: o.id,
            number: o.number,
            customer: o.customer?.name ?? '',
            qty: autoQty ? dqty : 0,
            process_status: 'WASH',
        }]);
        setCandidates(prev => prev.filter(c => norm(String(c.id)) !== oid && norm(String(c.number)) !== onum));
    };

    const removeItem = (order_id: string) => {
        setItems(prev => prev.filter(x => x.order_id !== order_id));
        // Refresh kandidat agar order yang dihapus bisa muncul kembali di hasil cari
        if (q.length >= 2) { void search(); }
    };

    const clearSelected = () => setItems([]);

    // Validasi ringan sisi klien
    const invalidQty = useMemo(
        () => items.some(it => isNaN(it.qty as any) || (it.qty as number) < 0),
        [items]
    );
    const invalidTime = useMemo(() => {
        const cmp = (a?: string | null, b?: string | null) => (a && b) ? (a <= b) : true;
        const anyInvalid = items.some(it => {
            const s = it.started_at ?? '';
            const f = it.finished_at ?? '';
            // valid bila salah satu kosong, atau f >= s
            if (!s || !f) return false;
            return !(cmp(s, f));
        });
        return anyInvalid;
    }, [items]);

    const disableSave = items.length === 0 || invalidQty || invalidTime || loading;

    const selectedSummary = useMemo(() => {
        const totalQty = items.reduce((acc, it) => acc + (Number(it.qty) || 0), 0);
        return { count: items.length, totalQty };
    }, [items]);

    const submit = async () => {
        const payload = {
            note_date: noteDate,
            items: items.map(it => ({
                order_id: it.order_id,
                qty: it.qty,
                process_status: it.process_status,
                started_at: it.started_at || null,
                finished_at: it.finished_at || null,
                note: it.note || null,
            })),
        };

        setLoading(true);
        try {
            if (id) {
                await updateWashNote(id, payload);
            } else {
                await createWashNote(payload);
            }
            nav('/wash-notes');
        } catch (err: any) {
            const resp = err?.response;
            const status = resp?.status;
            const data = resp?.data;

            // Tangani 422: catatan harian sudah ada untuk user & tanggal yang sama
            if (status === 422) {
                // 1) Redirect by meta.existing_id
                const existingId = data?.meta?.existing_id;
                if (existingId) {
                    return nav(`/wash-notes/${existingId}/edit`);
                }
                // 2) Fallback: cari catatan di tanggal yang sama
                try {
                    const res = await listWashNotes({ date_from: noteDate, date_to: noteDate, page: 1, per_page: 1 });
                    const existing = res?.data?.[0];
                    if (existing?.id) {
                        return nav(`/wash-notes/${existing.id}/edit`);
                    }
                } catch (e) {
                }
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetSearchDates = () => { setFrom(today); setTo(today); };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-end gap-3">
                {/* Tanggal ditentukan otomatis (default hari ini) dan dapat disesuaikan di backend bila diperlukan */}
                <div className="text-sm text-gray-600">
                    Tanggal catatan: <b>{noteDate}</b>
                </div>
                <button
                    onClick={submit}
                    disabled={disableSave}
                    className={`ml-auto px-3 py-2 rounded text-white ${disableSave ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}
                    title={disableSave ? 'Lengkapi data agar dapat disimpan' : 'Simpan catatan'}
                >
                    {id ? 'Simpan Perubahan' : 'Simpan'}
                </button>
            </div>

            <InfoTipsForm noteDate={noteDate} />

            {(invalidQty || invalidTime) && (
                <div className="rounded border border-red-200 bg-red-50 text-red-700 p-3 text-sm" role="alert" aria-live="polite">
                    {invalidQty && <div>Qty tidak boleh negatif.</div>}
                    {invalidTime && <div>Jam selesai harus lebih besar atau sama dengan jam mulai.</div>}
                </div>
            )}

            <div className="border rounded p-3 space-y-3">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <label className="block text-sm">Cari Order (nomor / pelanggan)</label>
                        <input
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="ketik minimal 2 huruf…"
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>
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
                        onClick={resetSearchDates}
                        className="px-3 py-2 border rounded"
                        title="Kembalikan rentang ke hari ini"
                    >
                        Reset
                    </button>
                    <div className="flex items-center gap-2 text-sm ml-2">
                        <input
                            id="auto-qty"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={autoQty}
                            onChange={e => setAutoQty(e.target.checked)}
                        />
                        <label htmlFor="auto-qty">Auto-isi qty dari order</label>
                    </div>
                </div>

                {candidates.length > 0 && (
                    <div className="border rounded divide-y">
                        {candidates
                            // Saringan tambahan saat render (defensif)
                            .filter(o => !selectedIds.has(norm(String(o.id))) && !selectedNumbers.has(norm(String(o.number))))
                            .map(o => (
                                <div key={o.id} className="p-2 flex items-center gap-3">
                                    <div className="w-56">{o.number}</div>
                                    <div className="flex-1">{o.customer?.name ?? '-'}</div>
                                    <div className="text-sm text-gray-600">
                                        Default qty: <b>{Number(o?.default_qty ?? 0)}</b>
                                    </div>
                                    <button
                                        onClick={() => addItem(o)}
                                        disabled={selectedIds.has(norm(String(o.id))) || selectedNumbers.has(norm(String(o.number)))}
                                        className="text-blue-600 underline disabled:text-gray-400 disabled:no-underline"
                                    >
                                        Tambah
                                    </button>
                                </div>
                            ))}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <div>
                        Terpilih: <b>{selectedSummary.count}</b> order • total qty <b>{selectedSummary.totalQty}</b>
                    </div>
                    {items.length > 0 && (
                        <button type="button" onClick={clearSelected} className="underline text-gray-700">
                            Hapus semua pilihan
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    {items.map((it, idx) => (
                        <div key={it.order_id} className="p-2 border rounded grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-3 text-sm">
                                <div className="font-medium">{it.number}</div>
                                <div className="text-gray-500">{it.customer || '-'}</div>
                            </div>
                            <input
                                className="col-span-2 border rounded px-2 py-1"
                                type="number" min={0} step="0.1"
                                value={it.qty}
                                onChange={e => {
                                    const v = parseFloat(e.target.value || '0');
                                    setItems(prev => prev.map((x, i) => i === idx ? { ...x, qty: isNaN(v) ? 0 : v } : x));
                                }}
                            />
                            <select
                                className="col-span-2 border rounded px-2 py-1"
                                value={it.process_status ?? ''}
                                onChange={e => setItems(prev => prev.map((x, i) => i === idx ? { ...x, process_status: (e.target.value || undefined) as any } : x))}
                            >
                                <option value="">(kosong)</option>
                                <option value="QUEUE">QUEUE</option>
                                <option value="WASH">WASH</option>
                                <option value="DRY">DRY</option>
                                <option value="FINISHING">FINISHING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="PICKED_UP">PICKED_UP</option>
                            </select>
                            <input
                                className="col-span-2 border rounded px-2 py-1"
                                type="time"
                                value={it.started_at ?? ''}
                                onChange={e => {
                                    const v = hhmm(e.target.value);
                                    setItems(prev => prev.map((x, i) => i === idx ? { ...x, started_at: v || null } : x));
                                }}
                            />
                            <input
                                className="col-span-2 border rounded px-2 py-1"
                                type="time"
                                value={it.finished_at ?? ''}
                                onChange={e => {
                                    const v = hhmm(e.target.value);
                                    setItems(prev => prev.map((x, i) => i === idx ? { ...x, finished_at: v || null } : x));
                                }}
                            />
                            <div className="col-span-12 flex gap-2">
                                <input
                                    className="flex-1 border rounded px-2 py-1"
                                    placeholder="Catatan singkat"
                                    value={it.note ?? ''}
                                    onChange={e => setItems(prev => prev.map((x, i) => i === idx ? { ...x, note: e.target.value || null } : x))}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeItem(it.order_id)}
                                    className="px-3 py-1 border rounded text-red-600 border-red-300"
                                    title="Hapus dari daftar"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <div className="text-sm text-gray-500">Belum ada order terpilih.</div>}
                </div>
            </div>
        </div>
    );
}
