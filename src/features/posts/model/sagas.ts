import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE } from "./slice";
import { listPosts } from "../api/repo";

function* fetchWorker(action: any): any {
  try {
    const { page, pageSize } = action.payload;
    const data = yield call(listPosts, page, pageSize);
    yield put({ type: FETCH_SUCCESS, payload: data });
  } catch (e: any) {
    const msg = e?.response?.data?.detail || e?.message || "Не удалось загрузить посты";
    yield put({ type: FETCH_FAILURE, payload: msg });
  }
}

export default function* postsSaga() {
  yield takeLatest(FETCH_REQUEST, fetchWorker);
}
