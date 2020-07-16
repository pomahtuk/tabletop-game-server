import {
  GAMES_ERROR,
  LOADING_USER,
  SET_GAME_NUM_PLAYERS,
  SET_GAME_PLAYERS,
  SET_GAME_SETTINGS,
  SET_GAMES,
  SET_USER,
  USER_ERROR,
} from "@/store/constants";
import {
  checkLogin,
  getGames,
  loginUser,
  logoutUser,
  registerUser,
  UserData,
} from "@/api/clinet";
import { ActionTree } from "vuex";
import {
  ComputerPlayerType,
  GameFieldSettings,
  GameSettings,
  Player,
  State,
} from "@/store/state";
import { v4 as uuid } from "uuid";

export const actionTypes = {
  CHECK_USER: "CHECK_USER",
  LOGIN_USER: "LOGIN_USER",
  REGISTER_USER: "REGISTER_USER",
  LOGOUT_USER: "LOGOUT_USER",
  GET_GAMES: "GET_GAMES",
  SET_GAME_SETTINGS: "SET_GAME_SETTINGS",
  SET_GAME_FIELD_SETTINGS: "SET_GAME_FIELD_SETTINGS",
  ADD_COMPUTER_PLAYER: "ADD_COMPUTER_PLAYER",
  ADD_PLAYER: "ADD_PLAYER",
  REMOVE_PLAYER: "REMOVE_PLAYER",
  SET_GAME_NUM_PLAYERS: "SET_GAME_NUM_PLAYERS",
};

const actions: ActionTree<State, State> = {
  [actionTypes.ADD_COMPUTER_PLAYER](
    this,
    { commit, state },
    type: ComputerPlayerType
  ) {
    const {
      gamePlayerSettings: { initialPlayers },
    } = state;

    return commit(SET_GAME_PLAYERS, [
      ...initialPlayers,
      {
        id: `computer_${uuid()}`,
        isComputer: true,
        computerPlayerType: type,
      },
    ]);
  },

  [actionTypes.ADD_PLAYER](this, { commit, state }, player: Player) {
    const {
      gamePlayerSettings: { initialPlayers },
    } = state;

    return commit(SET_GAME_PLAYERS, [...initialPlayers, player]);
  },

  [actionTypes.REMOVE_PLAYER](this, { commit, state }, index: number) {
    const {
      gamePlayerSettings: { initialPlayers },
    } = state;

    return commit(SET_GAME_PLAYERS, [
      ...initialPlayers.slice(0, index),
      ...initialPlayers.slice(index + 1, initialPlayers.length),
    ]);
  },

  [actionTypes.SET_GAME_NUM_PLAYERS](this, { commit }, number: number) {
    return commit(SET_GAME_NUM_PLAYERS, number);
  },

  [actionTypes.SET_GAME_SETTINGS](this, { commit }, settings: GameSettings) {
    return commit(SET_GAME_SETTINGS, settings);
  },

  [actionTypes.SET_GAME_FIELD_SETTINGS](
    this,
    { commit },
    settings: GameFieldSettings
  ) {
    return commit(SET_GAME_SETTINGS, settings);
  },

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
