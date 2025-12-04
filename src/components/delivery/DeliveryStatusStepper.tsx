// src/components/delivery/DeliveryStatusStepper.tsx
import type { DeliveryStatus } from '../../types/deliveries';

const FLOW: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'ON_THE_WAY', 'PICKED', 'HANDOVER', 'COMPLETED'];

export default function DeliveryStatusStepper({ status }: { status: DeliveryStatus }) {
    // Logika asli dipertahankan
    const activeIdx = Math.max(0, FLOW.indexOf(status));

    return (
        <ol
            className="flex items-center flex-wrap gap-2 text-xs"
            aria-label="Status pengiriman"
            role="list"
        >
            {FLOW.map((s, i) => {
                const isDone = i < activeIdx;
                const isActive = i === activeIdx;
                const pillBase =
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition duration-150 ease-out';
                const pillClass = isActive
                    ? // Langkah aktif: solid brand, teks on-brand, ring ringan + micro-scale
                    `${pillBase} bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)] shadow-elev-1 scale-[1.02]`
                    : isDone
                        ? // Sudah lewat: subtle brand (mirip chip--subtle pada table Customers)
                        `${pillBase} text-[var(--color-brand-primary)] bg-[#E6EDFF]`
                        : // Belum: outline halus
                        `${pillBase} border border-[color:var(--color-border)] text-gray-700 bg-white/80`;

                return (
                    <li key={s} className="flex items-center gap-2" aria-current={isActive ? 'step' : undefined}>
                        <span className={pillClass}>
                            {/* Bullet/ikon sederhana: ✔ untuk selesai, • untuk lain */}
                            <span aria-hidden="true">{isDone ? '✔' : '•'}</span>
                            <span className="tracking-wide">{s}</span>
                        </span>

                        {/* Connector antar step */}
                        {i < FLOW.length - 1 && (
                            <span
                                className={`h-px w-6 md:w-8 ${i < activeIdx ? 'bg-[var(--color-brand-primary)]' : 'bg-[color:var(--color-border)]'
                                    }`}
                                aria-hidden="true"
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
