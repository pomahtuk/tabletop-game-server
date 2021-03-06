export interface GameItem {
  created: string;
  name: string;
  players: string;
  fieldSize: string;
  neutralPlanets: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface GameSettings {
  name: string;
  isPrivate: boolean;
  password?: string;
}

export interface GameFieldSettings {
  fieldHeight: number;
  filedWidth: number;
  neutralPlanets: number;
}

export enum ComputerPlayerType {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
}

export interface Player {
  id: string;
  isComputer: boolean;
  computerPlayerType?: ComputerPlayerType;
  username?: string;
}

export interface GamePlayerSettings {
  initialPlayers: Player[];
}

export interface State {
  loadingUser: boolean;
  userError?: string;
  gamesError?: string;
  user?: User;
  games: GameItem[];
  gameSettings: GameSettings;
  gameFieldSettings: GameFieldSettings;
  gamePlayerSettings: GamePlayerSettings;
}

const state: State = {
  loadingUser: false,
  userError: undefined,
  gamesError: undefined,
  user: undefined,
  games: [],
  gameSettings: {
    name: "New game",
    isPrivate: false,
    password: "",
  },
  gameFieldSettings: {
    fieldHeight: 10,
    filedWidth: 10,
    neutralPlanets: 2,
  },
  gamePlayerSettings: {
    initialPlayers: [],
  },
};

export default state;
