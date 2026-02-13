import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "steam_iqra_auth",
  password: "Ab@14615751",
  port: 5432,
});