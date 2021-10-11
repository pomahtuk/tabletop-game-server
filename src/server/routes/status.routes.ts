import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

export default async function statusRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.route({
    url: "/status",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ date: new Date(), works: true });
    },
  });
}
