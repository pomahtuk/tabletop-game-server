import { UserSchema } from "../users/schema";

export const GameSchema: any = {
  id: { type: "string", format: "uuid" },
  status: { type: "string", enum: ["not_started", "in_progress", "finished"] },
  users: { type: "array", items: { properties: UserSchema } },
  created_at: { type: "string", format: "date-time" },
  updated_at: { type: "string", format: "date-time" },
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
