import * as fp from "fastify-plugin";

import { Game } from "../../dao/entities/game";
// import { User } from "../../dao/entities/user";
import { listGamesSchema, postGameSchema, putGameSchema } from "./schema";
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  FastifyError,
} from "fastify";
import { ServerResponse } from "http";

export default fp(
  async (
    fastify: FastifyInstance,
    opts: any,
    done: (err?: FastifyError | undefined) => void
  ) => {
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
        const games = await fastify.orm.getRepository(Game).find({
          relations: ["users"],
        });

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
        const game = await fastify.orm
          .getRepository(Game)
          .findOne(request.params.gameId, {
            relations: ["users"],
          });

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
        const gameRepository = fastify.orm.getRepository(Game);

        const game = await gameRepository.create(request.body);
        const results = await gameRepository.save(game);
        return reply.send(results);
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
        const gameRepository = fastify.orm.getRepository(Game);
        const game = await gameRepository.findOne(request.params.gameId, {
          relations: ["users"],
        });
        if (!game) {
          return reply.code(404).send("not found");
        }
        gameRepository.merge(game, request.body);
        const results = await gameRepository.save(game);
        return reply.send(results);
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
        const result = await fastify.orm
          .getRepository(Game)
          .delete(request.params.gameId);

        return reply.send(result);
      },
    });

    done();
  }
);
