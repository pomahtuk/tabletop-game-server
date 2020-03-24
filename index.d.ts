import { Connection } from "typeorm";
import { Server, IncomingMessage, ServerResponse } from "http";
import { FastifyMiddleware } from "fastify";

declare module "fastify" {
  interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    orm: Connection;
    circuitBreaker: () => FastifyMiddleware;
  }
}
