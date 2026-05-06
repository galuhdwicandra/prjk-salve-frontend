// src/api/orderPhotos.ts
import { api } from "./client";

export async function uploadOrderPhotos(
  orderId: string,
  before: File[] = [],
  after: File[] = [],
  replaceExisting = false
): Promise<void> {
  const fd = new FormData();

  before.forEach((f) => fd.append("photos[before][]", f));
  after.forEach((f) => fd.append("photos[after][]", f));

  fd.append("replace_existing", replaceExisting ? "1" : "0");

  await api.post(`/orders/${encodeURIComponent(orderId)}/photos`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}