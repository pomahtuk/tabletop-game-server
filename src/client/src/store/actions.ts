import {
  GAMES_ERROR,
  LOADING_USER,
  SET_GAME_FIELD_SETTINGS,
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
import { ComputerPlayerType, Player, State } from "@/store/state";
import { v4 as uuid } from "uuid";
import getPlanetLimit from "../../../server/gamelogic/helpers/getPlanetLimit";

export const actionTypes = {
  CHECK_USER: "CHECK_USER",
  LOGIN_USER: "LOGIN_USER",
  REGISTER_USER: "REGISTER_USER",
  LOGOUT_USER: "LOGOUT_USER",
  GET_GAMES: "GET_GAMES",
  SET_GAME_NAME: "SET_GAME_NAME",
  SET_GAME_FIELD_HEIGHT: "SET_GAME_FIELD_HEIGHT",
  SET_GAME_FIELD_WIDTH: "SET_GAME_FIELD_WIDTH",
  SET_GAME_NEUTRAL_PLANETS_COUNT: "SET_GAME_NEUTRAL_PLANETS_COUNT",
  ADD_PLAYER: "ADD_PLAYER",
  ADD_USER_AS_PLAYER: "ADD_USER_AS_PLAYER",
  REMOVE_PLAYER: "REMOVE_PLAYER",
};

export type PlayerTypeString = "human" | "easy" | "hard" | "normal";

const actions: ActionTree<State, State> = {
  [actionTypes.ADD_USER_AS_PLAYER](this, { commit, state }) {
    const {
      user,
      gamePlayerSettings: { initialPlayers },
    } = state;

    if (!user) {
      return;
    }

    const player: Player = {
      isComputer: false,
      id: user.id,
      username: user.username,
    };

    return commit(SET_GAME_PLAYERS, [...initialPlayers, player]);
  },

  [actionTypes.ADD_PLAYER](
    this,
    { commit, state },
    playerType: PlayerTypeString
  ) {
    const {
      gamePlayerSettings: { initialPlayers },
    } = state;

    const isComputer = playerType !== "human";

    const player: Player = {
      isComputer,
      id: uuid(),
      username: isComputer ? `Bot ${initialPlayers.length}` : "???",
    };

    if (isComputer) {
      player.computerPlayerType = playerType as ComputerPlayerType;
    }

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

  [actionTypes.SET_GAME_NAME](this, { commit, state }, name: string) {
    const { gameSettings } = state;

    return commit(SET_GAME_SETTINGS, {
      ...gameSettings,
      name,
    });
  },

  [actionTypes.SET_GAME_FIELD_WIDTH](this, { commit, state }, width: number) {
    const { neutralPlanets } = state.gameFieldSettings;
    const fieldSize = state.gameFieldSettings.fieldHeight * width;
    const maxPlanets = getPlanetLimit(
      fieldSize,
      state.gamePlayerSettings.initialPlayers.length
    );
    return commit(SET_GAME_FIELD_SETTINGS, {
      ...state.gameFieldSettings,
      filedWidth: width,
      neutralPlanets:
        neutralPlanets <= maxPlanets ? neutralPlanets : maxPlanets,
    });
  },

  [actionTypes.SET_GAME_FIELD_HEIGHT](this, { commit, state }, height: number) {
    const { neutralPlanets } = state.gameFieldSettings;
    const fieldSize = state.gameFieldSettings.filedWidth * height;
    const maxPlanets = getPlanetLimit(
      fieldSize,
      state.gamePlayerSettings.initialPlayers.length
    );
    return commit(SET_GAME_FIELD_SETTINGS, {
      ...state.gameFieldSettings,
      fieldHeight: height,
      neutralPlanets:
        neutralPlanets <= maxPlanets ? neutralPlanets : maxPlanets,
    });
  },

  [actionTypes.SET_GAME_NEUTRAL_PLANETS_COUNT](
    this,
    { commit, state },
    neutralPlanets: number
  ) {
    return commit(SET_GAME_FIELD_SETTINGS, {
      ...state.gameFieldSettings,
      neutralPlanets,
    });
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
