import { buildApp } from "./app.js";
import { loadEnvironment } from "./config.js";
import { createPool } from "./db/pool.js";
import { UserRepository } from "./auth/user-repository.js";

const environment = loadEnvironment();
const pool = createPool(environment);
const app = buildApp(environment, pool);
const users = new UserRepository(pool);

async function start() {
  try {
    // Ensure the shared administrator exists before the API accepts logins.
    await users.ensureDefaultAdmin();
    await app.listen({ host: environment.HOST, port: environment.PORT });
  } catch (error) {
    app.log.error(error);
    await pool.end();
    process.exit(1);
  }
}

void start();
