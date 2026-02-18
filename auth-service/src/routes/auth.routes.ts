import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/database";
import jwt from "jsonwebtoken";
import { authenticate } from "../middlewares/auth.middleware";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../middlewares/auth.middleware";



const router = Router();

// REGISTER 

router.post("/register", [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
  .isLength({ min: 6})
  .withMessage("Password must be at least 6 characters"),
], 
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO auth_users (email, password_hash, role) VALUES ($1, $2, $3)",
      [email, hashedPassword, "student"]
    );

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN 

router.post("/login", [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
], 
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM auth_users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// PROTECTED ROUTES

router.get("/profile", authenticate, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, email, role, is_active, created_at FROM auth_users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;