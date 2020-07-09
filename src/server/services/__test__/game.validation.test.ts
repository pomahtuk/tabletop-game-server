// check game validation
import createTestConnection from "../../testhelpers/createTestConnection";
import { GameService } from "../game.service";
import { GameStatus } from "../../gamelogic/Game";

describe("Validating game on creation", (): void => {
  let gameService: GameService;

  beforeAll(
    async (): Promise<void> => {
      await createTestConnection();
      gameService = new GameService();
    }
  );

  describe("Field size validations", (): void => {
    it("Throws error if field height is missing", async (): Promise<void> => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          numPlayers: 2,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing field size");
      }
    });

    it("Throws error if field width is missing", async (): Promise<void> => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldHeight: 10,
          numPlayers: 2,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing field size");
      }
    });

    it("Throws error if field size is out of lower bounds for width", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 2,
          fieldHeight: 10,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing field size");
      }
    });

    it("Throws error if field size is out of lower bounds for height", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldHeight: 2,
          fieldWidth: 10,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing field size");
      }
    });

    it("Throws error if field size is out of higher bounds for width", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldHeight: 10,
          fieldWidth: 100,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing field size");
      }
    });

    it("Throws error if field size is out of higher bounds for height", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldHeight: 100,
          fieldWidth: 10,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing field size");
      }
    });
  });

  describe("Number of players validation", (): void => {
    it("Throwing an error in numPlayers is not present", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing number of players");
      }
    });

    it("Throwing an error in numPlayers is too small", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
          numPlayers: 1,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing number of players");
      }
    });

    it("Throwing an error in numPlayers is too high", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
          numPlayers: 10,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Incorrect or missing number of players");
      }
    });
  });

  describe("Number of neutral planets validation", (): void => {
    it("Throwing an error if number of neutral planets is not specified", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
          numPlayers: 2,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Missing number of neutral planets");
      }
    });

    it("Throwing an error if number of neutral planets is negative number", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
          numPlayers: 2,
          neutralPlanetCount: -1,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Missing number of neutral planets");
      }
    });

    it("Throwing an error if number of neutral planets is too high for field size", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 4,
          fieldHeight: 4,
          numPlayers: 2,
          neutralPlanetCount: 100,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch(
          "Too many neutral planets requested, limit for current field size:"
        );
      }
    });
  });

  describe("Game status validation", (): void => {
    it("Throwing an error if gameCompleted specified on creation", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
          numPlayers: 2,
          neutralPlanetCount: 0,
          gameCompleted: true,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Setting game status is not allowed");
      }
    });

    it("Throwing an error if gameStarted specified on creation", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
          numPlayers: 2,
          neutralPlanetCount: 0,
          gameCompleted: false,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Setting game status is not allowed");
      }
    });

    it("Throwing an error if gameStarted specified on creation", async (): Promise<
      void
    > => {
      expect.assertions(2);
      try {
        await gameService.createGame({
          fieldWidth: 10,
          fieldHeight: 10,
          numPlayers: 2,
          neutralPlanetCount: 0,
          status: GameStatus.COMPLETED,
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toMatch("Setting game status is not allowed");
      }
    });
  });

  it("Throwing an error if winnerId specified on creation", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await gameService.createGame({
        fieldWidth: 10,
        fieldHeight: 10,
        numPlayers: 2,
        neutralPlanetCount: 0,
        winnerId: "id",
      });
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.message).toMatch("Setting winner id right away is not allowed");
    }
  });

  it("Throwing an error if waitingForPlayer specified on creation", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await gameService.createGame({
        fieldWidth: 10,
        fieldHeight: 10,
        numPlayers: 2,
        neutralPlanetCount: 0,
        waitingForPlayer: 1,
      });
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.message).toMatch("Setting waitingForPlayer is not allowed");
    }
  });

  it("Able to create valid game", async (): Promise<void> => {
    const game = await gameService.createGame({
      fieldWidth: 10,
      fieldHeight: 10,
      numPlayers: 2,
      neutralPlanetCount: 2,
    });

    expect(game).toBeDefined();
    expect(game.fieldHeight).toBe(10);
    expect(game.fieldHeight).toBe(10);
    expect(game.numPlayers).toBe(2);
    expect(game.neutralPlanetCount).toBe(2);
  });
});
