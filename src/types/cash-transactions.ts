export type CashTransactionKind = 'IN' | 'OUT' | 'TRANSFER';

export type FeeBearer = 'SENDER' | 'RECEIVER';

export type AccountMini = { id: string; code: string; name: string };

export type ContactMini = { id: string; code: string | null; name: string; phone: string | null };

export interface CashTransactionLine {
  id: string;
  transaction_category_id: string;
  description: string | null;
  amount: string | number;
  line_order: number;
  category?: { id: string; name: string } | null;
}

export interface CashTransaction {
  id: string;
  branch_id: string;
  kind: CashTransactionKind;
  no: string;
  trx_date: string;
  cash_account_id: string;
  to_account_id: string | null;
  contact_id: string | null;
  amount: string | number;
  fee_amount: string | number;
  fee_bearer: FeeBearer | null;
  description: string | null;
  attachment_path: string | null;
  branch?: { id: string; name: string; code?: string | null } | null;
  cash_account?: AccountMini | null;
  to_account?: AccountMini | null;
  contact?: ContactMini | null;
  lines?: CashTransactionLine[];
  created_at?: string | null;
}

export interface CashTransactionLinePayload {
  transaction_category_id: string;
  description: string | null;
  amount: number;
}

export interface CashTransactionPayload {
  branch_id?: string | null;
  kind: 'IN' | 'OUT';
  trx_date: string;
  cash_account_id: string;
  contact_id: string | null;
  description: string | null;
  lines: CashTransactionLinePayload[];
  attachment?: File | null;
}

export interface CashTransferPayload {
  branch_id?: string | null;
  trx_date: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  description: string | null;
  fee_amount: number;
  fee_bearer: FeeBearer;
}

export interface CashTransactionQuery {
  kind?: CashTransactionKind;
  q?: string;
  branch_id?: string | null;
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
