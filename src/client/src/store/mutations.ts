import { LOADED_USER, LOADING_USER, SET_USER } from "@/store/constants";
import { State, User } from "@/store/state";

export default {
  [LOADING_USER](state: State) {
    state.loadingUser = true;
  },
  [LOADED_USER](state: State) {
    state.loadingUser = false;
  },
  [SET_USER](state: State, user: User) {
    state.user = user;
  },
};
