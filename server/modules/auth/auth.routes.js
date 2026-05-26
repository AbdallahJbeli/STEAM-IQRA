import express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { loginController } from './auth.controller.js';
import { REDIS_URL } from '../../config/env.js';

const router = express.Router();

const redisUrl = REDIS_URL;
const redisClient = createClient({ url: redisUrl });
redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});
redisClient.connect().catch((err) => {
  console.error('Failed to connect Redis client for rate limiting:', err);
});

const loginLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: 'rl:',
  }),
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