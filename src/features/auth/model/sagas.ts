import { call, put, takeLatest } from "redux-saga/effects";
import http from "@/app/api/http";
import { API_PATHS } from "@/app/api/config";
import Cookies from "js-cookie";
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./slice";
import { push } from "connected-react-router";

function* tryOne(url: string, body: any): any {
  const r = yield call([http, http.post], url, body);
  const access = r.data?.access || r.data?.access_token || r.data?.token;
  const refresh = r.data?.refresh || r.data?.refresh_token;
  if (access && refresh) return { access, refresh };
  throw new Error("invalid tokens");
}

function ensureSlash(u: string) {
  if (!u.endsWith("/")) return u + "/";
  return u;
}

function* loginWorker(action: any): any {
  try {
    const { email, password } = action.payload;
    const urls = Array.from(new Set([
      ensureSlash(API_PATHS.login || "/api/token/"),
      "/api/token/",
      "/api/auth/jwt/create/",
      "/api/auth/token/",
      "/api/login/",
      "/api/auth/login/"
    ]));
    const bodies = [
      { username: email, password },
      { email, password },
      { login: email, password },
      { username: email, email, password }
    ];
    let ok = null as null | { access: string; refresh: string };
    for (const u of urls) {
      for (const b of bodies) {
        try {
          ok = yield* tryOne(u, b);
          if (ok) break;
        } catch (_) {}
      }
      if (ok) break;
    }
    if (!ok) throw new Error("Страница не найдена или неверный эндпоинт авторизации");
    Cookies.set("access_token", ok.access, { path: "/" });
    Cookies.set("refresh_token", ok.refresh, { path: "/" });
    yield put({ type: LOGIN_SUCCESS, payload: { email } });
    yield put(push("/posts"));
  } catch (e: any) {
    const msg = e?.response?.data?.detail || e?.response?.data?.message || e?.message || "Ошибка авторизации";
    yield put({ type: LOGIN_FAILURE, payload: msg });
  }
}

function* logoutWorker() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  yield put(push("/login"));
}

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginWorker);
  yield takeLatest(LOGOUT, logoutWorker);
}
