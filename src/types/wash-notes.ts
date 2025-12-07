export type ProcessStatus = 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';

export interface WashNoteItem {
    id: string;
    order_id: string;
    qty: number;
    process_status?: ProcessStatus | null;
    started_at?: string | null;  // "HH:mm"
    finished_at?: string | null; // "HH:mm"
    note?: string | null;
}

export interface WashNote {
    id: string;
    user_id: number;
    branch_id: string | null;
    note_date: string; // "YYYY-MM-DD"
    orders_count: number;
    total_qty: number;
    items?: WashNoteItem[];
}

export interface OrderLite {
    id: string;
    number: string;
    invoice_no?: string | null;
    status: string;
    customer?: { id: string; name: string } | null;
    default_qty?: number;
}
