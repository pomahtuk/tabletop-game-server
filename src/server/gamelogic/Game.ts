import { produceFleets } from "./Planet";
import { Player, PlayerStatsMap, PlayerTurn } from "./Player";
import Fleet from "./Fleet";

import getDistanceBetweenPoints from "./helpers/getDistanceBetweenPoints";
import validateTurnData from "./helpers/validateTurnData";
import conductBattle from "./helpers/conductBattle";
import markDeadPlayers from "./helpers/markDeadPlayers";
import ComputerPlayer, { takeTurn } from "./ComputerPlayer";
import { Game } from "../dao/entities/game";

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
    const playerFleets = fleetList.filter((fleet) => fleet.owner === player.id);
    return [...acc, ...playerFleets];
  }, []);

const processTurn = (game: Game, statsMap: PlayerStatsMap) => {
  // send fleets
  const currentTurns = game.turnsObj.turns || [];
  game.fleetTimelineObj.fleetTimeline =
    game.fleetTimelineObj.fleetTimeline || [];
  for (const turn of currentTurns) {
    for (const order of turn.orders) {
      const originPlanet = game.planets[order.origin];
      const destinationPlanet = game.planets[order.destination];
      const fleetTimelineIndex = getDistanceBetweenPoints(
        originPlanet.coordinates,
        destinationPlanet.coordinates
      );
      const fleetTimelinePoint =
        game.fleetTimelineObj.fleetTimeline[fleetTimelineIndex] || [];
      fleetTimelinePoint.push(
        new Fleet({
          owner: originPlanet.owner!,
          amount: order.amount,
          killPercent: originPlanet.killPercent,
          destination: destinationPlanet.name,
        })
      );
      game.fleetTimelineObj.fleetTimeline[
        fleetTimelineIndex
      ] = fleetTimelinePoint;
      originPlanet.ships -= order.amount;
    }
  }

  // check arrival
  const arrivingFleets = game.fleetTimelineObj.fleetTimeline.shift() || [];
  for (const fleet of arrivingFleets) {
    const destinationPlanet = game.planets[fleet.destination];
    if (destinationPlanet.owner === fleet.owner) {
      // arriving to own planet, grow fleet
      destinationPlanet.ships += fleet.amount;
    } else {
      conductBattle({
        attackerFleet: fleet,
        defenderPlanet: destinationPlanet,
        statsMap,
      });
    }
  }

  // do production only for captured planets
  Object.keys(game.planets).forEach((planetName): void =>
    produceFleets(game.planets[planetName], statsMap)
  );

  // mark dead players
  markDeadPlayers({
    players: game.playersObj.players.map((p) => p.id),
    planets: game.planets,
    remainingTimeline: game.fleetTimelineObj.fleetTimeline,
    statsMap,
  });

  // clean turn data
  game.turnsObj.turns = [];

  // check if someone won
  findWinner(game, statsMap);
};

const findWinner = (game: Game, statsMap: PlayerStatsMap): void => {
  // may be check if all planets are captured?
  const alivePlayers = game.playersObj.players.filter(
    (player): boolean => !statsMap[player.id]?.isDead
  );
  // if we have exactly 1 alive player
  if (alivePlayers.length === 1) {
    game.winnerId = alivePlayers[0].id;
    game.status = GameStatus.COMPLETED;
    return;
  }
  // if only computers left we don't really care about the winner
  const humanPlayersLeft = alivePlayers.filter(
    (player): boolean => !player.isComputer
  );
  if (humanPlayersLeft.length === 0) {
    game.winnerId = null;
    game.status = GameStatus.COMPLETED;
  }
};

export const findNextValidPlayer = (
  game: Game,
  statsMap: PlayerStatsMap
): void => {
  game.fleetTimelineObj.fleetTimeline =
    game.fleetTimelineObj.fleetTimeline || [];
  game.waitingForPlayer += 1;
  if (game.waitingForPlayer >= game.playersObj.players.length) {
    // if we made full circle - start anew
    game.waitingForPlayer = 0;
    // and process current turn
    processTurn(game, statsMap);
  }
  const nextPlayer = game.playersObj.players[game.waitingForPlayer];
  if (statsMap[nextPlayer.id]?.isDead) {
    findNextValidPlayer(game, statsMap);
  }
  // moving computer turn processing here for now, but make sure not to make a turn once game completed
  if (nextPlayer.isComputer && game.status !== GameStatus.COMPLETED) {
    const orders = takeTurn(
      nextPlayer as ComputerPlayer,
      game.planets,
      findPlayerFleets(game.fleetTimelineObj.fleetTimeline, nextPlayer)
    );
    addDataToTurn(game, {
      playerId: nextPlayer.id,
      orders,
    });
    findNextValidPlayer(game, statsMap);
  }
};

const addDataToTurn = (game: Game, data: PlayerTurn): void => {
  // check if we already have some data for this turn
  game.turnsObj.turns = game.turnsObj.turns || [];
  game.turnsObj.turns.push(data);
};

export const addPlayerTurnData = (
  game: Game,
  data: PlayerTurn,
  statsMap: PlayerStatsMap
): TurnStatus => {
  // do not accept any turns for completed game
  if (game.status === GameStatus.COMPLETED) {
    return TurnStatus.IGNORED;
  }
  const { playerId } = data;
  const playerWeAreWaitingFor = game.playersObj.players[game.waitingForPlayer];
  if (playerId !== playerWeAreWaitingFor.id) {
    return TurnStatus.INVALID;
  }
  // this will throw if data is invalid
  const result = validateTurnData(data, game.planets);
  if (!result.valid) {
    return TurnStatus.INVALID;
  }
  // check if we already have some data for this turn
  addDataToTurn(game, data);
  // update pointer to player we are waiting for
  findNextValidPlayer(game, statsMap);
  return TurnStatus.VALID;
};
