const express = require('express');
const router = express.Router();

const companiesRoutes = require('./companies');
const clientsRoutes = require('./clients');
const updatesRoutes = require('./updates');
const documentsRoutes = require('./documents');
const activityRoutes = require('./activity');

router.use('/companies', companiesRoutes);
router.use('/clients', clientsRoutes);
router.use('/updates', updatesRoutes);
router.use('/documents', documentsRoutes);
router.use('/activity', activityRoutes);

module.exports = router;
