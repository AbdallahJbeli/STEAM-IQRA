import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'JWT_SECRET',
  'CLIENT_URL',
  'SERVER_PORT',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_PORT',
];
const missingVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;
if (typeof JWT_SECRET !== 'string' || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be a secure string of at least 32 characters');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10);
if (Number.isNaN(SERVER_PORT) || SERVER_PORT <= 0) {
  throw new Error('SERVER_PORT must be a valid positive number');
}

const TRUST_PROXY = process.env.TRUST_PROXY === 'true';
const REDIS_URL = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = parseInt(process.env.DB_PORT, 10);
if (Number.isNaN(DB_PORT) || DB_PORT <= 0) {
  throw new Error('DB_PORT must be a valid positive number');
}

export {
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLIENT_URL,
  SERVER_PORT,
  TRUST_PROXY,
  REDIS_URL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
};
