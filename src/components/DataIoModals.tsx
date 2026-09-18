import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { downloadXlsx, runExportJob } from '../utils/export-table';
import type { ExportJob } from '../utils/export-table';
import { IconFile } from '../pages/users/icons';

export type ImportColumn = [string, string];

type IoModalProps = {
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export function IoModal({ title, onClose, children }: IoModalProps) {
    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={title}>
            <div className="box">
                <div className="modal-head">
                    <h3>{title}</h3>
                    <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
                        {'\u2715'}
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

type ExportFormatModalProps = {
    note?: ReactNode;
    busy?: boolean;
    onPick: (format: 'xlsx' | 'pdf') => void;
    onClose: () => void;
};

export function ExportFormatModal({ note, busy = false, onPick, onClose }: ExportFormatModalProps) {
    return (
        <IoModal title="Pilih Format Export" onClose={onClose}>
            {note ? (
                <p className="mini" style={{ marginBottom: 14 }}>
                    {note}
                </p>
            ) : null}

            <button type="button" className="txn-choice" disabled={busy} onClick={() => onPick('xlsx')}>
                <b>Export ke Excel</b>
                <span>Berkas .xlsx untuk diolah lebih lanjut</span>
            </button>

            <button type="button" className="txn-choice" disabled={busy} onClick={() => onPick('pdf')}>
                <b>Export ke PDF</b>
                <span>Berkas siap cetak / dibagikan</span>
            </button>
        </IoModal>
    );
}

type ExportJobModalProps = {
    job: ExportJob;
    onClose: () => void;
    onError: (message: string) => void;
};

export function ExportJobModal({ job, onClose, onError }: ExportJobModalProps) {
    return (
        <ExportFormatModal
            note={`${Math.max(0, job.aoa.length - 1)} baris data. \u00B7 ${job.subtitle}`}
            onClose={onClose}
            onPick={(format) => {
                const message = runExportJob(job, format);

                if (message) onError(message);
                onClose();
            }}
        />
    );
}

type ImportModalProps = {
    title: string;
    templateName: string;
    columns: ImportColumn[];
    example: unknown[];
    busy: boolean;
    onFile: (file: File) => void;
    onClose: () => void;
};

export function ImportModal({
    title,
    templateName,
    columns,
    example,
    busy,
    onFile,
    onClose,
}: ImportModalProps) {
    const [drag, setDrag] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    function pick(file: File | undefined) {
        if (file && !busy) onFile(file);
    }

    return (
        <IoModal title={`Import ${title}`} onClose={onClose}>
            <p className="mini" style={{ marginBottom: 12 }}>
                Unduh template dulu untuk melihat formatnya (baris pertama sudah berisi contoh), lalu isi dan unggah.
                Bisa juga langsung tarik dan lepas berkas di bawah.
            </p>

            <button
                type="button"
                className="btn ghost sm"
                style={{ marginBottom: 14 }}
                onClick={() => downloadXlsx(templateName, 'Data', [columns.map(([column]) => column), example])}
            >
                <IconFile />
                <span>Unduh Template</span>
            </button>

            <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.csv,text/csv"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    pick(file);
                }}
            />

            <div
                className={drag ? 'dropzone drag' : 'dropzone'}
                role="button"
                tabIndex={0}
                onClick={() => {
                    if (!busy) fileRef.current?.click();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click();
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    pick(e.dataTransfer.files?.[0]);
                }}
            >
                <b>{busy ? 'Memproses berkas\u2026' : 'Tarik dan lepas berkas di sini'}</b>
                <div className="mini" style={{ marginTop: 4 }}>
                    atau klik untuk memilih berkas (.xlsx / .csv)
                </div>
            </div>

            <div className="mini" style={{ marginTop: 14, fontWeight: 800, color: 'var(--ink)' }}>
                Panduan kolom
            </div>

            <table className="imp-legend">
                <tbody>
                    {columns.map(([column, note]) => (
                        <tr key={column}>
                            <td className="k">{column}</td>
                            <td>{note || '\u2014'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </IoModal>
    );
}
