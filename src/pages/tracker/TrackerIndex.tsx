import { useEffect, useMemo, useRef, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { getTracker, issueTrackerLink, revokeTrackerLink, searchTracker } from '../../api/tracker';
import { fmtDate, fmtDateTime } from '../../utils/date';
import type { TrackerDetail, TrackerSearchRow } from '../../types/tracker';

function optionLabel(row: TrackerSearchRow): string {
    return `${row.number} — ${row.customer ?? '-'} · ${fmtDate(row.created_at)}`;
}

export default function TrackerIndex() {
    const [query, setQuery] = useState('');
    const [rows, setRows] = useState<TrackerSearchRow[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<TrackerDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [copied, setCopied] = useState(false);

    const boxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onDocClick(event: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
        }

        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    useEffect(() => {
        let alive = true;

        const timer = window.setTimeout(() => {
            searchTracker(query.trim())
                .then((res) => {
                    if (alive) setRows(res.data ?? []);
                })
                .catch((e) => {
                    if (alive) setError(getErrorMessage(e, 'Pencarian gagal'));
                });
        }, 300);

        return () => {
            alive = false;
            window.clearTimeout(timer);
        };
    }, [query]);

    useEffect(() => {
        if (!selectedId) {
            setDetail(null);
            return;
        }

        setError(null);
        setCopied(false);

        getTracker(selectedId)
            .then((res) => setDetail(res.data))
            .catch((e) => setError(getErrorMessage(e, 'Order tidak dapat dibuka')));
    }, [selectedId]);

    const selectedLabel = useMemo(() => {
        const row = rows.find((item) => item.id === selectedId);
        if (row) return optionLabel(row);
        return detail ? `${detail.number} — ${detail.customer ?? '-'}` : '';
    }, [rows, selectedId, detail]);

    async function handleIssueLink() {
        if (!detail) return;

        setBusy(true);

        try {
            const res = await issueTrackerLink(detail.id);
            const url = res.data?.tracker_url ?? null;

            setDetail({
                ...detail,
                tracker_url: url,
                token_expires_at: res.data?.token_expires_at ?? null,
            });

            if (url) {
                await navigator.clipboard.writeText(url);
                setCopied(true);
            }
        } catch (e) {
            setError(getErrorMessage(e, 'Gagal membuat link customer'));
        } finally {
            setBusy(false);
        }
    }

    async function handleRevokeLink() {
        if (!detail) return;

        setBusy(true);

        try {
            await revokeTrackerLink(detail.id);
            setDetail({ ...detail, tracker_url: null, token_expires_at: null });
            setCopied(false);
        } catch (e) {
            setError(getErrorMessage(e, 'Gagal mencabut link'));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="card">
            <div className="card-title">
                Tracker Order
                <span className="ct-note">pilih nomor order untuk melihat riwayat perjalanannya</span>
            </div>

            <div className="field" style={{ maxWidth: 440, marginTop: 12 }}>
                <label htmlFor="trkOrder">Nomor Order</label>
                <div className={open ? 'ss open' : 'ss'} ref={boxRef}>
                    <button
                        type="button"
                        id="trkOrder"
                        className="ss-display"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <span className={selectedLabel ? 'ss-label' : 'ss-label ph'}>
                            {selectedLabel || 'cari no order / pelanggan...'}
                        </span>
                        <span className="ss-caret" />
                    </button>

                    <div className="ss-pop">
                        <input
                            type="text"
                            className="ss-search"
                            value={query}
                            placeholder="Cari..."
                            autoComplete="off"
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="ss-list" role="listbox">
                            {rows.length === 0 ? (
                                <div className="ss-empty">Tidak ada hasil</div>
                            ) : (
                                rows.map((row) => (
                                    <div
                                        key={row.id}
                                        role="option"
                                        aria-selected={row.id === selectedId}
                                        className={row.id === selectedId ? 'ss-opt sel' : 'ss-opt'}
                                        onClick={() => {
                                            setSelectedId(row.id);
                                            setOpen(false);
                                        }}
                                    >
                                        {optionLabel(row)}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div role="alert" className="mini" style={{ color: 'var(--danger)', marginTop: 12 }}>
                    {error}
                </div>
            ) : null}

            {!detail ? (
                <div className="mini" style={{ marginTop: 16 }}>
                    Pilih nomor order di atas untuk melihat riwayatnya.
                </div>
            ) : (
                <>
                    <div className="trk-pos">
                        <div className="mini" style={{ color: '#cbd5e1' }}>
                            Posisi saat ini · {detail.number} · {detail.customer ?? '-'}
                        </div>
                        <div className="trk-pos-v">
                            <span className={`chip ${detail.position.tone}`}>{detail.position.label}</span>
                            {detail.position.suffix ? ` · ${detail.position.suffix}` : null}
                        </div>
                        {detail.deadline ? (
                            <div className="mini" style={{ color: '#cbd5e1', marginTop: 4 }}>
                                Deadline: {fmtDate(detail.deadline)}
                            </div>
                        ) : null}
                    </div>

                    <div className="card-title" style={{ marginTop: 18 }}>
                        Riwayat
                        <span className="ct-note">
                            {detail.tracker_url ? `link customer aktif s/d ${fmtDate(detail.token_expires_at)}` : ''}
                            <button
                                type="button"
                                className="btn-outline"
                                style={{ marginLeft: 10 }}
                                disabled={busy}
                                onClick={handleIssueLink}
                            >
                                {detail.tracker_url ? 'Buat ulang & salin link' : 'Buat & salin link'}
                            </button>
                            {detail.tracker_url ? (
                                <button
                                    type="button"
                                    className="btn-outline"
                                    style={{ marginLeft: 6 }}
                                    disabled={busy}
                                    onClick={handleRevokeLink}
                                >
                                    Cabut
                                </button>
                            ) : null}
                            {copied ? <span style={{ marginLeft: 8, color: 'var(--ok)' }}>tersalin</span> : null}
                        </span>
                    </div>

                    <div className="timeline">
                        {detail.timeline.map((event) => (
                            <div
                                key={`${event.at}-${event.title}`}
                                className={event.danger ? 'tl-item tl-danger' : 'tl-item'}
                            >
                                <div className="tl-dot" />
                                <div className="tl-c">
                                    <div className="tl-t">
                                        {event.title}
                                        <span className="tl-time">{fmtDateTime(event.at)}</span>
                                    </div>
                                    {event.detail || event.actor ? (
                                        <div className="tl-d">
                                            {[event.detail, event.actor && `oleh ${event.actor}`]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
