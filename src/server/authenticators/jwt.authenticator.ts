import {
  FastifyError,
  FastifyReply,
  FastifyRequest,
  RawServerBase,
} from "fastify";

export const JWTVerify = async (
  request: FastifyRequest,
  reply: FastifyReply<RawServerBase>,
  done: (err?: Error | undefined) => void
) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return done(err as Error);
  }
  return done();
};
