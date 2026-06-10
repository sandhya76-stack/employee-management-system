const express = require('express');
const router = express.Router();
const { getAdminDashboard, getManagerDashboard, getEmployeeDashboard, getProductivity } = require('../controllers/dashboard.controller');
const { verifyToken, isAdmin, isManager } = require('../middleware/auth.middleware');

router.get('/admin', verifyToken, isAdmin, getAdminDashboard);
router.get('/manager', verifyToken, isManager, getManagerDashboard);
router.get('/employee', verifyToken, getEmployeeDashboard);
router.get('/productivity', verifyToken, isManager, getProductivity);

module.exports = router;