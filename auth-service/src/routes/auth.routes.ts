import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5, 
	message: { error: "Too many requests, please try again later." },
	standardHeaders: true,
	legacyHeaders: false,
});

router.post("/register", authLimiter, AuthController.registerValidators, AuthController.register);

router.post("/login", authLimiter, AuthController.loginValidators, AuthController.login);

router.post("/activate", authLimiter, AuthController.activateValidators, AuthController.activate);

router.get("/me", authenticate, AuthController.getMe);

export default router;