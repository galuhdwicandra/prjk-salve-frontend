import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../store/useAuth';
import type { RoleName } from '../api/client';

// Hook ringan untuk ambil snapshot dari store dan reaktif lewat subscribe()
function useAuthState() {
  const [snapshot, setSnapshot] = useState(() => ({
    user: useAuth.user,
    roles: useAuth.roles,
  }));
  useEffect(() => {
    const unsub = useAuth.subscribe(() => {
      setSnapshot({ user: useAuth.user, roles: useAuth.roles });
    });
    return () => { unsub(); };
  }, []);
  return snapshot;
}

export default function Guarded(props: { roles: RoleName[]; children: ReactNode }) {
  const { roles: myRoles } = useAuthState();
  const allowed = (myRoles ?? []).some((r: RoleName) => props.roles.includes(r)); // <- r ditipkan
  if (!allowed) {
    return <div className="text-sm text-red-600">Anda tidak berhak mengakses halaman ini.</div>;
  }
  return <>{props.children}</>;
}
