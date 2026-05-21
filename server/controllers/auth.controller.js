import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/auth.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    if (user.is_active === false) {
      return res.status(403).json({
        message: 'Your account is not active'
      });
    }

    if (user.email_verified_at === null) {
      return res.status(403).json({
        message: 'Email address is not verified'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};