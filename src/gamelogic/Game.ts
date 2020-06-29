import Planet, { PlanetMap, produceFleets } from "./Planet";
import Player, { PlayerTurn } from "./Player";
import Fleet from "./Fleet";

import getPlanetName from "./helpers/getPlanetName";
import getDistanceBetweenPoints from "./helpers/getDistanceBetweenPoints";
import validateTurnData from "./helpers/validateTurnData";
import placePlanets from "./helpers/placePlanets";
import conductBattle from "./helpers/conductBattle";
import markDeadPlayers from "./helpers/markDeadPlayers";
import ComputerPlayer, { takeTurn } from "./ComputerPlayer";
import { User } from "../dao/entities/user";

export interface GameOptions {
  fieldHeight: number;
  fieldWidth: number;
  neutralPlanetCount: number;
  players: Player[];
}

export enum GameStatus {
  "NOT_STARTED" = "not_started",
  "IN_PROGRESS" = "in_progress",
  "COMPLETED" = "completed",
}

export enum TurnStatus {
  "VALID" = "valid",
  "IGNORED" = "ignored",
  "INVALID" = "invalid",
}

export const findPlayerFleets = (
  fleets: Fleet[][],
  player: Player | User
): Fleet[] =>
  fleets.reduce((acc, fleetList) => {
    const playerFleets = fleetList.filter(
      (fleet) => fleet.owner.id === player.id
    );
    return [...acc, ...playerFleets];
  }, []);

const processTurn = (game: ConquestGame) => {
  // send fleets
  const currentTurns = game.turns;
  for (const turn of currentTurns) {
    for (const order of turn.orders) {
      const originPlanet = game.planets[order.origin];
      const destinationPlanet = game.planets[order.destination];
      const fleetTimelineIndex = getDistanceBetweenPoints(
        originPlanet.coordinates,
        destinationPlanet.coordinates
      );
      const fleetTimelinePoint = game.fleetTimeline[fleetTimelineIndex] || [];
      fleetTimelinePoint.push(
        new Fleet({
          owner: originPlanet.owner as Player,
          amount: order.amount,
          killPercent: originPlanet.killPercent,
          destination: destinationPlanet.name,
        })
      );
      game.fleetTimeline[fleetTimelineIndex] = fleetTimelinePoint;
      originPlanet.ships -= order.amount;
    }
  }

  // check arrival
  const arrivingFleets = game.fleetTimeline.shift() || [];
  for (const fleet of arrivingFleets) {
    const destinationPlanet = game.planets[fleet.destination];
    if (
      destinationPlanet.owner &&
      destinationPlanet.owner.id === fleet.owner.id
    ) {
      // arriving to own planet, grow fleet
      destinationPlanet.ships += fleet.amount;
    } else {
      conductBattle({
        attackerFleet: fleet,
        defenderPlanet: destinationPlanet,
      });
    }
  }

  // do production only for captured planets
  Object.keys(game.planets).forEach((planetName): void =>
    produceFleets(game.planets[planetName])
  );

  // mark dead players
  markDeadPlayers({
    players: game.players!,
    planets: game.planets,
    remainingTimeline: game.fleetTimeline,
  });

  // clean turn data
  game.turns = [];

  // check if someone won
  findWinner(game);
};

const findWinner = (game: ConquestGame): void => {
  // may be check if all planets are captured?
  const alivePlayers = game.players!.filter(
    (player): boolean => !player.stats!.isDead
  );
  // if we have exactly 1 alive player
  if (alivePlayers.length === 1) {
    game.winner = alivePlayers[0];
    game.status = GameStatus.COMPLETED;
    return;
  }
  // if only computers left we don't really care about the winner
  const humanPlayersLeft = alivePlayers.filter(
    (player): boolean => !player.isComputer
  );
  if (humanPlayersLeft.length === 0) {
    game.winner = null;
    game.status = GameStatus.COMPLETED;
  }
};

