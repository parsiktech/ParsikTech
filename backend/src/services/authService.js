const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db/config');
const { generateToken, hashToken } = require('../utils/helpers');

const SALT_ROUNDS = 12;

/**
 * Hash a password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

/**
 * Verify JWT token
 */
function verifyJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Admin login
 */
async function adminLogin(email, password) {
  const result = await query(
    'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return { success: false, message: 'Invalid email or password' };
  }

  const admin = result.rows[0];
  const isValid = await verifyPassword(password, admin.password_hash);

  if (!isValid) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Update last login
  await query(
    'UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
    [admin.id]
  );

  const token = generateJWT({
    id: admin.id,
    email: admin.email,
    type: 'admin',
    role: admin.role
  });

  return {
    success: true,
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  };
}

/**
 * Client login
 */
async function clientLogin(email, password) {
  const result = await query(
    `SELECT ca.*, cc.name as company_name, cc.status as company_status
     FROM client_accounts ca
     JOIN client_companies cc ON ca.company_id = cc.id
     WHERE ca.email = $1 AND ca.is_active = true`,
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return { success: false, message: 'Invalid email or password' };
  }

  const client = result.rows[0];

  if (client.company_status !== 'active') {
    return { success: false, message: 'Your account is currently inactive. Please contact support.' };
  }

  const isValid = await verifyPassword(password, client.password_hash);

  if (!isValid) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Update last login
  await query(
    'UPDATE client_accounts SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
    [client.id]
  );

  const token = generateJWT({
    id: client.id,
    email: client.email,
    companyId: client.company_id,
    type: 'client'
  });

  return {
    success: true,
    token,
    user: {
      id: client.id,
      email: client.email,
      companyId: client.company_id,
      companyName: client.company_name
    }
  };
}

/**
 * Request password reset
 */
async function requestPasswordReset(email, userType = 'client') {
  const table = userType === 'admin' ? 'admin_users' : 'client_accounts';

  const result = await query(
    `SELECT id, email FROM ${table} WHERE email = $1`,
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    // Don't reveal if email exists
    return { success: true, message: 'If an account exists, a reset link has been sent.' };
  }

  const user = result.rows[0];
  const resetToken = generateToken();
  const resetTokenHash = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour

  await query(
    `UPDATE ${table} SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3`,
    [resetTokenHash, expiresAt, user.id]
  );

  // Return token for email sending (in production, send email here)
  return {
    success: true,
    message: 'If an account exists, a reset link has been sent.',
    resetToken, // For development - remove in production
    email: user.email
  };
}

/**
 * Reset password with token
 */
async function resetPassword(token, newPassword, userType = 'client') {
  const table = userType === 'admin' ? 'admin_users' : 'client_accounts';
  const tokenHash = hashToken(token);

  const result = await query(
    `SELECT id FROM ${table}
     WHERE password_reset_token = $1
     AND password_reset_expires > CURRENT_TIMESTAMP`,
    [tokenHash]
  );

  if (result.rows.length === 0) {
    return { success: false, message: 'Invalid or expired reset token' };
  }

  const passwordHash = await hashPassword(newPassword);

  await query(
    `UPDATE ${table}
     SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL
     WHERE id = $2`,
    [passwordHash, result.rows[0].id]
  );

  return { success: true, message: 'Password reset successfully' };
}

/**
 * Create admin user (for initial setup or by super_admin)
 */
async function createAdmin(email, password, name, role = 'admin') {
  const passwordHash = await hashPassword(password);

  try {
    const result = await query(
      `INSERT INTO admin_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email.toLowerCase(), passwordHash, name, role]
    );

    return { success: true, admin: result.rows[0] };
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      return { success: false, message: 'Email already exists' };
    }
    throw err;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  adminLogin,
  clientLogin,
  requestPasswordReset,
  resetPassword,
  createAdmin
};
