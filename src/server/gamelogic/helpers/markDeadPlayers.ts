import Planet, { PlanetMap } from "../Planet";
import Fleet from "../Fleet";
import { PlayerStatsMap } from "../Player";

export interface MarkDeadPlayersOptions {
  players: string[];
  planets: PlanetMap;
  remainingTimeline: Fleet[][];
  statsMap: PlayerStatsMap;
}

const markDeadPlayers = ({
  players,
  planets,
  remainingTimeline,
  statsMap,
}: MarkDeadPlayersOptions): void => {
  // dead - no planets owned and no fleets in future timeline
  const foundPlayerIds: Set<string> = new Set();
  Object.keys(planets)
    .map((planetName): Planet => planets[planetName])
    .forEach((planet): void => {
      if (planet.owner) {
        foundPlayerIds.add(planet.owner);
      }
    });
  remainingTimeline.forEach((fleets): void => {
    fleets.forEach((fleet): void => {
      foundPlayerIds.add(fleet.owner);
    });
  });
  players.forEach((player): void => {
    if (!foundPlayerIds.has(player)) {
      statsMap[player].isDead = true;
    }
  });
};

export default markDeadPlayers;
