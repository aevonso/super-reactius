export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "/";
export const API_PATHS = {
  login: (import.meta.env.VITE_API_LOGIN_PATH as string) || "/api/token/",
  refresh: (import.meta.env.VITE_API_REFRESH_PATH as string) || "/api/token/refresh/",
  posts: (import.meta.env.VITE_API_POSTS_PATH as string) || "/api/posts",
};
