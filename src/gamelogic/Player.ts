import { v4 as uuid } from "uuid";

export interface PlayerTurnOrder {
  origin: string;
  destination: string;
  amount: number;
}

export interface PlayerTurn {
  player: Player;
  orders: PlayerTurnOrder[];
}

export default class Player {
  public id: string;
  public screenName: string;
  public statEnemyShipsDestroyed = 0;
  public statEnemyFleetsDestroyed = 0;
  public statShipCount = 0;
  public isDead = false;
  public isComputer = false;

  public constructor(id: string = uuid(), name: string) {
    this.id = id;
    this.screenName = name;
    this.statEnemyShipsDestroyed = 0;
    this.statEnemyFleetsDestroyed = 0;
    this.statShipCount = 0;
  }
}
