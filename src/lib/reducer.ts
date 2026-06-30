import type { AppState } from "./types";
import { DEFAULT_APP_STATE } from "./types";

export type AppAction =
  | { type: "HYDRATE"; payload: AppState }
  | { type: "UPDATE"; payload: Partial<AppState> }
  | { type: "RESET" };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "UPDATE":
      return { ...state, ...action.payload };
    case "RESET":
      return { ...DEFAULT_APP_STATE };
    default:
      return state;
  }
}
