// src/components/delivery/DeliveryStatusStepper.tsx
import type { DeliveryStatus } from '../../types/deliveries';

const FLOW: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED'];

export default function DeliveryStatusStepper({ status }: { status: DeliveryStatus }) {
    const activeIdx = Math.max(0, FLOW.indexOf(status));
    return (
        <div className="flex items-center gap-2 text-xs">
            {FLOW.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded ${i <= activeIdx ? 'bg-black text-white' : 'border'}`}>{s}</div>
                    {i < FLOW.length - 1 && <div className="w-6 h-px bg-muted" />}
                </div>
            ))}
        </div>
    );
}
