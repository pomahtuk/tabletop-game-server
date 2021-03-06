import ComputerPlayerHard from "../ComputerPlayerHard";
import { ComputerPlayerType, takeTurn } from "../ComputerPlayer";
import Planet from "../Planet";

describe("ComputerPlayerHard", (): void => {
  it("Exports computer player easy class", (): void => {
    expect(ComputerPlayerHard).toBeDefined();
  });

  it("Able to create instance of ComputerPlayerHard", (): void => {
    const computer = new ComputerPlayerHard(undefined, "test");
    expect(computer).toBeDefined();
    expect(computer.isComputer).toBeTruthy();
    expect(computer.computerType).toBe(ComputerPlayerType.HARD);
  });

  it("Can prepare turn data for attack", (): void => {
    const computer = new ComputerPlayerHard(undefined, "test");
    const planets = {
      A: new Planet("A", computer.id, { x: 0, y: 0 }),
      B: new Planet("B", null, { x: 1, y: 1 }),
    };

    planets.A.ships = 43;

    expect(takeTurn(computer, planets, [])).toHaveLength(1);
  });

  it("Can prepare turn data for reinforcements", (): void => {
    const computer = new ComputerPlayerHard(undefined, "test");
    const planets = {
      A: new Planet("A", computer.id, { x: 0, y: 0 }),
      B: new Planet("B", computer.id, { x: 1, y: 1 }),
    };

    planets.A.ships = 22;

    expect(takeTurn(computer, planets, [])).toHaveLength(1);
  });
});
