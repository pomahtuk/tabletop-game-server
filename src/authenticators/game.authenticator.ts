import { FastifyError, FastifyReply, FastifyRequest, JWTTypes } from "fastify";
import { ServerResponse } from "http";
import { User } from "../dao/entities/user";
import { getRepository } from "typeorm";
import { Game } from "../dao/entities/game";

export const UserInGameVerify = async (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>,
  done: (err?: FastifyError | undefined) => void
) => {
  const repo = getRepository(Game);
  const { gameId } = request.params;

  if (!gameId) {
    return done(new Error("Game info not found"));
  }

  if (!request.user && !getUserId(request.user)) {
    return done(new Error("User info not found"));
  }
  const userId = getUserId(request.user);

  try {
    const game = await repo.findOne(gameId, {
      relations: ["users"],
    });
    const found = !game?.users.find(
      (user: User): boolean => user.id === userId
    );
    if (found) {
      return done();
    }
    return done(new Error("User could not access this game"));
  } catch (error) {
    return done(error);
  }
};

const getUserId = (user: JWTTypes.SignPayloadType): string => {
  // this is types issue, in fact request.user is an object
  return (user as any).id as string;
};
