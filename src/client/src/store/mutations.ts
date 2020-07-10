import { LOADING_USER, SET_USER, USER_ERROR } from "@/store/constants";
import { State, User } from "@/store/state";

export default {
  [LOADING_USER](state: State) {
    state.loadingUser = true;
    state.userError = undefined;
  },
  [USER_ERROR](state: State, error: string) {
    state.loadingUser = false;
    state.userError = error;
  },
  [SET_USER](state: State, user: User) {
    state.loadingUser = false;
    state.user = user;
  },
};
