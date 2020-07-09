import { GameStatus } from "../../Game";
import { UsersService } from "../../../services/users.service";
import { GameService } from "../../../services/game.service";
import createTestConnection from "../../../testhelpers/createTestConnection";
import { GameplayService } from "../../../services/gameplay.service";
import { User } from "../../../dao/entities/user";
import { getRepository, Repository } from "typeorm";
import { GameUserStats } from "../../../dao/entities/gameuserstats";

describe("Main game", (): void => {
  let gameplayService: GameplayService;
  let gameService: GameService;
  let statsRepo: Repository<GameUserStats>;

  let player1: User;
  let player2: User;
  let player3: User;

  let gameId: string;

  beforeAll(
    async (): Promise<void> => {
      await createTestConnection();
      let usersService = new UsersService();
      gameService = new GameService();

      // create two users
      player1 = await usersService.createUser({
        username: "game_base_1",
        password: "sample_pwd1",
        email: "game.base.1@example.com",
      });

      player2 = await usersService.createUser({
        username: "game_base_2",
        password: "sample_pwd2",
        email: "game.base.2@example.com",
      });

      player3 = await usersService.createUser({
        username: "game_base_3",
        password: "sample_pwd3",
        email: "game.base.3@example.com",
      });

      gameplayService = new GameplayService(gameService, usersService);

      statsRepo = getRepository(GameUserStats);
    }
  );

  it("Throwing an error if initialPlayers have more keys than numPlayers", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await gameplayService.createGame({
        fieldWidth: 10,
        fieldHeight: 10,
        numPlayers: 2,
        neutralPlanetCount: 0,
        initialPlayers: {
          "0": { id: "0", isComputer: true },
          "1": { id: "1", isComputer: true },
          "2": { id: "2", isComputer: true },
        },
      });
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.message).toMatch("Sent more initial players than game supports");
    }
  });

  it("Creates a new game with given params", async (): Promise<void> => {
    const game = await gameplayService.createGame({
      fieldHeight: 10,
      fieldWidth: 10,
      numPlayers: 2,
      neutralPlanetCount: 5,
    });

    expect(game).toBeDefined();

    // get data
    const planets = game.planets;

    // check we have all players
    expect(game.playersObj).toBeDefined();

    // check we have planets generated
    expect(planets).toBeDefined();
    expect(Object.keys(planets).length).toBe(7);
    expect(planets["A"].coordinates).toBeDefined();
    expect(planets["B"].coordinates).toBeDefined();

    // make sure game is not started
    expect(game.gameStarted).toBe(false);
    expect(game.gameCompleted).toBe(false);

    // make sure status shortcut working
    expect(game.status).toBe(GameStatus.NOT_STARTED);

    // exposing fieldSize
    expect(game.fieldSize).toMatchObject([10, 10]);

    gameId = game.id!;
  });

  it("Able to add player", async (): Promise<void> => {
    const game = await gameplayService.addPlayer(gameId, player1);
    // game should not be started at this moment
    expect(game.status).toBe(GameStatus.NOT_STARTED);
    // we should have additional user
    expect(game.playersObj.players).toHaveLength(1);
    expect(game.users).toHaveLength(1);
    // planet should be assigned
    expect(game.planets["A"].owner).toBe(player1.id);
  });

  it("Able to add player and start a game", async (): Promise<void> => {
    const game = await gameplayService.addPlayer(gameId, player2);
    // game should not be started at this moment
    expect(game.status).toBe(GameStatus.IN_PROGRESS);
    // we should have additional user
    expect(game.playersObj.players).toHaveLength(2);
    expect(game.users).toHaveLength(2);
    // planet should be assigned
    expect(game.planets["B"].owner).toBe(player2.id);
    expect(game.waitingForPlayer).toBe(0);
  });

  it("Able to mark player dead and ignore it for next one", async (): Promise<
    void
  > => {
    const game = await gameplayService.createGame({
      fieldHeight: 4,
      fieldWidth: 4,
      numPlayers: 3,
      neutralPlanetCount: 1,
      initialPlayers: {
        "0": player1,
        "1": player2,
        "2": player3,
      },
    });

    const assaultPlayer2 = async (): Promise<void> => {
      // step one - everyone waiting
      await gameplayService.takePlayerTurn(game.id!, player1.id, []);
      await gameplayService.takePlayerTurn(game.id!, player2.id, []);
      await gameplayService.takePlayerTurn(game.id!, player3.id, []);
      // step two - attacking player2
      await gameplayService.takePlayerTurn(game.id!, player1.id, [
        {
          amount: 20,
          origin: "A",
          destination: "B",
        },
      ]);
      await gameplayService.takePlayerTurn(game.id!, player2.id, []);
      await gameplayService.takePlayerTurn(game.id!, player3.id, [
        {
          amount: 20,
          origin: "C",
          destination: "B",
        },
      ]);
    };
    await assaultPlayer2();
    // at this point turn should be complete
    expect(game.waitingForPlayer).toBe(0);
    // check if player2 is dead
    const stats = await statsRepo.find({
      gameId: game.id!,
    });
    expect(stats.find((p) => p.userId === player2.id)!.isDead).toBe(true);
    // now empty player1 turn
    await gameplayService.takePlayerTurn(game.id!, player1.id, []);
    // get game
    const updatedGame = await gameService.getGame(game.id!);
    expect(updatedGame.waitingForPlayer).toBe(2);
  });
});
