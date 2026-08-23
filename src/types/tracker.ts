export interface TrackerStage {
    index: number;
    label: string;
}

export interface TrackerEvent {
    at: string;
    title: string;
    detail: string | null;
    actor: string | null;
    danger: boolean;
}

export interface TrackerPhoto {
    group: string;
    path: string;
}

export interface TrackerPosition {
    label: string;
    tone: string;
    suffix: string | null;
}

export interface TrackerSearchRow {
    id: string;
    number: string;
    invoice_no: string | null;
    customer: string | null;
    branch: string | null;
    status: string;
    ready_at: string | null;
    created_at: string | null;
}

export interface TrackerDetail {
    id: string;
    number: string;
    invoice_no: string | null;
    customer: string | null;
    branch: string | null;
    location: string | null;
    status: string;
    stage: TrackerStage;
    position: TrackerPosition;
    received_at: string | null;
    deadline: string | null;
    grand_total: number;
    outstanding: number;
    photos: TrackerPhoto[];
    timeline: TrackerEvent[];
    tracker_url: string | null;
    token_expires_at: string | null;
}

export interface TrackerLink {
    tracker_url: string | null;
    token_expires_at: string | null;
}

export interface CustomerTrackerData {
    number: string;
    customer_first_name: string | null;
    stage: TrackerStage;
    estimate: string | null;
    qty: number;
    outlet: {
        name: string | null;
        address: string | null;
        phone: string | null;
    };
    show_pickup: boolean;
    outstanding: number;
    photos: TrackerPhoto[];
    timeline: TrackerEvent[];
    updated_at: string;
}
