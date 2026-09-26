import { useSyncExternalStore } from 'react';
import { createOrder } from '../api/orders';
import type { OrderItemInput } from '../types/orders';

const ACTIVE_KEY = 'pos-salve:chat:active';
const SESSION_PREFIX = 'pos-salve:chat:';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const CHAT_STEPS = [
  'customerName',
  'customerWa',
  'receivedAt',
  'readyAt',
  'notes',
  'payMode',
  'confirm',
] as const;

export type ChatStep = (typeof CHAT_STEPS)[number];

export type ChatSlotKey = Exclude<ChatStep, 'confirm'>;

export type ChatSlots = Record<ChatSlotKey, string>;

export type ChatPayMode = 'PENDING' | 'DP' | 'FULL';

export interface ChatSession {
  clientRef: string;
  createdAt: number;
  step: ChatStep;
  slots: ChatSlots;
  customerId: string;
  items: OrderItemInput[];
}

export const CHAT_SLOT_STEPS = CHAT_STEPS.filter(
  (step): step is ChatSlotKey => step !== 'confirm',
);

const EMPTY_SLOTS: ChatSlots = {
  customerName: '',
  customerWa: '',
  receivedAt: '',
  readyAt: '',
  notes: '',
  payMode: '',
};

const subscribers = new Set<() => void>();

let current: ChatSession | null = null;

function sessionKey(clientRef: string): string {
  return SESSION_PREFIX + clientRef;
}

function readActiveRef(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

function readStored(): ChatSession | null {
  const clientRef = readActiveRef();

  if (!clientRef) return null;

  try {
    const raw = window.localStorage.getItem(sessionKey(clientRef));

    if (!raw) return null;

    const parsed = JSON.parse(raw) as ChatSession;

    if (parsed.clientRef !== clientRef) return null;
    if (!CHAT_STEPS.includes(parsed.step)) return null;
    if (Date.now() - parsed.createdAt >= SESSION_TTL_MS) return null;

    return {
      ...parsed,
      customerId: parsed.customerId ?? '',
      items: parsed.items ?? [],
      slots: { ...EMPTY_SLOTS, ...parsed.slots },
    };
  } catch {
    return null;
  }
}

function persist(session: ChatSession): void {
  try {
    window.localStorage.setItem(sessionKey(session.clientRef), JSON.stringify(session));
    window.localStorage.setItem(ACTIVE_KEY, session.clientRef);
  } catch {
    return;
  }
}

function clearStored(): void {
  const clientRef = readActiveRef();

  try {
    if (clientRef) window.localStorage.removeItem(sessionKey(clientRef));
    window.localStorage.removeItem(ACTIVE_KEY);
  } catch {
    return;
  }
}

function commit(session: ChatSession | null): void {
  current = session;
  subscribers.forEach((fn) => fn());
}

export function startChatSession(): ChatSession {
  clearStored();

  const session: ChatSession = {
    clientRef: crypto.randomUUID(),
    createdAt: Date.now(),
    step: CHAT_STEPS[0],
    slots: EMPTY_SLOTS,
    customerId: '',
    items: [],
  };

  persist(session);
  commit(session);

  return session;
}

export function ensureChatSession(): ChatSession {
  const stored = readStored();

  if (!stored) return startChatSession();

  commit(stored);

  return stored;
}

export function setChatSlot(key: ChatSlotKey, value: string): void {
  if (!current) return;

  const session: ChatSession = {
    ...current,
    slots: { ...current.slots, [key]: value },
  };

  persist(session);
  commit(session);
}

export function setChatStep(step: ChatStep): void {
  if (!current) return;

  const session: ChatSession = { ...current, step };

  persist(session);
  commit(session);
}

interface ChatRequiredSlot {
  label: string;
  step: ChatSlotKey | null;
  filled: (session: ChatSession, branchId: string) => boolean;
}

export const CHAT_REQUIRED_SLOTS: readonly ChatRequiredSlot[] = [
  { label: 'Outlet', step: null, filled: (_session, branchId) => branchId !== '' },
  { label: 'Pelanggan', step: 'customerName', filled: (session) => session.customerId !== '' },
  { label: 'Layanan', step: null, filled: (session) => session.items.length > 0 },
  { label: 'Tanggal diterima', step: 'receivedAt', filled: (session) => session.slots.receivedAt !== '' },
  { label: 'Target selesai', step: 'readyAt', filled: (session) => session.slots.readyAt !== '' },
  { label: 'Mode pembayaran', step: 'payMode', filled: (session) => session.slots.payMode !== '' },
];

export function guardChatSubmit(session: ChatSession, branchId: string): ChatRequiredSlot[] {
  return CHAT_REQUIRED_SLOTS.filter((slot) => !slot.filled(session, branchId));
}

export type ChatSubmitResult =
  | { ok: true; reference: string | null }
  | { ok: false; missing: string[] };

export async function submitChatOrder(branchId: string): Promise<ChatSubmitResult> {
  const session = current;

  if (!session || session.step !== 'confirm') return { ok: false, missing: [] };

  const missing = guardChatSubmit(session, branchId);

  if (missing.length > 0) {
    const target = missing.find((slot) => slot.step !== null)?.step;

    if (target) setChatStep(target);

    return { ok: false, missing: missing.map((slot) => slot.label) };
  }

  const res = await createOrder({
    branch_id: branchId,
    customer_id: session.customerId,
    items: session.items,
    notes: session.slots.notes || null,
    received_at: session.slots.receivedAt,
    ready_at: session.slots.readyAt,
    client_ref: session.clientRef,
  });

  return { ok: true, reference: res.data?.invoice_no ?? res.data?.number ?? null };
}

function subscribe(fn: () => void): () => void {
  subscribers.add(fn);

  return () => {
    subscribers.delete(fn);
  };
}

function snapshot(): ChatSession | null {
  return current;
}

export function useChatSession(): ChatSession | null {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
