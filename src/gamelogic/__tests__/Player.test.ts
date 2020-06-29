import Player from "../Player";

describe("Player", (): void => {
  it("Creates a new Player", (): void => {
    const playerId = "Tester";
    const player = new Player(playerId);

    expect(player).toBeDefined();

    expect(player.id).toBeDefined();
    expect(player.id).toEqual(playerId);
    expect(player.stats!.enemyShipsDestroyed).toBe(0);
    expect(player.stats!.enemyFleetsDestroyed).toBe(0);
    expect(player.stats!.shipCount).toBe(0);
  });
});
