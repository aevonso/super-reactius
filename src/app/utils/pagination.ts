export function parsePaginationHeaders(headers: any) {
  const h: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers || {})) h[k.toLowerCase()] = String(v);
  const total = Number(h["x-total-count"] ?? h["x-total"] ?? 0);
  const page = Number(h["x-page"] ?? 1);
  const pageSize = Number(h["x-per-page"] ?? h["x-page-size"] ?? 10);
  return { total, page, pageSize };
}
