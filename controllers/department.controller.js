const pool = require('../config/db');

// CREATE DEPARTMENT
const createDepartment = async (req, res) => {
  const { name, head_id } = req.body;
  try {
    const newDept = await pool.query(
      'INSERT INTO departments (name, head_id) VALUES ($1, $2) RETURNING *',
      [name, head_id]
    );
    res.status(201).json({ message: 'Department created successfully', department: newDept.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// GET ALL DEPARTMENTS
const getDepartments = async (req, res) => {
  try {
    const departments = await pool.query('SELECT * FROM departments');
    res.json(departments.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// GET SINGLE DEPARTMENT
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    if (department.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// UPDATE DEPARTMENT
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, head_id } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE departments SET name = $1, head_id = $2 WHERE id = $3 RETURNING *',
      [name, head_id, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department updated successfully', department: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// DELETE DEPARTMENT
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
module.exports = { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment };
