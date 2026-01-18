const express = require('express');
const router = express.Router();
const { query } = require('../../db/config');
const { authenticate, requireAdmin } = require('../../middleware/auth');
const { errorResponse, successResponse } = require('../../utils/helpers');

// All routes require admin authentication
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/activity
 * Get activity feed with filtering
 */
router.get('/', async (req, res) => {
  try {
    const {
      companyId,
      eventType,
      dateFrom,
      dateTo,
      limit = 50,
      offset = 0
    } = req.query;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (companyId) {
      whereConditions.push(`al.company_id = $${paramIndex++}`);
      params.push(companyId);
    }

    if (eventType) {
      // Map event types to action patterns
      const eventTypeMap = {
        'login': ['login', 'logout'],
        'documents': ['document_upload', 'document_download', 'document_delete', 'document_update'],
        'updates': ['update_create', 'update_edit', 'update_delete'],
        'access': ['client_account_disable', 'client_invite_send', 'client_invite_accept'],
        'company': ['company_create', 'company_update', 'company_status_change']
      };

      const actions = eventTypeMap[eventType];
      if (actions) {
        whereConditions.push(`al.action = ANY($${paramIndex++}::text[])`);
        params.push(actions);
      }
    }

    if (dateFrom) {
      whereConditions.push(`al.created_at >= $${paramIndex++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      whereConditions.push(`al.created_at <= $${paramIndex++}`);
      params.push(dateTo);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    params.push(parseInt(limit), parseInt(offset));

    const result = await query(
      `SELECT
        al.*,
        cc.name as company_name,
        CASE
          WHEN al.user_type = 'admin' THEN au.name
          WHEN al.user_type = 'client' THEN cc2.owner_name
          ELSE NULL
        END as user_name,
        CASE
          WHEN al.user_type = 'admin' THEN au.email
          WHEN al.user_type = 'client' THEN ca.email
          ELSE NULL
        END as user_email
       FROM activity_logs al
       LEFT JOIN client_companies cc ON al.company_id = cc.id
       LEFT JOIN admin_users au ON al.user_type = 'admin' AND al.user_id = au.id
       LEFT JOIN client_accounts ca ON al.user_type = 'client' AND al.user_id = ca.id
       LEFT JOIN client_companies cc2 ON ca.company_id = cc2.id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    // Get total count for pagination
    const countResult = await query(
      `SELECT COUNT(*) as total FROM activity_logs al ${whereClause}`,
      params.slice(0, -2) // Remove limit and offset
    );

    return successResponse(res, {
      activities: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (err) {
    console.error('Get activity feed error:', err);
    return errorResponse(res, 500, 'Failed to get activity feed');
  }
});

/**
 * GET /api/admin/activity/stats
 * Get activity statistics for the dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Get login counts
    const loginStats = await query(
      `SELECT COUNT(*) as total,
              COUNT(CASE WHEN action = 'login' THEN 1 END) as logins,
              COUNT(CASE WHEN action LIKE 'document%' THEN 1 END) as document_actions,
              COUNT(CASE WHEN action LIKE 'update%' THEN 1 END) as update_actions
       FROM activity_logs
       WHERE created_at >= $1`,
      [daysAgo]
    );

    // Get failed logins (would need to track this separately, for now return 0)
    const suspiciousActivity = await query(
      `SELECT COUNT(*) as failed_logins
       FROM activity_logs
       WHERE action = 'login'
         AND details::text LIKE '%failed%'
         AND created_at >= $1`,
      [daysAgo]
    );

    return successResponse(res, {
      totalEvents: parseInt(loginStats.rows[0].total),
      logins: parseInt(loginStats.rows[0].logins),
      documentActions: parseInt(loginStats.rows[0].document_actions),
      updateActions: parseInt(loginStats.rows[0].update_actions),
      suspiciousActivity: parseInt(suspiciousActivity.rows[0].failed_logins) || 0,
      period: `${days} days`
    });
  } catch (err) {
    console.error('Get activity stats error:', err);
    return errorResponse(res, 500, 'Failed to get activity stats');
  }
});

/**
 * GET /api/admin/activity/security
 * Get security-related activity (login history, suspicious activity)
 */
router.get('/security', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // Get login history with IP addresses
    const loginHistory = await query(
      `SELECT
        al.*,
        cc.name as company_name,
        CASE
          WHEN al.user_type = 'admin' THEN au.name
          WHEN al.user_type = 'client' THEN cc2.owner_name
          ELSE NULL
        END as user_name,
        CASE
          WHEN al.user_type = 'admin' THEN au.email
          WHEN al.user_type = 'client' THEN ca.email
          ELSE NULL
        END as user_email
       FROM activity_logs al
       LEFT JOIN client_companies cc ON al.company_id = cc.id
       LEFT JOIN admin_users au ON al.user_type = 'admin' AND al.user_id = au.id
       LEFT JOIN client_accounts ca ON al.user_type = 'client' AND al.user_id = ca.id
       LEFT JOIN client_companies cc2 ON ca.company_id = cc2.id
       WHERE al.action IN ('login', 'logout', 'password_reset', 'password_reset_request')
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    // Get unique IP addresses per user (for suspicious activity detection)
    const ipPerUser = await query(
      `SELECT
        user_id,
        user_type,
        COUNT(DISTINCT ip_address) as unique_ips,
        array_agg(DISTINCT ip_address) as ip_addresses
       FROM activity_logs
       WHERE action = 'login'
         AND created_at >= NOW() - INTERVAL '30 days'
         AND ip_address IS NOT NULL
       GROUP BY user_id, user_type
       HAVING COUNT(DISTINCT ip_address) > 1
       ORDER BY unique_ips DESC
       LIMIT 10`
    );

    return successResponse(res, {
      loginHistory: loginHistory.rows,
      multipleIpUsers: ipPerUser.rows
    });
  } catch (err) {
    console.error('Get security activity error:', err);
    return errorResponse(res, 500, 'Failed to get security activity');
  }
});

module.exports = router;
