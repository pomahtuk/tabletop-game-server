import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { GameService } from "../services/game.service";
import { UsersService } from "../services/users.service";
import { GameplayService } from "../services/gameplay.service";
import { ServerResponse } from "http";
import { JWTVerify } from "../authenticators/jwt.authenticator";
import {
  getUserId,
  UserInGameVerify,
} from "../authenticators/game.authenticator";

export default fp(async (fastify, _opts, next) => {
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
      request: FastifyRequest,
      reply: FastifyReply<ServerResponse>
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
    preHandler: fastify.auth([JWTVerify, UserInGameVerify]),
    handler: async (
      request: FastifyRequest,
      reply: FastifyReply<ServerResponse>
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

  next();
});
