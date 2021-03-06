import { ActionTree } from "vuex";
import { State } from "@/store/state";
import {
  checkLogin,
  loginUser,
  logoutUser,
  registerUser,
  UserData,
} from "@/api/clinet";
import { LOADING_USER, SET_USER, USER_ERROR } from "@/store/constants";

export const actionTypes = {
  CHECK_USER: "CHECK_USER",
  LOGIN_USER: "LOGIN_USER",
  REGISTER_USER: "REGISTER_USER",
  LOGOUT_USER: "LOGOUT_USER",
  GET_GAMES: "GET_GAMES",
};

const actions: ActionTree<State, State> = {
  async [actionTypes.CHECK_USER](this, { commit }) {
    try {
      const user = await checkLogin();
      return commit(SET_USER, user);
    } catch (e) {
      // nothing here expected
    }
  },

  async [actionTypes.LOGOUT_USER](this, { commit }) {
    try {
      await logoutUser();
      return commit(SET_USER, undefined);
    } catch (e) {
      // nothing here expected
    }
  },

  async [actionTypes.LOGIN_USER](this, { commit }, userData: UserData) {
    commit(LOADING_USER);
    try {
      const user = await loginUser(userData);
      commit(SET_USER, user);
      return user;
    } catch (e) {
      commit(USER_ERROR, e.message);
    }
  },

  async [actionTypes.REGISTER_USER](this, { commit }, userData: UserData) {
    commit(LOADING_USER);
    try {
      const user = await registerUser(userData);
      commit(SET_USER, user);
      return user;
    } catch (e) {
      commit(USER_ERROR, e.message);
    }
  },
};

export default actions;
