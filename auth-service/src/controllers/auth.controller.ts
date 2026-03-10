import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const passwordValidator = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");

export class AuthController {
  static registerValidators = [
    body("email").isEmail().withMessage("Invalid email format"),
    passwordValidator,
    body("role").isIn(["student", "trainer"]).withMessage("Invalid role"),
  ];

  static loginValidators = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ];

  static activateValidators = [
    body("token").notEmpty().withMessage("Activation token is required"),
    passwordValidator,
  ];

  static async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    try {
      await AuthService.registerUser(email, password, role);
      res.status(201).json({ message: "User created" });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message === "Email already exists" || error.message === "Admin account already exists") {
        const msg = process.env.NODE_ENV === "production" ? "Registration failed" : error.message;
        return res.status(400).json({ error: msg });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  }

  static async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const token = await AuthService.loginUser(email, password);
      res.json({ token });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message });
      }
      if (error.message === "Password change required") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  }

  static async activate(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;
    try {
      await AuthService.activateUser(token, password);
      res.json({ message: "Password set, you can now login" });
    } catch (error: any) {
      console.error("Activation error:", error);
      if (error.message === "Invalid or expired token") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Activation failed" });
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await AuthService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
}