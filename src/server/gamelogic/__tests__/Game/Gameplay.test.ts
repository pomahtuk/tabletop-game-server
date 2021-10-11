import { GameStatus, TurnStatus } from "../../Game";
import { GameplayService } from "../../../services/gameplay.service";
import { GameService } from "../../../services/game.service";
import { Player } from "../../Player";
import createTestConnection from "../../../testhelpers/createTestConnection";
import { UsersService } from "../../../services/users.service";

describe("Could have a game", (): void => {
  let gameplayService: GameplayService;
  let gameService: GameService;

  let gameId: string;
  let player1: Player;
  let player2: Player;

  const makeEmptyPlayerTurn = async (playerId: string): Promise<TurnStatus> => {
    return await gameplayService.takePlayerTurn(gameId, playerId, []);
  };

  beforeAll(async (): Promise<void> => {
    await createTestConnection();
    let usersService = new UsersService();
    gameService = new GameService();

    // create two users
    player1 = await usersService.createUser({
      username: "game_users_1",
      password: "sample_pwd1",
      email: "game.users.1@example.com",
    });

    player2 = await usersService.createUser({
      username: "game_users_2",
      password: "sample_pwd2",
      email: "game.users.2@example.com",
    });

    gameplayService = new GameplayService(gameService, usersService);

    const game = await gameplayService.createGame({
      fieldHeight: 4,
      fieldWidth: 4,
      numPlayers: 2,
      neutralPlanetCount: 1,
      initialPlayers: {
        "0": player1,
        "1": player2,
      },
    });

    gameId = game.id!;
  });

  // strategy here -
  // player2 just sitting on own planet accumulating ships
  // player 1 - waiting 3 turns and capturing neutral planet and sitting for a while accumulating ships
  // then when enough produced - combining fleets at neutral
  // and attacking player 2 capturing their planet
  it("Returns invalid status when passing invalid turn", async (): Promise<void> => {
    expect.assertions(2);
    try {
      await gameplayService.takePlayerTurn(gameId, player1.id, [
        {
          origin: "Z",
          destination: "D",
          amount: 10,
        },
      ]);
    } catch (error) {
      const typedError = error as Error;
      expect(typedError).toBeDefined();
      expect(typedError.message).toMatch("Turn data invalid");
    }
  });

  it("Does not let player 2 take turn before player 1", async (): Promise<void> => {
    expect.assertions(3);
    try {
      await gameplayService.takePlayerTurn(gameId, player1.id, [
        {
          origin: "B",
          destination: "D",
          amount: 10,
        },
      ]);
    } catch (error) {
      const typedError = error as Error;
      expect(typedError).toBeDefined();
      expect(typedError.message).toMatch("Turn data invalid");
      const game = await gameService.getGame(gameId);
      expect(game.waitingForPlayer).toBe(0);
    }
  });

  it("Does accept player 1 turn", async (): Promise<void> => {
    await makeEmptyPlayerTurn(player1.id);
  });

  it("Does not accept player 1 turn for second time", async (): Promise<void> => {
    expect.assertions(3);

    const game = await gameService.getGame(gameId);
    expect(game.waitingForPlayer).toBe(1);

    try {
      await gameplayService.takePlayerTurn(gameId, player1.id, [
        {
          origin: "A",
          destination: "C",
          amount: 10,
        },
      ]);
    } catch (error) {
      const typedError = error as Error;
      expect(typedError).toBeDefined();
      expect(typedError.message).toMatch("Turn data invalid");
    }
  });

  it("Does accept player 2 turn", async (): Promise<void> => {
    await makeEmptyPlayerTurn(player2.id);
  });

  it("Capable of conducting simple battle", async (): Promise<void> => {
    // wait two more turns to be sure
    await makeEmptyPlayerTurn(player1.id);
    await makeEmptyPlayerTurn(player2.id);
    await makeEmptyPlayerTurn(player1.id);
    await makeEmptyPlayerTurn(player2.id);

    let game = await gameService.getGame(gameId);

    // let player 1 capture neutral planet
    const availableAttackFleet = game.planets["A"].ships;
    await gameplayService.takePlayerTurn(gameId, player1.id, [
      {
        origin: "A",
        destination: "C",
        amount: availableAttackFleet,
      },
    ]);

    await makeEmptyPlayerTurn(player2.id);
    // sitting here, waiting for 20 turns
    for (let i = 0; i < 20; i++) {
      await makeEmptyPlayerTurn(player1.id);
      await makeEmptyPlayerTurn(player2.id);
    }
    // done waiting, combine fleets
    // find best planet to use
    game = await gameService.getGame(gameId);
    const combinePlanet =
      game.planets["A"].killPercent > game.planets["C"].killPercent ? "A" : "C";
    const sourcePlanet = combinePlanet === "A" ? "C" : "A";
    let availableFleetAtSource = game.planets[sourcePlanet].ships;
    await gameplayService.takePlayerTurn(gameId, player1.id, [
      {
        origin: sourcePlanet,
        destination: combinePlanet,
        amount: availableFleetAtSource,
      },
    ]);

    await makeEmptyPlayerTurn(player2.id);
    // at this point turn processed and we have combined fleet at planet C
    game = await gameService.getGame(gameId);
    const availableFleetAtDestination = game.planets[combinePlanet].ships;
    availableFleetAtSource = game.planets[sourcePlanet].ships;
    await gameplayService.takePlayerTurn(gameId, player1.id, [
      {
        origin: combinePlanet,
        destination: "B",
        amount: availableFleetAtDestination,
      },
      {
        origin: sourcePlanet,
        destination: "B",
        amount: availableFleetAtSource,
      },
    ]);

    await makeEmptyPlayerTurn(player2.id);
    // now game processed another turn
    // check if there are any fleets en route
    game = await gameService.getGame(gameId);
    const fleets = game.fleetTimelineObj.fleetTimeline;
    const fleetsTravelling = fleets.reduce((acc, fleetData) => {
      return [...acc, ...fleetData];
    }, []);
    if (fleetsTravelling.length > 0) {
      // wait a bit
      await makeEmptyPlayerTurn(player1.id);
      await makeEmptyPlayerTurn(player2.id);
    }
    // we should know the winner
    expect(game.status).toBe(GameStatus.COMPLETED);
    expect(game.winnerId).toBeDefined();
    expect(game.winnerId).toBe(player1.id);
  });

  // now game should not accept new turns
  it("Does not accept any player turns after game completion", async (): Promise<void> => {
    const result = await makeEmptyPlayerTurn(player1.id);
    expect(result).toBe(TurnStatus.IGNORED);
  });
});
