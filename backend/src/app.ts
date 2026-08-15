import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify, { type FastifyRequest } from "fastify";
import type { Pool } from "pg";
import type { Environment } from "./config.js";
import { registerAuthRoutes } from "./auth/routes.js";
import { UserRepository } from "./auth/user-repository.js";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest): Promise<void>;
  }
}

export function buildApp(environment: Environment, pool: Pool) {
  const app = Fastify({ logger: environment.NODE_ENV !== "test" });

  app.register(cors, { origin: environment.CORS_ORIGIN ?? false });
  app.register(jwt, { secret: environment.JWT_SECRET });

  app.decorate("authenticate", async function authenticate(request) {
    await request.jwtVerify();
  });

  app.get("/health", async () => {
    await pool.query("SELECT 1");
    return { status: "ok" };
  });

  app.register(registerAuthRoutes, new UserRepository(pool), environment);

  app.setErrorHandler((error, _request, reply) => {
    if (error.name === "ZodError") {
      return reply.code(400).send({ message: "Dados inválidos.", details: error.issues });
    }
    if (error.code === "23505") {
      return reply.code(409).send({ message: "Já existe um registro com estes dados." });
    }
    app.log.error(error);
    return reply.code(500).send({ message: "Erro interno do servidor." });
  });

  return app;
}
