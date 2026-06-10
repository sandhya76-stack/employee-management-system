const pool = require('../config/db');

// SEARCH EMPLOYEES
const searchEmployees = async (req, res) => {
  const { name, department, designation } = req.query;
  try {
    let query = `
      SELECT e.*, u.name, u.email, u.role, d.name AS department_name
      FROM employees e
      JOIN users u ON e.user_id = u.id
      JOIN departments d ON e.department_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let count = 1;

    if (name) {
      query += ` AND u.name ILIKE $${count}`;
      params.push(`%${name}%`);
      count++;
    }
    if (department) {
      query += ` AND d.name ILIKE $${count}`;
      params.push(`%${department}%`);
      count++;
    }
    if (designation) {
      query += ` AND e.designation ILIKE $${count}`;
      params.push(`%${designation}%`);
      count++;
    }

    const employees = await pool.query(query, params);
    res.json(employees.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SEARCH TASKS
const searchTasks = async (req, res) => {
  const { title, status, priority, from_date, to_date } = req.query;
  try {
    let query = `
      SELECT t.*,
        u1.name AS assigned_to_name,
        u2.name AS assigned_by_name
      FROM tasks t
      JOIN users u1 ON t.assigned_to = u1.id
      JOIN users u2 ON t.assigned_by = u2.id
      WHERE 1=1
    `;
    const params = [];
    let count = 1;

    if (title) {
      query += ` AND t.title ILIKE $${count}`;
      params.push(`%${title}%`);
      count++;
    }
    if (status) {
      query += ` AND t.status = $${count}`;
      params.push(status);
      count++;
    }
    if (priority) {
      query += ` AND t.priority = $${count}`;
      params.push(priority);
      count++;
    }
    if (from_date) {
      query += ` AND t.due_date >= $${count}`;
      params.push(from_date);
      count++;
    }
    if (to_date) {
      query += ` AND t.due_date <= $${count}`;
      params.push(to_date);
      count++;
    }

    const tasks = await pool.query(query, params);
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SEARCH DAILY REPORTS
const searchReports = async (req, res) => {
  const { name, from_date, to_date } = req.query;
  try {
    let query = `
      SELECT dr.*, u.name, u.email
      FROM daily_reports dr
      JOIN users u ON dr.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let count = 1;

    if (name) {
      query += ` AND u.name ILIKE $${count}`;
      params.push(`%${name}%`);
      count++;
    }
    if (from_date) {
      query += ` AND dr.date >= $${count}`;
      params.push(from_date);
      count++;
    }
    if (to_date) {
      query += ` AND dr.date <= $${count}`;
      params.push(to_date);
      count++;
    }

    const reports = await pool.query(query, params);
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SEARCH DEPARTMENTS
const searchDepartments = async (req, res) => {
  const { name } = req.query;
  try {
    let query = `SELECT * FROM departments WHERE 1=1`;
    const params = [];

    if (name) {
      query += ` AND name ILIKE $1`;
      params.push(`%${name}%`);
    }

    const departments = await pool.query(query, params);
    res.json(departments.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { searchEmployees, searchTasks, searchReports, searchDepartments };
