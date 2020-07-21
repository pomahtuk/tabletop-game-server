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
  GameFieldSettings,
  GameItem,
  GameSettings,
  Player,
  State,
  User,
} from "@/store/state";

export default {
  [LOADING_USER](state: State): void {
    state.loadingUser = true;
    state.userError = undefined;
  },
  [USER_ERROR](state: State, error: string): void {
    state.loadingUser = false;
    state.userError = error;
  },
  [SET_USER](state: State, user: User): void {
    state.loadingUser = false;
    state.user = user;
  },
  [SET_GAMES](state: State, games: GameItem[]): void {
    state.gamesError = undefined;
    state.games = games;
  },
  [GAMES_ERROR](state: State, error: string): void {
    state.gamesError = error;
  },
  [SET_GAME_SETTINGS](state: State, settings: GameSettings): void {
    state.gameSettings = settings;
  },
  [SET_GAME_FIELD_SETTINGS](state: State, settings: GameFieldSettings): void {
    state.gameFieldSettings = settings;
  },
  [SET_GAME_PLAYERS](state: State, players: Player[]): void {
    state.gamePlayerSettings.initialPlayers = players;
  },
};
