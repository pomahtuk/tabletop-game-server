import Fleet from "../Fleet";

describe("Fleet", (): void => {
  it("Creates a new Fleet", (): void => {
    const playerId = "Tester";

    const fleet = new Fleet({
      owner: playerId,
      amount: 10,
      destination: "A",
    });

    expect(fleet).toBeDefined();
    expect(fleet.owner).toBe(playerId);
    expect(fleet.amount).toBe(10);
    expect(fleet.destination).toBe("A");
    expect(fleet.killPercent).toBe(0.5); // default when not specified
  });
});
