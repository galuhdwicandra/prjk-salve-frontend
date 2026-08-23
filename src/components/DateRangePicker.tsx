import { useEffect, useRef, useState } from 'react';
import { fmtDate, localYMD, rangeFor, todayLocalYMD } from '../utils/date';
import type { DateRangeKey } from '../utils/date';

const PRESETS: { key: DateRangeKey; label: string }[] = [
  { key: 'today', label: 'Hari ini' },
  { key: 'yesterday', label: 'Kemarin' },
  { key: 'week', label: 'Minggu ini' },
  { key: 'month', label: 'Bulan ini' },
  { key: 'lastmonth', label: 'Bulan lalu' },
  { key: 'last7', label: '7 Hari terakhir' },
  { key: 'last30', label: '30 Hari terakhir' },
  { key: 'year', label: 'Tahun ini' },
  { key: 'lastyear', label: 'Tahun lalu' },
];

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type Props = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

function monthOf(value: string): Date {
  const base = value || todayLocalYMD();
  return new Date(Number(base.slice(0, 4)), Number(base.slice(5, 7)) - 1, 1);
}

function cellsOf(month: Date): Date[] {
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
  return Array.from(
    { length: 42 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
}

function headOf(month: Date): string {
  return month.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

export default function DateRangePicker({ from, to, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(() => monthOf(from));
  const [pending, setPending] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnchor(monthOf(from));
  }, [from]);

  useEffect(() => {
    if (!open) return;

    const close = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setPending(null);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  function commit(start: string, end: string) {
    setPending(null);
    setOpen(false);
    onChange(start, end);
  }

  function pick(day: Date) {
    const value = localYMD(day);

    if (!pending) {
      setPending(value);
      return;
    }

    commit(pending <= value ? pending : value, pending <= value ? value : pending);
  }

  function shift(months: number) {
    setAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() + months, 1));
  }

  const lo = pending ?? from;
  const hi = pending ?? to;

  function calendar(month: Date) {
    return (
      <div className="drp-cal" key={month.getTime()}>
        <div className="drp-mhead">{headOf(month)}</div>
        <div className="drp-dow">
          {DOW.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="drp-grid">
          {cellsOf(month).map((day) => {
            const value = localYMD(day);
            const classes = ['drp-day'];

            if (day.getMonth() !== month.getMonth()) classes.push('out');
            if (value === lo || value === hi) classes.push('edge');
            else if (value > lo && value < hi) classes.push('in');

            return (
              <button type="button" key={value} className={classes.join(' ')} onClick={() => pick(day)}>
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={open ? 'drp open' : 'drp'} ref={boxRef}>
      <button type="button" className="drp-btn" onClick={() => setOpen((prev) => !prev)}>
        <span className="drp-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
        {fmtDate(from)} {'\u2013'} {fmtDate(to)}
      </button>

      <div className="drp-pop">
        <div className="drp-presets">
          {PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.key}
              className="drp-pre"
              onClick={() => {
                const [start, end] = rangeFor(preset.key);
                commit(start, end);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="drp-main">
          <div className="drp-two">
            <button type="button" className="drp-arrow" aria-label="Bulan sebelumnya" onClick={() => shift(-1)}>
              {'\u2039'}
            </button>
            {calendar(anchor)}
            {calendar(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))}
            <button type="button" className="drp-arrow" aria-label="Bulan berikutnya" onClick={() => shift(1)}>
              {'\u203a'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
