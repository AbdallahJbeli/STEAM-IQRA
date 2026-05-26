import pool from '../../shared/database/database.js';

export async function getUserByEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('A valid email string is required');
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email, password, role, is_active, email_verified_at FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}
