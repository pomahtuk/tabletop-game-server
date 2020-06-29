import Fleet from "../Fleet";
import Player from "../Player";

describe("Fleet", (): void => {
  it("Creates a new Fleet", (): void => {
    const playerId = "Tester";
    const player = new Player(playerId);

    const fleet = new Fleet({
      owner: player,
      amount: 10,
      destination: "A",
    });

    expect(fleet).toBeDefined();
    expect(fleet.owner).toBeDefined();
    expect(fleet.owner.id).toBe(playerId);
    expect(fleet.amount).toBe(10);
    expect(fleet.destination).toBe("A");
    expect(fleet.killPercent).toBe(0.5); // default when not specified
  });
});
