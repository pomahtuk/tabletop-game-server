import Planet from "../../Planet";
import Fleet from "../../Fleet";

import markDeadPlayers from "../../helpers/markDeadPlayers";

describe("markDeadPlayers", (): void => {
  it("Do nothing if all players are alive", (): void => {
    const player1Id = "1";
    const player2Id = "2";
    const players = [player1Id, player2Id];

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

    const planets = {
      A: new Planet("A", player1Id),
      B: new Planet("B", player2Id),
    };

    markDeadPlayers({
      players,
      planets,
      remainingTimeline: [[]],
      statsMap,
    });

    expect(statsMap[player1Id].isDead).toBe(false);
    expect(statsMap[player1Id].isDead).toBe(false);
  });

  it("Do nothing if player have one fleet flying", (): void => {
    const playerId = "1";
    const players = [playerId];
    const planets = {};

    const statsMap = {
      [playerId]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
    };

    markDeadPlayers({
      players,
      planets,
      remainingTimeline: [
        [
          new Fleet({
            owner: playerId,
            amount: 10,
            destination: "A",
          }),
        ],
      ],
      statsMap,
    });

    expect(statsMap[playerId].isDead).toBe(false);
  });

  it("Mark player dead if it has no planets and no fleets standing", (): void => {
    const playerId = "1";
    const players = [playerId];
    const planets = {};

    const statsMap = {
      [playerId]: {
        enemyShipsDestroyed: 0,
        enemyFleetsDestroyed: 0,
        shipCount: 0,
        isDead: false,
      },
    };

    markDeadPlayers({
      players,
      planets,
      remainingTimeline: [[]],
      statsMap,
    });

    expect(statsMap[playerId].isDead).toBe(true);
  });
});
