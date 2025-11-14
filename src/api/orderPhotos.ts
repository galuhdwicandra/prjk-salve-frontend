// src/api/orderPhotos.ts
import { api } from "./client";

export async function uploadOrderPhotos(
  orderId: string,
  before: File[] = [],
  after: File[] = []
): Promise<void> {
  const fd = new FormData();
  before.forEach(f => fd.append("photos[before][]", f));
  after.forEach(f => fd.append("photos[after][]", f));
  await api.post(`/orders/${encodeURIComponent(orderId)}/photos`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
