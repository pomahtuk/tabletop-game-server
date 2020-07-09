import { UserSchema } from "./user.schema";

export const GameSchema: any = {
  id: { type: "string", format: "uuid" },
  winnerId: { type: "string", format: "uuid" },
  isPublic: { type: "boolean" },
  numPlayers: { type: "integer" },
  fieldWidth: { type: "integer" },
  fieldHeight: { type: "integer" },
  neutralPlanetCount: { type: "integer" },
  waitingForPlayer: { type: "integer" },
  gameStarted: { type: "boolean" },
  gameCompleted: { type: "boolean" },
  users: { type: "array", items: { properties: UserSchema } },
};

export const listGamesSchema = {
  summary: "list games",
  response: {
    200: {
      type: "array",
      items: {
        properties: GameSchema,
      },
    },
  },
};

export const getGameSchema = {
  summary: "get game",
  response: {
    200: {
      type: "object",
      properties: GameSchema,
    },
  },
};
