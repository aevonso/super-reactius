import axios from "axios";

export const http = axios.create({
  baseURL: "/",
  timeout: 20000,
  withCredentials: false,
  validateStatus: s => s < 500,
});

export type Tokens = { access: string; refresh?: string };

export async function login(email: string, password: string): Promise<Tokens> {
  const body = new URLSearchParams();
  body.set("email", email);
  body.set("password", password);

  const res = await http.post("/auth/token-generate", body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  if (res.status >= 200 && res.status < 300) {
    const data = res.data;
    const access = data.access_token;
    const refresh = data.refresh_token;
    if (!access) throw new Error("Сервер не вернул access_token");
    return { access, refresh };
  }
  throw new Error(`${res.status}: ${JSON.stringify(res.data)}`);
}

export async function refreshToken(refresh: string): Promise<Tokens> {
  const body = new URLSearchParams();
  body.set("refresh_token", refresh);
  const res = await http.post("/auth/token-refresh", body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
  if (res.status >= 200 && res.status < 300) {
    return { access: res.data.access_token, refresh: res.data.refresh_token };
  }
  throw new Error("Не удалось обновить токен");
}

export async function getProfile(access: string) {
  const res = await http.get("/profile", {
    headers: { Authorization: `Bearer ${access}` }
  });
  return res.data;
}

export function isAuthed() {
  return !!localStorage.getItem("access_token");
}
