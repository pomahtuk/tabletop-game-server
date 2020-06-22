import fp from "fastify-plugin";

import {
  listGamesSchema,
  postGameSchema,
  putGameSchema,
} from "../schemas/game.schema";
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  FastifyError,
} from "fastify";
import { ServerResponse } from "http";
import { GameService } from "../services/game.service";

export default fp(
  async (
    fastify: FastifyInstance,
    _opts: any,
    next: (err?: FastifyError | undefined) => void
  ) => {
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
        const games = await gameService.getGames();
        return reply.send(games);
      },
    });

    // get one
    fastify.route({
      url: "/game/:gameId",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const game = gameService.getGame(request.params.gameId);
        return reply.send(game);
      },
    });

    // create one
    fastify.route({
      url: "/game",
      logLevel: "warn",
      method: ["POST"],
      schema: postGameSchema,
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const game = gameService.createGame(request.body);
        return reply.send(game);
      },
    });

    // replace
    fastify.route({
      url: "/game/:gameId",
      logLevel: "warn",
      method: ["PUT"],
      schema: putGameSchema,
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const game = await gameService.updateGame(
          request.params.gameId,
          request.body
        );
        return reply.send(game);
      },
    });

    // delete
    fastify.route({
      url: "/game/:gameId",
      logLevel: "warn",
      method: ["DELETE"],
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const result = await gameService.deleteGame(request.params.gameId);

        return reply.send(result);
      },
    });

    next();
  }
);
