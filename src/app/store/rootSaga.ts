import { all, fork } from "redux-saga/effects";
import authSaga from "@/features/auth/model/sagas";
import postsSaga from "@/features/posts/model/sagas";

export default function* rootSaga() {
  yield all([fork(authSaga), fork(postsSaga)]);
}
