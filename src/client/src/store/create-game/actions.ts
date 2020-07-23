import { ComputerPlayerType, Player, State } from "@/store/state";
import {
  SET_GAME_FIELD_SETTINGS,
  SET_GAME_PLAYERS,
  SET_GAME_SETTINGS,
} from "@/store/constants";
import { v4 as uuid } from "uuid";
import getPlanetLimit from "../../../../server/gamelogic/helpers/getPlanetLimit";
import { ActionTree } from "vuex";

export const actionTypes = {
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
};

export default actions;
