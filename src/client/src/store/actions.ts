import { GAMES_ERROR, SET_GAMES } from "@/store/constants";
import { getGames } from "@/api/clinet";
import { ActionTree } from "vuex";
import { State } from "@/store/state";
import createGameActions from "./create-game/actions";
import authActions from "./auth/actions";

export const actionTypes = {
  GET_GAMES: "GET_GAMES",
};

const actions: ActionTree<State, State> = {
  ...createGameActions,

  ...authActions,

  async [actionTypes.GET_GAMES](this, { commit }) {
    try {
      const games = await getGames();
      commit(SET_GAMES, games);
      return games;
    } catch (e) {
      commit(GAMES_ERROR, e.message);
    }
  },
};

export default actions;
