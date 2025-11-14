// src/components/orders/OrderPhotos.tsx
import { useMemo, useRef, useState } from "react";
import { uploadOrderPhotos } from "../../api/orderPhotos";

type Props = {
    orderId: string;
    onUploaded?: () => void;
};

type Incoming = { before: File[]; after: File[] };

export default function OrderPhotos({ orderId, onUploaded }: Props) {
    const [files, setFiles] = useState<Incoming>({ before: [], after: [] });
    const [busy, setBusy] = useState(false);
    const beforeRef = useRef<HTMLInputElement>(null);
    const afterRef = useRef<HTMLInputElement>(null);

    // Heuristik ringan: mobile? -> gunakan capture camera
    const isMobile = useMemo(() => {
        const ua = navigator.userAgent.toLowerCase();
        return /android|iphone|ipad|ipod/.test(ua);
    }, []);

    function pick(kind: "before" | "after") {
        (kind === "before" ? beforeRef : afterRef).current?.click();
    }

    function onChange(kind: "before" | "after", list: FileList | null) {
        if (!list) return;
        const arr = Array.from(list);
        setFiles(prev => ({
            ...prev,
            [kind]: [...prev[kind], ...arr],
        }));
    }

    async function onUpload() {
        try {
            setBusy(true);
            await uploadOrderPhotos(orderId, files.before, files.after);
            setFiles({ before: [], after: [] });
            onUploaded?.();
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="rounded-2xl border p-4">
            <div className="text-sm font-semibold mb-3">Order Photos</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <section className="border rounded-xl p-3">
                    <div className="text-xs font-medium mb-2">Before</div>

                    {/* PC: drag & drop; Mobile: tombol kamera */}
                    <div
                        className="border rounded-lg p-4 text-center text-xs"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault();
                            const dropped = Array.from(e.dataTransfer.files || []);
                            setFiles(prev => ({ ...prev, before: [...prev.before, ...dropped] }));
                        }}
                    >
                        {isMobile ? (
                            <button
                                type="button"
                                className="px-3 py-2 rounded-lg border"
                                onClick={() => pick("before")}
                            >
                                Buka Kamera
                            </button>
                        ) : (
                            <>
                                <div className="mb-2">Drop file ke sini atau</div>
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded-lg border"
                                    onClick={() => pick("before")}
                                >
                                    Pilih File
                                </button>
                            </>
                        )}
                    </div>

                    <input
                        ref={beforeRef}
                        type="file"
                        accept="image/*"
                        // KUNCI untuk kamera HP:
                        // capture="environment" akan memicu kamera belakang di banyak mobile browser.
                        // Di desktop, ini diabaikan dan akan buka file chooser.
                        capture={isMobile ? "environment" : undefined}
                        multiple
                        className="hidden"
                        onChange={e => onChange("before", e.target.files)}
                    />

                    {/* Preview ringkas */}
                    {files.before.length > 0 && (
                        <ul className="mt-2 text-xs list-disc pl-5">
                            {files.before.map((f, i) => (
                                <li key={i}>{f.name}</li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="border rounded-xl p-3">
                    <div className="text-xs font-medium mb-2">After</div>

                    <div
                        className="border rounded-lg p-4 text-center text-xs"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault();
                            const dropped = Array.from(e.dataTransfer.files || []);
                            setFiles(prev => ({ ...prev, after: [...prev.after, ...dropped] }));
                        }}
                    >
                        {isMobile ? (
                            <button
                                type="button"
                                className="px-3 py-2 rounded-lg border"
                                onClick={() => pick("after")}
                            >
                                Buka Kamera
                            </button>
                        ) : (
                            <>
                                <div className="mb-2">Drop file ke sini atau</div>
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded-lg border"
                                    onClick={() => pick("after")}
                                >
                                    Pilih File
                                </button>
                            </>
                        )}
                    </div>

                    <input
                        ref={afterRef}
                        type="file"
                        accept="image/*"
                        capture={isMobile ? "environment" : undefined}
                        multiple
                        className="hidden"
                        onChange={e => onChange("after", e.target.files)}
                    />

                    {files.after.length > 0 && (
                        <ul className="mt-2 text-xs list-disc pl-5">
                            {files.after.map((f, i) => (
                                <li key={i}>{f.name}</li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    className="px-3 py-2 rounded-lg border"
                    onClick={onUpload}
                    disabled={busy || (files.before.length === 0 && files.after.length === 0)}
                >
                    {busy ? "Mengunggah..." : "Upload"}
                </button>
                <button
                    type="button"
                    className="px-3 py-2 rounded-lg border"
                    onClick={() => setFiles({ before: [], after: [] })}
                    disabled={busy}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
