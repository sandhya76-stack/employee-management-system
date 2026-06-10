const express = require('express');
const router = express.Router();
const { searchEmployees, searchTasks, searchReports, searchDepartments } = require('../controllers/search.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/employees', verifyToken, searchEmployees);
router.get('/tasks', verifyToken, searchTasks);
router.get('/reports', verifyToken, searchReports);
router.get('/departments', verifyToken, searchDepartments);

module.exports = router;