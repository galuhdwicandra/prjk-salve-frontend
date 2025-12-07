// src/utils/date.ts
export function todayLocalYMD(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`; // selalu tanggal lokal (bukan UTC)
}

export function toLocalYMD(input?: string): string {
  if (!input) return '';
  if (input.length >= 10 && input[4] === '-' && input[7] === '-') return input.slice(0, 10);
  const ms = Date.parse(input);
  if (Number.isNaN(ms)) return String(input).slice(0, 10);
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}
