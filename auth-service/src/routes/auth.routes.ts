import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

// REGISTER
router.post("/register", AuthController.registerValidators, AuthController.register);

// LOGIN
router.post("/login", AuthController.loginValidators, AuthController.login);

// PROTECTED ROUTES
router.get("/profile", authenticate, AuthController.getProfile);

router.get("/me", authenticate, AuthController.getMe);

export default router;