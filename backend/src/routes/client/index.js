const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { param, validationResult } = require('express-validator');
const { query } = require('../../db/config');
const { authenticate, requireClient } = require('../../middleware/auth');
const { logActivity, ACTIONS } = require('../../services/activityService');
const { errorResponse, successResponse } = require('../../utils/helpers');

// All routes require client authentication
router.use(authenticate, requireClient);

/**
 * GET /api/client/dashboard
 * Get dashboard overview data
 */
router.get('/dashboard', async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Get company info
    const companyResult = await query(
      'SELECT id, name, status, owner_name, owner_email, created_at FROM client_companies WHERE id = $1',
      [companyId]
    );

    if (companyResult.rows.length === 0) {
      return errorResponse(res, 404, 'Company not found');
    }

    // Get latest updates (last 5)
    const updatesResult = await query(
      `SELECT id, title, content, update_type, published_at
       FROM updates
       WHERE (company_id = $1 OR is_global = true) AND is_published = true
       ORDER BY published_at DESC
       LIMIT 5`,
      [companyId]
    );

    // Get recent documents (last 5)
    const documentsResult = await query(
      `SELECT id, title, category, uploaded_at
       FROM documents
       WHERE company_id = $1
       ORDER BY uploaded_at DESC
       LIMIT 5`,
      [companyId]
    );

    // Get unread notifications count
    const notificationsResult = await query(
      'SELECT COUNT(*) as unread_count FROM notifications WHERE company_id = $1 AND is_read = false',
      [companyId]
    );

    return successResponse(res, {
      company: companyResult.rows[0],
      recentUpdates: updatesResult.rows,
      recentDocuments: documentsResult.rows,
      unreadNotifications: parseInt(notificationsResult.rows[0].unread_count)
    });
  } catch (err) {
    console.error('Get dashboard error:', err);
    return errorResponse(res, 500, 'Failed to get dashboard data');
  }
});

/**
 * GET /api/client/updates
 * Get all updates for the client's company
 */
router.get('/updates', async (req, res) => {
  try {
    const { limit = 20, offset = 0, type } = req.query;
    const companyId = req.user.companyId;

    let whereConditions = [`(company_id = $1 OR is_global = true)`, `is_published = true`];
    let params = [companyId];
    let paramIndex = 2;

    if (type) {
      whereConditions.push(`update_type = $${paramIndex++}`);
      params.push(type);
    }

    params.push(parseInt(limit), parseInt(offset));

    const result = await query(
      `SELECT id, title, content, update_type, published_at, is_global
       FROM updates
       WHERE ${whereConditions.join(' AND ')}
       ORDER BY published_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return successResponse(res, result.rows);
  } catch (err) {
    console.error('Get updates error:', err);
    return errorResponse(res, 500, 'Failed to get updates');
  }
});

/**
 * GET /api/client/updates/:id
 * Get a specific update
 */
router.get('/updates/:id', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid update ID');
    }

    const companyId = req.user.companyId;

    const result = await query(
      `SELECT id, title, content, update_type, published_at, is_global
       FROM updates
       WHERE id = $1 AND (company_id = $2 OR is_global = true) AND is_published = true`,
      [req.params.id, companyId]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Update not found');
    }

    return successResponse(res, result.rows[0]);
  } catch (err) {
    console.error('Get update error:', err);
    return errorResponse(res, 500, 'Failed to get update');
  }
});

/**
 * GET /api/client/documents
 * Get all documents for the client's company
 */
router.get('/documents', async (req, res) => {
  try {
    const { limit = 50, offset = 0, category } = req.query;
    const companyId = req.user.companyId;

    let whereConditions = [`company_id = $1`];
    let params = [companyId];
    let paramIndex = 2;

    if (category) {
      whereConditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    params.push(parseInt(limit), parseInt(offset));

    const result = await query(
      `SELECT id, title, description, category, file_name, file_size, mime_type, version, uploaded_at
       FROM documents
       WHERE ${whereConditions.join(' AND ')}
       ORDER BY uploaded_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return successResponse(res, result.rows);
  } catch (err) {
    console.error('Get documents error:', err);
    return errorResponse(res, 500, 'Failed to get documents');
  }
});

/**
 * GET /api/client/documents/:id/download
 * Download a document
 */
router.get('/documents/:id/download', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid document ID');
    }

    const companyId = req.user.companyId;

    // Get document info
    const result = await query(
      'SELECT * FROM documents WHERE id = $1 AND company_id = $2',
      [req.params.id, companyId]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Document not found');
    }

    const doc = result.rows[0];
    const filePath = path.join(__dirname, '../../../uploads/documents', doc.file_path);

    if (!fs.existsSync(filePath)) {
      return errorResponse(res, 404, 'File not found on server');
    }

    // Log the download
    await query(
      'INSERT INTO document_downloads (document_id, downloaded_by) VALUES ($1, $2)',
      [req.params.id, req.user.id]
    );

    await logActivity({
      userId: req.user.id,
      userType: 'client',
      companyId,
      action: ACTIONS.DOCUMENT_DOWNLOAD,
      resourceType: 'document',
      resourceId: req.params.id,
      details: { title: doc.title, fileName: doc.file_name },
      req
    });

    // Send file
    res.setHeader('Content-Disposition', `attachment; filename="${doc.file_name}"`);
    res.setHeader('Content-Type', doc.mime_type);
    return res.sendFile(filePath);
  } catch (err) {
    console.error('Download document error:', err);
    return errorResponse(res, 500, 'Failed to download document');
  }
});

