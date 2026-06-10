const express = require('express');
const router = express.Router();
const { submitReport, getAllReports, getMyReports, getReportsByDate, updateReport, deleteReport } = require('../controllers/report.controller');
const { verifyToken, isAdmin, isManager } = require('../middleware/auth.middleware');

router.post('/', verifyToken, submitReport);
router.get('/', verifyToken, isManager, getAllReports);
router.get('/my-reports', verifyToken, getMyReports);
router.get('/date/:date', verifyToken, isManager, getReportsByDate);
router.put('/:id', verifyToken, updateReport);
router.delete('/:id', verifyToken, isAdmin, deleteReport);

module.exports = router;