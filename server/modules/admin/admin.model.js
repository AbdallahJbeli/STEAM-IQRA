import pool from '../config/database.js';

export async function getAllUsers() {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, is_active, email_verified_at FROM users ORDER BY id'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

export async function setUserActive(userId, isActive) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const result = await pool.query(
      'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, username, email, is_active',
      [isActive, userId]
    );
    return result.rows[0] ?? null;
  } catch (error) {
    console.error('Error updating user active status:', error);
    throw error;
  }
}
