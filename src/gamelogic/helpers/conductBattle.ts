import Planet from "../Planet";
import Player from "../Player";
import Fleet from "../Fleet";
import { User } from "../../dao/entities/user";

export interface ConductBattleParams {
  attackerFleet: Fleet;
  defenderPlanet: Planet;
}

const conductBattle = ({
  defenderPlanet,
  attackerFleet,
}: ConductBattleParams): void => {
  let haveVictor = false;
  let planetHolds = true;

  const makePlanetKill = (fleet: Fleet, player: Player | User | null): void => {
    fleet.amount -= 1;
    if (player) {
      player.stats!.enemyShipsDestroyed += 1;
    }
  };

  const makeFleetKill = (planet: Planet, player: Player): void => {
    planet.ships -= 1;
    player.stats!.enemyShipsDestroyed += 1;
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

  if (planetHolds && defenderPlanet.owner) {
    defenderPlanet.owner.stats!.enemyFleetsDestroyed += 1;
  }

  if (!planetHolds) {
    attackerFleet.owner.stats!.enemyFleetsDestroyed += 1;
    defenderPlanet.owner = attackerFleet.owner;
  }
};

export default conductBattle;
