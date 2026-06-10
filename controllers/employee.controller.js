const pool = require('../config/db');

// CREATE EMPLOYEE
const createEmployee = async (req, res) => {
  const { user_id, department_id, designation, skills } = req.body;
  try {
    const newEmployee = await pool.query(
      'INSERT INTO employees (user_id, department_id, designation, skills) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, department_id, designation, skills]
    );
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {
  try {
    const employees = await pool.query(`
      SELECT e.*, u.name, u.email, u.role, d.name AS department_name
      FROM employees e
      JOIN users u ON e.user_id = u.id
      JOIN departments d ON e.department_id = d.id
    `);
    res.json(employees.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET SINGLE EMPLOYEE
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await pool.query(`
      SELECT e.*, u.name, u.email, u.role, d.name AS department_name
      FROM employees e
      JOIN users u ON e.user_id = u.id
      JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1
    `, [id]);
    if (employee.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE EMPLOYEE
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { department_id, designation, skills } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE employees SET department_id = $1, designation = $2, skills = $3 WHERE id = $4 RETURNING *',
      [department_id, designation, skills, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully', employee: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee };