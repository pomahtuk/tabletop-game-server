import { v4 as uuid } from "uuid";
import { User } from "../dao/entities/user";

export interface PlayerTurnOrder {
  origin: string;
  destination: string;
  amount: number;
}

export interface PlayerTurn {
  player: Player | User;
  orders: PlayerTurnOrder[];
}

export interface PlayerStats {
  enemyShipsDestroyed: number;
  enemyFleetsDestroyed: number;
  shipCount: number;
  isDead: boolean;
}

export default class Player {
  public id: string;
  public stats?: PlayerStats;
  public isComputer = false;

  public constructor(id: string = uuid()) {
    this.id = id;
    this.stats = {
      enemyShipsDestroyed: 0,
      enemyFleetsDestroyed: 0,
      shipCount: 0,
      isDead: false,
    };
  }
}
