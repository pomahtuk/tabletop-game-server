import ComputerPlayerEasy from "../ComputerPlayerEasy";
import { ComputerPlayerType, takeTurn } from "../ComputerPlayer";
import Planet from "../Planet";

describe("ComputerPlayerEasy", (): void => {
  it("Exports computer player easy class", (): void => {
    expect(ComputerPlayerEasy).toBeDefined();
  });

  it("Able to create instance of ComputerPlayerEasy", (): void => {
    const computer = new ComputerPlayerEasy(undefined, "test");
    expect(computer).toBeDefined();
    expect(computer.isComputer).toBeTruthy();
    expect(computer.computerType).toBe(ComputerPlayerType.EASY);
  });

  it("Can prepare turn data for attack", (): void => {
    const computer = new ComputerPlayerEasy(undefined, "test");
    const planets = {
      A: new Planet("A", computer.id, { x: 0, y: 0 }),
      B: new Planet("B", null, { x: 1, y: 1 }),
    };

    planets.A.ships = 29;

    expect(takeTurn(computer, planets, [])).toHaveLength(1);
  });

  it("Can prepare turn data for reinforcements", (): void => {
    const computer = new ComputerPlayerEasy(undefined, "test");
    const planets = {
      A: new Planet("A", computer.id, { x: 0, y: 0 }),
      B: new Planet("B", computer.id, { x: 1, y: 1 }),
    };

    planets.A.ships = 22;

    expect(takeTurn(computer, planets, [])).toHaveLength(1);
  });
});
