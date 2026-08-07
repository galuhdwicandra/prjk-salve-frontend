// src/types/branches.ts
export type ResetPolicy = 'monthly' | 'never';
export type BranchType = 'workshop' | 'droppoint';

export interface Branch {
  id: string;
  code: string;
  name: string;
  type: BranchType;
  address?: string | null;
  hours?: string | null;
  invoice_prefix: string;
  reset_policy: ResetPolicy;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BranchUpsertPayload {
  code: string;
  name: string;
  type: BranchType;
  address?: string | null;
  hours?: string | null;
  invoice_prefix: string;
  reset_policy: ResetPolicy;
}

export interface BranchQuery {
  q?: string;
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface InvoiceCounter {
  id: string;
  branch_id: string;
  doc_key?: string | null;
  prefix: string;
  format?: string | null;
  seq: number;
  reset_policy: CounterResetPolicy;
  last_reset_month?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type CounterResetPolicy = 'monthly' | 'yearly' | 'never';

export interface DocumentNumber {
  id: string | null;
  key: string;
  group: string;
  label: string;
  status: 'aktif' | 'rencana';
  format: string;
  reset_policy: CounterResetPolicy;
  seq: number;
  next: string;
}

export interface DocumentNumberSavePayload {
  branch_id: string;
  doc_key: string;
  format: string;
  reset_policy: CounterResetPolicy;
  seq: number;
}
