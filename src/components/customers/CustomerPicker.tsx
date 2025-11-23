// src/components/customers/CustomerPicker.tsx
import React, { useEffect, useMemo, useRef, useState, useId } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const listboxId = useId();

  function isCustomerLite(u: unknown): u is CustomerLite {
    if (!u || typeof u !== "object") return false;
    const o = u as UnknownObj;
    return typeof o.id === "string" && typeof o.name === "string";
  }

  function extractRows(u: unknown): unknown[] {
    if (Array.isArray(u)) return u;
    if (u && typeof u === "object") {
      const o = u as UnknownObj;
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
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    timerRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await listCustomers({ q: query, per_page: 8 });
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
        setActiveIndex(items.length > 0 ? 0 : -1);
      } catch {
        setList([]);
        setOpen(false);
        setActiveIndex(-1);
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
  const displayText = selectedLabel || query;

  function pick(c: CustomerLite) {
    setSelectedLabel(c.name);
    setQuery(c.name);
    onChange(c.id);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function clearSelection() {
    setSelectedLabel("");
    setQuery("");
    onChange("");
    setList([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setActiveIndex((idx) => (idx === -1 && list.length ? 0 : idx));
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (list.length ? (prev + 1) % list.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (list.length ? (prev - 1 + list.length) % list.length : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && list[activeIndex]) pick(list[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <div className="flex items-center gap-2">
        <div className="relative grow">
          <input
            ref={inputRef}
            className="input w-full pl-9 py-2"
            value={displayText}
            onChange={(e) => {
              setSelectedLabel("");
              onChange(""); // reset id saat user mulai mengetik lagi
              setQuery(e.target.value);
            }}
            placeholder={placeholder}
            onFocus={() => { if (list.length > 0) setOpen(true); }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? `listbox-${listboxId}` : undefined}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-activedescendant={
              open && activeIndex >= 0 ? `option-${listboxId}-${list[activeIndex]?.id}` : undefined
            }
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔎
          </span>
        </div>

        {value && (
          <button
            type="button"
            className="btn-outline text-xs px-2 py-1"
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
        <div
          className="absolute z-20 mt-1 w-full rounded-lg border border-[color:var(--color-border)] bg-white shadow-elev-2 overflow-hidden"
          role="listbox"
          id={`listbox-${listboxId}`}
        >
          {loading && (
            <div className="px-3 py-2 text-sm flex items-center gap-2 opacity-70">
              <span className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black/60 animate-spin" />
              Mencari…
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="px-3 py-2 text-sm opacity-70">Tidak ada hasil</div>
          )}

          {!loading && list.length > 0 && (
            <ul className="max-h-64 overflow-auto">
              {list.map((c, idx) => {
                const active = idx === activeIndex;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      id={`option-${listboxId}-${c.id}`}
                      role="option"
                      aria-selected={value === c.id || active}
                      className={`w-full text-left px-3 py-2 transition-colors ${
                        active ? "bg-[#E6EDFF]" : "hover:bg-black/5"
                      }`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => e.preventDefault()} // cegah blur sebelum click
                      onClick={() => pick(c)}
                    >
                      <div className="text-sm font-medium">
                        {highlight(c.name, query)}
                      </div>
                      {(c.whatsapp || c.address) && (
                        <div className="text-[11px] opacity-70">
                          {c.whatsapp ? <>WA: {highlight(c.whatsapp, query)}</> : null}
                          {c.whatsapp && c.address ? " • " : ""}
                          {c.address ? <>{highlight(c.address, query)}</> : null}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Utils ---------- */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function highlight(text?: string | null, q?: string) {
  if (!text) return null;
  if (!q || q.length < 2) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="bg-[#E6EDFF] px-0.5 rounded">{part}</mark>
      : <span key={i}>{part}</span>
  );
}
