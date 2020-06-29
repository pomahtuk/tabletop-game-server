// import conductBattle from "../../helpers/conductBattle";

import Player from "../../Player";
import Planet from "../../Planet";
import Fleet from "../../Fleet";
import conductBattle from "../../helpers/conductBattle";

describe("conductBattle", (): void => {
  it("Able to conduct simple battle with attacker as a clear winner", (): void => {
    const player1 = new Player();
    const attackerFleet = new Fleet({
      owner: player1,
      amount: 100,
      destination: "A",
      killPercent: 0.5,
    });

    const defenderPlanet = new Planet("A");

    const shipsToDestroy = defenderPlanet.ships;
    conductBattle({
      attackerFleet,
      defenderPlanet,
    });
    expect(player1.stats!.enemyFleetsDestroyed).toBe(1);
    expect(player1.stats!.enemyShipsDestroyed).toBe(shipsToDestroy);
    expect(defenderPlanet.owner).toMatchObject(player1);
  });

  it("Able to conduct simple battle with defender as a clear winner", (): void => {
    const player1 = new Player();
    const attackerFleet = new Fleet({
      owner: player1,
      amount: 1,
      destination: "A",
      killPercent: 0.2,
    });

    const defenderPlanet = new Planet("A");

    conductBattle({
      attackerFleet,
      defenderPlanet,
    });
    expect(player1.stats!.enemyFleetsDestroyed).toBe(0);
    expect(defenderPlanet.owner).toBeNull();
  });

  it("Able to conquer planet from other player", (): void => {
    const player1 = new Player();
    const player2 = new Player();
    const attackerFleet = new Fleet({
      owner: player1,
      amount: 30,
      destination: "A",
      killPercent: 0.5,
    });

    const defenderPlanet = new Planet("A", player2);

    conductBattle({
      attackerFleet,
      defenderPlanet,
    });
    expect(player1.stats!.enemyFleetsDestroyed).toBe(1);
    expect(defenderPlanet.owner).toMatchObject(player1);
  });

  it("Able to hold player planet against attack", (): void => {
    const player1 = new Player();
    const player2 = new Player();
    const attackerFleet = new Fleet({
      owner: player1,
      amount: 3,
      destination: "A",
      killPercent: 0.5,
    });

    const defenderPlanet = new Planet("A", player2);

    conductBattle({
      attackerFleet,
      defenderPlanet,
    });
    expect(player2.stats!.enemyFleetsDestroyed).toBe(1);
    expect(player2.stats!.enemyShipsDestroyed).toBe(3);
    expect(defenderPlanet.owner).toMatchObject(player2);
  });
});
