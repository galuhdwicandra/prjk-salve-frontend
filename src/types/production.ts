import type { PaginationMeta } from './branches';

export type ProductionStatus =
    | 'QUEUE'
    | 'WASHING'
    | 'DRYING'
    | 'IRONING'
    | 'READY'
    | 'PICKED_UP'
    | 'CANCELED';

export type ProductionBoardStatus =
    | 'QUEUE'
    | 'WASHING'
    | 'DRYING'
    | 'IRONING'
    | 'READY';

export interface ProductionMiniCustomer {
    id: string;
    name: string;
    whatsapp?: string | null;
}

export interface ProductionMiniOrder {
    id: string;
    branch_id: string;
    number: string;
    invoice_no?: string | null;
    status: ProductionStatus;
    received_at?: string | null;
    ready_at?: string | null;
    customer?: ProductionMiniCustomer | null;
}

export interface ProductionAssignee {
    id: string;
    name: string;
}

export interface ProductionTask {
    id: string;
    order_id: string;
    branch_id: string;
    assigned_to: string | null;
    current_status: ProductionStatus;
    qty: number;
    started_date?: string | null;
    finished_date?: string | null;
    note?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    assignee?: ProductionAssignee | null;
    order?: ProductionMiniOrder | null;
}

export type ProductionBoardColumns = Record<ProductionBoardStatus, ProductionTask[]>;

export interface ProductionBoardData {
    columns: ProductionBoardColumns;
    items: ProductionTask[];
}

export type ProductionBoardFilterStatus = ProductionBoardStatus | 'OVERDUE';

export interface ProductionBoardQuery {
    q?: string;
    status?: ProductionBoardFilterStatus;
    branch_id?: string;
    assigned_to?: string;
    page?: number;
    per_page?: number;
}

export interface ProductionMovePayload {
    to_status: ProductionStatus;
    note?: string | null;
}

export interface ProductionActionPayload {
    note?: string | null;
}

export type ProductionCorrectionType = 'REWASH' | 'ROLLBACK';
export type ProductionCorrectionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ProductionCorrectionRequestPayload {
    type: ProductionCorrectionType;
    reason: string;
    direct?: boolean;
}

export interface ProductionCorrectionReviewPayload {
    review_note?: string | null;
}

export interface ProductionCorrectionRequest {
    id: string;
    production_task_id: string;
    order_id: string;
    branch_id: string;
    requested_by: string | number;
    reviewed_by?: string | number | null;
    type: ProductionCorrectionType;
    from_status: ProductionStatus;
    to_status: ProductionStatus;
    reason: string;
    status: ProductionCorrectionStatus;
    review_note?: string | null;
    requested_date?: string | null;
    reviewed_date?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    order?: ProductionMiniOrder | null;
    task?: ProductionTask | null;
    requester?: ProductionAssignee | null;
    reviewer?: ProductionAssignee | null;
}

export interface ProductionCorrectionRequestQuery {
    status?: ProductionCorrectionStatus;
    type?: ProductionCorrectionType;
    branch_id?: string;
    page?: number;
    per_page?: number;
}

export interface ProductionReportDetail {
    order_id: string;
    invoice_no?: string | null;
    number?: string | null;
    customer_name?: string | null;
    qty: number;
    current_status?: ProductionStatus | null;
    received_at?: string | null;
    ready_at?: string | null;
    started_date?: string | null;
    finished_date?: string | null;
    is_overdue: boolean;
    overdue_days: number;
    overdue_text?: string | null;
}

export interface ProductionStaffReportRow {
    user_id: string;
    staff_name: string;
    total_invoice: number;
    total_qty: number;
    finished: number;
    unfinished: number;
    overdue: number;
    details: ProductionReportDetail[];
}

export interface ProductionReportQuery {
    date_from?: string;
    date_to?: string;
    branch_id?: string;
    user_id?: string;
}

export interface ApiEnvelope<T, M = unknown> {
    data: T;
    meta: M;
    message: string | null;
    errors: Record<string, string[]> | null;
}

export type ProductionBoardResponse = ApiEnvelope<
    ProductionBoardData,
    {
        branch_id?: string | null;
        statuses: ProductionBoardStatus[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    }
>;

export type ProductionTaskResponse = ApiEnvelope<ProductionTask, Record<string, unknown>>;

export type ProductionCorrectionRequestResponse = ApiEnvelope<
    ProductionCorrectionRequest,
    Record<string, unknown>
>;

export type ProductionCorrectionRequestListResponse = ApiEnvelope<
    ProductionCorrectionRequest[],
    PaginationMeta
>;

export type ProductionReportResponse = ApiEnvelope<
    ProductionStaffReportRow[],
    {
        from: string;
        to: string;
        branch_id?: string | null;
    }
>;

export type { PaginationMeta };