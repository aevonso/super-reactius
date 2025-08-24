import http from "@/app/api/http";
import { API_PATHS } from "@/app/api/config";
import { parsePaginationHeaders } from "@/app/utils/pagination";

export async function listPosts(page: number, pageSize: number) {
  const res = await http.get(API_PATHS.posts, { params: { page, page_size: pageSize } });
  const { total } = parsePaginationHeaders(res.headers);
  return {
    items: Array.isArray(res.data) ? res.data : (res.data?.results ?? []),
    total: Number.isFinite(total) ? total : (Array.isArray(res.data) ? res.data.length : (res.data?.count ?? 0)),
    page,
    pageSize,
  };
}
