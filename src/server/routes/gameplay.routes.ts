import { GameService } from "../services/game.service";
import { UsersService } from "../services/users.service";
import { GameplayService } from "../services/gameplay.service";
import { JWTVerify } from "../authenticators/jwt.authenticator";
import {
  getUserId,
  UserInGameVerify,
} from "../authenticators/game.authenticator";
import {
  FastifyPluginOptions,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { Game } from "../dao/entities/game";
import { PlayerTurnOrder } from "../gamelogic/Player";

export default async function gameplayRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  const gameService = new GameService();
  const userService = new UsersService();
  const gameplayService = new GameplayService(gameService, userService);

  // start
  fastify.route({
    url: "/game/start",
    logLevel: "warn",
    method: ["POST", "HEAD"],
    // TODO: add schema
    preHandler: fastify.auth([JWTVerify]),
    handler: async (
      request: FastifyRequest<{
        Body: Partial<Game>;
      }>,
      reply: FastifyReply
    ) => {
      const game = await gameplayService.createGame(request.body);
      return reply.send(game);
    },
  });

  // take turn
  fastify.route({
    url: "/game/:gameId/turn",
    logLevel: "warn",
    method: ["POST", "HEAD"],
    // TODO: add schema
    // @ts-ignore - types issue, TODO: figure out proper way
    preHandler: fastify.auth([JWTVerify, UserInGameVerify]),
    handler: async (
      request: FastifyRequest<{
        Params: {
          gameId: string;
        };
        Body: PlayerTurnOrder[];
      }>,
      reply: FastifyReply
    ) => {
      const userId = getUserId(request.user);
      const game = await gameplayService.takePlayerTurn(
        request.params.gameId,
        userId,
        request.body
      );
      return reply.send(game);
    },
  });
}
