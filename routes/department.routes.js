const express = require('express');
const router = express.Router();
const { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/department.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/', verifyToken, isAdmin, createDepartment);
router.get('/', verifyToken, getDepartments);
router.get('/:id', verifyToken, getDepartmentById);
router.put('/:id', verifyToken, isAdmin, updateDepartment);
router.delete('/:id', verifyToken, isAdmin, deleteDepartment);

module.exports = router;