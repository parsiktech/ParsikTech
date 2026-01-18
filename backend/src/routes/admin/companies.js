const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { query } = require('../../db/config');
const { authenticate, requireAdmin } = require('../../middleware/auth');
const { logActivity, ACTIONS } = require('../../services/activityService');
const { errorResponse, successResponse } = require('../../utils/helpers');

// All routes require admin authentication
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/companies
 * List all companies with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`cc.status = $${paramIndex++}`);
      params.push(status);
    }

    if (search) {
      whereConditions.push(`(cc.name ILIKE $${paramIndex} OR cc.owner_email ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    params.push(parseInt(limit), parseInt(offset));

    const result = await query(
      `SELECT cc.*,
              ca.email as account_email,
              ca.is_active as account_active,
              ca.last_login_at as account_last_login,
              au.name as created_by_name,
              (SELECT it.email FROM invite_tokens it
               WHERE it.company_id = cc.id AND it.is_used = false AND it.expires_at > NOW()
               ORDER BY it.created_at DESC LIMIT 1) as pending_invite_email
       FROM client_companies cc
       LEFT JOIN client_accounts ca ON cc.id = ca.company_id
       LEFT JOIN admin_users au ON cc.created_by = au.id
       ${whereClause}
       ORDER BY cc.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM client_companies cc ${whereClause}`,
      params.slice(0, -2)
    );

    return successResponse(res, {
      companies: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('List companies error:', err);
    return errorResponse(res, 500, 'Failed to list companies');
  }
});

/**
 * GET /api/admin/companies/:id
 * Get single company details
 */
router.get('/:id', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid company ID');
    }

    const result = await query(
      `SELECT cc.*,
              ca.id as account_id,
              ca.email as account_email,
              ca.is_active as account_active,
              ca.last_login_at as account_last_login,
              ca.created_at as account_created_at,
              au.name as created_by_name
       FROM client_companies cc
       LEFT JOIN client_accounts ca ON cc.id = ca.company_id
       LEFT JOIN admin_users au ON cc.created_by = au.id
       WHERE cc.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    return successResponse(res, result.rows[0]);
  } catch (err) {
    console.error('Get company error:', err);
    return errorResponse(res, 500, 'Failed to get company');
  }
});

/**
 * POST /api/admin/companies
 * Create new company
 */
router.post('/', [
  body('name').trim().notEmpty().isLength({ max: 255 }),
  body('ownerEmail').optional().isEmail().normalizeEmail(),
  body('ownerName').optional().trim().isLength({ max: 255 }),
  body('contactPhone').optional().trim().isLength({ max: 50 }),
  body('address').optional().trim(),
  body('website').optional().trim().isURL(),
  body('industry').optional().trim().isLength({ max: 100 }),
  body('internalNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const {
      name, ownerEmail, ownerName, contactPhone,
      address, website, industry, internalNotes
    } = req.body;

    const result = await query(
      `INSERT INTO client_companies
       (name, owner_email, owner_name, contact_phone, address, website, industry, internal_notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, ownerEmail, ownerName, contactPhone, address, website, industry, internalNotes, req.user.id]
    );

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: result.rows[0].id,
      action: ACTIONS.COMPANY_CREATE,
      resourceType: 'company',
      resourceId: result.rows[0].id,
      details: { name },
      req
    });

    return successResponse(res, result.rows[0], 'Company created successfully', 201);
  } catch (err) {
    console.error('Create company error:', err);
    return errorResponse(res, 500, 'Failed to create company');
  }
});

/**
 * PUT /api/admin/companies/:id
 * Update company
 */
router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().trim().notEmpty().isLength({ max: 255 }),
  body('ownerEmail').optional().isEmail().normalizeEmail(),
  body('ownerName').optional().trim().isLength({ max: 255 }),
  body('contactPhone').optional().trim().isLength({ max: 50 }),
  body('address').optional().trim(),
  body('website').optional().trim(),
  body('industry').optional().trim().isLength({ max: 100 }),
  body('internalNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const allowedFields = ['name', 'owner_email', 'owner_name', 'contact_phone', 'address', 'website', 'industry', 'internal_notes'];
    const fieldMapping = {
      ownerEmail: 'owner_email',
      ownerName: 'owner_name',
      contactPhone: 'contact_phone',
      internalNotes: 'internal_notes'
    };

    let setClauses = [];
    let params = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMapping[key] || key;
      if (allowedFields.includes(dbField) && value !== undefined) {
        setClauses.push(`${dbField} = $${paramIndex++}`);
        params.push(value);
      }
    }

    if (setClauses.length === 0) {
      return errorResponse(res, 400, 'No valid fields to update');
    }

    params.push(id);

    const result = await query(
      `UPDATE client_companies
       SET ${setClauses.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: id,
      action: ACTIONS.COMPANY_UPDATE,
      resourceType: 'company',
      resourceId: id,
      details: { updatedFields: Object.keys(updates) },
      req
    });

    return successResponse(res, result.rows[0], 'Company updated successfully');
  } catch (err) {
    console.error('Update company error:', err);
    return errorResponse(res, 500, 'Failed to update company');
  }
});

