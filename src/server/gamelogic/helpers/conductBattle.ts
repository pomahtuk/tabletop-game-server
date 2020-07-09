import Planet from "../Planet";
import { PlayerStatsMap } from "../Player";
import Fleet from "../Fleet";

export interface ConductBattleParams {
  attackerFleet: Fleet;
  defenderPlanet: Planet;
  statsMap: PlayerStatsMap;
}

const conductBattle = ({
  defenderPlanet,
  attackerFleet,
  statsMap,
}: ConductBattleParams): void => {
  let haveVictor = false;
  let planetHolds = true;

  const makePlanetKill = (fleet: Fleet, playerId?: string): void => {
    fleet.amount -= 1;
    if (playerId && statsMap[playerId]) {
      statsMap[playerId].enemyShipsDestroyed += 1;
    }
  };

  const makeFleetKill = (planet: Planet, playerId: string): void => {
    planet.ships -= 1;
    statsMap[playerId]!.enemyShipsDestroyed += 1;
  };

  while (!haveVictor) {
    const attackerRoll = Math.random();
    const defenderRoll = Math.random();

    // check if defender able to score a kill
    if (defenderRoll < defenderPlanet.killPercent) {
      makePlanetKill(attackerFleet, defenderPlanet.owner);
    }

    // attacker lost all ships
    if (attackerFleet.amount <= 0) {
      haveVictor = true;
      planetHolds = true;
      break;
    }

    // check if attacker able to score a kill
    if (attackerRoll < attackerFleet.killPercent) {
      makeFleetKill(defenderPlanet, attackerFleet.owner);
    }

    // defender lost all ships
    if (defenderPlanet.ships <= 0) {
      haveVictor = true;
      planetHolds = false;
      break;
    }
  }

  if (planetHolds && defenderPlanet.owner && statsMap[defenderPlanet.owner]) {
    statsMap[defenderPlanet.owner].enemyFleetsDestroyed += 1;
  }

  if (!planetHolds) {
    statsMap[attackerFleet.owner].enemyFleetsDestroyed += 1;
    defenderPlanet.owner = attackerFleet.owner;
  }
};

export default conductBattle;
