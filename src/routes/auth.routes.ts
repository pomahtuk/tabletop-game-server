import * as fp from "fastify-plugin";

import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  FastifyError,
  CookieSerializeOptions,
} from "fastify";
import { ServerResponse } from "http";

import { postUserSchema } from "../schemas/user.schema";
import { UsersService } from "../services/users.service";
import { AuthService } from "../services/auth.service";
import { PasswordResetService } from "../services/password.reset.service";
import { MailerServiceImpl } from "../services/mailer.service";

export default fp(
  async (
    fastify: FastifyInstance,
    _opts: any,
    next: (err?: FastifyError | undefined) => void
  ) => {
    const usersService = new UsersService();
    const authService = new AuthService(usersService);
    const mailerService = new MailerServiceImpl();
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
      method: ["POST", "HEAD"],
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

        return reply.setCookie("token", token, cookieOptions).send(user);
      },
    });

    // user logout
    fastify.route({
      url: "/auth/logout",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (
        req: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        return reply
          .clearCookie("token", {
            // domain: 'your.domain',
            path: "/",
            // secure: true, // send cookie over HTTPS only
            httpOnly: true,
            sameSite: true, // alternative CSRF protection
          })
          .send({ status: "OK" });
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

    next();
  }
);
