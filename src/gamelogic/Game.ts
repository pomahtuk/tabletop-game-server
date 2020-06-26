import Planet, { PlanetMap } from "./Planet";
import Player, { PlayerTurn } from "./Player";
import Fleet from "./Fleet";

import getPlanetName from "./helpers/getPlanetName";
import getDistanceBetweenPoints from "./helpers/getDistanceBetweenPoints";
import validateTurnData from "./helpers/validateTurnData";
import placePlanets from "./helpers/placePlanets";
import conductBattle from "./helpers/conductBattle";
import markDeadPlayers from "./helpers/markDeadPlayers";

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

export const findPlayerFleets = (fleets: Fleet[][], player: Player): Fleet[] =>
  fleets.reduce((acc, fleetList) => {
    const playerFleets = fleetList.filter(
      (fleet) => fleet.owner.id === player.id
    );
    return [...acc, ...playerFleets];
  }, []);

class ConquestGame {
  public static maxSize = 20;
  public static minSize = 4;
  public static minPlayers = 2;
  public static maxPlayers = 4;

  #players: Player[] = [];
  readonly #fieldHeight: number;
  readonly #fieldWidth: number;
  public turns: PlayerTurn[] = [];
  public planets: PlanetMap = {};
  private planetCount = 0;
  public waitingForPlayer = -1;
  public fleetTimeline: Fleet[][] = [];
  public status: GameStatus = GameStatus.NOT_STARTED;
  public winner: Player | null = null;

  // testhelpers
  public getPlayers() {
    return this.#players;
  }
  public get fieldSize(): [number, number] {
    return [this.#fieldHeight, this.#fieldWidth];
  }

  public constructor({
    fieldHeight: height,
    fieldWidth: width,
    neutralPlanetCount,
    players: newPlayers,
  }: GameOptions) {
    this.#fieldHeight = height;
    this.#fieldWidth = width;
    // create game field
    // get players in easy way
    this.addPlayers(newPlayers);
    // add neutral planets
    this.addNeutralPlanets(neutralPlanetCount, newPlayers.length);
    // place planets
    placePlanets({
      planets: this.planets,
      fieldHeight: this.#fieldHeight,
      fieldWidth: this.#fieldWidth,
      planetCount: this.planetCount,
    });
    // we start from negative to make sure that when firs player is computer we are able to have a game
    this.findNextValidPlayer();
  }

  public addPlayerTurnData(data: PlayerTurn): TurnStatus {
    // do not accept any turns for completed game
    if (this.status === GameStatus.COMPLETED) {
      return TurnStatus.IGNORED;
    }
    const { player } = data;
    const playerWeAreWaitingFor = this.#players[this.waitingForPlayer];
    if (player.id !== playerWeAreWaitingFor.id) {
      return TurnStatus.INVALID;
    }
    // this will throw if data is invalid
    const result = validateTurnData(data, this.planets);
    if (!result.valid) {
      return TurnStatus.INVALID;
    }
    // mark game as in progress if it is not started yet
    if (this.status === GameStatus.NOT_STARTED) {
      this.status = GameStatus.IN_PROGRESS;
    }
    // check if we already have some data for this turn
    this.addDataToTurn(data);
    // update pointer to player we are waiting for
    this.findNextValidPlayer();
    return TurnStatus.VALID;
  }

  private addDataToTurn(data: PlayerTurn): void {
    // check if we already have some data for this turn
    const turn = this.turns;
    turn.push(data);
  }

  private findNextValidPlayer(): void {
    this.waitingForPlayer += 1;
    if (this.waitingForPlayer >= this.#players.length) {
      // if we made full circle - start anew
      this.waitingForPlayer = 0;
      // and process current turn
      this.processTurn();
    }
    const nextPlayer = this.#players[this.waitingForPlayer];
    if (nextPlayer.isDead) {
      this.findNextValidPlayer();
    }
    // moving computer turn processing here for now, but make sure not to make a turn once game completed
    if (nextPlayer.isComputer && this.status !== GameStatus.COMPLETED) {
      const orders = nextPlayer.takeTurn(
        this.planets,
        findPlayerFleets(this.fleetTimeline, nextPlayer)
      );
      this.addDataToTurn({
        player: nextPlayer,
        orders,
      });
      this.findNextValidPlayer();
    }
  }

  private processTurn(): void {
    // send fleets
    const currentTurns = this.turns;
    for (const turn of currentTurns) {
      for (const order of turn.orders) {
        const originPlanet = this.planets[order.origin];
        const destinationPlanet = this.planets[order.destination];
        const fleetTimelineIndex = getDistanceBetweenPoints(
          originPlanet.coordinates,
          destinationPlanet.coordinates
        );
        const fleetTimelinePoint = this.fleetTimeline[fleetTimelineIndex] || [];
        fleetTimelinePoint.push(
          new Fleet({
            owner: originPlanet.owner as Player,
            amount: order.amount,
            killPercent: originPlanet.killPercent,
            destination: destinationPlanet.name,
          })
        );
        this.fleetTimeline[fleetTimelineIndex] = fleetTimelinePoint;
        originPlanet.ships -= order.amount;
      }
    }

    // check arrival
    const arrivingFleets = this.fleetTimeline.shift() || [];
    for (const fleet of arrivingFleets) {
      const destinationPlanet = this.planets[fleet.destination];
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
    Object.keys(this.planets).forEach((planetName): void =>
      this.planets[planetName].produce()
    );
    // mark dead players
    markDeadPlayers({
      players: this.#players,
      planets: this.planets,
      remainingTimeline: this.fleetTimeline,
    });

    // clean turn data
    this.turns = [];

    // check if someone won
    this.findWinner();
  }

  private findWinner(): void {
    // may be check if all planets are captured?
    const alivePlayers = this.#players.filter(
      (player): boolean => !player.isDead
    );
    // if we have exactly 1 alive player
    if (alivePlayers.length === 1) {
      this.winner = alivePlayers[0];
      this.status = GameStatus.COMPLETED;
      return;
    }
    // if only computers left we don't really care about the winner
    const humanPlayersLeft = alivePlayers.filter(
      (player): boolean => !player.isComputer
    );
    if (humanPlayersLeft.length === 0) {
      this.winner = null;
      this.status = GameStatus.COMPLETED;
    }
  }

  private addPlayers(newPlayers: Player[]): void {
    this.#players = newPlayers;
    // generate player planets
    newPlayers.forEach((player, index): void => {
      const playerPlanet = new Planet(getPlanetName(index), player);
      this.planets[playerPlanet.name] = playerPlanet;
    });
  }

  private addNeutralPlanets(
    neutralPlanetCount: number,
    playersCount: number
  ): void {
    for (let i = 0; i < neutralPlanetCount; i++) {
      const planet = new Planet(getPlanetName(playersCount + i));
      this.planets[planet.name] = planet;
    }
    this.planetCount = neutralPlanetCount + playersCount;
  }
}

export default ConquestGame;
