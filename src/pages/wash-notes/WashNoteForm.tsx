// src/pages/wash-notes/WashNoteForm.tsx
import { useEffect, useMemo, useState } from 'react';
import { createWashNote, updateWashNote, getWashNote, searchOrderCandidates, listWashNotes } from '../../api/washNotes';
import { useNavigate, useParams } from 'react-router-dom';
import { todayLocalYMD, toLocalYMD } from '../../utils/date';

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
        <aside className="card rounded-lg border border-[color:var(--color-border)] bg-[var(--color-surface)] shadow-elev-1">
            <div className="flex items-center justify-between p-3">
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
                <div id="wash-tips-form" className="px-3 pb-3 text-sm leading-relaxed">
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

    const [noteDate, setNoteDate] = useState(() => todayLocalYMD());
    const [items, setItems] = useState<ItemDraft[]>([]);
    const [q, setQ] = useState('');
    const [candidates, setCandidates] = useState<any[]>([]);
    const today = todayLocalYMD();
    const [from, setFrom] = useState<string>(today);
    const [to, setTo] = useState<string>(today);
    const [loading, setLoading] = useState(false);
    const [autoQty, setAutoQty] = useState<boolean>(true);

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
                exclude_note_id: id || undefined,
            });
            const rows = (res.data ?? []) as any[];
            const filtered = rows.filter(o => {
                const oid = norm(String(o.id));
                const onum = norm(String(o.number));
                return !selectedIds.has(oid) && !selectedNumbers.has(onum);
            });
            setCandidates(filtered);
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
        if (q.length >= 2) { void search(); }
    };

    const clearSelected = () => setItems([]);

    const invalidQty = useMemo(
        () => items.some(it => isNaN(it.qty as any) || (it.qty as number) < 0),
        [items]
    );
    const invalidTime = useMemo(() => {
        const cmp = (a?: string | null, b?: string | null) => (a && b) ? (a <= b) : true;
        const anyInvalid = items.some(it => {
            const s = it.started_at ?? '';
            const f = it.finished_at ?? '';
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

            if (status === 422) {
                const existingId = data?.meta?.existing_id;
                if (existingId) {
                    return nav(`/wash-notes/${existingId}/edit`);
                }
                try {
                    const res = await listWashNotes({ date_from: noteDate, date_to: noteDate, page: 1, per_page: 1 });
                    const existing = res?.data?.[0];
                    if (existing?.id) {
                        return nav(`/wash-notes/${existing.id}/edit`);
                    }
                } catch { }
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetSearchDates = () => { setFrom(today); setTo(today); };

    return (
        <div className="space-y-4">
            {/* Header + Save */}
            <div className="flex items-end gap-3">
                <div>
                    <label className="block text-xs mb-1" htmlFor="noteDate">Tanggal catatan</label>
                    <input
                        id="noteDate"
                        type="date"
                        className="input py-2"
                        value={noteDate}
                        onChange={e => setNoteDate(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setNoteDate(todayLocalYMD())}
                    title="Set ke hari ini"
                >
                    Hari ini
                </button>
                <button
                    onClick={submit}
                    disabled={disableSave}
                    className={`ml-auto ${disableSave ? 'btn-outline opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                    title={disableSave ? 'Lengkapi data agar dapat disimpan' : 'Simpan catatan'}
                >
                    {id ? 'Simpan Perubahan' : 'Simpan'}
                </button>
            </div>

            <InfoTipsForm noteDate={noteDate} />

            {(invalidQty || invalidTime) && (
                <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm" role="alert" aria-live="polite">
                    {invalidQty && <div>Qty tidak boleh negatif.</div>}
                    {invalidTime && <div>Jam selesai harus lebih besar atau sama dengan jam mulai.</div>}
                </div>
            )}

            {/* Toolbar Pencarian */}
            <section className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1" aria-label="Pencarian order kandidat">
                <div className="p-3 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-2">
                    <div className="relative">
                        <label className="sr-only" htmlFor="q">Cari Order</label>
                        <input
                            id="q"
                            value={q}
                            onChange={e => { setQ(e.target.value); }}
                            placeholder="Cari Order (nomor / pelanggan)… (min 2 huruf)"
                            className="input w-full pl-9 py-2"
                        />
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
                    </div>

                    <div>
                        <label className="block text-xs mb-1" htmlFor="from">Dari</label>
                        <input
                            id="from"
                            type="date"
                            className="input py-2"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs mb-1" htmlFor="to">Sampai</label>
                        <input
                            id="to"
                            type="date"
                            className="input py-2"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={resetSearchDates}
                        className="btn-outline h-10 self-end"
                        title="Kembalikan rentang ke hari ini"
                    >
                        Reset
                    </button>

                    <div className="flex items-center gap-2 self-end">
                        <input
                            id="auto-qty"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={autoQty}
                            onChange={e => setAutoQty(e.target.checked)}
                        />
                        <label htmlFor="auto-qty" className="text-sm">Auto-isi qty dari order</label>
                    </div>
                </div>
            </section>

            {/* Kandidat (TABLE – gaya sama dengan CustomersIndex) */}
            <section aria-busy={loading ? 'true' : 'false'}>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-[720px] w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    <Th>Kode Order</Th>
                                    <Th>Pelanggan</Th>
                                    <Th className="text-right">Default Qty</Th>
                                    <Th className="text-right pr-4">Aksi</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--color-border)]">
                                {loading ? (
                                    <>
                                        <RowSkeleton cols={[160, 240, 80, 100]} />
                                        <RowSkeleton cols={[160, 240, 80, 100]} />
                                        <RowSkeleton cols={[160, 240, 80, 100]} />
                                    </>
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-4 text-center text-gray-500">Tidak ada kandidat. Ketik minimal 2 huruf untuk mencari.</td>
                                    </tr>
                                ) : (
                                    candidates
                                        .filter(o => !selectedIds.has(norm(String(o.id))) && !selectedNumbers.has(norm(String(o.number))))
                                        .map(o => (
                                            <tr key={o.id} className="hover:bg-black/5 transition-colors">
                                                <Td className="font-medium">{o.number}</Td>
                                                <Td>{o.customer?.name ?? '-'}</Td>
                                                <Td className="text-right tabular-nums">{Number(o?.default_qty ?? 0)}</Td>
                                                <Td className="text-right">
                                                    <button
                                                        onClick={() => addItem(o)}
                                                        disabled={selectedIds.has(norm(String(o.id))) || selectedNumbers.has(norm(String(o.number)))}
                                                        className="btn-outline disabled:opacity-50"
                                                    >
                                                        Tambah
                                                    </button>
                                                </Td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Ringkas pilihan */}
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

            {/* Items terpilih (TABLE – gaya sama dengan CustomersIndex) */}
            <section>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-[980px] w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    <Th>Order</Th>
                                    <Th>Pelanggan</Th>
                                    <Th className="text-right">Qty</Th>
                                    <Th>Status</Th>
                                    <Th>Mulai</Th>
                                    <Th>Selesai</Th>
                                    <Th>Catatan</Th>
                                    <Th className="text-right pr-4">Aksi</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--color-border)]">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-3 py-4 text-center text-gray-500">Belum ada order terpilih.</td>
                                    </tr>
                                ) : (
                                    items.map((it, idx) => (
                                        <tr key={it.order_id} className="hover:bg-black/5 transition-colors">
                                            <Td className="font-medium">{it.number}</Td>
                                            <Td><span className="line-clamp-1 max-w-[40ch]">{it.customer || '-'}</span></Td>
                                            <Td className="text-right">
                                                <input
                                                    className="input w-24 text-right"
                                                    type="number"
                                                    min={0}
                                                    step={1}               // integer agar tidak muncul .00
                                                    value={it.qty}
                                                    onChange={e => {
                                                        const v = parseFloat(e.target.value || '0');
                                                        setItems(prev => prev.map((x, i) => i === idx ? { ...x, qty: isNaN(v) ? 0 : v } : x));
                                                    }}
                                                />
                                            </Td>
                                            <Td>
                                                <select
                                                    className="input"
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
                                            </Td>
                                            <Td>
                                                <input
                                                    className="input w-28"
                                                    type="time"
                                                    value={it.started_at ?? ''}
                                                    onChange={e => {
                                                        const v = hhmm(e.target.value);
                                                        setItems(prev => prev.map((x, i) => i === idx ? { ...x, started_at: v || null } : x));
                                                    }}
                                                />
                                            </Td>
                                            <Td>
                                                <input
                                                    className="input w-28"
                                                    type="time"
                                                    value={it.finished_at ?? ''}
                                                    onChange={e => {
                                                        const v = hhmm(e.target.value);
                                                        setItems(prev => prev.map((x, i) => i === idx ? { ...x, finished_at: v || null } : x));
                                                    }}
                                                />
                                            </Td>
                                            <Td>
                                                <input
                                                    className="input w-[24rem] max-w-[48ch]"
                                                    placeholder="Catatan singkat"
                                                    value={it.note ?? ''}
                                                    onChange={e => setItems(prev => prev.map((x, i) => i === idx ? { ...x, note: e.target.value || null } : x))}
                                                />
                                            </Td>
                                            <Td className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(it.order_id)}
                                                    className="btn-outline text-red-600 border-red-300"
                                                    title="Hapus dari daftar"
                                                >
                                                    Hapus
                                                </button>
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

/* ---------- Subcomponents (tabel konsisten) ---------- */
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
function RowSkeleton({ cols = [160, 240, 100, 100] }: { cols?: number[] }) {
    return (
        <tr>
            {cols.map((w, i) => (
                <td key={i} className="px-3 py-3">
                    <div className="h-4 rounded bg-black/10 animate-pulse" style={{ width: `${w}px` }} />
                </td>
            ))}
        </tr>
    );
}
