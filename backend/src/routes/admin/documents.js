const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../../db/config');
const { authenticate, requireAdmin } = require('../../middleware/auth');
const { logActivity, ACTIONS } = require('../../services/activityService');
const { errorResponse, successResponse } = require('../../utils/helpers');

// All routes require admin authentication
router.use(authenticate, requireAdmin);

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../../uploads/documents');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'text/csv',
      'application/zip'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

/**
 * GET /api/admin/documents
 * List all documents with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { companyId, category, limit = 50, offset = 0 } = req.query;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (companyId) {
      whereConditions.push(`d.company_id = $${paramIndex++}`);
      params.push(companyId);
    }

    if (category) {
      whereConditions.push(`d.category = $${paramIndex++}`);
      params.push(category);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    params.push(parseInt(limit), parseInt(offset));

    const result = await query(
      `SELECT d.*, cc.name as company_name, au.name as uploaded_by_name,
              (SELECT COUNT(*) FROM document_downloads WHERE document_id = d.id) as download_count
       FROM documents d
       LEFT JOIN client_companies cc ON d.company_id = cc.id
       LEFT JOIN admin_users au ON d.uploaded_by = au.id
       ${whereClause}
       ORDER BY d.uploaded_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return successResponse(res, result.rows);
  } catch (err) {
    console.error('List documents error:', err);
    return errorResponse(res, 500, 'Failed to list documents');
  }
});

/**
 * POST /api/admin/documents
 * Upload a new document
 */
router.post('/', upload.single('file'), [
  body('companyId').isUUID(),
  body('title').trim().notEmpty().isLength({ max: 255 }),
  body('description').optional().trim(),
  body('category').optional().isIn(['report', 'contract', 'deliverable', 'invoice', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    if (!req.file) {
      return errorResponse(res, 400, 'No file uploaded');
    }

    const { companyId, title, description = '', category = 'other', adminNotes = '' } = req.body;

    // Verify company exists
    const companyResult = await query('SELECT id FROM client_companies WHERE id = $1', [companyId]);
    if (companyResult.rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return errorResponse(res, 404, 'Company not found');
    }

    // Check for existing document with same title for this company (for versioning)
    const existingDoc = await query(
      'SELECT MAX(version) as max_version FROM documents WHERE company_id = $1 AND title = $2',
      [companyId, title]
    );

    const version = existingDoc.rows[0].max_version ? existingDoc.rows[0].max_version + 1 : 1;

    const result = await query(
      `INSERT INTO documents (company_id, title, description, file_path, file_name, file_size, mime_type, category, version, uploaded_by, admin_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        companyId,
        title,
        description,
        req.file.filename,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        category,
        version,
        req.user.id,
        adminNotes
      ]
    );

    // Create notification for the company
    await query(
      `INSERT INTO notifications (company_id, title, message, notification_type, related_resource_type, related_resource_id)
       VALUES ($1, $2, $3, 'document', 'document', $4)`,
      [companyId, `New document: ${title}`, description.substring(0, 500) || 'A new document has been uploaded', result.rows[0].id]
    );

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId,
      action: ACTIONS.DOCUMENT_UPLOAD,
      resourceType: 'document',
      resourceId: result.rows[0].id,
      details: { title, category, version, fileName: req.file.originalname },
      req
    });

    return successResponse(res, result.rows[0], 'Document uploaded successfully', 201);
  } catch (err) {
    console.error('Upload document error:', err);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    return errorResponse(res, 500, 'Failed to upload document');
  }
});

/**
 * PUT /api/admin/documents/:id
 * Update document metadata
 */
router.put('/:id', [
  param('id').isUUID(),
  body('title').optional().trim().notEmpty().isLength({ max: 255 }),
  body('description').optional().trim(),
  body('category').optional().isIn(['report', 'contract', 'deliverable', 'invoice', 'other']),
  body('adminNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { id } = req.params;
    const { title, description, category, adminNotes } = req.body;

    let setClauses = [];
    let params = [];
    let paramIndex = 1;

    if (title !== undefined) {
      setClauses.push(`title = $${paramIndex++}`);
      params.push(title);
    }
    if (description !== undefined) {
      setClauses.push(`description = $${paramIndex++}`);
      params.push(description);
    }
    if (category !== undefined) {
      setClauses.push(`category = $${paramIndex++}`);
      params.push(category);
    }
    if (adminNotes !== undefined) {
      setClauses.push(`admin_notes = $${paramIndex++}`);
      params.push(adminNotes);
    }

    if (setClauses.length === 0) {
      return errorResponse(res, 400, 'No fields to update');
    }

    params.push(id);

    const result = await query(
      `UPDATE documents SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Document not found');
    }

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: result.rows[0].company_id,
      action: ACTIONS.DOCUMENT_UPDATE,
      resourceType: 'document',
      resourceId: id,
      details: { updatedFields: Object.keys(req.body) },
      req
    });

    return successResponse(res, result.rows[0], 'Document updated successfully');
  } catch (err) {
    console.error('Update document error:', err);
    return errorResponse(res, 500, 'Failed to update document');
  }
});

/**
 * DELETE /api/admin/documents/:id
 * Delete a document
 */
router.delete('/:id', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid document ID');
    }

    // Get document info first
    const docResult = await query(
      'SELECT * FROM documents WHERE id = $1',
      [req.params.id]
    );

    if (docResult.rows.length === 0) {
      return errorResponse(res, 404, 'Document not found');
    }

    const doc = docResult.rows[0];

    // Delete the file from storage
    const filePath = path.join(uploadsDir, doc.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await query('DELETE FROM documents WHERE id = $1', [req.params.id]);

    await logActivity({
      userId: req.user.id,
      userType: 'admin',
      companyId: doc.company_id,
      action: ACTIONS.DOCUMENT_DELETE,
      resourceType: 'document',
      resourceId: req.params.id,
      details: { title: doc.title, fileName: doc.file_name },
      req
    });

    return successResponse(res, null, 'Document deleted successfully');
  } catch (err) {
    console.error('Delete document error:', err);
    return errorResponse(res, 500, 'Failed to delete document');
  }
});

/**
 * GET /api/admin/documents/:id/downloads
 * Get download history for a document
 */
router.get('/:id/downloads', [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Invalid document ID');
    }

    const result = await query(
      `SELECT dd.*, ca.email as downloaded_by_email
       FROM document_downloads dd
       LEFT JOIN client_accounts ca ON dd.downloaded_by = ca.id
       WHERE dd.document_id = $1
       ORDER BY dd.downloaded_at DESC`,
      [req.params.id]
    );

    return successResponse(res, result.rows);
  } catch (err) {
    console.error('Get download history error:', err);
    return errorResponse(res, 500, 'Failed to get download history');
  }
});

module.exports = router;
