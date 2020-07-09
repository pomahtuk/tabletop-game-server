export interface PlayerTurnOrder {
  origin: string;
  destination: string;
  amount: number;
}

export interface PlayerTurn {
  playerId: string;
  orders: PlayerTurnOrder[];
}

export interface PlayerStats {
  enemyShipsDestroyed: number;
  enemyFleetsDestroyed: number;
  shipCount: number;
  isDead: boolean;
}

export interface PlayerStatsMap {
  [key: string]: PlayerStats;
}

export interface Player {
  id: string;
  isComputer: boolean;
  username?: string;
}
