export type CashflowCriteria = 'OPERATING' | 'INVESTING' | 'FINANCING';

export interface TransactionCategory {
  id: string;
  name: string;
  cash_in: boolean;
  cash_out: boolean;
  cashflow: CashflowCriteria;
  in_account_id: string | null;
  out_account_id: string | null;
  in_account?: { id: string; code: string; name: string } | null;
  out_account?: { id: string; code: string; name: string } | null;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
}

export interface TransactionCategoryPayload {
  name: string;
  cash_in: boolean;
  cash_out: boolean;
  cashflow: CashflowCriteria;
  in_account_id?: string | null;
  out_account_id?: string | null;
  description: string | null;
  is_active?: boolean;
}

export const CASHFLOW_LABEL: Record<CashflowCriteria, string> = {
  OPERATING: 'Operasi',
  INVESTING: 'Investasi',
  FINANCING: 'Pendanaan',
};
