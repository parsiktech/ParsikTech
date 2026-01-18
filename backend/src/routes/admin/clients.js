const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { query } = require('../../db/config');
const { authenticate, requireAdmin } = require('../../middleware/auth');
const { hashPassword } = require('../../services/authService');
const { logActivity, ACTIONS } = require('../../services/activityService');
const { sendInviteEmail } = require('../../services/emailService');
const { errorResponse, successResponse, generateToken, hashToken, isStrongPassword } = require('../../utils/helpers');

// All routes require admin authentication
router.use(authenticate, requireAdmin);

/**
 * POST /api/admin/clients
 * Create client account for a company (with optional invite)
 * If sendInvite is true, sends an email invite. Otherwise requires password.
 */
router.post('/', [
  body('companyId').isUUID(),
  body('email').isEmail().normalizeEmail(),
  body('name').optional().trim().notEmpty(),
  body('sendInvite').optional().isBoolean(),
  body('password').optional().isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { companyId, email, name, password, sendInvite = true } = req.body;

    // If not sending invite, password is required
    if (!sendInvite && !password) {
      return errorResponse(res, 400, 'Password is required when not sending invite');
    }

    if (password && !isStrongPassword(password)) {
      return errorResponse(res, 400, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    // Check company exists
    const companyResult = await query(
      'SELECT id, name FROM client_companies WHERE id = $1',
      [companyId]
    );

    if (companyResult.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    // Check if company already has an account
    const existingAccount = await query(
      'SELECT id FROM client_accounts WHERE company_id = $1',
      [companyId]
    );

    if (existingAccount.rows.length > 0) {
      return errorResponse(res, 400, 'Company already has a client account');
    }

    // If sending invite, create invite token and send email
    if (sendInvite) {
      // Generate invite token
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 48 * 3600000); // 48 hours

      await query(
        `INSERT INTO invite_tokens (token, company_id, email, expires_at, created_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [hashToken(token), companyId, email, expiresAt, req.user.id]
      );

      await logActivity({
        userId: req.user.id,
        userType: 'admin',
        companyId,
        action: ACTIONS.CLIENT_INVITE_SEND,
        resourceType: 'invite',
        details: { email, name, expiresAt, companyName: companyResult.rows[0].name },
        req
      });

      // Generate invite URL and send email
      const inviteUrl = `${process.env.FRONTEND_URL}/invite/${token}`;

      const emailResult = await sendInviteEmail({
        to: email,
        companyName: companyResult.rows[0].name,
        inviteUrl,
        expiresAt,
      });

      return successResponse(res, {
        client: { email, name, companyId, invitePending: true },
        invite: {
          inviteUrl,
          expiresAt,
          emailSent: emailResult.success && !emailResult.skipped,
          emailSkipped: emailResult.skipped || false,
        }
      }, emailResult.skipped ? 'Invite created (email not configured)' : 'Invite sent successfully', 201);
    }

    // Direct account creation with password
    const passwordHash = await hashPassword(password);

    const result = await query(
      `INSERT INTO client_accounts (company_id, email, password_hash, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, company_id, email, is_active, created_at`,
      [companyId, email, passwordHash, req.user.id]
    );

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId,
      action: ACTIONS.CLIENT_ACCOUNT_CREATE,
      resourceType: 'client_account',
      resourceId: result.rows[0].id,
      details: { email, companyName: companyResult.rows[0].name },
      req
    });

    return successResponse(res, { client: result.rows[0] }, 'Client account created successfully', 201);
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      return errorResponse(res, 400, 'Email already in use');
    }
    console.error('Create client error:', err);
    return errorResponse(res, 500, 'Failed to create client account');
  }
});

/**
 * POST /api/admin/clients/invite
 * Send invite link to create client account
 */
router.post('/invite', [
  body('companyId').isUUID(),
  body('email').isEmail().normalizeEmail(),
  body('expiresInHours').optional().isInt({ min: 1, max: 168 }) // 1 hour to 7 days
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { companyId, email, expiresInHours = 48 } = req.body;

    // Check company exists
    const companyResult = await query(
      'SELECT id, name FROM client_companies WHERE id = $1',
      [companyId]
    );

    if (companyResult.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    // Check if company already has an account
    const existingAccount = await query(
      'SELECT id FROM client_accounts WHERE company_id = $1',
      [companyId]
    );

    if (existingAccount.rows.length > 0) {
      return errorResponse(res, 400, 'Company already has a client account');
    }

    // Invalidate any existing invites for this company
    await query(
      'UPDATE invite_tokens SET is_used = true WHERE company_id = $1 AND is_used = false',
      [companyId]
    );

    // Generate new invite token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + expiresInHours * 3600000);

    await query(
      `INSERT INTO invite_tokens (token, company_id, email, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [hashToken(token), companyId, email, expiresAt, req.user.id]
    );

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId,
      action: ACTIONS.CLIENT_INVITE_SEND,
      resourceType: 'invite',
      details: { email, expiresAt, companyName: companyResult.rows[0].name },
      req
    });

    // Generate invite URL and send email
    const inviteUrl = `${process.env.FRONTEND_URL}/invite/${token}`;

    const emailResult = await sendInviteEmail({
      to: email,
      companyName: companyResult.rows[0].name,
      inviteUrl,
      expiresAt,
    });

    return successResponse(res, {
      inviteUrl,
      expiresAt,
      email,
      emailSent: emailResult.success && !emailResult.skipped,
      emailSkipped: emailResult.skipped || false,
    }, emailResult.skipped ? 'Invite created (email not configured)' : 'Invite sent successfully');
  } catch (err) {
    console.error('Create invite error:', err);
    return errorResponse(res, 500, 'Failed to create invite');
  }
});

/**
 * PUT /api/admin/clients/:id
 * Update client account
 */
router.put('/:id', [
  param('id').isUUID(),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, 'No fields to update');
    }

    const result = await query(
      `UPDATE client_accounts SET email = $1 WHERE id = $2
       RETURNING id, company_id, email, is_active`,
      [email, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Client account not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: result.rows[0].company_id,
      action: ACTIONS.CLIENT_ACCOUNT_UPDATE,
      resourceType: 'client_account',
      resourceId: id,
      details: { newEmail: email },
      req
    });

    return successResponse(res, result.rows[0], 'Client account updated');
  } catch (err) {
    if (err.code === '23505') {
      return errorResponse(res, 400, 'Email already in use');
    }
    console.error('Update client error:', err);
    return errorResponse(res, 500, 'Failed to update client account');
  }
});

