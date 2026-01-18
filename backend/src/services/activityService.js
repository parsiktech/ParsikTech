const { query } = require('../db/config');
const { getClientIp } = require('../utils/helpers');

/**
 * Log an activity
 */
async function logActivity({
  userId,
  userType,
  companyId = null,
  action,
  resourceType = null,
  resourceId = null,
  details = null,
  req = null
}) {
  try {
    await query(
      `INSERT INTO activity_logs
       (user_id, user_type, company_id, action, resource_type, resource_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        userType,
        companyId,
        action,
        resourceType,
        resourceId,
        details ? JSON.stringify(details) : null,
        req ? getClientIp(req) : null,
        req ? req.headers['user-agent'] : null
      ]
    );
  } catch (err) {
    // Don't fail the main operation if logging fails
    console.error('Failed to log activity:', err);
  }
}

/**
 * Get activity logs with filtering
 */
async function getActivityLogs({
  companyId = null,
  userId = null,
  userType = null,
  action = null,
  resourceType = null,
  limit = 50,
  offset = 0
}) {
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (companyId) {
    whereConditions.push(`company_id = $${paramIndex++}`);
    params.push(companyId);
  }
  if (userId) {
    whereConditions.push(`user_id = $${paramIndex++}`);
    params.push(userId);
  }
  if (userType) {
    whereConditions.push(`user_type = $${paramIndex++}`);
    params.push(userType);
  }
  if (action) {
    whereConditions.push(`action = $${paramIndex++}`);
    params.push(action);
  }
  if (resourceType) {
    whereConditions.push(`resource_type = $${paramIndex++}`);
    params.push(resourceType);
  }

  const whereClause = whereConditions.length > 0
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';

  params.push(limit, offset);

  const result = await query(
    `SELECT * FROM activity_logs
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    params
  );

  return result.rows;
}

/**
 * Get recent activity for a company
 */
async function getCompanyActivity(companyId, limit = 20) {
  const result = await query(
    `SELECT * FROM activity_logs
     WHERE company_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [companyId, limit]
  );
  return result.rows;
}

/**
 * Get system-wide activity feed (for admin dashboard)
 */
async function getGlobalActivityFeed(limit = 50) {
  const result = await query(
    `SELECT al.*, cc.name as company_name
     FROM activity_logs al
     LEFT JOIN client_companies cc ON al.company_id = cc.id
     ORDER BY al.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

// Common action types
const ACTIONS = {
  // Auth
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_RESET_REQUEST: 'password_reset_request',
  PASSWORD_RESET: 'password_reset',

  // Company
  COMPANY_CREATE: 'company_create',
  COMPANY_UPDATE: 'company_update',
  COMPANY_STATUS_CHANGE: 'company_status_change',
  COMPANY_DELETE: 'company_delete',

  // Client Account
  CLIENT_ACCOUNT_CREATE: 'client_account_create',
  CLIENT_ACCOUNT_UPDATE: 'client_account_update',
  CLIENT_ACCOUNT_DISABLE: 'client_account_disable',
  CLIENT_INVITE_SEND: 'client_invite_send',
  CLIENT_INVITE_ACCEPT: 'client_invite_accept',

  // Documents
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_UPDATE: 'document_update',
  DOCUMENT_DELETE: 'document_delete',
  DOCUMENT_DOWNLOAD: 'document_download',

  // Updates
  UPDATE_CREATE: 'update_create',
  UPDATE_EDIT: 'update_edit',
  UPDATE_DELETE: 'update_delete',

  // Admin
  ADMIN_CREATE: 'admin_create',
  ADMIN_UPDATE: 'admin_update'
};

module.exports = {
  logActivity,
  getActivityLogs,
  getCompanyActivity,
  getGlobalActivityFeed,
  ACTIONS
};
