import fp from "fastify-plugin";

import { FastifyRequest, FastifyReply, CookieSerializeOptions } from "fastify";
import { ServerResponse } from "http";

import { postUserSchema } from "../schemas/user.schema";
import { UsersService } from "../services/users.service";
import { AuthService } from "../services/auth.service";
import { PasswordResetService } from "../services/password.reset.service";
import { MailerServiceImpl } from "../services/mailer.service";
import { JWTVerify } from "../authenticators/jwt.authenticator";

export default fp(async (fastify, _opts, next) => {
  const usersService = new UsersService();
  const mailerService = new MailerServiceImpl();
  const authService = new AuthService(usersService, mailerService);
  const passwordResetService = new PasswordResetService(
    usersService,
    mailerService
  );

  const cookieOptions: CookieSerializeOptions = {
    // domain: 'your.domain',
    path: "/",
    // secure: true, // send cookie over HTTPS only
    httpOnly: true,
    sameSite: true, // alternative CSRF protection
  };

  // user register
  fastify.route({
    url: "/auth/register",
    logLevel: "warn",
    method: "POST",
    schema: postUserSchema,
    handler: async (
      req: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      const user = await authService.register(req.body);
      const token = await reply.jwtSign({ ...user });

      return reply.setCookie("token", token, cookieOptions).send(user);
    },
  });

  // user register
  fastify.route({
    url: "/auth/activate/:code",
    logLevel: "warn",
    method: "POST",
    // TODO: activation schema here
    handler: async (
      req: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      const user = await authService.activateUser(req.params.code);
      const token = await reply.jwtSign({ ...user });

      return reply.setCookie("token", token, cookieOptions).send(user);
    },
  });

  // user login
  fastify.route({
    url: "/auth/login",
    logLevel: "warn",
    method: "POST",
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

      return reply.setCookie("token", token, cookieOptions).send(user);
    },
  });

  // user logout
  fastify.route({
    url: "/auth/logout",
    logLevel: "warn",
    method: "POST",
    handler: async (
      req: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      return reply.clearCookie("token", cookieOptions).send({ status: "OK" });
    },
  });

  // start password reset
  fastify.route({
    url: "/auth/reset/start",
    logLevel: "warn",
    method: "POST",
    handler: async (
      req: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      const email: string = req.body["email"];
      await passwordResetService.startPasswordReset(email);
      return reply.send({ status: "OK" });
    },
  });

  // complete password reset
  fastify.route({
    url: "/auth/reset/complete",
    logLevel: "warn",
    method: "POST",
    handler: async (
      req: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      const email: string = req.body["email"];
      const token: string = req.body["token"];
      const password: string = req.body["password"];
      await passwordResetService.resetPassword({
        email,
        token,
        password,
      });
      return reply.send({ status: "OK" });
    },
  });

  // complete password reset
  fastify.route({
    url: "/auth/check",
    logLevel: "warn",
    method: "GET",
    preHandler: fastify.auth([JWTVerify]),
    handler: async (
      req: FastifyRequest,
      reply: FastifyReply<ServerResponse>
    ) => {
      return reply.send(req.user);
    },
  });
  next();
});
