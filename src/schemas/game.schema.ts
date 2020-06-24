import { UserSchema } from "./user.schema";

export const GameSchema: any = {
  id: { type: "string", format: "uuid" },
  isPublic: { type: "boolean" },
  numPlayers: { type: "integer" },
  fieldWidth: { type: "integer" },
  fieldHeight: { type: "integer" },
  gameStarted: { type: "boolean" },
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

export const postGameSchema = {
  summary: "create game",
  body: {
    type: "object",
    required: ["users"],
    properties: GameSchema,
  },
  response: {
    200: {
      type: "object",
      properties: GameSchema,
    },
  },
};

export const putGameSchema = {
  summary: "update game",
  body: {
    type: "object",
    required: ["users"],
    properties: GameSchema,
  },
  response: {
    200: {
      type: "object",
      properties: GameSchema,
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
