import fp from "fastify-plugin";
import { FastifyRequest, FastifyReply } from "fastify";

import {
  listUsersSchema,
  putUserSchema,
  getUserSchema,
} from "../schemas/user.schema";
import { ServerResponse } from "http";
import { UsersService } from "../services/users.service";
import { JWTVerify } from "../authenticators/jwt.authenticator";
import { getUserId } from "../authenticators/game.authenticator";

export default fp(async (fastify, _opts, next) => {
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
    url: "/user",
    logLevel: "warn",
    method: ["PUT"],
    schema: putUserSchema,
    preHandler: fastify.auth([JWTVerify]),
    handler: async (
      request: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      const userId = getUserId(request.user);
      const updated = await usersService.updateUser(userId, request.body);
      return reply.send(updated);
    },
  });

  // delete
  fastify.route({
    url: "/user",
    logLevel: "warn",
    method: ["DELETE"],
    preHandler: fastify.auth([JWTVerify]),
    handler: async (
      request: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      const userId = getUserId(request.user);
      // TODO: clear everything associated with this user
      const result = usersService.deleteUser(userId);
      // delete self and logout immediately
      return reply.send(result).clearCookie("token", {
        path: "/",
        httpOnly: true,
        sameSite: true,
      });
    },
  });

  next();
});
