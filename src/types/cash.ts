export interface CashMutation {
  id: string;
  cash_session_id: string;
  branch_id: string;
  type:
    | 'OPENING_FLOAT'
    | 'SALE_CASH'
    | 'RECEIVABLE_CASH_SETTLEMENT'
    | 'EXPENSE_CASH'
    | 'WITHDRAWAL'
    | 'ADJUSTMENT_IN'
    | 'ADJUSTMENT_OUT';
  direction: 'IN' | 'OUT';
  amount: number;
  source_type?: string | null;
  source_id?: string | null;
  reference_no?: string | null;
  note?: string | null;
  created_by?: number | null;
  effective_at: string | null;
  creator?: { id: number; name: string } | null;
}

export interface CashSession {
  id: string;
  branch_id: string;
  business_date: string;
  status: 'OPEN' | 'CLOSED';
  opened_by: number;
  opened_at: string | null;
  opening_cash: number;
  closed_by?: number | null;
  closed_at?: string | null;
  closing_cash_system?: number | null;
  closing_cash_counted?: number | null;
  difference_amount?: number | null;
  notes?: string | null;
  branch?: { id: string; name: string } | null;
  opener?: { id: number; name: string } | null;
  closer?: { id: number; name: string } | null;
  mutations?: CashMutation[];
}

export interface CashSessionQuery {
  branch_id?: string;
  status?: 'OPEN' | 'CLOSED';
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Envelope<T, M = unknown> {
  data: T;
  meta: M;
  message: string | null;
  errors: Record<string, string[]> | null;
}

export interface OpenCashSessionPayload {
  branch_id?: string;
  business_date: string;
  opening_cash: number;
  notes?: string | null;
}

export interface UpdateCashSessionPayload {
  opening_cash: number;
  notes?: string | null;
}

export interface CloseCashSessionPayload {
  closing_cash_counted: number;
  notes?: string | null;
}

export interface WithdrawalPayload {
  amount: number;
  effective_at?: string | null;
  note?: string | null;
}