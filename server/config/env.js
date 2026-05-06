const requiredEnvVars = ['JWT_SECRET'];
const missingVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const JWT_SECRET = process.env.JWT_SECRET;
if (typeof JWT_SECRET !== 'string' || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be a secure string of at least 32 characters');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export { JWT_SECRET, JWT_EXPIRES_IN };
