import { AnyAction } from "redux";
import Cookies from "js-cookie";
import { AuthState } from "./types";

export const LOGIN_REQUEST = "auth/LOGIN_REQUEST";
export const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "auth/LOGIN_FAILURE";
export const LOGOUT = "auth/LOGOUT";

const initial: AuthState = {
  isAuthenticated: Boolean(Cookies.get("access_token")),
  loading: false,
  error: null,
  email: null,
};

export default function reducer(state = initial, action: AnyAction): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, email: action.payload.email };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, isAuthenticated: false, email: null };
    default:
      return state;
  }
}
