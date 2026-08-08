import { useEffect, useState } from 'react';
import { listPaymentMethods } from '../api/paymentMethods';
import type { PaymentMethodMaster } from '../types/payments';

const FALLBACK: PaymentMethodMaster[] = [
    { id: 'CASH', code: 'CASH', name: 'Cash', is_active: true, sort_order: 1 },
    { id: 'QRIS', code: 'QRIS', name: 'QRIS', is_active: true, sort_order: 2 },
    { id: 'TRANSFER', code: 'TRANSFER', name: 'Transfer', is_active: true, sort_order: 3 },
];

export function useActivePaymentMethods(): PaymentMethodMaster[] {
    const [methods, setMethods] = useState<PaymentMethodMaster[]>(FALLBACK);

    useEffect(() => {
        let alive = true;

        listPaymentMethods({ is_active: true })
            .then((res) => {
                if (!alive) return;
                const rows = res.data ?? [];
                if (rows.length > 0) setMethods(rows);
            })
            .catch(() => undefined);

        return () => {
            alive = false;
        };
    }, []);

    return methods;
}
