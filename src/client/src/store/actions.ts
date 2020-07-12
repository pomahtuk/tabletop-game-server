import { LOADING_USER, SET_USER, USER_ERROR } from "@/store/constants";
import { checkLogin, login, register, UserData } from "@/api/users";
import { ActionTree } from "vuex";
import { State } from "@/store/state";

export const actionTypes = {
  CHECK_USER: "CHECK_USER",
  LOGIN_USER: "LOGIN_USER",
  REGISTER_USER: "REGISTER_USER",
};

const actions: ActionTree<State, State> = {
  async [actionTypes.CHECK_USER](this, { commit }) {
    const userString = window.localStorage.getItem("user");
    let shouldCheckServer = !userString || userString.length === 0;

    if (!shouldCheckServer) {
      try {
        return commit(SET_USER, JSON.parse(userString as string));
      } catch (e) {
        shouldCheckServer = true;
      }
    }

    if (shouldCheckServer) {
      try {
        const user = await checkLogin();
        return commit(SET_USER, user);
      } catch (e) {
        commit(SET_USER, undefined);
      }
    }

    commit(SET_USER, undefined);
  },

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
