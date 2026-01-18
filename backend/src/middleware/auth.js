const { verifyJWT } = require('../services/authService');
const { errorResponse } = require('../utils/helpers');
const { query } = require('../db/config');

/**
 * Authenticate any user (admin or client)
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return errorResponse(res, 401, 'Invalid or expired token');
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return errorResponse(res, 401, 'Authentication failed');
  }
}

/**
 * Require admin user
 */
async function requireAdmin(req, res, next) {
  try {
    if (!req.user || req.user.type !== 'admin') {
      return errorResponse(res, 403, 'Admin access required');
    }

    // Verify admin still exists and is active
    const result = await query(
      'SELECT id, is_active FROM admin_users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return errorResponse(res, 403, 'Admin account is inactive');
    }

    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    return errorResponse(res, 500, 'Authorization check failed');
  }
}

/**
 * Require super admin
 */
async function requireSuperAdmin(req, res, next) {
  try {
    if (!req.user || req.user.type !== 'admin' || req.user.role !== 'super_admin') {
      return errorResponse(res, 403, 'Super admin access required');
    }
    next();
  } catch (err) {
    return errorResponse(res, 500, 'Authorization check failed');
  }
}

/**
 * Require client user
 */
async function requireClient(req, res, next) {
  try {
    if (!req.user || req.user.type !== 'client') {
      return errorResponse(res, 403, 'Client access required');
    }

    // Verify client account and company are still active
    const result = await query(
      `SELECT ca.id, ca.is_active, cc.status as company_status
       FROM client_accounts ca
       JOIN client_companies cc ON ca.company_id = cc.id
       WHERE ca.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return errorResponse(res, 403, 'Client account is inactive');
    }

    if (result.rows[0].company_status !== 'active') {
      return errorResponse(res, 403, 'Company account is inactive');
    }

    next();
  } catch (err) {
    console.error('Client auth error:', err);
    return errorResponse(res, 500, 'Authorization check failed');
  }
}

/**
 * Optional authentication - sets req.user if token valid, otherwise continues
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyJWT(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (err) {
    // Continue without auth
    next();
  }
}

module.exports = {
  authenticate,
  requireAdmin,
  requireSuperAdmin,
  requireClient,
  optionalAuth
};
