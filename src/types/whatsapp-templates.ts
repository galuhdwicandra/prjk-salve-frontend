export interface WhatsappTemplate {
    id: string;
    branch_id: string | null;
    key: 'receipt_pending' | 'receipt_paid';
    name: string;
    content: string;
    is_active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    branch?: { id: string; name: string } | null;
}

export interface WhatsappTemplateQuery {
    key?: 'receipt_pending' | 'receipt_paid';
    branch_id?: string | 'global';
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

export interface WhatsappTemplateUpsertPayload {
    branch_id?: string | null;
    key: 'receipt_pending' | 'receipt_paid';
    name: string;
    content: string;
    is_active?: boolean;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}