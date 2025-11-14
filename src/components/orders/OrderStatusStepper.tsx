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

  return (
    <div className="flex items-center gap-2 text-xs">
      {UI_FLOW.map((s, idx) => {
        const activeIdx = UI_FLOW.indexOf(current);
        const active = idx <= activeIdx;
        return (
          <React.Fragment key={s}>
            <div className={`px-2 py-1 rounded ${active ? 'bg-black text-white' : 'border'}`}>{s}</div>
            {idx < UI_FLOW.length - 1 && <div className="w-6 h-px bg-muted" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
