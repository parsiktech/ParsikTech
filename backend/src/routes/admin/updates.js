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
 * GET /api/admin/updates
 * List all updates with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { companyId, type, isGlobal, limit = 50, offset = 0 } = req.query;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (companyId) {
      whereConditions.push(`u.company_id = $${paramIndex++}`);
      params.push(companyId);
    }

    if (type) {
      whereConditions.push(`u.update_type = $${paramIndex++}`);
      params.push(type);
    }

    if (isGlobal !== undefined) {
      whereConditions.push(`u.is_global = $${paramIndex++}`);
      params.push(isGlobal === 'true');
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    params.push(parseInt(limit), parseInt(offset));

    const result = await query(
      `SELECT u.*, cc.name as company_name, au.name as created_by_name
       FROM updates u
       LEFT JOIN client_companies cc ON u.company_id = cc.id
       LEFT JOIN admin_users au ON u.created_by = au.id
       ${whereClause}
       ORDER BY u.published_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return successResponse(res, result.rows);
  } catch (err) {
    console.error('List updates error:', err);
    return errorResponse(res, 500, 'Failed to list updates');
  }
});

/**
 * POST /api/admin/updates
 * Create a new update
 */
router.post('/', [
  body('title').trim().notEmpty().isLength({ max: 255 }),
  body('content').trim().notEmpty(),
  body('companyId').optional().isUUID(),
  body('isGlobal').optional().isBoolean(),
  body('updateType').optional().isIn(['general', 'status', 'deliverable', 'announcement', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { title, content, companyId, isGlobal = false, updateType = 'general' } = req.body;

    // Validate: must have companyId or be global
    if (!companyId && !isGlobal) {
      return errorResponse(res, 400, 'Update must be either for a specific company or marked as global');
    }

    // If companyId provided, verify company exists
    if (companyId) {
      const companyResult = await query('SELECT id FROM client_companies WHERE id = $1', [companyId]);
      if (companyResult.rows.length === 0) {
        return errorResponse(res, 404, 'Company not found');
      }
    }

    const result = await query(
      `INSERT INTO updates (title, content, company_id, is_global, update_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, content, isGlobal ? null : companyId, isGlobal, updateType, req.user.id]
    );

    // Create notification for company/all companies
    if (isGlobal) {
      // Create notifications for all active companies
      await query(
        `INSERT INTO notifications (company_id, title, message, notification_type, related_resource_type, related_resource_id)
         SELECT id, $1, $2, 'update', 'update', $3
         FROM client_companies WHERE status = 'active'`,
        [title, content.substring(0, 500), result.rows[0].id]
      );
    } else if (companyId) {
      // Create notification for specific company
      await query(
        `INSERT INTO notifications (company_id, title, message, notification_type, related_resource_type, related_resource_id)
         VALUES ($1, $2, $3, 'update', 'update', $4)`,
        [companyId, title, content.substring(0, 500), result.rows[0].id]
      );
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: companyId || null,
      action: ACTIONS.UPDATE_CREATE,
      resourceType: 'update',
      resourceId: result.rows[0].id,
      details: { title, isGlobal, updateType },
      req
    });

    return successResponse(res, result.rows[0], 'Update created successfully', 201);
  } catch (err) {
    console.error('Create update error:', err);
    return errorResponse(res, 500, 'Failed to create update');
  }
});

/**
 * PUT /api/admin/updates/:id
 * Edit an update
 */
router.put('/:id', [
  param('id').isUUID(),
  body('title').optional().trim().notEmpty().isLength({ max: 255 }),
  body('content').optional().trim().notEmpty(),
  body('updateType').optional().isIn(['general', 'status', 'deliverable', 'announcement', 'urgent']),
  body('isPublished').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { id } = req.params;
    const { title, content, updateType, isPublished } = req.body;

    let setClauses = [];
    let params = [];
    let paramIndex = 1;

    if (title !== undefined) {
      setClauses.push(`title = $${paramIndex++}`);
      params.push(title);
    }
    if (content !== undefined) {
      setClauses.push(`content = $${paramIndex++}`);
      params.push(content);
    }
    if (updateType !== undefined) {
      setClauses.push(`update_type = $${paramIndex++}`);
      params.push(updateType);
    }
    if (isPublished !== undefined) {
      setClauses.push(`is_published = $${paramIndex++}`);
      params.push(isPublished);
    }

    if (setClauses.length === 0) {
      return errorResponse(res, 400, 'No fields to update');
    }

    params.push(id);

    const result = await query(
      `UPDATE updates SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Update not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: result.rows[0].company_id,
      action: ACTIONS.UPDATE_EDIT,
      resourceType: 'update',
      resourceId: id,
      details: { updatedFields: Object.keys(req.body) },
      req
    });

    return successResponse(res, result.rows[0], 'Update modified successfully');
  } catch (err) {
    console.error('Edit update error:', err);
    return errorResponse(res, 500, 'Failed to edit update');
  }
});

/**
 * DELETE /api/admin/updates/:id
 * Delete an update
 */
router.delete('/:id', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid update ID');
    }

    const result = await query(
      'DELETE FROM updates WHERE id = $1 RETURNING id, company_id, title',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Update not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: result.rows[0].company_id,
      action: ACTIONS.UPDATE_DELETE,
      resourceType: 'update',
      resourceId: req.params.id,
      details: { title: result.rows[0].title },
      req
    });

    return successResponse(res, null, 'Update deleted successfully');
  } catch (err) {
    console.error('Delete update error:', err);
    return errorResponse(res, 500, 'Failed to delete update');
  }
});

module.exports = router;
