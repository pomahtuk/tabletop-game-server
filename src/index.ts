import * as fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import statusRoutes from "./routes/status";

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

server.register(statusRoutes);

const start = async (port: number = 3000) => {
  try {
    await server.listen(port, "0.0.0.0");
    console.log("Started server at port 3000")
    // server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

const { PORT } = process.env;

start(parseInt(PORT, 10));