import { GameSchema } from "./game.schema";

export const startGameSchema = {
  summary: "start game",
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

export const takeTurnSchema = {
  summary: "take turn in a game",
  body: {
    type: "object",
    required: ["orders"],
    properties: GameSchema,
  },
  response: {
    200: {
      type: "object",
      properties: GameSchema,
    },
  },
};
