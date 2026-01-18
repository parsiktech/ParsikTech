const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');
const { logActivity, ACTIONS } = require('../services/activityService');
const { authenticate, requireAdmin, requireClient } = require('../middleware/auth');
const { errorResponse, successResponse, isStrongPassword } = require('../utils/helpers');

/**
 * POST /api/auth/admin/login
 * Admin login
 */
router.post('/admin/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;
    const result = await authService.adminLogin(email, password);

    if (!result.success) {
      await logActivity({
        userId: null,
        userType: 'admin',
        action: ACTIONS.LOGIN,
        details: { email, success: false },
        req
      });
      return errorResponse(res, 401, result.message);
    }

    await logActivity({
      userId: result.user.id,
      userType: 'admin',
      action: ACTIONS.LOGIN,
      details: { email, success: true },
      req
    });

    return successResponse(res, {
      token: result.token,
      user: result.user
    }, 'Login successful');
  } catch (err) {
    console.error('Admin login error:', err);
    return errorResponse(res, 500, 'Login failed');
  }
});

/**
 * POST /api/auth/client/login
 * Client login
 */
router.post('/client/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;
    const result = await authService.clientLogin(email, password);

    if (!result.success) {
      await logActivity({
        userId: null,
        userType: 'client',
        action: ACTIONS.LOGIN,
        details: { email, success: false },
        req
      });
      return errorResponse(res, 401, result.message);
    }

    await logActivity({
      userId: result.user.id,
      userType: 'client',
      companyId: result.user.companyId,
      action: ACTIONS.LOGIN,
      details: { email, success: true },
      req
    });

    return successResponse(res, {
      token: result.token,
      user: result.user
    }, 'Login successful');
  } catch (err) {
    console.error('Client login error:', err);
    return errorResponse(res, 500, 'Login failed');
  }
});

/**
 * POST /api/auth/password/request-reset
 * Request password reset
 */
router.post('/password/request-reset', [
  body('email').isEmail().normalizeEmail(),
  body('userType').optional().isIn(['admin', 'client'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { email, userType = 'client' } = req.body;
    const result = await authService.requestPasswordReset(email, userType);

    await logActivity({
      userId: null,
      userType,
      action: ACTIONS.PASSWORD_RESET_REQUEST,
      details: { email },
      req
    });

    // Always return success to not reveal if email exists
    return successResponse(res, null, result.message);
  } catch (err) {
    console.error('Password reset request error:', err);
    return errorResponse(res, 500, 'Password reset request failed');
  }
});

/**
 * POST /api/auth/password/reset
 * Reset password with token
 */
router.post('/password/reset', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
  body('userType').optional().isIn(['admin', 'client'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { token, password, userType = 'client' } = req.body;

    if (!isStrongPassword(password)) {
      return errorResponse(res, 400, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    const result = await authService.resetPassword(token, password, userType);

    if (!result.success) {
      return errorResponse(res, 400, result.message);
    }

    await logActivity({
      userId: null,
      userType,
      action: ACTIONS.PASSWORD_RESET,
      details: { success: true },
      req
    });

    return successResponse(res, null, result.message);
  } catch (err) {
    console.error('Password reset error:', err);
    return errorResponse(res, 500, 'Password reset failed');
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const { query } = require('../db/config');
    let user;

    if (req.user.type === 'admin') {
      const result = await query(
        'SELECT id, email, name, role, last_login_at, created_at FROM admin_users WHERE id = $1',
        [req.user.id]
      );
      user = result.rows[0];
    } else {
      const result = await query(
        `SELECT ca.id, ca.email, ca.last_login_at, ca.created_at,
                cc.id as company_id, cc.name as company_name, cc.status as company_status
         FROM client_accounts ca
         JOIN client_companies cc ON ca.company_id = cc.id
         WHERE ca.id = $1`,
        [req.user.id]
      );
      user = result.rows[0];
    }

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, {
      ...user,
      type: req.user.type
    });
  } catch (err) {
    console.error('Get user error:', err);
    return errorResponse(res, 500, 'Failed to get user info');
  }
});

/**
 * POST /api/auth/change-password
 * Change own password (authenticated)
 */
router.post('/change-password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { currentPassword, newPassword } = req.body;
    const { query } = require('../db/config');

    if (!isStrongPassword(newPassword)) {
      return errorResponse(res, 400, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    const table = req.user.type === 'admin' ? 'admin_users' : 'client_accounts';

    // Get current password hash
    const result = await query(
      `SELECT password_hash FROM ${table} WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'User not found');
    }

    // Verify current password
    const isValid = await authService.verifyPassword(currentPassword, result.rows[0].password_hash);
    if (!isValid) {
      return errorResponse(res, 401, 'Current password is incorrect');
    }

    // Update password
    const newHash = await authService.hashPassword(newPassword);
    await query(
      `UPDATE ${table} SET password_hash = $1 WHERE id = $2`,
      [newHash, req.user.id]
    );

    return successResponse(res, null, 'Password changed successfully');
  } catch (err) {
    console.error('Change password error:', err);
    return errorResponse(res, 500, 'Failed to change password');
  }
});

module.exports = router;