/**
 * PATCH /api/admin/companies/:id/status
 * Change company status
 */
router.patch('/:id/status', [
  param('id').isUUID(),
  body('status').isIn(['active', 'paused', 'archived'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { id } = req.params;
    const { status } = req.body;

    const result = await query(
      `UPDATE client_companies SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: id,
      action: ACTIONS.COMPANY_STATUS_CHANGE,
      resourceType: 'company',
      resourceId: id,
      details: { newStatus: status },
      req
    });

    return successResponse(res, result.rows[0], `Company status changed to ${status}`);
  } catch (err) {
    console.error('Change company status error:', err);
    return errorResponse(res, 500, 'Failed to change company status');
  }
});

/**
 * GET /api/admin/companies/:id/activity
 * Get company activity history
 */
router.get('/:id/activity', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid company ID');
    }

    const { limit = 50 } = req.query;

    const result = await query(
      `SELECT * FROM activity_logs
       WHERE company_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [req.params.id, parseInt(limit)]
    );

    return successResponse(res, result.rows);
  } catch (err) {
    console.error('Get company activity error:', err);
    return errorResponse(res, 500, 'Failed to get company activity');
  }
});

/**
 * DELETE /api/admin/companies/:id
 * Delete a company and all associated data
 */
router.delete('/:id', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid company ID');
    }

    const { id } = req.params;

    // Check company exists
    const companyResult = await query(
      'SELECT id, name FROM client_companies WHERE id = $1',
      [id]
    );

    if (companyResult.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    const companyName = companyResult.rows[0].name;

    // Delete in order (respecting foreign key constraints)
    // 1. Delete activity logs
    await query('DELETE FROM activity_logs WHERE company_id = $1', [id]);

    // 2. Delete documents
    await query('DELETE FROM documents WHERE company_id = $1', [id]);

    // 3. Delete updates
    await query('DELETE FROM updates WHERE company_id = $1', [id]);

    // 4. Delete invite tokens
    await query('DELETE FROM invite_tokens WHERE company_id = $1', [id]);

    // 5. Delete client accounts
    await query('DELETE FROM client_accounts WHERE company_id = $1', [id]);

    // 6. Finally delete the company
    await query('DELETE FROM client_companies WHERE id = $1', [id]);

    // Log the deletion (without company_id since it's deleted)
    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      action: ACTIONS.COMPANY_DELETE || 'company_delete',
      resourceType: 'company',
      resourceId: id,
      details: { deletedCompanyName: companyName },
      req
    });

    return successResponse(res, null, `Company "${companyName}" and all associated data deleted successfully`);
  } catch (err) {
    console.error('Delete company error:', err);
    return errorResponse(res, 500, 'Failed to delete company');
  }
});

module.exports = router;
