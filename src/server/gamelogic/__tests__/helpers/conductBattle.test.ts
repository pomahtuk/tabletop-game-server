import Planet from "../../Planet";
import Fleet from "../../Fleet";
import conductBattle from "../../helpers/conductBattle";

describe("conductBattle", (): void => {
  it("Able to conduct simple battle with attacker as a clear winner", (): void => {
    const playerId = "1";

    const statsMap = {
      [playerId]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
    };

    const attackerFleet = new Fleet({
      owner: playerId,
      amount: 100,
      destination: "A",
      killPercent: 0.5,
    });

    const defenderPlanet = new Planet("A");

    const shipsToDestroy = defenderPlanet.ships;
    conductBattle({
      attackerFleet,
      defenderPlanet,
      statsMap,
    });
    expect(statsMap[playerId].enemyFleetsDestroyed).toBe(1);
    expect(statsMap[playerId].enemyShipsDestroyed).toBe(shipsToDestroy);
    expect(defenderPlanet.owner).toBe(playerId);
  });

  it("Able to conduct simple battle with defender as a clear winner", (): void => {
    const playerId = "1";

    const statsMap = {
      [playerId]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
    };

    const attackerFleet = new Fleet({
      owner: playerId,
      amount: 1,
      destination: "A",
      killPercent: 0.2,
    });

    const defenderPlanet = new Planet("A");

    conductBattle({
      attackerFleet,
      defenderPlanet,
      statsMap,
    });
    expect(statsMap[playerId].enemyFleetsDestroyed).toBe(0);
    expect(defenderPlanet.owner).toBeFalsy();
  });

  it("Able to conquer planet from other player", (): void => {
    const player1Id = "1";
    const player2Id = "2";

    const statsMap = {
      [player1Id]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
      [player2Id]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
    };

    const attackerFleet = new Fleet({
      owner: player1Id,
      amount: 30,
      destination: "A",
      killPercent: 0.5,
    });

    const defenderPlanet = new Planet("A", player2Id);

    conductBattle({
      attackerFleet,
      defenderPlanet,
      statsMap,
    });
    expect(statsMap[player1Id].enemyFleetsDestroyed).toBe(1);
    expect(defenderPlanet.owner).toBe(player1Id);
  });

  it("Able to hold player planet against attack", (): void => {
    const player1Id = "1";
    const player2Id = "2";

    const statsMap = {
      [player1Id]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
      [player2Id]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
    };

    const attackerFleet = new Fleet({
      owner: player1Id,
      amount: 3,
      destination: "A",
      killPercent: 0.5,
    });

    const defenderPlanet = new Planet("A", player2Id);

    conductBattle({
      attackerFleet,
      defenderPlanet,
      statsMap,
    });
    expect(statsMap[player2Id].enemyFleetsDestroyed).toBe(1);
    expect(statsMap[player2Id].enemyShipsDestroyed).toBe(3);
    expect(defenderPlanet.owner).toBe(player2Id);
  });
});
