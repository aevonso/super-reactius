import { AnyAction } from "redux";
import { PostsState } from "./types";

export const FETCH_REQUEST = "posts/FETCH_REQUEST";
export const FETCH_SUCCESS = "posts/FETCH_SUCCESS";
export const FETCH_FAILURE = "posts/FETCH_FAILURE";

const initial: PostsState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

export default function reducer(state = initial, action: AnyAction): PostsState {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SUCCESS:
      return { ...state, loading: false, ...action.payload };
    case FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
