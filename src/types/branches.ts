// src/types/branches.ts
export type ResetPolicy = 'monthly' | 'never';

export interface Branch {
  id: string;
  code: string;
  name: string;
  address?: string | null;
  invoice_prefix: string;
  reset_policy: ResetPolicy;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BranchUpsertPayload {
  code: string;
  name: string;
  address?: string | null;
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
  prefix: string;
  seq: number;
  reset_policy: ResetPolicy;
  last_reset_month?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InvoiceCounterUpsertPayload {
  branch_id: string;
  prefix: string;         
  reset_policy: ResetPolicy;
  seq?: number;
}

export interface InvoiceCounterQuery {
  branch_id?: string;
  page?: number;
  per_page?: number;
}
