// src/utils/date.ts
export type DateRangeKey =
  | 'today'
  | 'yesterday'
  | 'week'
  | 'month'
  | 'lastmonth'
  | 'last7'
  | 'last30'
  | 'year'
  | 'lastyear';

export type DateRange = readonly [string, string];

function localYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function todayLocalYMD(): string {
  return localYMD(new Date());
}
 
 export function toLocalYMD(input?: string): string {
   if (!input) return '';
   if (input.length >= 10 && input[4] === '-' && input[7] === '-') return input.slice(0, 10);
   const ms = Date.parse(input);
   if (Number.isNaN(ms)) return String(input).slice(0, 10);

  return localYMD(new Date(ms));
}

export function fmtDate(iso?: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function rangeFor(key: DateRangeKey): DateRange {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  switch (key) {
    case 'today':
      return [localYMD(now), localYMD(now)];
    case 'yesterday': {
      const yd = new Date(y, m, d - 1);
      return [localYMD(yd), localYMD(yd)];
    }
    case 'week': {
      const off = (now.getDay() + 6) % 7;
      return [localYMD(new Date(y, m, d - off)), localYMD(new Date(y, m, d - off + 6))];
    }
    case 'month':
      return [localYMD(new Date(y, m, 1)), localYMD(new Date(y, m + 1, 0))];
    case 'lastmonth':
      return [localYMD(new Date(y, m - 1, 1)), localYMD(new Date(y, m, 0))];
    case 'last7':
      return [localYMD(new Date(y, m, d - 6)), localYMD(now)];
    case 'last30':
      return [localYMD(new Date(y, m, d - 29)), localYMD(now)];
    case 'year':
      return [localYMD(new Date(y, 0, 1)), localYMD(new Date(y, 11, 31))];
    case 'lastyear':
      return [localYMD(new Date(y - 1, 0, 1)), localYMD(new Date(y - 1, 11, 31))];
  }
}