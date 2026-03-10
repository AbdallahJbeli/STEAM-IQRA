import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  max: 10,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err.message)
  } else {
    console.log("Database connected successfully");
    release();
  }
})