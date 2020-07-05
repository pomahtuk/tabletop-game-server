import { GameService } from "../game.service";
import createTestConnection from "../../testhelpers/createTestConnection";

describe("GameService", () => {
  let gameService: GameService;
  let publicGameId: string;
  let privateGameId: string;
  const gameCode = "12345";

  beforeAll(
    async (): Promise<void> => {
      await createTestConnection();
    }
  );

  it("Exports service", (): void => {
    expect(GameService).toBeDefined();
  });

  it("Able to create instance of service", (): void => {
    gameService = new GameService();
    expect(gameService).toBeInstanceOf(GameService);
  });

  it("Returns empty list of game with new DB", async (): Promise<void> => {
    const games = await gameService.getGames();
    expect(games.length).toBe(0);
  });

  it("Can create game", async (): Promise<void> => {
    const created = await gameService.createGame({
      fieldHeight: 10,
      fieldWidth: 10,
      neutralPlanetCount: 0,
      numPlayers: 2,
      users: [],
    });

    expect(created).toBeDefined();
    expect(created.isPublic).toBe(true);
    publicGameId = created.id!;
  });

  it("Can create private game", async (): Promise<void> => {
    const created = await gameService.createGame({
      isPublic: false,
      fieldHeight: 10,
      fieldWidth: 10,
      neutralPlanetCount: 0,
      numPlayers: 2,
      gameCode,
      users: [],
    });

    expect(created).toBeDefined();
    expect(created.gameCode).toBe(gameCode);
    expect(created.isPublic).toBe(false);
    privateGameId = created.id!;
  });

  it("Can get all games from DB", async (): Promise<void> => {
    const games = await gameService.getGames();
    expect(games.length).toBe(2);
  });

  it("Can get public games from DB", async (): Promise<void> => {
    const games = await gameService.getGames({
      isPublic: true,
    });
    expect(games.length).toBe(1);
  });

  it("Can get paginated games from DB", async (): Promise<void> => {
    const games = await gameService.getGames({
      page: 1,
      limit: 1,
    });
    expect(games.length).toBe(1);
    expect(games[0].gameCode).toBeDefined();
  });

  it("Can get public game details", async (): Promise<void> => {
    const game = await gameService.getGame(publicGameId);
    expect(game).toBeDefined();
    expect(game.id).toBe(publicGameId);
  });

  it("Returns error on getting private game with wrong code", async (): Promise<
    void
  > => {
    expect.assertions(2);

    try {
      await gameService.getGame(privateGameId, "wrong");
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe("Game code is not correct");
    }
  });

  it("Can get private game details with code", async (): Promise<void> => {
    const game = await gameService.getGame(privateGameId, gameCode);
    expect(game).toBeDefined();
    expect(game.id).toBe(privateGameId);
  });

  it("Can delete game", async (): Promise<void> => {
    const game = await gameService.createGame({
      fieldHeight: 10,
      fieldWidth: 10,
      neutralPlanetCount: 0,
      users: [],
      numPlayers: 2,
    });
    const deletionResult = await gameService.deleteGame(game.id!);
    expect(deletionResult).toBeDefined();
  });

  it("Throwing error when game with given id does not exist", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await gameService.getGame("111");
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toBe("Game with this id does not exist");
    }
  });
});
