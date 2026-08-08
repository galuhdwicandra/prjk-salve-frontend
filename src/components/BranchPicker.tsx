import { useState } from 'react';
import { useSyncExternalStore } from 'react';
import { useAuth } from '../store/useAuth';

interface Props {
  className?: string;
}

export default function BranchPicker({ className = 'loc-badge' }: Props) {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branches = user?.branches ?? [];
  const [active, setActive] = useState('');

  if (branches.length === 0) return null;

  const value = branches.some((b) => b.id === active) ? active : branches[0].id;

  return (
    <div className={className}>
      <span className="lbl">Outlet</span>
      <select
        aria-label="Pilih outlet aktif"
        value={value}
        onChange={(e) => setActive(e.target.value)}
      >
        {branches.map((b) => (
          <option key={b.id} value={b.id}>{`${b.code} — ${b.name}`}</option>
        ))}
      </select>
    </div>
  );
}
