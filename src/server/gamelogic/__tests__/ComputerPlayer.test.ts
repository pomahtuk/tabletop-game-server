import ComputerPlayer, {
  ComputerPlayerType,
  shouldSkipPlanet,
  takeTurn,
} from "../ComputerPlayer";
import Planet from "../Planet";

describe("ComputerPlayer", (): void => {
  it("Exports computer player class", (): void => {
    expect(ComputerPlayer).toBeDefined();
  });

  it("Able to create instance of ComputerPlayer", (): void => {
    const computer = new ComputerPlayer(
      undefined,
      "test",
      ComputerPlayerType.EASY
    );
    expect(computer).toBeDefined();
    expect(computer.isComputer).toBeTruthy();
    expect(computer.computerType).toBe(ComputerPlayerType.EASY);
  });

  it("Can properly calculate if planet should not be considered as destination for turn", (): void => {
    const computer = new ComputerPlayer(
      undefined,
      "test",
      ComputerPlayerType.EASY
    );
    const shouldNot = shouldSkipPlanet("A", [], []);
    expect(shouldNot).toBe(false);
    const shouldDueToOrders = shouldSkipPlanet(
      "A",
      [
        { origin: "B", destination: "A", amount: 10 },
        { origin: "A", destination: "B", amount: 10 },
      ],
      []
    );
    expect(shouldDueToOrders).toBe(true);
    const shouldDueToFleets = shouldSkipPlanet(
      "A",
      [],
      [
        { owner: computer.id, destination: "A", amount: 10, killPercent: 0.5 },
        { owner: computer.id, destination: "B", amount: 10, killPercent: 0.5 },
      ]
    );
    expect(shouldDueToFleets).toBe(true);
  });

  it("Can prepare turn data", (): void => {
    const computer = new ComputerPlayer(
      undefined,
      "test",
      ComputerPlayerType.EASY
    );
    expect(takeTurn(computer, {}, [])).toHaveLength(0);
  });

  it("Can prepare turn data when there is a planet to skip in data due to sent fleets", (): void => {
    const computer = new ComputerPlayer(
      undefined,
      "test",
      ComputerPlayerType.EASY
    );
    const planetC = new Planet("C", computer.id, { x: 0, y: 0 });
    planetC.ships = 100;
    const planetA = new Planet("A", null, { x: 0, y: 0 });
    const planetB = new Planet("B", null, { x: 0, y: 0 });
    const turnData = takeTurn(
      computer,
      {
        A: planetA,
        B: planetB,
        C: planetC,
      },
      [{ owner: computer.id, destination: "A", amount: 10, killPercent: 0.5 }]
    );
    expect(turnData).toHaveLength(1);
    expect(turnData[0].destination).toBe("B");
  });

  it("Can prepare turn data when there is a planet to skip in data due to sent fleets", (): void => {
    const computer = new ComputerPlayer(
      undefined,
      "test",
      ComputerPlayerType.EASY
    );
    const planetC = new Planet("C", computer.id, { x: 0, y: 0 });
    planetC.ships = 100;
    const planetD = new Planet("D", computer.id, { x: 0, y: 0 });
    planetD.ships = 100;
    const planetA = new Planet("A", computer.id, { x: 0, y: 0 });
    const planetB = new Planet("B", computer.id, { x: 0, y: 0 });
    const turnData = takeTurn(
      computer,
      {
        A: planetA,
        B: planetB,
        C: planetC,
        D: planetD,
      },
      []
    );
    expect(turnData).toHaveLength(2);
    expect(turnData[0].destination).toBe("A");
    expect(turnData[1].destination).toBe("B");
  });
});
