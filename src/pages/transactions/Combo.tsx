import { useEffect, useMemo, useRef, useState } from 'react';

export type ComboOption = { value: string; label: string; hint?: string };

type Props = {
  value: string;
  options: ComboOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  addLabel?: string;
  onAdd?: () => void;
  onChange: (value: string) => void;
};

export default function Combo({
  value,
  options,
  placeholder = 'cari\u2026',
  searchPlaceholder = 'Cari\u2026',
  addLabel,
  onAdd,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  const selected = options.find((option) => option.value === value) ?? null;

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return options;

    return options.filter((option) => `${option.label} ${option.hint ?? ''}`.toLowerCase().includes(keyword));
  }, [options, q]);

  return (
    <div className="combo" ref={boxRef}>
      <button
        type="button"
        className={open ? 'combo-btn open' : 'combo-btn'}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((prev) => !prev);
          setQ('');
        }}
      >
        <span className={selected ? '' : 'combo-ph'}>{selected ? selected.label : placeholder}</span>
        <i className="combo-caret" />
      </button>

      {open ? (
        <div className="combo-pop" role="listbox">
          <input autoFocus type="search" value={q} placeholder={searchPlaceholder} onChange={(e) => setQ(e.target.value)} />

          <div className="combo-list">
            {filtered.length === 0 ? <div className="combo-empty">Tidak ada hasil.</div> : null}

            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={option.value === value ? 'combo-item on' : 'combo-item'}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.hint ? <small>{option.hint}</small> : null}
              </button>
            ))}
          </div>

          {addLabel && onAdd ? (
            <button
              type="button"
              className="combo-add"
              onClick={() => {
                setOpen(false);
                onAdd();
              }}
            >
              {addLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
