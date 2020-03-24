import * as fastify from "fastify";
import statusRoutes from "./modules/status";
import gameRoutes from "./modules/game/routes";
import userRoutes from "./modules/users/routes";
import * as helmet from "fastify-helmet";
import * as websocket from "fastify-websocket";
import * as fastifyCookie from "fastify-cookie";
import * as formBody from "fastify-formbody";

const IS_TEST = process.env.NODE_ENV === "test";

const server: fastify.FastifyInstance = fastify({
  ajv: { customOptions: { schemaId: "auto" } },
});

// └── plugins (from the Fastify ecosystem)
server.register(
  require("fastify-typeorm-plugin"),
  IS_TEST
    ? {
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: ["src/dao/entities/*.ts"],
        synchronize: true,
        logging: false,
      }
    : require("../ormconfig.json")
);
server.register(websocket);
server.register(fastifyCookie);
server.register(formBody);
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks and middleware
server.register(helmet);
// └── your services
server.register(statusRoutes);
server.register(gameRoutes);
server.register(userRoutes);

const start = async (port: number = 3000) => {
  try {
    await server.listen(port, "0.0.0.0");
    console.log(`Started server at port ${port}`);
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  console.error(error);
});

process.on("unhandledRejection", (error) => {
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
