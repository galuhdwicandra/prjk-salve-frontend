// src/components/delivery/AssignCourierSelect.tsx
import { useEffect, useMemo, useState } from 'react';
import { listUsers } from '../../api/users';
import type { User } from '../../types/users';

type Props = {
  value: string | number | null;
  onChange: (userId: string | number | null) => void;
  disabled?: boolean;
};

export default function AssignCourierSelect({ value, onChange, disabled = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<User[]>([]);

  const options = useMemo(
    () =>
      rows
        .filter((u) => (u.roles ?? []).includes('Kurir'))
        .map((u) => ({ id: u.id, label: `${u.name}` })),
    [rows]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await listUsers({ role: 'Kurir', per_page: 100 });
        const list = Array.isArray((res as unknown as { data: User[] }).data)
          ? (res as { data: User[] }).data
          : [];
        if (mounted) setRows(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hasValue = value !== null && String(value).length > 0;

  return (
    <div className="flex items-center gap-2" aria-busy={loading ? 'true' : 'false'}>
      <label className="sr-only" htmlFor="assign-courier">
        Pilih kurir
      </label>
      <select
        id="assign-courier"
        className="input min-w-[220px] py-2 pr-8"
        value={value === null ? '' : String(value)}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
        disabled={disabled || loading}
        aria-label="Pilih kurir untuk pengantaran"
      >
        <option value="">{loading ? 'Memuat kurir…' : '— Pilih Kurir —'}</option>
        {options.map((o) => (
          <option key={String(o.id)} value={String(o.id)}>
            {o.label}
          </option>
        ))}
      </select>

      {hasValue && (
        <button
          type="button"
          className="btn-outline text-xs h-9 px-2"
          onClick={() => onChange(null)}
          disabled={disabled}
          title="Kosongkan kurir"
          aria-label="Kosongkan kurir"
        >
          Kosongkan
        </button>
      )}
    </div>
  );
}
