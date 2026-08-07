import type { ReactNode } from 'react';
import type { ModuleKey } from '../api/client';
import { useCanModule } from '../store/useAuth';

export default function Guarded(props: { module: ModuleKey; children: ReactNode }) {
  if (!useCanModule(props.module)) {
    return <div className="text-sm text-red-600">Kamu tidak punya akses ke menu itu.</div>;
  }

  return <>{props.children}</>;
}
