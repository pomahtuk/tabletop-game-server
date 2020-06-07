import { DeleteResult, getRepository, Repository } from "typeorm";
import { Game } from "../dao/entities/game";
import { HttpException } from "../exceptions/httpException";
import { NOT_FOUND } from "http-status-codes";

export class GameService {
  private repo: Repository<Game>;

  constructor() {
    this.repo = getRepository(Game);
  }

  public getGames(): Promise<Game[]> {
    return this.repo.find({
      relations: ["users"],
    });
  }

  public async getGame(gameId: string): Promise<Game> {
    const game = await this.repo.findOne(gameId, {
      relations: ["users"],
    });
    if (game) {
      return game;
    }
    throw new HttpException("Game with this id does not exist", NOT_FOUND);
  }

  public createGame(newGame: Game): Promise<Game> {
    const game = this.repo.create(newGame);
    return this.repo.save(game);
  }

  public deleteGame(gameId: string): Promise<DeleteResult> {
    return this.repo.delete(gameId);
  }

  public async updateGame(gameId: string, gameData: Game): Promise<Game> {
    const game = await this.repo.findOne(gameId, {
      relations: ["users"],
    });
    if (game) {
      this.repo.merge(game, gameData);
      return this.repo.save(game);
    }
    throw new HttpException("Game with this id does not exist", NOT_FOUND);
  }
}
