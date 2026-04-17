// src/components/delivery/DeliveryStatusStepper.tsx
import type { DeliveryStatus } from '../../types/deliveries';

const FLOW: DeliveryStatus[] = [
    'CREATED',
    'ASSIGNED',
    'ON_THE_WAY',
    'PICKED',
    'HANDOVER',
    'COMPLETED',
];

const TERMINAL: DeliveryStatus[] = ['FAILED', 'CANCELLED'];

export default function DeliveryStatusStepper({ status }: { status: DeliveryStatus }) {
    const flowIndex = FLOW.indexOf(status);
    const isTerminal = TERMINAL.includes(status);

    // Jika status ada di FLOW → pakai index aslinya
    // Jika status terminal FAILED/CANCELLED → tampilkan semua step flow sebagai selesai
    const activeIdx = flowIndex >= 0 ? flowIndex : FLOW.length - 1;

    return (
        <div className="space-y-2">
            <ol
                className="flex items-center flex-wrap gap-2 text-xs"
                aria-label="Status pengiriman"
                role="list"
            >
                {FLOW.map((s, i) => {
                    const isDone = i < activeIdx || (isTerminal && i <= FLOW.length - 1);
                    const isActive = !isTerminal && i === activeIdx;

                    const pillBase =
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition duration-150 ease-out';

                    const pillClass = isActive
                        ? `${pillBase} bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)] shadow-elev-1 scale-[1.02]`
                        : isDone
                            ? `${pillBase} text-[var(--color-brand-primary)] bg-[#E6EDFF]`
                            : `${pillBase} border border-[color:var(--color-border)] text-gray-700 bg-white/80`;

                    return (
                        <li
                            key={s}
                            className="flex items-center gap-2"
                            aria-current={isActive ? 'step' : undefined}
                        >
                            <span className={pillClass}>
                                <span aria-hidden="true">{isDone ? '✔' : '•'}</span>
                                <span className="tracking-wide">{s}</span>
                            </span>

                            {i < FLOW.length - 1 && (
                                <span
                                    className={`h-px w-6 md:w-8 ${
                                        isDone ? 'bg-[var(--color-brand-primary)]' : 'bg-[color:var(--color-border)]'
                                    }`}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            {isTerminal && (
                <div>
                    <span className="chip chip--danger">{status}</span>
                </div>
            )}
        </div>
    );
}