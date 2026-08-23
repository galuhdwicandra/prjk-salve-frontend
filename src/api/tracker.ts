import { api } from './client';
import type { SingleResponse } from '../types/orders';
import type {
    CustomerTrackerData,
    TrackerDetail,
    TrackerLink,
    TrackerSearchRow,
} from '../types/tracker';

export async function searchTracker(q: string) {
    const { data } = await api.get<SingleResponse<TrackerSearchRow[]>>('/tracker/search', {
        params: { q },
    });
    return data;
}

export async function getTracker(id: string) {
    const { data } = await api.get<SingleResponse<TrackerDetail>>(
        `/tracker/orders/${encodeURIComponent(id)}`,
    );
    return data;
}

export async function issueTrackerLink(id: string) {
    const { data } = await api.post<SingleResponse<TrackerLink>>(
        `/tracker/orders/${encodeURIComponent(id)}/link`,
    );
    return data;
}

export async function revokeTrackerLink(id: string) {
    const { data } = await api.delete<SingleResponse<null>>(
        `/tracker/orders/${encodeURIComponent(id)}/link`,
    );
    return data;
}

export async function getCustomerTracker(token: string) {
    const { data } = await api.get<SingleResponse<CustomerTrackerData>>(
        `/track/t/${encodeURIComponent(token)}`,
    );
    return data;
}