/**
 * PATCH /api/admin/clients/:id/disable
 * Disable client account
 */
router.patch('/:id/disable', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid client ID');
    }

    const result = await query(
      `UPDATE client_accounts SET is_active = false WHERE id = $1
       RETURNING id, company_id, email, is_active`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Client account not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: result.rows[0].company_id,
      action: ACTIONS.CLIENT_ACCOUNT_DISABLE,
      resourceType: 'client_account',
      resourceId: req.params.id,
      req
    });

    return successResponse(res, result.rows[0], 'Client account disabled');
  } catch (err) {
    console.error('Disable client error:', err);
    return errorResponse(res, 500, 'Failed to disable client account');
  }
});

/**
 * PATCH /api/admin/clients/:id/enable
 * Enable client account
 */
router.patch('/:id/enable', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid client ID');
    }

    const result = await query(
      `UPDATE client_accounts SET is_active = true WHERE id = $1
       RETURNING id, company_id, email, is_active`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Client account not found');
    }

    return successResponse(res, result.rows[0], 'Client account enabled');
  } catch (err) {
    console.error('Enable client error:', err);
    return errorResponse(res, 500, 'Failed to enable client account');
  }
});

/**
 * POST /api/admin/clients/resend-invite/:companyId
 * Resend invite for a company that doesn't have a client account yet
 */
router.post('/resend-invite/:companyId', [
  param('companyId').isUUID(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { companyId } = req.params;
    const { email } = req.body;

    // Check company exists
    const companyResult = await query(
      'SELECT id, name FROM client_companies WHERE id = $1',
      [companyId]
    );

    if (companyResult.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    // Check if company already has an account
    const existingAccount = await query(
      'SELECT id FROM client_accounts WHERE company_id = $1',
      [companyId]
    );

    if (existingAccount.rows.length > 0) {
      return errorResponse(res, 400, 'Company already has a client account. Cannot resend invite.');
    }

    // Invalidate any existing invites for this company
    await query(
      'UPDATE invite_tokens SET is_used = true WHERE company_id = $1 AND is_used = false',
      [companyId]
    );

    // Generate new invite token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 48 * 3600000); // 48 hours

    await query(
      `INSERT INTO invite_tokens (token, company_id, email, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [hashToken(token), companyId, email, expiresAt, req.user.id]
    );

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId,
      action: ACTIONS.CLIENT_INVITE_SEND,
      resourceType: 'invite',
      details: { email, expiresAt, companyName: companyResult.rows[0].name, isResend: true },
      req
    });

    // Generate invite URL and send email
    const inviteUrl = `${process.env.FRONTEND_URL}/invite/${token}`;

    const emailResult = await sendInviteEmail({
      to: email,
      companyName: companyResult.rows[0].name,
      inviteUrl,
      expiresAt,
    });

    return successResponse(res, {
      inviteUrl,
      expiresAt,
      email,
      emailSent: emailResult.success && !emailResult.skipped,
      emailSkipped: emailResult.skipped || false,
    }, emailResult.skipped ? 'Invite created (email not configured)' : 'Invite resent successfully');
  } catch (err) {
    console.error('Resend invite error:', err);
    return errorResponse(res, 500, 'Failed to resend invite');
  }
});

/**
 * POST /api/admin/clients/:id/reset-password
 * Reset client password (admin-initiated)
 */
router.post('/:id/reset-password', [
  param('id').isUUID(),
  body('newPassword').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { newPassword } = req.body;

    if (!isStrongPassword(newPassword)) {
      return errorResponse(res, 400, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    const passwordHash = await hashPassword(newPassword);

    const result = await query(
      `UPDATE client_accounts SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL
       WHERE id = $2
       RETURNING id, company_id, email`,
      [passwordHash, req.params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Client account not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: result.rows[0].company_id,
      action: ACTIONS.PASSWORD_RESET,
      resourceType: 'client_account',
      resourceId: req.params.id,
      details: { initiatedBy: 'admin' },
      req
    });

    return successResponse(res, null, 'Password reset successfully');
  } catch (err) {
    console.error('Reset client password error:', err);
    return errorResponse(res, 500, 'Failed to reset password');
  }
});

module.exports = router;
