import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

dotenv.config();

const requiredEnvVars = ['CLIENT_URL', 'SERVER_PORT', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
if (typeof JWT_SECRET !== 'string' || JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be a secure string of at least 32 characters');
  process.exit(1);
}

const PORT = parseInt(process.env.SERVER_PORT, 10);
if (Number.isNaN(PORT) || PORT <= 0) {
  console.error('SERVER_PORT must be a valid positive number');
  process.exit(1);
}

const CLIENT_URL = process.env.CLIENT_URL;
const TRUST_PROXY = process.env.TRUST_PROXY === 'true';

const app = express();
if (TRUST_PROXY) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});


app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/auth', authRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.get('/', (req, res) => res.status(200).send('API is running'));

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});