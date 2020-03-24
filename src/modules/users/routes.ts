import * as fp from "fastify-plugin";

import { User } from "../../dao/entities/user";
import { listUsersSchema, postUserSchema, putUserSchema } from "./schema";
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
      url: "/users",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      schema: listUsersSchema,
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const users = await fastify.orm.getRepository(User).find({
          relations: ["games"],
        });

        return reply.send(users);
      },
    });

    // get one
    fastify.route({
      url: "/user/:userId",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const user = await fastify.orm
          .getRepository(User)
          .findOne(request.params.userId, {
            relations: ["games"],
          });

        return reply.send(user);
      },
    });

    // create one
    fastify.route({
      url: "/user",
      logLevel: "warn",
      method: ["POST"],
      schema: postUserSchema,
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const userRepository = fastify.orm.getRepository(User);

        const user = await userRepository.create(request.body);
        const results = await userRepository.save(user);
        return reply.send(results);
      },
    });

    // replace
    fastify.route({
      url: "/user/:userId",
      logLevel: "warn",
      method: ["PUT"],
      schema: putUserSchema,
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const userRepository = fastify.orm.getRepository(User);
        const user = await userRepository.findOne(request.params.userId, {
          relations: ["games"],
        });
        if (!user) {
          return reply.code(404).send("not found");
        }
        userRepository.merge(user, request.body);
        const results = await userRepository.save(user);
        return reply.send(results);
      },
    });

    // delete
    fastify.route({
      url: "/user/:userId",
      logLevel: "warn",
      method: ["DELETE"],
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const result = await fastify.orm
          .getRepository(User)
          .delete(request.params.userId);

        return reply.send(result);
      },
    });

    done();
  }
);
