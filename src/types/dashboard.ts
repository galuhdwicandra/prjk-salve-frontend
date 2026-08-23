export interface CashflowPoint {
  date: string;
  cash_in: number;
  cash_out: number;
}

export interface BranchRevenueRow {
  branch_id: string;
  code: string;
  name: string;
  amount: number;
}

export interface CategoryMixRow {
  name: string;
  qty: number;
  amount: number;
}

export interface DashboardSummary {
  revenue_recognized: number;
  unearned_revenue: number;
  pairs: number;
  atv_per_pair: number;
  outstanding: number;
  cashflow_daily: CashflowPoint[];
  revenue_by_branch: BranchRevenueRow[];
  customers_new: number;
  customers_returning: number;
  category_mix: CategoryMixRow[];
}

export interface DashboardSummaryMeta {
  from: string;
  to: string;
  branch_id?: string | null; // UUID cabang atau null/undefined = semua
}