import bcrypt from "bcrypt";
import { pool } from "../config/database";
import jwt from "jsonwebtoken";

export type Role = "admin" | "student" | "trainer"; 

export interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: Date;
}

export class AuthService {
  static async registerUser(email: string, password: string, role: Role): Promise<void> {
    // Check for duplicate email
    const existingUser = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO auth_users (email, password_hash, role) VALUES ($1, $2, $3)",
      [email, hashedPassword, role]
    );
  }

  static async loginUser(email: string, password: string): Promise<string> {
    const result = await pool.query("SELECT * FROM auth_users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
  throw new Error("JWT secret not configured");
}

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    return token;
  }

  static async getUserById(userId: number): Promise<User | null> {
    const result = await pool.query(
      "SELECT id, email, role, is_active, created_at FROM auth_users WHERE id = $1",
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}