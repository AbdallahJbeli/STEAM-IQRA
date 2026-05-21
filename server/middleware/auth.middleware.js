import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token missing or malformed',
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    const statusCode = 401;
    let message = 'Invalid or expired token';

    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    } else if (error.name === 'NotBeforeError') {
      message = 'Token not yet valid';
    }

    console.warn('Authentication error:', {
      error: error.name,
      path: req.path,
      ip: req.ip,
    });

    return res.status(statusCode).json({ message });
  }
};