/**
 * GET /api/client/notifications
 * Get all notifications for the client's company
 */
router.get('/notifications', async (req, res) => {
  try {
    const { limit = 50, offset = 0, unreadOnly } = req.query;
    const companyId = req.user.companyId;

    let whereConditions = [`company_id = $1`];
    let params = [companyId];
    let paramIndex = 2;

    if (unreadOnly === 'true') {
      whereConditions.push(`is_read = false`);
    }

    params.push(parseInt(limit), parseInt(offset));

    const result = await query(
      `SELECT id, title, message, notification_type, related_resource_type, related_resource_id, is_read, created_at
       FROM notifications
       WHERE ${whereConditions.join(' AND ')}
       ORDER BY created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return successResponse(res, result.rows);
  } catch (err) {
    console.error('Get notifications error:', err);
    return errorResponse(res, 500, 'Failed to get notifications');
  }
});

/**
 * PUT /api/client/notifications/:id/read
 * Mark a notification as read
 */
router.put('/notifications/:id/read', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid notification ID');
    }

    const companyId = req.user.companyId;

    const result = await query(
      `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND company_id = $2
       RETURNING *`,
      [req.params.id, companyId]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Notification not found');
    }

    return successResponse(res, result.rows[0]);
  } catch (err) {
    console.error('Mark notification read error:', err);
    return errorResponse(res, 500, 'Failed to mark notification as read');
  }
});

/**
 * PUT /api/client/notifications/read-all
 * Mark all notifications as read
 */
router.put('/notifications/read-all', async (req, res) => {
  try {
    const companyId = req.user.companyId;

    await query(
      `UPDATE notifications SET is_read = true, read_at = CURRENT_TIMESTAMP
       WHERE company_id = $1 AND is_read = false`,
      [companyId]
    );

    return successResponse(res, null, 'All notifications marked as read');
  } catch (err) {
    console.error('Mark all notifications read error:', err);
    return errorResponse(res, 500, 'Failed to mark notifications as read');
  }
});

/**
 * GET /api/client/account
 * Get account information
 */
router.get('/account', async (req, res) => {
  try {
    const result = await query(
      `SELECT ca.id, ca.email, ca.last_login_at, ca.created_at,
              cc.id as company_id, cc.name as company_name, cc.status as company_status,
              cc.owner_name, cc.owner_email, cc.admin_notes
       FROM client_accounts ca
       JOIN client_companies cc ON ca.company_id = cc.id
       WHERE ca.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Account not found');
    }

    // Don't expose admin_notes to client
    const account = result.rows[0];
    delete account.admin_notes;

    return successResponse(res, account);
  } catch (err) {
    console.error('Get account error:', err);
    return errorResponse(res, 500, 'Failed to get account info');
  }
});

module.exports = router;
