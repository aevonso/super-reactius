import axios from "axios";

export const http = axios.create({
  baseURL: "",
  withCredentials: false,
  headers: { "Content-Type": "application/json" }
});

http.interceptors.request.use((config) => {
  const t = localStorage.getItem("access_token");
  if (t) config.headers = { ...config.headers, Authorization: `Bearer ${t}` };
  return config;
});

http.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const rt = localStorage.getItem("refresh_token");
      if (rt) {
        const { data } = await axios.post("/api/token/refresh/", { refresh: rt });
        localStorage.setItem("access_token", data.access);
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${data.access}` };
        return http(original);
      }
    }
    return Promise.reject(error);
  }
);
