import { setActiveBranchId, useActiveBranchId } from '../store/useBranch';
import { useSyncExternalStore } from 'react';
import { useAuth } from '../store/useAuth';

interface Props {
  className?: string;
}

export default function BranchPicker({ className = 'loc-badge' }: Props) {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branches = user?.branches ?? [];
  const value = useActiveBranchId();

  if (branches.length === 0) return null;

  return (
    <div className={className}>
      <span className="lbl">Outlet</span>
      <select
        aria-label="Pilih outlet aktif"
        value={value}
        onChange={(e) => setActiveBranchId(e.target.value)}
      >
        {branches.map((b) => (
          <option key={b.id} value={b.id}>{`${b.code} — ${b.name}`}</option>
        ))}
      </select>
    </div>
  );
}
