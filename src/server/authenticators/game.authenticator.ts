import {
  FastifyError,
  FastifyReply,
  FastifyRequest,
  RawServerBase,
} from "fastify";
import { User } from "../dao/entities/user";
import { getRepository } from "typeorm";
import { Game } from "../dao/entities/game";

export const UserInGameVerify = async (
  request: FastifyRequest<{
    Params: {
      gameId: string;
    };
  }>,
  _: FastifyReply<RawServerBase>,
  done: (err?: Error | undefined) => void
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
    return done(error as Error);
  }
};

export const getUserId = (user: any): string => {
  // this is types issue, in fact request.user is an object
  return (user as User).id;
};
