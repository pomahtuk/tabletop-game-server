import { GameSchema } from "./game.schema";

export const UserSchema = {
  id: { type: "string", format: "uuid" },
  username: { type: "string" },
  email: { type: "string" },
  games: { type: "array", items: { properties: GameSchema } },
  created_at: { type: "string", format: "date-time" },
  updated_at: { type: "string", format: "date-time" },
};

export const listUsersSchema = {
  summary: "list users",
  response: {
    200: {
      type: "array",
      items: {
        properties: UserSchema,
      },
    },
  },
};

export const postUserSchema = {
  summary: "create user",
  body: {
    type: "object",
    required: ["username"],
    properties: UserSchema,
  },
  response: {
    200: {
      type: "object",
      properties: UserSchema,
    },
  },
};

export const putUserSchema = {
  summary: "update user",
  body: {
    type: "object",
    required: ["username"],
    properties: UserSchema,
  },
  response: {
    200: {
      type: "object",
      properties: UserSchema,
    },
  },
};

export const getUserSchema = {
  summary: "update user",
  response: {
    200: {
      type: "object",
      properties: UserSchema,
    },
  },
};
