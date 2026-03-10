import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const passwordValidator = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");

const newPasswordValidator = body("newPassword")
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

  static changeCredentialsValidators = [
    body("newEmail").isEmail().withMessage("Invalid email format"),
    passwordValidator,
  ];

  static createTrainerValidators = [
    body("email").isEmail().withMessage("Invalid email format"),
  ];

  static changePasswordValidators = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    newPasswordValidator,
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
      if (error.message === "Email already exists" || error.message === "Cannot register as admin") {
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
      const { token, mustChangeCredentials } = await AuthService.loginUser(email, password);
      res.json({ token, mustChangeCredentials });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  }

  static async changeCredentials(req: AuthRequest, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { newEmail, password } = req.body;

    try {
      await AuthService.changeCredentials(req.user!.id, newEmail, password);
      res.json({ message: "Credentials updated successfully" });
    } catch (error: any) {
      console.error("Change credentials error:", error);
      if (error.message === "Email already in use") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to update credentials" });
    }
  }

  static async createTrainer(req: AuthRequest, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const result = await AuthService.createTrainer(email);
      // TODO: send email with credentials instead of returning them
      res.status(201).json({
        message: "Trainer account created",
        credentials: result,
      });
    } catch (error: any) {
      console.error("Create trainer error:", error);
      if (error.message === "Email already exists") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create trainer" });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      await AuthService.changePassword(req.user!.id, currentPassword, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error: any) {
      console.error("Change password error:", error);
      if (error.message === "Current password is incorrect") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to update password" });
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