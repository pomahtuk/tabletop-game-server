import fp from "fastify-plugin";

import { FastifyRequest, FastifyReply } from "fastify";
import { ServerResponse } from "http";

export default fp(async (fastify, _opts, next) => {
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
});
