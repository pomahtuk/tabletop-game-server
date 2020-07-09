import fp from "fastify-plugin";

import { listGamesSchema, getGameSchema } from "../schemas/game.schema";
import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { GameService } from "../services/game.service";
import { JWTVerify } from "../authenticators/jwt.authenticator";

export default fp(async (fastify, _opts, next) => {
  const gameService = new GameService();

  // list
  fastify.route({
    url: "/games",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    schema: listGamesSchema,
    handler: async (
      request: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
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
      request: FastifyRequest,
      reply: FastifyReply<ServerResponse>
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
      request: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      // todo: check who created game as only creator should be able to delete
      const result = await gameService.deleteGame(request.params.gameId);
      return reply.send(result);
    },
  });

  next();
});
