import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/auth.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { allowRoles } from './middleware/role.middleware.js';
import { CLIENT_URL, TRUST_PROXY } from './config/env.js';

const app = express();

// Trust Proxy
if (TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// Security & Body Parsing
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

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);
  return next();
});

// Routes
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

// Protected Route Example
app.get('/api/protected', authMiddleware, allowRoles('admin'), (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.get('/', (req, res) => res.status(200).send('API is running'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;