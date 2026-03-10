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
    // Check for duplicate email
    const existingUser = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      throw new Error("Email already exists");
    }

    // disallow creating additional admins via public registration once one exists
    if (role === 'admin') {
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
    const result = await pool.query("SELECT * FROM auth_users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];

    // if the account still requires initial password set, block login
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

    const jwtExpires = process.env.JWT_EXPIRES_IN || "1d";
    const signOptions: SignOptions = {
      expiresIn: jwtExpires as unknown as SignOptions['expiresIn']
    };

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      signOptions
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

  /**
   * Called on server startup to ensure an admin account exists.
   * If not, create a placeholder with a one‑time activation token and
   * log (or email) a link for the administrator to set their password.
   */
  static async initAdmin(): Promise<void> {
    const email = process.env.ADMIN_EMAIL;
    if (!email) {
      return;
    }

    const existing = await pool.query("SELECT id FROM auth_users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await pool.query(
      "INSERT INTO auth_users (email, role, activation_token, activation_expires, needs_password_reset) VALUES ($1, 'admin', $2, $3, true)",
      [email, token, expires]
    );

    // preview activation link in logs; replace with real email send later
    const port = process.env.PORT || 4001;
    console.log(`*** Admin setup: visit http://localhost:${port}/api/auth/activate?token=${token}`);
  }

  static async activateUser(token: string, newPassword: string): Promise<void> {
    const result = await pool.query(
      "SELECT id, activation_expires FROM auth_users WHERE activation_token = $1",
      [token]
    );
    if (result.rows.length === 0) {
      throw new Error("Invalid or expired token");
    }
    const user = result.rows[0];
    const expires: Date = user.activation_expires;
    if (expires && new Date() > expires) {
      throw new Error("Activation token expired");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE auth_users SET password_hash=$1, activation_token=NULL, activation_expires=NULL, needs_password_reset=false WHERE id=$2",
      [hashed, user.id]
    );
  }
}