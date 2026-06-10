const pool = require('../config/db');

// CHECK IN
const checkIn = async (req, res) => {
  const user_id = req.user.id;
  try {
    // Check if already checked in today
    const existing = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND date = CURRENT_DATE',
      [user_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = await pool.query(
      'INSERT INTO attendance (user_id, check_in, date) VALUES ($1, NOW(), CURRENT_DATE) RETURNING *',
      [user_id]
    );
    res.status(201).json({ message: 'Checked in successfully', attendance: attendance.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CHECK OUT
const checkOut = async (req, res) => {
  const user_id = req.user.id;
  try {
    // Find today's attendance
    const existing = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND date = CURRENT_DATE',
      [user_id]
    );
    if (existing.rows.length === 0) {
      return res.status(400).json({ message: 'You have not checked in today' });
    }
    if (existing.rows[0].check_out) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const attendance = await pool.query(
      'UPDATE attendance SET check_out = NOW() WHERE user_id = $1 AND date = CURRENT_DATE RETURNING *',
      [user_id]
    );
    res.json({ message: 'Checked out successfully', attendance: attendance.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET MY ATTENDANCE
const getMyAttendance = async (req, res) => {
  const user_id = req.user.id;
  try {
    const attendance = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC',
      [user_id]
    );
    res.json(attendance.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL ATTENDANCE
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await pool.query(`
      SELECT a.*, u.name, u.email
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.date DESC
    `);
    res.json(attendance.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ATTENDANCE BY DATE
const getAttendanceByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const attendance = await pool.query(`
      SELECT a.*, u.name, u.email
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.date = $1
    `, [date]);
    res.json(attendance.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET TODAY'S ATTENDANCE
const getTodayAttendance = async (req, res) => {
  try {
    const attendance = await pool.query(`
      SELECT a.*, u.name, u.email
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.date = CURRENT_DATE
    `);
    res.json(attendance.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance, getAttendanceByDate, getTodayAttendance };