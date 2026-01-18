const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { query } = require('../db/config');
const authService = require('../services/authService');
const { logActivity, ACTIONS } = require('../services/activityService');
const { errorResponse, successResponse, isStrongPassword, hashToken } = require('../utils/helpers');

/**
 * GET /api/invite/validate/:token
 * Validate invite token and get company info
 */
router.get('/validate/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const tokenHash = hashToken(token);

    const result = await query(
      `SELECT it.*, cc.name as company_name
       FROM invite_tokens it
       JOIN client_companies cc ON it.company_id = cc.id
       WHERE it.token = $1`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Invalid invite token');
    }

    const invite = result.rows[0];

    // Check if already used
    if (invite.used_at) {
      return errorResponse(res, 400, 'This invite has already been used');
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return errorResponse(res, 400, 'This invite has expired');
    }

    return successResponse(res, {
      valid: true,
      email: invite.email,
      companyName: invite.company_name,
      expiresAt: invite.expires_at
    });
  } catch (err) {
    console.error('Validate invite error:', err);
    return errorResponse(res, 500, 'Failed to validate invite');
  }
});

/**
 * POST /api/invite/accept
 * Accept invite and create client account
 */
router.post('/accept', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { token, password } = req.body;
    const tokenHash = hashToken(token);

    // Validate password strength
    if (!isStrongPassword(password)) {
      return errorResponse(res, 400, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    // Get and validate invite token
    const inviteResult = await query(
      `SELECT it.*, cc.name as company_name, cc.status as company_status
       FROM invite_tokens it
       JOIN client_companies cc ON it.company_id = cc.id
       WHERE it.token = $1`,
      [tokenHash]
    );

    if (inviteResult.rows.length === 0) {
      return errorResponse(res, 404, 'Invalid invite token');
    }

    const invite = inviteResult.rows[0];

    // Check if already used
    if (invite.used_at) {
      return errorResponse(res, 400, 'This invite has already been used');
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return errorResponse(res, 400, 'This invite has expired');
    }

    // Check if company is active
    if (invite.company_status !== 'active') {
      return errorResponse(res, 400, 'Company account is not active');
    }

    // Check if account already exists for this email
    const existingAccount = await query(
      'SELECT id FROM client_accounts WHERE email = $1',
      [invite.email]
    );

    if (existingAccount.rows.length > 0) {
      return errorResponse(res, 400, 'An account with this email already exists');
    }

    // Check if company already has an account
    const existingCompanyAccount = await query(
      'SELECT id FROM client_accounts WHERE company_id = $1',
      [invite.company_id]
    );

    if (existingCompanyAccount.rows.length > 0) {
      return errorResponse(res, 400, 'This company already has an account');
    }

    // Hash password
    const passwordHash = await authService.hashPassword(password);

    // Create client account
    const accountResult = await query(
      `INSERT INTO client_accounts (company_id, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, company_id, created_at`,
      [invite.company_id, invite.email, passwordHash]
    );

    // Mark invite as used
    await query(
      'UPDATE invite_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1',
      [invite.id]
    );

    // Create welcome notification
    await query(
      `INSERT INTO notifications (company_id, title, message, notification_type)
       VALUES ($1, 'Welcome to the Portal', 'Your account has been successfully created. Explore your dashboard to see updates and documents.', 'security')`,
      [invite.company_id]
    );

    // Log activity
    await logActivity({
      userId: accountResult.rows[0].id,
      userType: 'client',
      companyId: invite.company_id,
      action: ACTIONS.INVITE_ACCEPT,
      resourceType: 'client_account',
      resourceId: accountResult.rows[0].id,
      details: { email: invite.email, invitedBy: invite.created_by },
      req
    });

    // Generate token for immediate login
    const authToken = authService.generateToken({
      id: accountResult.rows[0].id,
      email: accountResult.rows[0].email,
      companyId: invite.company_id,
      type: 'client'
    });

    return successResponse(res, {
      token: authToken,
      user: {
        id: accountResult.rows[0].id,
        email: accountResult.rows[0].email,
        companyId: invite.company_id,
        companyName: invite.company_name,
        type: 'client'
      }
    }, 'Account created successfully', 201);
  } catch (err) {
    console.error('Accept invite error:', err);
    return errorResponse(res, 500, 'Failed to create account');
  }
});

module.exports = router;
