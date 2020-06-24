import { DeleteResult, getRepository, Repository } from "typeorm";
import { Game } from "../dao/entities/game";
import { HttpException } from "../exceptions/httpException";
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "http-status-codes";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validationException";
import { User } from "../dao/entities/user";

export interface GetGamesOptions {
  page?: number;
  limit?: number;
  isPublic?: boolean;
  gameStarted?: boolean;
  order?: {
    [K in keyof Game]?: "ASC" | "DESC" | 1 | -1;
  };
}

export class GameService {
  private repo: Repository<Game>;

  constructor() {
    this.repo = getRepository(Game);
  }

  public getGames(
    { page = 0, limit = 10, isPublic, gameStarted, order }: GetGamesOptions = {
      page: 0,
      limit: 10,
    }
  ): Promise<Game[]> {
    const where: {
      isPublic?: boolean;
      gameStarted?: boolean;
    } = {};

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (gameStarted !== undefined) {
      where.gameStarted = gameStarted;
    }

    return this.repo.find({
      relations: ["users"],
      where,
      order,
      skip: page * limit,
      take: limit,
      cache: true,
    });
  }

  public async getGame(gameId: string, gameCode?: string): Promise<Game> {
    const game = await this.repo.findOne(gameId, {
      relations: ["users"],
    });
    if (game) {
      if (game.gameCode && gameCode && game.gameCode !== gameCode) {
        throw new HttpException("Game code is not correct", FORBIDDEN);
      }
      return game;
    }
    throw new HttpException("Game with this id does not exist", NOT_FOUND);
  }

  public createGame(newGame: Game): Promise<Game> {
    // TODO: validate Game
    const game = this.repo.create(newGame);
    return this.repo.save(game);
  }

  public deleteGame(gameId: string): Promise<DeleteResult> {
    return this.repo.delete(gameId);
  }

  public async updateGame(gameId: string, gameData: Game): Promise<Game> {
    // prevent overriding of Id;
    if (gameData.id && gameData.id !== gameId) {
      throw new HttpException("Changing Game id is forbidden", FORBIDDEN);
    }
    const gameInstance = await GameService.validateIncomingGame(gameData);
    const game = await this.getGame(gameId);
    try {
      this.repo.merge(game, gameInstance);
      return this.repo.save(game);
    } catch (error) {
      // NOTE: ignoring branch not corresponding to expected exception as other exceptions
      // are not supposed to happen anw will be an indication of DB issue, so, external dependency
      /* istanbul ignore next */
      throw new HttpException(
        "Something went wrong",
        INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  public async saveGame(game: Game): Promise<Game> {
    try {
      await GameService.validateGameInstance(game);
      return await this.repo.save(game);
    } catch (error) {
      // NOTE: ignoring branch not corresponding to expected exception as other exceptions
      // are not supposed to happen anw will be an indication of DB issue, so, external dependency
      /* istanbul ignore next */
      throw new HttpException(
        "Something went wrong",
        INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  private static async validateIncomingGame(gameData: Game): Promise<Game> {
    const gameInstance = new Game(gameData);
    return await GameService.validateGameInstance(gameInstance);
  }

  private static async validateGameInstance(gameInstance: Game): Promise<Game> {
    const validationErrors = await validate(gameInstance);
    if (validationErrors.length > 0) {
      throw new ValidationException("Game is not valid", validationErrors);
    }
    return gameInstance;
  }
}
