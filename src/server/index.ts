import fastify, { FastifyRequest, FastifyReply } from "fastify";
import helmet from "fastify-helmet";
import websocket from "fastify-websocket";
import fastifyCookie from "fastify-cookie";
import formBody from "fastify-formbody";
import jwt from "fastify-jwt";
import auth from "fastify-auth";
import cors from "fastify-cors";

import { OrmConfig } from "./ormconfig";

import statusRoutes from "./routes/status.routes";
import gameRoutes from "./routes/game.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import gameplayRoutes from "./routes/gameplay.routes";

const IS_TEST = process.env.NODE_ENV === "test";

const server = fastify({
  ajv: { customOptions: { schemaId: "auto" } },
  logger: true,
});

// └── plugins (from the Fastify ecosystem)
server.register(jwt, {
  // TODO: use certificate files or env variables
  secret: "some secret super secret here",
  cookie: {
    cookieName: "token",
    signed: true,
  },
});
server.register(
  require("fastify-typeorm-plugin"),
  IS_TEST
    ? {
        type: "sqlite",
        database: ":memory:",
        // @ts-ignore - types issue, options are valid
        dropSchema: true,
        entities: ["src/server/dao/entities/*.ts"],
        synchronize: true,
        logging: false,
      }
    : OrmConfig
);
server.register(websocket);
server.register(fastifyCookie);
server.register(formBody);
server.register(auth);
server.register(cors, {
  origin: [/\.konquest\.space$/, /localhost/],
  credentials: true,
});
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks and middleware
server.register(helmet);
// └── your services
server.register(statusRoutes);
server.register(gameRoutes);
server.register(userRoutes);
server.register(authRoutes);
server.register(gameplayRoutes);

server.setErrorHandler(
  (error: Error, req: FastifyRequest, reply: FastifyReply) => {
    req.log.error(error);
    reply.send(error);
  }
);

const start = async (port: number = IS_TEST ? 3001 : 3000) => {
  try {
    await server.listen(port, "0.0.0.0");
    console.log(`Started server at port ${port}`);
  } catch (err) {
    console.error(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", (error: Error) => {
  console.error(error);
});

process.on("unhandledRejection", (error: Error) => {
  console.error(error);
});

const { PORT } = process.env;

PORT ? start(parseInt(PORT, 10)) : start();

process.on("SIGINT", async () => {
  console.log("stopping server");
  await server.close();
  console.log("server stopped");
  process.exit(0);
});

export default server;
