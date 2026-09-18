import { useEffect, useRef, useState } from 'react';
import { IoModal } from '../../components/DataIoModals';
import { listAccountingAccounts } from '../../api/accounting';
import { getErrorMessage } from '../../api/client';
import DateRangePicker from '../../components/DateRangePicker';
import type { AccountingAccount } from '../../types/accounting';
import { rangeFor } from '../../utils/date';
import { IconDownload } from '../users/icons';

type IoChooserProps = {
    mode: 'import' | 'export';
    onPickAccounts: () => void;
    onPickMutasi: () => void;
    onClose: () => void;
};

export function IoChooser({ mode, onPickAccounts, onPickMutasi, onClose }: IoChooserProps) {
    const label = mode === 'import' ? 'Import' : 'Export';

    return (
        <IoModal title={`${label} Data`} onClose={onClose}>
            <p className="mini" style={{ marginBottom: 14 }}>
                Pilih data yang ingin di-{label.toLowerCase()}.
            </p>

            <button type="button" className="txn-choice" onClick={onPickAccounts}>
                <b>Kas &amp; Bank</b>
                <span>Daftar akun kas &amp; bank</span>
            </button>

            {mode === 'export' ? (
                <button type="button" className="txn-choice" onClick={onPickMutasi}>
                    <b>Ekspor Mutasi</b>
                    <span>Mutasi transaksi per rekening (pilih rekening &amp; periode)</span>
                </button>
            ) : null}
        </IoModal>
    );
}

type AccountMultiSelectProps = {
    options: AccountingAccount[];
    value: string[];
    onChange: (value: string[]) => void;
};

function AccountMultiSelect({ options, value, onChange }: AccountMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const boxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onDocClick(event: MouseEvent) {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
        }

        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    const keyword = q.trim().toLowerCase();
    const filtered = keyword ? options.filter((option) => option.name.toLowerCase().includes(keyword)) : options;
    const picked = options.filter((option) => value.includes(option.id));

    function toggle(id: string) {
        onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
    }

    return (
        <div className={open ? 'ss ms open' : 'ss ms'} ref={boxRef}>
            <div
                className="ss-display"
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((prev) => !prev);
                    }
                }}
            >
                <span className="ms-chips">
                    {picked.length === 0 ? (
                        <span className="ss-label ph">cari &amp; pilih rekening...</span>
                    ) : (
                        picked.map((option) => (
                            <span key={option.id} className="ms-chip">
                                {option.name}
                                <button
                                    type="button"
                                    aria-label={`Hapus ${option.name}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggle(option.id);
                                    }}
                                >
                                    {'\u00D7'}
                                </button>
                            </span>
                        ))
                    )}
                </span>
                <span className="ss-caret" />
            </div>

            <div className="ss-pop">
                <input
                    type="text"
                    className="ss-search"
                    value={q}
                    placeholder="Cari..."
                    autoComplete="off"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setQ(e.target.value)}
                />

                <div className="ss-list" role="listbox" aria-multiselectable="true">
                    {filtered.length === 0 ? (
                        <div className="ss-empty">Tidak ada hasil</div>
                    ) : (
                        filtered.map((option) => {
                            const on = value.includes(option.id);

                            return (
                                <div
                                    key={option.id}
                                    role="option"
                                    aria-selected={on}
                                    className={on ? 'ss-opt sel' : 'ss-opt'}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggle(option.id);
                                    }}
                                >
                                    <span className="msck">{on ? '\u2713' : ''}</span> {option.name}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

type ExportMutasiModalProps = {
    busy: boolean;
    onSubmit: (accounts: AccountingAccount[], from: string, to: string) => void;
    onClose: () => void;
};

export function ExportMutasiModal({ busy, onSubmit, onClose }: ExportMutasiModalProps) {
    const [defaultFrom, defaultTo] = rangeFor('month');

    const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
    const [picked, setPicked] = useState<string[]>([]);
    const [from, setFrom] = useState(defaultFrom);
    const [to, setTo] = useState(defaultTo);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        void (async () => {
            try {
                const res = await listAccountingAccounts({ is_cash_account: true, is_active: true, per_page: 200 });
                if (alive) setAccounts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                if (alive) setError(getErrorMessage(err, 'Gagal memuat daftar rekening'));
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const selected = picked.length ? accounts.filter((account) => picked.includes(account.id)) : accounts;

    return (
        <IoModal title="Ekspor Mutasi" onClose={onClose}>
            {error ? (
                <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
                    {error}
                </div>
            ) : null}

            <div className="field">
                <label>
                    Pilih Rekening <span className="mini">(bisa lebih dari satu)</span>
                </label>

                <AccountMultiSelect options={accounts} value={picked} onChange={setPicked} />
            </div>

            <div className="field">
                <label>Periode</label>
                <DateRangePicker
                    from={from}
                    to={to}
                    onChange={(nextFrom, nextTo) => {
                        setFrom(nextFrom);
                        setTo(nextTo);
                    }}
                />
            </div>

            <div className="mini" style={{ marginBottom: 14 }}>
                Tidak memilih rekening = semua rekening.
            </div>

            <button
                type="button"
                className="btn block"
                disabled={busy || selected.length === 0}
                onClick={() => onSubmit(selected, from, to)}
            >
                <IconDownload />
                <span>{busy ? 'Menyiapkan\u2026' : 'Ekspor Mutasi'}</span>
            </button>
        </IoModal>
    );
}
