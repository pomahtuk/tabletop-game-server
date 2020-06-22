import fp from "fastify-plugin";

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
    _opts: any,
    next: (err?: FastifyError | undefined) => void
  ) => {
    fastify.route({
      url: "/status",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>
      ) => {
        return reply.send({ date: new Date(), works: true });
      },
    });
    next();
  }
);
