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

    const options = useMemo(() => rows
        .filter(u => (u.roles ?? []).includes('Kurir'))
        .map(u => ({ id: u.id, label: `${u.name}` })), [rows]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const res = await listUsers({ role: 'Kurir', per_page: 100 });
                const list = Array.isArray((res as unknown as { data: User[] }).data) ? (res as { data: User[] }).data : [];
                if (mounted) setRows(list);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="flex items-center gap-2">
            <select
                className="border rounded px-2 py-1 text-sm"
                value={value === null ? '' : String(value)}
                onChange={(e) => onChange(e.target.value ? e.target.value : null)}
                disabled={disabled || loading}
            >
                <option value="">{loading ? 'Memuat kurir…' : '— Pilih Kurir —'}</option>
                {options.map(o => (
                    <option key={String(o.id)} value={String(o.id)}>{o.label}</option>
                ))}
            </select>
            {value && (
                <button
                    type="button"
                    className="text-xs border rounded px-2 py-1"
                    onClick={() => onChange(null)}
                    disabled={disabled}
                    title="Kosongkan kurir"
                >
                    ×
                </button>
            )}
        </div>
    );
}