export const findNextValidPlayer = (game: ConquestGame): void => {
  game.waitingForPlayer += 1;
  if (game.waitingForPlayer >= game.players!.length) {
    // if we made full circle - start anew
    game.waitingForPlayer = 0;
    // and process current turn
    processTurn(game);
  }
  const nextPlayer = game.players![game.waitingForPlayer];
  if (nextPlayer.stats!.isDead) {
    findNextValidPlayer(game);
  }
  // moving computer turn processing here for now, but make sure not to make a turn once game completed
  if (nextPlayer.isComputer && game.status !== GameStatus.COMPLETED) {
    const orders = takeTurn(
      nextPlayer as ComputerPlayer,
      game.planets,
      findPlayerFleets(game.fleetTimeline, nextPlayer)
    );
    addDataToTurn(game, {
      player: nextPlayer,
      orders,
    });
    findNextValidPlayer(game);
  }
};

const addDataToTurn = (game: ConquestGame, data: PlayerTurn): void => {
  // check if we already have some data for this turn
  const turn = game.turns;
  turn.push(data);
};

export const addPlayerTurnData = (
  game: ConquestGame,
  data: PlayerTurn
): TurnStatus => {
  // do not accept any turns for completed game
  if (game.status === GameStatus.COMPLETED) {
    return TurnStatus.IGNORED;
  }
  const { player } = data;
  const playerWeAreWaitingFor = game.players![game.waitingForPlayer!];
  if (player.id !== playerWeAreWaitingFor.id) {
    return TurnStatus.INVALID;
  }
  // this will throw if data is invalid
  const result = validateTurnData(data, game.planets);
  if (!result.valid) {
    return TurnStatus.INVALID;
  }
  // mark game as in progress if it is not started yet
  if (game.status === GameStatus.NOT_STARTED) {
    game.status = GameStatus.IN_PROGRESS;
  }
  // check if we already have some data for this turn
  addDataToTurn(game, data);
  // update pointer to player we are waiting for
  findNextValidPlayer(game);
  return TurnStatus.VALID;
};

class ConquestGame {
  public static maxSize = 20;
  public static minSize = 4;
  public static minPlayers = 2;
  public static maxPlayers = 4;

  public players?: (User | Player)[] = [];
  readonly fieldHeight: number;
  readonly fieldWidth: number;
  public turns: PlayerTurn[] = [];
  public planets: PlanetMap = {};
  public waitingForPlayer = -1;
  public fleetTimeline: Fleet[][] = [];
  public status: GameStatus = GameStatus.NOT_STARTED;
  public winner: Player | User | null = null;

  public get fieldSize(): [number, number] {
    return [this.fieldHeight, this.fieldWidth];
  }

  public constructor({
    fieldHeight: height,
    fieldWidth: width,
    neutralPlanetCount,
    players: newPlayers,
  }: GameOptions) {
    this.fieldHeight = height;
    this.fieldWidth = width;
    // create game field
    // get players in easy way
    this.addPlayers!(newPlayers);
    // add neutral planets
    this.addNeutralPlanets!(neutralPlanetCount, newPlayers.length);
    // place planets
    placePlanets({
      planets: this.planets,
      fieldHeight: this.fieldHeight,
      fieldWidth: this.fieldWidth,
      planetCount: neutralPlanetCount + newPlayers.length,
    });
    // we start from negative to make sure that when firs player is computer we are able to have a game
    findNextValidPlayer(this);
  }

  private addPlayers?(newPlayers: Player[]): void {
    this.players = newPlayers;
    // generate player planets
    newPlayers.forEach((player, index): void => {
      const playerPlanet = new Planet(getPlanetName(index), player);
      this.planets[playerPlanet.name] = playerPlanet;
    });
  }

  private addNeutralPlanets?(
    neutralPlanetCount: number,
    playersCount: number
  ): void {
    for (let i = 0; i < neutralPlanetCount; i++) {
      const planet = new Planet(getPlanetName(playersCount + i));
      this.planets[planet.name] = planet;
    }
  }
}

export default ConquestGame;
