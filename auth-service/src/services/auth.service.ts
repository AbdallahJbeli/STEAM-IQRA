import bcrypt from "bcrypt";
import crypto from "crypto";
import { pool } from "../config/database";
import jwt, { SignOptions } from "jsonwebtoken";

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
    const existingUser = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      throw new Error("Email already exists");
    }

    if (role === "admin") {
      const adminCheck = await pool.query("SELECT id FROM auth_users WHERE role = 'admin'");
      if (adminCheck.rows.length > 0) {
        throw new Error("Admin account already exists");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO auth_users (email, password_hash, role, needs_password_reset) VALUES ($1, $2, $3, false)",
      [email, hashedPassword, role]
    );
  }

  static async loginUser(email: string, password: string): Promise<string> {
    const result = await pool.query(
      "SELECT id, email, role, password_hash, needs_password_reset FROM auth_users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];

    if (user.needs_password_reset) {
      throw new Error("Password change required");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret not configured");
    }

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
    };

    return jwt.sign({ id: user.id, role: user.role }, jwtSecret, signOptions);
  }

  static async getUserById(userId: number): Promise<User | null> {
    const result = await pool.query(
      "SELECT id, email, role, is_active, created_at FROM auth_users WHERE id = $1",
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async initAdmin(): Promise<void> {
    const email = process.env.ADMIN_EMAIL;
    if (!email) return;

    const existing = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
    if (existing.rows.length > 0) return;

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      "INSERT INTO auth_users (email, role, activation_token, activation_expires, needs_password_reset) VALUES ($1, 'admin', $2, $3, true)",
      [email, token, expires]
    );

    const port = process.env.PORT || 4001;
    console.log(`*** Admin setup: visit http://localhost:${port}/api/auth/activate?token=${token}`);
  }

  static async activateUser(token: string, newPassword: string): Promise<void> {
    const result = await pool.query(
      "SELECT id, activation_expires FROM auth_users WHERE activation_token = $1",
      [token]
    );

    if (result.rows.length === 0 || new Date() > result.rows[0].activation_expires) {
      throw new Error("Invalid or expired token");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE auth_users SET password_hash=$1, activation_token=NULL, activation_expires=NULL, needs_password_reset=false WHERE id=$2",
      [hashed, result.rows[0].id]
    );
  }
}