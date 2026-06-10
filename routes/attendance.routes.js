const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance, getAllAttendance, getAttendanceByDate, getTodayAttendance } = require('../controllers/attendance.controller');
const { verifyToken, isManager } = require('../middleware/auth.middleware');

router.post('/checkin', verifyToken, checkIn);
router.put('/checkout', verifyToken, checkOut);
router.get('/my-attendance', verifyToken, getMyAttendance);
router.get('/today', verifyToken, isManager, getTodayAttendance);
router.get('/date/:date', verifyToken, isManager, getAttendanceByDate);
router.get('/', verifyToken, isManager, getAllAttendance);

module.exports = router;