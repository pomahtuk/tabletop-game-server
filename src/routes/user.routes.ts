import fp from "fastify-plugin";
import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  FastifyError,
} from "fastify";

import {
  listUsersSchema,
  putUserSchema,
  getUserSchema,
} from "../schemas/user.schema";
import { ServerResponse } from "http";
import { UsersService } from "../services/users.service";

export default fp(
  async (
    fastify: FastifyInstance,
    _opts: any,
    next: (err?: FastifyError | undefined) => void
  ) => {
    const usersService = new UsersService();

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
        const users = await usersService.getUsers();
        return reply.send(users);
      },
    });

    // get one
    fastify.route({
      url: "/user/:userId",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      schema: getUserSchema,
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const user = await usersService.getUser(request.params.userId);
        return reply.send(user);
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
        const updated = await usersService.updateUser(
          request.params.userId,
          request.body
        );
        return reply.send(updated);
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
        const result = usersService.deleteUser(request.params.userId);
        return reply.send(result);
      },
    });

    next();
  }
);
