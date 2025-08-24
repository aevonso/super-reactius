import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const http = axios.create({
  baseURL: "/",
  timeout: 20000,
  withCredentials: false,
  validateStatus: s => s < 500,
});

export type Tokens = { access: string; refresh?: string };

function isAuthUrl(url?: string) {
  if (!url) return false;
  return /^\/?auth(\/|$)/i.test(url);
}

http.interceptors.request.use((config: AxiosRequestConfig) => {
  try {
    const url = (config.url || "").toString();
    if (!isAuthUrl(url)) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers = config.headers || {};
        if (!("Authorization" in config.headers)) {
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
      }
    }
  } catch {}
  return config;
});

// --- тихо обрабатываем 401 ---
http.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.status === 401) {
      // чистим токены и тихо редиректим на /login
      try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } catch {}
      if (typeof window !== "undefined" && !/\/login$/.test(window.location.pathname)) {
        // без console.error — просто переход
        window.location.replace("/login");
      }
    }
    return res;
  },
  (err) => {
    // сеть/таймаут — не шумим в консоли
    return Promise.reject(err);
  }
);

// ---- auth helpers ----
export async function login(email: string, password: string): Promise<Tokens> {
  const body = new URLSearchParams();
  body.set("email", email);
  body.set("password", password);

  const res = await http.post("/auth/token-generate", body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (res.status >= 200 && res.status < 300) {
    const access = res.data?.access_token;
    const refresh = res.data?.refresh_token;
    if (!access) throw new Error("Сервер не вернул access_token");
    return { access, refresh };
  }
  throw new Error(`${res.status}: ${JSON.stringify(res.data)}`);
}

export async function refreshToken(refresh: string): Promise<Tokens> {
  const body = new URLSearchParams();
  body.set("refresh_token", refresh);
  const res = await http.post("/auth/token-refresh", body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (res.status >= 200 && res.status < 300) {
    return { access: res.data.access_token, refresh: res.data.refresh_token };
  }
  throw new Error("Не удалось обновить токен");
}

export async function getProfile() {
  const res = await http.get("/profile"); 
  return res.data;
}

export function isAuthed() {
  return !!localStorage.getItem("access_token");
}
