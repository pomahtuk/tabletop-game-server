import Player from "../Player";
import Planet, { PlanetMap } from "../Planet";
import Fleet from "../Fleet";
import { User } from "../../dao/entities/user";

export interface MarkDeadPlayersOptions {
  players: (Player | User)[];
  planets: PlanetMap;
  remainingTimeline: Fleet[][];
}

const markDeadPlayers = ({
  players,
  planets,
  remainingTimeline,
}: MarkDeadPlayersOptions): void => {
  // dead - no planets owned and no fleets in future timeline
  const foundPlayerIds: Set<string> = new Set();
  Object.keys(planets)
    .map((planetName): Planet => planets[planetName])
    .forEach((planet): void => {
      if (planet.owner) {
        foundPlayerIds.add(planet.owner.id);
      }
    });
  remainingTimeline.forEach((fleets): void => {
    fleets.forEach((fleet): void => {
      foundPlayerIds.add(fleet.owner.id);
    });
  });
  players.forEach((player): void => {
    if (!foundPlayerIds.has(player.id)) {
      player.stats!.isDead = true;
    }
  });
};

export default markDeadPlayers;
