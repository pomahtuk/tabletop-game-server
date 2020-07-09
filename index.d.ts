import { Connection } from "typeorm";
import { Server, IncomingMessage, ServerResponse } from "http";
import { FastifyMiddleware, JWTTypes } from "fastify";
import * as jwt from "jsonwebtoken";

interface JWT {
  options: {
    decode: jwt.DecodeOptions;
    sign: jwt.SignOptions;
    verify: jwt.VerifyOptions;
  };
  secret: jwt.Secret;

  sign(payload: JWTTypes.SignPayloadType, options?: jwt.SignOptions): string;
  sign(
    payload: JWTTypes.SignPayloadType,
    callback: JWTTypes.SignCallback
  ): void;
  sign(
    payload: JWTTypes.SignPayloadType,
    options: jwt.SignOptions,
    callback: JWTTypes.SignCallback
  ): void;

  verify<Decoded extends JWTTypes.VerifyPayloadType>(
    token: string,
    options?: jwt.VerifyOptions
  ): Decoded;
  verify<Decoded extends JWTTypes.VerifyPayloadType>(
    token: string,
    callback: JWTTypes.VerifyCallback<Decoded>
  ): void;
  verify<Decoded extends JWTTypes.VerifyPayloadType>(
    token: string,
    options: jwt.VerifyOptions,
    callback: JWTTypes.VerifyCallback<Decoded>
  ): void;

  decode<Decoded extends JWTTypes.DecodePayloadType>(
    token: string,
    options?: jwt.DecodeOptions
  ): null | Decoded;
}

declare module "fastify" {
  interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    orm: Connection;
    circuitBreaker: () => FastifyMiddleware;
    jwt: JWT;
    auth(
      functions: any[],
      options?: {
        relation?: "and" | "or";
        run?: "all";
      }
    ): any;
  }
}
