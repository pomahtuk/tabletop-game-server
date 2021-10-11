import fp from "fastify-plugin";

import { listGamesSchema, getGameSchema } from "../schemas/game.schema";
import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyPluginOptions,
} from "fastify";
import { GameService } from "../services/game.service";
import { JWTVerify } from "../authenticators/jwt.authenticator";

export default async function gameRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  const gameService = new GameService();

  // list
  fastify.route({
    url: "/games",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    schema: listGamesSchema,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // TODO: ordering and filtering
      const games = await gameService.getGames();
      return reply.send(games);
    },
  });

  // get one
  fastify.route({
    url: "/game/:gameId",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    schema: getGameSchema,
    handler: async (
      request: FastifyRequest<{
        Params: {
          gameId: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      // TODO: gameCode
      const game = await gameService.getGame(request.params.gameId);
      return reply.send(game);
    },
  });

  // delete
  fastify.route({
    url: "/game/:gameId",
    logLevel: "warn",
    method: ["DELETE"],
    preHandler: fastify.auth([JWTVerify]),
    handler: async (
      request: FastifyRequest<{
        Params: {
          gameId: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      // todo: check who created game as only creator should be able to delete
      const result = await gameService.deleteGame(request.params.gameId);
      return reply.send(result);
    },
  });
}
