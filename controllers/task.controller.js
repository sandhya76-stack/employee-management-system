const pool = require('../config/db');
const { createNotification } = require('./notification.controller');

// CREATE TASK
const createTask = async (req, res) => {
  const { title, description, assigned_to, priority, due_date } = req.body;
  const assigned_by = req.user.id;
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, status, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, assigned_to, assigned_by, priority, 'todo', due_date]
    );

    // Send notification to assigned employee
    await createNotification(
      assigned_to,
      'New Task Assigned',
      `You have been assigned a new task: ${title}`
    );

    res.status(201).json({ message: 'Task created successfully', task: newTask.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await pool.query(`
      SELECT t.*,
        u1.name AS assigned_to_name,
        u2.name AS assigned_by_name
      FROM tasks t
      JOIN users u1 ON t.assigned_to = u1.id
      JOIN users u2 ON t.assigned_by = u2.id
    `);
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET SINGLE TASK
const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await pool.query(`
      SELECT t.*,
        u1.name AS assigned_to_name,
        u2.name AS assigned_by_name
      FROM tasks t
      JOIN users u1 ON t.assigned_to = u1.id
      JOIN users u2 ON t.assigned_by = u2.id
      WHERE t.id = $1
    `, [id]);
    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, priority = $3, due_date = $4 WHERE id = $5 RETURNING *',
      [title, description, priority, due_date, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully', task: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Send notification when task is completed
    if (status === 'completed') {
      const task = updated.rows[0];
      await createNotification(
        task.assigned_by,
        'Task Completed',
        `Task "${task.title}" has been marked as completed`
      );
    }

    res.json({ message: 'Task status updated successfully', task: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET MY TASKS
const getMyTasks = async (req, res) => {
  const user_id = req.user.id;
  try {
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE assigned_to = $1',
      [user_id]
    );
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, getMyTasks, deleteTask };