import { useSyncExternalStore } from 'react';
import type { NormalizedApiError } from '../api/client';
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

export type ChatErrorSlot = ChatSlotKey | 'cart' | 'discount' | 'payment' | 'voucher';

export interface ChatNotice {
  message: string;
  offerPos: boolean;
  flaggedItems: number[];
}
export type ChatPayMode = 'PENDING' | 'DP' | 'FULL';

export interface ChatSession {
  clientRef: string;
  createdAt: number;
  step: ChatStep;
  slots: ChatSlots;
  notice: ChatNotice | null;
  customerId: string;
  items: OrderItemInput[];
}

export const CHAT_SLOT_STEPS = CHAT_STEPS.filter(
  (step): step is ChatSlotKey => step !== 'confirm',
);

export const SERVER_FIELD_SLOTS = new Map<string, ChatErrorSlot>([
  ['customer_id', 'customerName'],
  ['items', 'cart'],
  ['received_at', 'receivedAt'],
  ['ready_at', 'readyAt'],
  ['discount_value', 'discount'],
  ['amount', 'payment'],
  ['code', 'voucher'],
]);

function isSlotStep(slot: ChatErrorSlot): slot is ChatSlotKey {
  return (CHAT_SLOT_STEPS as readonly string[]).includes(slot);
}

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

    return { ...parsed, slots: { ...EMPTY_SLOTS, ...parsed.slots }, notice: parsed.notice ?? null };
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
    notice: null,
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

  const session: ChatSession = { ...current, step, notice: null };

  persist(session);
  commit(session);
}

export function applyChatServerError(error: NormalizedApiError): void {
  if (!current) return;

  const fields = error.isValidationError ? Object.keys(error.errors) : [];
  const field = fields.find((key) => SERVER_FIELD_SLOTS.has(key.split('.')[0]));
  const slot = field ? SERVER_FIELD_SLOTS.get(field.split('.')[0]) : undefined;
  const target = slot && isSlotStep(slot) ? slot : null;

  const flaggedItems = [
    ...new Set(
      fields
        .map((key) => /^items\.(\d+)\./.exec(key)?.[1])
        .filter((index): index is string => index !== undefined)
        .map(Number),
    ),
  ];

  const session: ChatSession = {
    ...current,
    step: target ?? current.step,
    notice: {
      message: (field && error.errors[field]?.[0]) || error.message,
      offerPos: target === null,
      flaggedItems,
    },
  };

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
