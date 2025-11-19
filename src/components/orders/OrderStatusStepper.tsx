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
      className="flex items-center gap-2 text-xs select-none"
      role="list"
      aria-label="Order progress"
    >
      {UI_FLOW.map((s, idx) => {
        const isCurrent = idx === activeIdx;
        const isDone = idx < activeIdx;

        const dotCls =
          'grid place-items-center h-6 w-6 rounded-full border text-[10px] font-semibold transition-transform duration-150 motion-reduce:transition-none';
        const dotState = isCurrent
          ? 'bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)] border-transparent scale-[1.04]'
          : isDone
          ? 'bg-[#E6EDFF] text-[var(--color-brand-primary)] border-[color:var(--color-brand-primary)]'
          : 'bg-[color:var(--color-surface)] text-gray-500 border-[color:var(--color-border)]';

        const labelCls = 'text-[11px] font-medium tracking-wide';
        const labelState = isCurrent
          ? 'text-[color:var(--color-text-default)]'
          : isDone
          ? 'text-[var(--color-brand-primary)]'
          : 'text-gray-500';

        const barCls = 'h-[2px] rounded w-6 md:w-10';
        const barState = idx < activeIdx
          ? 'bg-[var(--color-brand-primary)]/80'
          : 'bg-[color:var(--color-border)]';

        return (
          <React.Fragment key={s}>
            <div
              className="flex items-center gap-2"
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={s}
            >
              <span className={`${dotCls} ${dotState}`} aria-hidden="true">{idx + 1}</span>
              <span className={`${labelCls} ${labelState}`}>{s}</span>
            </div>
            {idx < UI_FLOW.length - 1 && (
              <div className={`${barCls} ${barState}`} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
