import { LOADED_USER, SET_USER } from "@/store/constants";
import { login, register, UserData } from "@/api/users";
import { ActionTree } from "vuex";
import { State } from "@/store/state";

export const actionTypes = {
  LOGIN_USER: "LOGIN_USER",
  REGISTER_USER: "REGISTER_USER",
};

const actions: ActionTree<State, State> = {
  async [actionTypes.LOGIN_USER](
    this,
    { commit },
    { userData }: { userData: UserData }
  ) {
    commit(LOADED_USER);
    commit(LOADED_USER);
    commit(SET_USER, await login(userData));
  },

  async [actionTypes.REGISTER_USER](
    this,
    { commit },
    { userData }: { userData: UserData }
  ) {
    commit(LOADED_USER);
    commit(LOADED_USER);
    commit(SET_USER, await register(userData));
  },
};

export default actions;
