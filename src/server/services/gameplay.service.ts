import { GameService } from "./game.service";
import { UsersService } from "./users.service";
import { User } from "../dao/entities/user";
import { Player, PlayerStatsMap, PlayerTurnOrder } from "../gamelogic/Player";
import { Game, PlayerIndexMap } from "../dao/entities/game";
import {
  addPlayerTurnData,
  findNextValidPlayer,
  GameStatus,
  TurnStatus,
} from "../gamelogic/Game";
import { HttpException } from "../exceptions/httpException";
import { BAD_REQUEST } from "http-status-codes";
import Planet from "../gamelogic/Planet";
import getPlanetName from "../gamelogic/helpers/getPlanetName";
import { GameUserStats } from "../dao/entities/gameuserstats";
import { getManager, getRepository, Repository } from "typeorm";
import placePlanets from "../gamelogic/helpers/placePlanets";

const defaultPlayerStats = {
  enemyShipsDestroyed: 0,
  enemyFleetsDestroyed: 0,
  shipCount: 0,
  isDead: false,
};

export class GameplayService {
  private gameService: GameService;
  private usersService: UsersService;
  private statsRepo: Repository<GameUserStats>;

  constructor(gameService: GameService, usersService: UsersService) {
    this.gameService = gameService;
    this.usersService = usersService;
    this.statsRepo = getRepository(GameUserStats);
  }

  public async createGame(gameData: Partial<Game>): Promise<Game> {
    if (
      gameData.initialPlayers &&
      Object.values(gameData.initialPlayers).length > gameData.numPlayers!
    ) {
      throw new HttpException(
        "Sent more initial players than game supports",
        BAD_REQUEST
      );
    }

    // create game
    let game = await this.gameService.createGame(gameData);

    // add all planets and place them
    const totalPlanets = game.neutralPlanetCount + game.numPlayers;
    for (let i = 0; i < totalPlanets; i++) {
      // adding dummy ID just to reserve planet for player
      const planet = new Planet(
        getPlanetName(i),
        i < game.numPlayers ? "dummy" : undefined
      );
      game.planets[planet.name] = planet;
    }

    // arrange planets
    placePlanets({
      planets: game.planets,
      fieldHeight: game.fieldHeight,
      fieldWidth: game.fieldWidth,
      planetCount: totalPlanets,
    });

    await getManager().transaction(async (transactionalEntityManager) => {
      // need this to generate id first;
      game = await transactionalEntityManager.save(game);
      if (gameData.initialPlayers) {
        const stats = this.addPlayers(game, gameData.initialPlayers);
        await transactionalEntityManager.save(stats);
        game = await transactionalEntityManager.save(game);
      }
    });

    return game;
  }

  private addPlayers(
    game: Game,
    playerIndexMap: PlayerIndexMap
  ): GameUserStats[] {
    const stats: GameUserStats[] = [];
    // make sure to initialize if empty
    game.playersObj.players = game.playersObj.players || [];
    const players = game.playersObj.players;
    // make sure to initialize if empty
    game.users = game.users || [];
    Object.keys(playerIndexMap).forEach((key) => {
      const playerIndex = parseInt(key, 10);
      const player = playerIndexMap[playerIndex];
      players[playerIndex] = player.isComputer
        ? player
        : GameplayService.cleanUpUser(player as User);
      const playerPlanetName = getPlanetName(playerIndex);
      game.planets[playerPlanetName].owner = player.id;
      stats.push(
        new GameUserStats({
          gameId: game.id!,
          userId: player.id,
          stats: defaultPlayerStats,
        })
      );
      if (!player.isComputer) {
        game.users.push(player as User);
      }
    });

    if (game.numPlayers === players.length) {
      game.status = GameStatus.IN_PROGRESS;
      findNextValidPlayer(
        game,
        stats.reduce((acc: PlayerStatsMap, stat) => {
          acc[stat.userId] = stat;
          return acc;
        }, {})
      );
    }

    return stats;
  }

  public async addPlayer(
    gameId: string,
    player: User,
    gameCode?: string
  ): Promise<Game> {
    let game = await this.gameService.getGame(gameId, gameCode);
    const players = game.playersObj.players || [];
    const playerIndex = players.length;
    players.push(GameplayService.cleanUpUser(player));
    game.playersObj.players = players;
    const playerPlanetName = getPlanetName(playerIndex);
    game.planets[playerPlanetName].owner = player.id;
    const userStat = new GameUserStats({
      gameId,
      userId: player.id,
      stats: defaultPlayerStats,
    });
    game.users.push(player);
    // if we have everyone - start immediately
    let stats: PlayerStatsMap = {};
    if (game.numPlayers === game.playersObj.players.length) {
      game.status = GameStatus.IN_PROGRESS;
      const dbStats = await this.getPlayerStatsMap(gameId);
      stats = {
        ...dbStats,
        [player.id]: userStat,
      };
      // this actually starts the game
      findNextValidPlayer(game, stats);
    }

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(Object.values(stats));
      game = await transactionalEntityManager.save(game);
    });

    return game;
  }

  private async getPlayerStatsMap(gameId: string) {
    // TODO: error handling
    const gameStats = await this.statsRepo.find({
      gameId: gameId,
    });
    return gameStats.reduce((acc: PlayerStatsMap, stat) => {
      acc[stat.userId] = stat;
      return acc;
    }, {});
  }

  private static cleanUpUser(user: User): Player {
    return {
      id: user.id,
      isComputer: user.isComputer || false,
      username: user.username,
    };
  }

  public async takePlayerTurn(
    gameId: string,
    playerId: string,
    orders: PlayerTurnOrder[]
  ): Promise<TurnStatus> {
    const game = await this.gameService.getGame(gameId);
    const stats = await this.getPlayerStatsMap(gameId);
    const turnStatus: TurnStatus = addPlayerTurnData(
      game,
      { playerId, orders },
      stats
    );
    if (turnStatus === TurnStatus.INVALID) {
      throw new HttpException("Turn data invalid", BAD_REQUEST);
    }
    // TODO: error handling
    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(game);
      await transactionalEntityManager.save(Object.values(stats));
    });
    return turnStatus;
  }
}
