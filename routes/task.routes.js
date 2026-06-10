const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, getMyTasks, deleteTask } = require('../controllers/task.controller');
const { verifyToken, isManager } = require('../middleware/auth.middleware');

router.post('/', verifyToken, isManager, createTask);
router.get('/', verifyToken, getTasks);
router.get('/my-tasks', verifyToken, getMyTasks);
router.get('/:id', verifyToken, getTaskById);
router.put('/:id', verifyToken, isManager, updateTask);
router.patch('/:id/status', verifyToken, updateTaskStatus);
router.delete('/:id', verifyToken, isManager, deleteTask);

module.exports = router;