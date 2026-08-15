import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify, { type FastifyRequest } from "fastify";
import type { Pool } from "pg";
import { ZodError } from "zod";
import type { Environment } from "./config.js";
import { registerAuthRoutes } from "./auth/routes.js";
import { UserRepository } from "./auth/user-repository.js";
import { InventoryRepository } from "./inventory/repository.js";
import { registerInventoryRoutes } from "./inventory/routes.js";
import { PartyRepository } from "./parties/repository.js";
import { registerPartyRoutes } from "./parties/routes.js";
import { ProductRepository } from "./products/repository.js";
import { registerProductRoutes } from "./products/routes.js";
import { PurchaseRepository } from "./purchases/repository.js";
import { registerPurchaseRoutes } from "./purchases/routes.js";
import { registerUserRoutes } from "./users/routes.js";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest): Promise<void>;
  }
}

export function buildApp(environment: Environment, pool: Pool) {
  const app = Fastify({ logger: environment.NODE_ENV !== "test" });
  const users = new UserRepository(pool);
  const parties = new PartyRepository(pool);
  const products = new ProductRepository(pool);
  const inventory = new InventoryRepository(pool);
  const purchases = new PurchaseRepository(pool);

  app.register(cors, { origin: environment.CORS_ORIGIN ?? false });
  app.register(jwt, { secret: environment.JWT_SECRET });

  app.decorate("authenticate", async function authenticate(request) {
    await request.jwtVerify();
  });

  app.get("/health", async () => {
    await pool.query("SELECT 1");
    return { status: "ok" };
  });

  registerAuthRoutes(app, users, environment);
  registerUserRoutes(app, users);
  registerPartyRoutes(app, users, parties);
  registerProductRoutes(app, users, products);
  registerInventoryRoutes(app, users, inventory);
  registerPurchaseRoutes(app, users, purchases, products);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
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
