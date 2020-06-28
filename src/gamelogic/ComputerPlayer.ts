import Player, { PlayerTurnOrder } from "./Player";
import Fleet from "./Fleet";
import Planet, { PlanetMap } from "./Planet";
import getDistanceBetweenPoints from "./helpers/getDistanceBetweenPoints";
import { v4 as uuid } from "uuid";

export enum ComputerPlayerType {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
}

const shouldSkipPlanet = (
  planetName: string,
  orders: PlayerTurnOrder[],
  fleets: Fleet[]
): boolean => {
  for (const order of orders) {
    if (order.destination === planetName) {
      return true;
    }
  }

  for (const fleet of fleets) {
    if (fleet.destination === planetName) {
      return true;
    }
  }

  return false;
};

export const takeTurn = (
  player: ComputerPlayer,
  planets: PlanetMap,
  fleets: Fleet[]
): PlayerTurnOrder[] => {
  const orders: PlayerTurnOrder[] = [];

  const planetList: Planet[] = Object.keys(planets).map(
    (planetName) => planets[planetName]
  );

  for (const origin of planetList) {
    if (origin.owner && origin.owner.id === player.id) {
      let shouldAttack = false;
      let shipsToSend = Math.floor(origin.ships * 0.7);
      let destinationName = "";
      let minDistance = 10;

      if (shipsToSend >= player.minimumShips) {
        for (const destination of planetList) {
          if (destination.owner && destination.owner.id === player.id) {
            continue;
          }

          const distance = getDistanceBetweenPoints(
            origin.coordinates,
            destination.coordinates
          );

          if (distance < minDistance && destination.ships < shipsToSend) {
            if (shouldSkipPlanet(destination.name, orders, fleets)) {
              continue;
            }

            minDistance = distance;
            shouldAttack = true;
            destinationName = destination.name;
          }
        }
      }

      if (shouldAttack) {
        orders.push({
          origin: origin.name,
          destination: destinationName,
          amount: shipsToSend,
        });
      } else {
        minDistance = Number.MAX_VALUE;
        shipsToSend = 0;
        let hasDestination = false;

        for (const destination of planetList) {
          const distance = getDistanceBetweenPoints(
            origin.coordinates,
            destination.coordinates
          );
          const homeShips = Math.floor(origin.ships * 0.5);

          if (
            distance < minDistance &&
            destination.owner &&
            destination.owner.id === player.id &&
            destination.ships < homeShips
          ) {
            if (shouldSkipPlanet(destination.name, orders, fleets)) {
              continue;
            }

            shipsToSend = Math.floor(
              (origin.ships - destination.ships) / player.shipCountFactor
            );

            destinationName = destination.name;
            hasDestination = true;
            minDistance = distance;
          }
        }

        if (hasDestination) {
          orders.push({
            origin: origin.name,
            destination: destinationName,
            amount: shipsToSend,
          });
        }
      }
    }
  }

  return orders;
};

class ComputerPlayer extends Player {
  public computerType: ComputerPlayerType;
  public minimumShips = 20;
  public shipCountFactor = 2;

  constructor(id: string = uuid(), name: string, type: ComputerPlayerType) {
    super(id, name);
    this.isComputer = true;
    this.computerType = type;
  }
}

export default ComputerPlayer;
