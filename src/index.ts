import * as fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import statusRoutes from "./routes/status";
import * as helmet from "fastify-helmet";
import * as websocket from "fastify-websocket";
import * as circuitBreaker from "fastify-circuit-breaker";
import * as fastifyCookie from "fastify-cookie";
import * as formBody from "fastify-formbody";

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

// └── plugins (from the Fastify ecosystem)
server.register(websocket);
server.register(circuitBreaker);
server.register(fastifyCookie);
server.register(formBody);
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks and middlewares
server.register(helmet);
// └── your services
server.register(statusRoutes);

const start = async (port: number = 3000) => {
  try {
    await server.listen(port, "0.0.0.0");
    console.log("Started server at port 3000");
    // server.blipp();
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

start(parseInt(PORT, 10));
