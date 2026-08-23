import { useCallback, useEffect, useState } from 'react';
import { listCustomerLabels } from '../api/customerLabels';
import type { CustomerLabel } from '../types/customers';

const CHIP_STYLES: Record<string, string> = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    navy: 'border-[#0A2A66]/30 bg-[#0A2A66]/10 text-[#0A2A66]',
    violet: 'border-violet-200 bg-violet-50 text-violet-700',
    rose: 'border-rose-200 bg-rose-50 text-rose-700',
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    red: 'border-red-200 bg-red-50 text-red-700',
};

const SWATCH_HEX: Record<string, string> = {
    blue: '#2563EB',
    navy: '#0A2A66',
    amber: '#F5A02D',
    emerald: '#16A34A',
    violet: '#9333EA',
    cyan: '#0891B2',
    orange: '#D97706',
    red: '#DC2626',
    slate: '#64748B',
    rose: '#E11D48',
};

export const CUSTOMER_LABEL_COLORS = Object.keys(SWATCH_HEX);

export function customerLabelSwatch(color: string): string {
    return SWATCH_HEX[color] ?? SWATCH_HEX.slate;
}

export function customerLabelChipClass(color?: string | null): string {
    return CHIP_STYLES[color ?? ''] ?? CHIP_STYLES.slate;
}

export interface UseCustomerLabels {
    labels: CustomerLabel[];
    chipClass: (name: string) => string;
}

export function useCustomerLabels(): UseCustomerLabels {
    const [labels, setLabels] = useState<CustomerLabel[]>([]);

    useEffect(() => {
        let alive = true;

        listCustomerLabels({ is_active: true })
            .then((res) => {
                if (alive) setLabels(res.data ?? []);
            })
            .catch(() => undefined);

        return () => {
            alive = false;
        };
    }, []);

    const chipClass = useCallback(
        (name: string) => customerLabelChipClass(labels.find((label) => label.name === name)?.color),
        [labels],
    );

    return { labels, chipClass };
}
