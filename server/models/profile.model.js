import pool from '../config/database.js';

export async function getUserProfileById(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email, role, is_active, email_verified_at FROM users WHERE id = $1',
      [userId]
    );

    return result.rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
