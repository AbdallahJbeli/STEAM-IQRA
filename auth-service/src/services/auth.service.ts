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
      throw new Error("Cannot register as admin");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO auth_users (email, password_hash, role, needs_password_reset) VALUES ($1, $2, $3, false)",
      [email, hashedPassword, role]
    );
  }

  static async loginUser(email: string, password: string): Promise<{ token: string; mustChangeCredentials: boolean }> {
    const result = await pool.query(
      "SELECT id, email, role, password_hash, needs_password_reset FROM auth_users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];

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

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, signOptions);

    return {
      token,
      mustChangeCredentials: user.needs_password_reset === true,
    };
  }

  static async getUserById(userId: number): Promise<User | null> {
    const result = await pool.query(
      "SELECT id, email, role, is_active, created_at FROM auth_users WHERE id = $1",
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async changeCredentials(
    userId: number,
    newEmail: string,
    newPassword: string
  ): Promise<void> {
    const existing = await pool.query(
      "SELECT id FROM auth_users WHERE email = $1 AND id != $2",
      [newEmail, userId]
    );
    if (existing.rows.length > 0) {
      throw new Error("Email already in use");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE auth_users SET email=$1, password_hash=$2, needs_password_reset=false WHERE id=$3",
      [newEmail, hashed, userId]
    );
  }

  static async createTrainer(email: string): Promise<{ email: string; tempPassword: string }> {
    const existing = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      throw new Error("Email already exists");
    }

    // generate a random temporary password
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashed = await bcrypt.hash(tempPassword, 10);

    await pool.query(
      "INSERT INTO auth_users (email, password_hash, role, needs_password_reset) VALUES ($1, $2, 'trainer', true)",
      [email, hashed]
    );

    // TODO: replace with real email sending
    return { email, tempPassword };
  }

  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const result = await pool.query(
      "SELECT password_hash FROM auth_users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE auth_users SET password_hash=$1, needs_password_reset=false WHERE id=$2",
      [hashed, userId]
    );
  }

  static async seedAdmin(): Promise<void> {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed");
      return;
    }

    const existing = await pool.query("SELECT id FROM auth_users WHERE role = 'admin'");
    if (existing.rows.length > 0) return;

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO auth_users (email, password_hash, role, needs_password_reset) VALUES ($1, $2, 'admin', true)",
      [email, hashed]
    );

    console.log(`*** Admin seeded with email: ${email} — login and change your credentials immediately`);
  }
}