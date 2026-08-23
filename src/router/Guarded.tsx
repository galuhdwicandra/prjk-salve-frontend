import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { ModuleKey } from '../api/client';
import { useAuth, useCanModule, firstAccessiblePath } from '../store/useAuth';

export default function Guarded(props: { module: ModuleKey; children: ReactNode }) {
  const allowed = useCanModule(props.module);

  if (!allowed) {
    return <Navigate to={firstAccessiblePath(useAuth.modules)} replace />;
  }

  return <>{props.children}</>;
}
