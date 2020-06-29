import { GameService } from "./game.service";
import { UsersService } from "./users.service";
import { User } from "../dao/entities/user";
import ComputerPlayer from "../gamelogic/ComputerPlayer";
import { PlayerStats, PlayerTurn } from "../gamelogic/Player";
import { Game } from "../dao/entities/game";
import ConquestGame, {
  addPlayerTurnData,
  findNextValidPlayer,
  TurnStatus,
} from "../gamelogic/Game";
import { HttpException } from "../exceptions/httpException";
import { BAD_REQUEST } from "http-status-codes";
import Planet from "../gamelogic/Planet";
import getPlanetName from "../gamelogic/helpers/getPlanetName";
import { GameUserStats } from "../dao/entities/gameuserstats";
import { getRepository, Repository } from "typeorm";

export class GameplayService {
  private gameService: GameService;
  private usersService: UsersService;
  private statsRepo: Repository<GameUserStats>;

  constructor(gameService: GameService, usersService: UsersService) {
    this.gameService = gameService;
    this.usersService = usersService;
    this.statsRepo = getRepository(GameUserStats);
  }

  // public startGame() {
  //   // we actually ready to go no players left to be added
  //   // generate game field, assign planets
  // }

  public async addPlayer(
    gameId: string,
    player: ComputerPlayer | User,
    gameCode?: string
  ): Promise<Game> {
    const game = await this.gameService.getGame(gameId, gameCode);
    const players = game.players ?? [];
    const playerStats: PlayerStats = {
      enemyShipsDestroyed: 0,
      enemyFleetsDestroyed: 0,
      shipCount: 0,
      isDead: false,
    };
    player.stats = playerStats;
    players.push(player);
    // create player planet
    const playerPlanet = new Planet(getPlanetName(players.length - 1), player);
    const planets = game.planets ?? {};
    planets[playerPlanet.name] = playerPlanet;
    if (!player.isComputer) {
      const stats = new GameUserStats(gameId, player.id!, playerStats);
      // TODO: error handling
      await this.statsRepo.save(stats);
      game.users.push(player as User);
    }
    game.planets = planets;
    game.players = players;
    // if we have everyone - start immediately
    if (game.numPlayers === game.players.length) {
      // add neutral planets
      // findNextValidPlayer(game);
    }
    return await this.gameService.saveGame(game);
  }

  public async takePlayerTurn(gameId: string, turnData: PlayerTurn) {
    const game = await this.gameService.getGame(gameId);
    // const turnStatus : TurnStatus = addPlayerTurnData(game as ConquestGame, turnData);
    // if (turnStatus === TurnStatus.INVALID) {
    //   throw new HttpException("Turn data invalid", BAD_REQUEST);
    // }
    // main method to actually play game
    // make sure turn valid
    // check game status afterwards
  }
}
