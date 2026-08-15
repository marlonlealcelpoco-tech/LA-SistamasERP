import type { Pool } from "pg";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  active: boolean;
};

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  async count(): Promise<number> {
    const result = await this.pool.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM users");
    return Number(result.rows[0].count);
  }

  async findByEmail(email: string): Promise<UserRecord | undefined> {
    const result = await this.pool.query<UserRecord>(
      "SELECT id, name, email, password_hash, active FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<UserRecord | undefined> {
    const result = await this.pool.query<UserRecord>(
      "SELECT id, name, email, password_hash, active FROM users WHERE id = $1 LIMIT 1",
      [id]
    );
    return result.rows[0];
  }

  async create(name: string, email: string, passwordHash: string): Promise<UserRecord> {
    const result = await this.pool.query<UserRecord>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, password_hash, active`,
      [name.trim(), email.toLowerCase(), passwordHash]
    );
    return result.rows[0];
  }
}
