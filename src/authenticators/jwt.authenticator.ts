import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ServerResponse } from "http";

export const JWTVerify = async (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>,
  done: (err?: FastifyError | undefined) => void
) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return done(err);
  }
  return done();
};
