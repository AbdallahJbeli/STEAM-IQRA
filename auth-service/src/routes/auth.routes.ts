import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// public routes
router.post("/register", authLimiter, AuthController.registerValidators, AuthController.register);
router.post("/login", authLimiter, AuthController.loginValidators, AuthController.login);

// admin only routes
router.post("/create-trainer", authenticate, authorize("admin"), AuthController.createTrainerValidators, AuthController.createTrainer);
router.put("/change-credentials", authenticate, authorize("admin"), AuthController.changeCredentialsValidators, AuthController.changeCredentials);

// trainer & student routes
router.put("/change-password", authenticate, authorize("trainer", "student"), AuthController.changePasswordValidators, AuthController.changePassword);

// any authenticated user
router.get("/me", authenticate, AuthController.getMe);

export default router;