const express = require('express');
const router = express.Router();
const { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employee.controller');
const { verifyToken, isAdmin, isManager } = require('../middleware/auth.middleware');

router.post('/', verifyToken, isAdmin, createEmployee);
router.get('/', verifyToken, getEmployees);
router.get('/:id', verifyToken, getEmployeeById);
router.put('/:id', verifyToken, isAdmin, updateEmployee);
router.delete('/:id', verifyToken, isAdmin, deleteEmployee);

module.exports = router;