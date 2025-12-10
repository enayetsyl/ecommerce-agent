import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "shopify_products",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function createUsersTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
          id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email         TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name          TEXT,
          created_at    TIMESTAMPTZ DEFAULT now(),
          updated_at    TIMESTAMPTZ DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log("✅ Users table created successfully!");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

createUsersTable();

