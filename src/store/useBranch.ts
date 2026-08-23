import { useSyncExternalStore } from 'react';
import { useAuth } from './useAuth';

const KEY = 'pos-salve:branch';

const subscribers = new Set<() => void>();

function read(): string {
    try {
        return window.localStorage.getItem(KEY) ?? '';
    } catch {
        return '';
    }
}

let current = read();

function snapshot(): string {
    const user = useAuth.user;
    const branches = user?.branches ?? [];

    if (branches.some((b) => b.id === current)) return current;

    return String(user?.branch_id ?? branches[0]?.id ?? '');
}

function subscribe(fn: () => void): () => void {
    subscribers.add(fn);
    const offAuth = useAuth.subscribe(fn);

    return () => {
        subscribers.delete(fn);
        offAuth();
    };
}

export function setActiveBranchId(id: string): void {
    current = id;

    try {
        window.localStorage.setItem(KEY, id);
    } catch {
        subscribers.forEach((fn) => fn());
        return;
    }

    subscribers.forEach((fn) => fn());
}

export function useActiveBranchId(): string {
    return useSyncExternalStore(subscribe, snapshot, snapshot);
}
