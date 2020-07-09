import ComputerPlayerEasy from "../../ComputerPlayerEasy";
import { TurnStatus, GameStatus, findPlayerFleets } from "../../Game";
import { PlanetMap } from "../../Planet";
import ComputerPlayerHard from "../../ComputerPlayerHard";
import Fleet from "../../Fleet";
import { GameplayService } from "../../../services/gameplay.service";
import { GameService } from "../../../services/game.service";
import createTestConnection from "../../../testhelpers/createTestConnection";
import { UsersService } from "../../../services/users.service";
import { Player } from "../../Player";
import { getRepository, Repository } from "typeorm";
import { GameUserStats } from "../../../dao/entities/gameuserstats";

const computer = new ComputerPlayerEasy(undefined, "test");

describe("Could have a game with Computer player", (): void => {
  let gameplayService: GameplayService;
  let gameService: GameService;
  let statsRepo: Repository<GameUserStats>;

  let gameId: string;
  let player1: Player;

  const makeEmptyPlayerTurn = async (): Promise<TurnStatus> => {
    return await gameplayService.takePlayerTurn(gameId, player1.id, []);
  };

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

      gameplayService = new GameplayService(gameService, usersService);

      statsRepo = getRepository(GameUserStats);

      const game = await gameplayService.createGame({
        fieldHeight: 4,
        fieldWidth: 4,
        numPlayers: 2,
        neutralPlanetCount: 1,
        initialPlayers: {
          "0": player1,
          "1": computer,
        },
      });

      gameId = game.id!;
    }
  );

  // here, as only used for computer player
  it("can find playerFleets", (): void => {
    const allFleets: Fleet[][] = [
      [
        {
          owner: player1.id,
          amount: 10,
          killPercent: 0.5,
          destination: "B",
        },
        {
          owner: computer.id,
          amount: 10,
          killPercent: 0.4,
          destination: "B",
        },
      ],
      [
        {
          owner: player1.id,
          amount: 10,
          killPercent: 0.8,
          destination: "D",
        },
      ],
    ];
    const playerFleets = findPlayerFleets(allFleets, player1);
    expect(playerFleets).toHaveLength(2);
  });

  it("Can stop game if only computer players are left", async (): Promise<
    void
  > => {
    const anotherComp = new ComputerPlayerHard(undefined, "another");
    const ownGame = await gameplayService.createGame({
      initialPlayers: {
        "0": anotherComp,
        "1": computer,
      },
      fieldHeight: 4,
      fieldWidth: 4,
      numPlayers: 2,
      neutralPlanetCount: 1,
    });
    expect(ownGame.status).toBe(GameStatus.COMPLETED);
    expect(ownGame.winnerId).toBe(null);
  });

  it("Can have game with computer player", async (): Promise<void> => {
    // do nothing
    const result = await makeEmptyPlayerTurn();
    // turn must be valid
    expect(result).toBe(TurnStatus.VALID);
    let game = await gameService.getGame(gameId);
    // and we should be waiting for player again
    expect(game.waitingForPlayer).toBe(0);
    // now let's wait for 5 turns
    for (let i = 0; i < 5; i++) {
      await makeEmptyPlayerTurn();
    }

    game = await gameService.getGame(gameId);

    // after this neutral planet should belong to Computer player
    const planets: PlanetMap = game.planets;
    const computerPlanets = Object.keys(planets)
      .map((planetName) => planets[planetName])
      .filter((planet) => planet.owner && planet.owner === computer.id);

    expect(computerPlanets).toHaveLength(2);

    // now, if we just wait few more turns computer should not be able to consolidate fleets
    for (let i = 0; i < 10; i++) {
      await makeEmptyPlayerTurn();
    }

    const stats = await statsRepo.findOne({
      gameId,
      userId: player1.id,
    });

    expect(stats!.isDead).toBe(false);

    // now let's send half of player planet fleet to computer planet, releasing deadlock
    await gameplayService.takePlayerTurn(gameId, player1.id, [
      {
        origin: "A",
        destination: "C",
        amount: 80,
      },
    ]);

    // at this point computer could make a move
    await gameplayService.takePlayerTurn(gameId, player1.id, [
      {
        origin: "A",
        destination: "C",
        amount: 20,
      },
    ]);

    // and to make sure that our fleet arrived at destination and destroyed
    await makeEmptyPlayerTurn();

    game = await gameService.getGame(gameId);

    // now game processed another turn
    // check if there are any fleets en route
    const fleets = game.fleetTimelineObj.fleetTimeline;
    const fleetsTravelling = fleets.reduce((acc, fleetData) => {
      return [...acc, ...fleetData];
    }, []);
    if (fleetsTravelling.length > 0) {
      // wait a bit
      await makeEmptyPlayerTurn();
    }

    // now Computer player won the game!
    expect(game.status).toBe(GameStatus.COMPLETED);
    expect(game.winnerId).toBeDefined();
    expect(game.winnerId).toBe(computer.id);
  });
});
