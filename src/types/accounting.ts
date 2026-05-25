export type AccountingAccountType =
  | 'ASSET'
  | 'LIABILITY'
  | 'EQUITY'
  | 'REVENUE'
  | 'EXPENSE';

export type AccountingNormalBalance = 'DEBIT' | 'CREDIT';

export type AccountingEventKey =
  | 'ORDER_PAID_CASH'
  | 'ORDER_PAID_QRIS'
  | 'ORDER_PAID_TRANSFER'
  | 'ORDER_RECEIVABLE_CREATED'
  | 'RECEIVABLE_SETTLED_CASH'
  | 'EXPENSE_CASH_BOX'
  | 'EXPENSE_NON_CASH'
  | 'CASH_OPENING_FLOAT'
  | 'CASH_WITHDRAWAL'
  | 'CASH_ADJUSTMENT_IN'
  | 'CASH_ADJUSTMENT_OUT'
  | 'ORDER_DISCOUNT';

export type BranchMini = {
  id: string;
  code?: string | null;
  name: string;
};

export type AccountingAccount = {
  id: string;
  branch_id: string | null;
  parent_id: string | null;
  code: string;
  name: string;
  type: AccountingAccountType;
  normal_balance: AccountingNormalBalance;
  is_cash_account: boolean;
  is_active: boolean;
  sort_order: number;
  branch?: BranchMini | null;
  parent?: Pick<AccountingAccount, 'id' | 'code' | 'name'> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AccountingAccountMapping = {
  id: string;
  branch_id: string | null;
  event_key: AccountingEventKey;
  payment_method: string | null;
  expense_category: string | null;
  debit_account_id: string;
  credit_account_id: string;
  is_active: boolean;
  branch?: BranchMini | null;
  debit_account?: Pick<AccountingAccount, 'id' | 'code' | 'name' | 'type' | 'normal_balance'> | null;
  credit_account?: Pick<AccountingAccount, 'id' | 'code' | 'name' | 'type' | 'normal_balance'> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type AccountingAccountQuery = {
  q?: string;
  branch_id?: string | null;
  type?: AccountingAccountType | '';
  is_active?: boolean | string;
  page?: number;
  per_page?: number;
};

export type AccountingAccountPayload = {
  branch_id?: string | null;
  parent_id?: string | null;
  code: string;
  name: string;
  type: AccountingAccountType;
  normal_balance: AccountingNormalBalance;
  is_cash_account: boolean;
  is_active: boolean;
  sort_order: number;
};

export type AccountingAccountMappingQuery = {
  q?: string;
  branch_id?: string | null;
  event_key?: AccountingEventKey | '';
  is_active?: boolean | string;
  page?: number;
  per_page?: number;
};

export type AccountingAccountMappingPayload = {
  branch_id?: string | null;
  event_key: AccountingEventKey;
  payment_method?: string | null;
  expense_category?: string | null;
  debit_account_id: string;
  credit_account_id: string;
  is_active: boolean;
};

export type ApiEnvelope<T, M = unknown> = {
  data: T;
  meta: M;
  message: string | null;
  errors: Record<string, string[]> | null;
};

export type AccountingJournalStatus = 'DRAFT' | 'POSTED' | 'VOID';

export type AccountingJournalLine = {
  id: string;
  journal_entry_id: string;
  account_id: string;
  description: string | null;
  debit: string | number;
  credit: string | number;
  line_order: number;
  account?: Pick<AccountingAccount, 'id' | 'code' | 'name' | 'type' | 'normal_balance' | 'branch_id' | 'is_active'> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AccountingJournalEntry = {
  id: string;
  branch_id: string;
  mapping_id: string | null;
  journal_no: string;
  journal_date: string;
  source_type: string | null;
  source_id: string | null;
  source_no: string | null;
  status: AccountingJournalStatus;
  description: string | null;
  total_debit: string | number;
  total_credit: string | number;
  created_by: number | string | null;
  posted_by: number | string | null;
  posted_at: string | null;
  voided_by: number | string | null;
  voided_at: string | null;
  void_reason: string | null;
  branch?: BranchMini | null;
  lines?: AccountingJournalLine[];
  lines_count?: number;
  creator?: { id: number | string; name: string } | null;
  poster?: { id: number | string; name: string } | null;
  voider?: { id: number | string; name: string } | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AccountingJournalLinePayload = {
  account_id: string;
  description?: string | null;
  debit?: number;
  credit?: number;
};

export type AccountingJournalPayload = {
  branch_id?: string | null;
  journal_date: string;
  description?: string | null;
  lines: AccountingJournalLinePayload[];
};

export type AccountingJournalQuery = {
  q?: string;
  branch_id?: string | null;
  status?: AccountingJournalStatus | '';
  source_type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
};

export type AccountingLedgerRow = {
  id: string;
  journal_entry_id: string;
  journal_date: string | null;
  journal_no: string | null;
  source_type: string | null;
  source_no: string | null;
  branch?: BranchMini | null;
  description: string | null;
  debit: string | number;
  credit: string | number;
  balance: string | number;
};

export type AccountingLedgerMeta = PaginationMeta & {
  account: Pick<AccountingAccount, 'id' | 'code' | 'name' | 'type' | 'normal_balance' | 'branch_id'>;
  branch_id: string | null;
  date_from: string;
  date_to: string;
  opening_balance: string | number;
  total_debit: string | number;
  total_credit: string | number;
  ending_balance: string | number;
};

export type AccountingProfitLossQuery = {
  date_from: string;
  date_to: string;
  branch_id?: string | null;
  basis?: 'posted' | 'journal_posted';
};

export type AccountingProfitLossAccountRow = {
  account_id: string;
  code: string;
  name: string;
  type: AccountingAccountType;
  normal_balance: AccountingNormalBalance;
  debit: number;
  credit: number;
  amount: number;
};

export type AccountingProfitLossSummary = {
  total_gross_revenue: number;
  total_contra_revenue: number;
  net_revenue: number;
  total_expense: number;
  net_profit: number;
  is_profit: boolean;
};

export type AccountingProfitLossData = {
  revenues: AccountingProfitLossAccountRow[];
  contra_revenues: AccountingProfitLossAccountRow[];
  expenses: AccountingProfitLossAccountRow[];
  summary: AccountingProfitLossSummary;
};

export type AccountingProfitLossMeta = {
  date_from: string;
  date_to: string;
  branch_id: string | null;
  basis: 'POSTED';
};

export type AccountingLedgerQuery = {
  account_id: string;
  branch_id?: string | null;
  date_from: string;
  date_to: string;
  page?: number;
  per_page?: number;
};

export type AccountingBalanceSheetQuery = {
  date_from: string;
  date_to: string;
  branch_id?: string | null;
};

export type AccountingBalanceSheetAccountRow = {
  id: string | null;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY';
  normal_balance: 'DEBIT' | 'CREDIT';
  total_debit: number;
  total_credit: number;
  balance: number;
};

export type AccountingBalanceSheetSummary = {
  total_assets: number;
  total_liabilities: number;
  total_equities: number;
  total_liabilities_and_equities: number;
  difference: number;
  is_balanced: boolean;
  status: 'BALANCED' | 'NOT_BALANCED';
};

export type AccountingBalanceSheetData = {
  assets: AccountingBalanceSheetAccountRow[];
  liabilities: AccountingBalanceSheetAccountRow[];
  equities: AccountingBalanceSheetAccountRow[];
  current_year_profit: number;
  summary: AccountingBalanceSheetSummary;
};

export type AccountingBalanceSheetMeta = {
  date_from: string;
  date_to: string;
  as_of_date: string;
  branch_id: string | null;
  basis: 'posted';
};

export type AccountingCashFlowQuery = {
  date_from: string;
  date_to: string;
  branch_id?: string | null;
  basis?: 'posted' | 'journal_posted';
};

export type AccountingCashFlowAccount = {
  id: string;
  code: string | null;
  name: string | null;
  normal_balance: AccountingNormalBalance;
};

export type AccountingCashFlowBranch = {
  id: string;
  code?: string | null;
  name?: string | null;
};

export type AccountingCashFlowItem = {
  id: string;
  journal_entry_id: string;
  journal_date: string | null;
  journal_no: string | null;
  source_type: string | null;
  source_no: string | null;
  event_key: AccountingEventKey | string | null;
  description: string | null;
  cash_account: AccountingCashFlowAccount;
  branch: AccountingCashFlowBranch;
  cash_in: number;
  cash_out: number;
  net_amount: number;
};

export type AccountingCashFlowActivity = {
  label: string;
  items: AccountingCashFlowItem[];
  total: number;
};

export type AccountingCashFlowSummary = {
  opening_balance: number;
  total_cash_in: number;
  total_cash_out: number;
  net_cash_flow: number;
  ending_balance: number;
};

export type AccountingCashFlowData = {
  operating_activities: AccountingCashFlowActivity;
  investing_activities: AccountingCashFlowActivity;
  financing_activities: AccountingCashFlowActivity;
  summary: AccountingCashFlowSummary;
};

export type AccountingCashFlowMeta = {
  date_from: string;
  date_to: string;
  branch_id: string | null;
  basis: 'POSTED';
  source: 'accounting_journal_lines';
};

export type AccountingDashboardQuery = {
  date_from: string;
  date_to: string;
  branch_id?: string | null;
  basis?: 'posted';
};

export type AccountingDashboardSummary = {
  total_cash: number;
  total_receivables: number;
  total_revenue: number;
  total_expense: number;
  net_profit: number;
  total_assets: number;
  total_liabilities: number;
  total_equities: number;
  total_liabilities_and_equities: number;
  balance_difference: number;
  is_balance_sheet_balanced: boolean;
  balance_status: 'BALANCED' | 'NOT_BALANCED';
};

export type AccountingDashboardRevenueExpensePoint = {
  period: string;
  revenue: number;
  expense: number;
  net_profit: number;
};

export type AccountingDashboardCashFlowPoint = {
  period: string;
  cash_in: number;
  cash_out: number;
  net_cash_flow: number;
};

export type AccountingDashboardProfitByBranchPoint = {
  branch_id: string;
  branch_code: string | null;
  branch_name: string | null;
  revenue: number;
  expense: number;
  net_profit: number;
};

export type AccountingDashboardReceivablesPoint = {
  period: string;
  receivables_in: number;
  receivables_out: number;
  net_receivables: number;
};

export type AccountingDashboardWarningSeverity = 'info' | 'warning' | 'danger';

export type AccountingDashboardWarningItem = {
  key:
    | 'MAPPING_INCOMPLETE'
    | 'UNBALANCED_JOURNALS'
    | 'DRAFT_JOURNALS'
    | 'BALANCE_SHEET_NOT_BALANCED'
    | string;
  label: string;
  message: string;
  count: number;
  severity: AccountingDashboardWarningSeverity;
};

export type AccountingDashboardWarnings = {
  items: AccountingDashboardWarningItem[];
  summary: {
    mapping_issue_count: number;
    unbalanced_journal_count: number;
    draft_journal_count: number;
    balance_difference: number;
    has_warning: boolean;
  };
};

export type AccountingDashboardCharts = {
  revenue_vs_expense: AccountingDashboardRevenueExpensePoint[];
  cash_in_vs_cash_out: AccountingDashboardCashFlowPoint[];
  net_profit_by_branch: AccountingDashboardProfitByBranchPoint[];
  receivables_trend: AccountingDashboardReceivablesPoint[];
};

export type AccountingDashboardData = {
  summary: AccountingDashboardSummary;
  charts: AccountingDashboardCharts;
  warnings: AccountingDashboardWarnings;
};

export type AccountingDashboardMeta = {
  date_from: string;
  date_to: string;
  branch_id: string | null;
  basis: 'posted';
};