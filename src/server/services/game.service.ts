import { DeleteResult, getRepository, Repository } from "typeorm";
import { Game } from "../dao/entities/game";
import { HttpException } from "../exceptions/httpException";
import { StatusCodes } from "http-status-codes";
import getPlanetLimit from "../gamelogic/helpers/getPlanetLimit";

export interface GetGamesOptions {
  page?: number;
  limit?: number;
  isPublic?: boolean;
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
    { page = 0, limit = 10, isPublic, order }: GetGamesOptions = {
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
        throw new HttpException(
          "Game code is not correct",
          StatusCodes.FORBIDDEN
        );
      }
      return game;
    }
    throw new HttpException(
      "Game with this id does not exist",
      StatusCodes.NOT_FOUND
    );
  }

  public createGame(newGame: Partial<Game>): Promise<Game> {
    // TODO: validate Game
    if (
      !newGame.fieldHeight ||
      !newGame.fieldWidth ||
      newGame.fieldWidth < 4 ||
      newGame.fieldWidth > 20 ||
      newGame.fieldHeight < 4 ||
      newGame.fieldHeight > 20
    ) {
      // 1 - field size
      throw new HttpException(
        "Incorrect or missing field size",
        StatusCodes.BAD_REQUEST
      );
    }

    if (
      !newGame.numPlayers ||
      newGame.numPlayers < 2 ||
      newGame.numPlayers > 4
    ) {
      // 2 - num players
      throw new HttpException(
        "Incorrect or missing number of players",
        StatusCodes.BAD_REQUEST
      );
    }

    // 3 - planet count
    if (
      !newGame.hasOwnProperty("neutralPlanetCount") ||
      typeof newGame.neutralPlanetCount === "undefined" ||
      newGame.neutralPlanetCount < 0
    ) {
      throw new HttpException(
        "Missing number of neutral planets",
        StatusCodes.BAD_REQUEST
      );
    }

    const neutralPlanetsLimit = getPlanetLimit(
      newGame.fieldHeight * newGame.fieldWidth,
      newGame.numPlayers
    );
    if (newGame.neutralPlanetCount > neutralPlanetsLimit) {
      throw new HttpException(
        `Too many neutral planets requested, limit for current field size: ${neutralPlanetsLimit}`,
        StatusCodes.BAD_REQUEST
      );
    }

    if (
      newGame.hasOwnProperty("gameStarted") ||
      newGame.hasOwnProperty("gameCompleted") ||
      newGame.hasOwnProperty("status")
    ) {
      // game status - should not be there
      throw new HttpException(
        "Setting game status is not allowed",
        StatusCodes.BAD_REQUEST
      );
    }

    if (newGame.hasOwnProperty("winnerId")) {
      // winnerId - should not be there
      throw new HttpException(
        "Setting winner id right away is not allowed",
        StatusCodes.BAD_REQUEST
      );
    }

    if (newGame.hasOwnProperty("waitingForPlayer")) {
      // waitingForPlayer - should not be there
      throw new HttpException(
        "Setting waitingForPlayer is not allowed",
        StatusCodes.BAD_REQUEST
      );
    }

    const game = this.repo.create(newGame);
    return this.repo.save(game);
  }

  public deleteGame(gameId: string): Promise<DeleteResult> {
    return this.repo.delete(gameId);
  }
}
