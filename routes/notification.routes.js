const express = require('express');
const router = express.Router();
const { getMyNotifications, getUnreadNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, getMyNotifications);
router.get('/unread', verifyToken, getUnreadNotifications);
router.put('/:id/read', verifyToken, markAsRead);
router.put('/read-all', verifyToken, markAllAsRead);
router.delete('/:id', verifyToken, deleteNotification);

module.exports = router;