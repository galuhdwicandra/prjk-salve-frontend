import React, { useEffect, useMemo, useRef, useState } from "react";
import { listCustomers } from "../../api/customers";

type Props = {
    /** id pelanggan terpilih (untuk form/submit) */
    value: string | "";
    /** callback saat id berubah */
    onChange: (id: string | "") => void;
    /** placeholder input */
    placeholder?: string;
    /** opsional: tampilkan teks kecil error bila wajib */
    requiredText?: string;
};

type CustomerLite = {
    id: string;
    name: string;
    whatsapp?: string | null;
    address?: string | null;
};

type UnknownObj = Record<string, unknown>;

export default function CustomerPicker({
    value,
    onChange,
    placeholder = "Cari nama/WA/alamat pelanggan...",
    requiredText,
}: Props): React.ReactElement {
    const [query, setQuery] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<CustomerLite[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>("");

    const boxRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);

    function isCustomerLite(u: unknown): u is CustomerLite {
        if (!u || typeof u !== "object") return false;
        const o = u as UnknownObj;
        return typeof o.id === "string" && typeof o.name === "string";
    }

    function extractRows(u: unknown): unknown[] {
        if (Array.isArray(u)) return u;
        if (u && typeof u === "object") {
            const o = u as UnknownObj;
            // bentuk umum: { data: [...] } atau { items: [...] } atau { data: { data: [...] } }
            if (Array.isArray(o.data)) return o.data as unknown[];
            if (Array.isArray(o.items)) return o.items as unknown[];
            if (o.data && typeof o.data === "object" && Array.isArray((o.data as UnknownObj).data)) {
                return ((o.data as UnknownObj).data as unknown[]);
            }
        }
        return [];
    }

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    // Debounce pencarian
    useEffect(() => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        if (!query || query.length < 2) {
            setList([]);
            return;
        }
        timerRef.current = window.setTimeout(async () => {
            setLoading(true);
            try {
                const res = await listCustomers({ q: query, per_page: 8 });

                // Normalisasi bentuk respons tanpa any
                const rowsUnknown = extractRows(res as unknown);
                const items: CustomerLite[] = rowsUnknown
                    .map((r) => {
                        if (!isCustomerLite(r)) return null;
                        const o = r as UnknownObj;
                        return {
                            id: String(o.id),
                            name: String(o.name),
                            whatsapp: o.whatsapp ? String(o.whatsapp) : null,
                            address: o.address ? String(o.address) : null,
                        } as CustomerLite;
                    })
                    .filter((x): x is CustomerLite => x !== null);

                setList(items);
                setOpen(true);
            } catch {
                setList([]);
                setOpen(false);
            } finally {
                setLoading(false);
            }
        }, 300) as unknown as number;
    }, [query]);

    // Jika parent reset value → kosongkan label
    useEffect(() => {
        if (!value) setSelectedLabel("");
    }, [value]);

    const showHelper = useMemo(() => !value && !!requiredText, [value, requiredText]);

    function pick(c: CustomerLite) {
        setSelectedLabel(c.name);
        setQuery(c.name);
        onChange(c.id);
        setOpen(false);
    }

    function clearSelection() {
        setSelectedLabel("");
        setQuery("");
        onChange("");
        setList([]);
        setOpen(false);
    }

    const displayText = selectedLabel || query;

    return (
        <div className="relative" ref={boxRef}>
            <div className="flex items-center gap-2">
                <input
                    className="border rounded px-3 py-2 w-full"
                    value={displayText}
                    onChange={(e) => {
                        setSelectedLabel("");
                        onChange(""); // reset id saat user mulai mengetik lagi
                        setQuery(e.target.value);
                    }}
                    placeholder={placeholder}
                    onFocus={() => {
                        if (list.length > 0) setOpen(true);
                    }}
                />
                {value && (
                    <button
                        type="button"
                        className="text-xs border rounded px-2 py-1"
                        onClick={clearSelection}
                        title="Bersihkan pilihan"
                    >
                        ×
                    </button>
                )}
            </div>

            {showHelper && (
                <div className="text-[11px] text-red-600 mt-1">{requiredText}</div>
            )}

            {open && (
                <div className="absolute z-20 mt-1 w-full rounded border bg-white shadow">
                    {loading && <div className="px-3 py-2 text-sm opacity-70">Mencari…</div>}
                    {!loading && list.length === 0 && (
                        <div className="px-3 py-2 text-sm opacity-70">Tidak ada hasil</div>
                    )}
                    {!loading &&
                        list.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                onClick={() => pick(c)}
                            >
                                <div className="text-sm font-medium">{c.name}</div>
                                {(c.whatsapp || c.address) && (
                                    <div className="text-[11px] opacity-70">
                                        {c.whatsapp ? `WA: ${c.whatsapp}` : ""}
                                        {c.whatsapp && c.address ? " • " : ""}
                                        {c.address ? `${c.address}` : ""}
                                    </div>
                                )}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}
