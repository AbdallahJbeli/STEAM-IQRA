import express from 'express';
import rateLimit from 'express-rate-limit';
import { loginController } from '../controllers/auth.controller.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
});

router.post('/login', loginLimiter, loginController);

export default router;