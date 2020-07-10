import { LOADING_USER, SET_USER, USER_ERROR } from "@/store/constants";
import { login, register, UserData } from "@/api/users";
import { ActionTree } from "vuex";
import { State } from "@/store/state";

export const actionTypes = {
  LOGIN_USER: "LOGIN_USER",
  REGISTER_USER: "REGISTER_USER",
};

const actions: ActionTree<State, State> = {
  async [actionTypes.LOGIN_USER](this, { commit }, userData: UserData) {
    commit(LOADING_USER);
    try {
      const user = await login(userData);
      commit(SET_USER, user);
    } catch (e) {
      commit(USER_ERROR, e.message);
    }
  },

  async [actionTypes.REGISTER_USER](this, { commit }, userData: UserData) {
    commit(LOADING_USER);
    try {
      const user = await register(userData);
      commit(SET_USER, user);
    } catch (e) {
      commit(USER_ERROR, e.message);
    }
  },
};

export default actions;
