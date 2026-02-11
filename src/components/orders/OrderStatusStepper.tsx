// src/components/orders/OrderStatusStepper.tsx
import React from 'react';
import type { OrderBackendStatus, OrderUiStep } from '../../types/orders';
import { BACKEND_TO_UI_STATUS } from '../../types/orders';

const UI_FLOW: OrderUiStep[] = ['QUEUE', 'WASH', 'DRY', 'FINISHING', 'COMPLETED', 'PICKED_UP'];

type Props = {
  backendStatus: OrderBackendStatus;
};

export default function OrderStatusStepper({ backendStatus }: Props): React.ReactElement {
  const current = BACKEND_TO_UI_STATUS[backendStatus];
  const activeIdx = UI_FLOW.indexOf(current);

  return (
    <div
      className="flex flex-wrap items-center gap-2 text-xs select-none"
      role="list"
      aria-label="Order progress"
    >
      {UI_FLOW.map((s, idx) => {
        const isCurrent = idx === activeIdx;
        const isDone = idx < activeIdx;

        // Container pill
        const pillBase =
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors motion-reduce:transition-none';
        const pillState = isCurrent
          ? 'bg-slate-900 text-white border-slate-900'
          : isDone
          ? 'bg-slate-50 text-slate-900 border-slate-200'
          : 'bg-white text-slate-500 border-slate-200';

        // Dot / icon
        const dotBase =
          'grid place-items-center h-5 w-5 rounded-full border text-[10px] font-semibold';
        const dotState = isCurrent
          ? 'bg-white text-slate-900 border-white'
          : isDone
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-500 border-slate-200';

        // Label
        const labelBase = 'text-[11px] font-semibold tracking-wide';
        const labelState = isCurrent ? 'text-white' : isDone ? 'text-slate-900' : 'text-slate-500';

        // Connector (line) between pills
        const barBase = 'h-[2px] w-6 rounded-full sm:w-10';
        const barState = idx < activeIdx ? 'bg-slate-900' : 'bg-slate-200';

        return (
          <React.Fragment key={s}>
            <div
              className={`${pillBase} ${pillState}`}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={s}
            >
              <span className={`${dotBase} ${dotState}`} aria-hidden="true">
                {isDone ? (
                  // check icon for done
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </span>
              <span className={`${labelBase} ${labelState}`}>{s}</span>
            </div>

            {idx < UI_FLOW.length - 1 && (
              <div className={`${barBase} ${barState}`} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
