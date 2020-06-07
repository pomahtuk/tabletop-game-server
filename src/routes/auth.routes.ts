import * as fp from "fastify-plugin";

import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  FastifyError,
} from "fastify";
import { ServerResponse } from "http";

import { postUserSchema } from "../schemas/user.schema";
import { UsersService } from "../services/users.service";
import { AuthService } from "../services/auth.service";

export default fp(
  async (
    fastify: FastifyInstance,
    _opts: any,
    next: (err?: FastifyError | undefined) => void
  ) => {
    const usersService = new UsersService();
    const authService = new AuthService(usersService);

    // user register
    fastify.route({
      url: "/auth/register",
      logLevel: "warn",
      method: ["POST", "HEAD"],
      schema: postUserSchema,
      handler: async (
        req: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const user = await authService.register(req.body);
        const token = await reply.jwtSign({ ...user });

        return reply
          .setCookie("token", token, {
            // domain: 'your.domain',
            // path: '/',
            // secure: true, // send cookie over HTTPS only
            httpOnly: true,
            sameSite: true, // alternative CSRF protection
          })
          .send(user);
      },
    });

    // user login
    fastify.route({
      url: "/auth/login",
      logLevel: "warn",
      method: ["POST", "HEAD"],
      handler: async (
        req: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        const user = await authService.getAuthenticatedUser(
          req.body.email,
          req.body.password
        );

        const token = await reply.jwtSign({
          ...user,
        });

        return reply
          .setCookie("token", token, {
            // domain: 'your.domain',
            // path: '/',
            // secure: true, // send cookie over HTTPS only
            httpOnly: true,
            sameSite: true, // alternative CSRF protection
          })
          .send(user);
      },
    });

    // test
    fastify.route({
      url: "/auth/test",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (
        req: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        await req.jwtVerify();
        return reply.send(req.user);
      },
    });

    next();
  }
);
