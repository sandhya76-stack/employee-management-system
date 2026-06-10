const pool = require('../config/db');

// SUBMIT DAILY REPORT
const submitReport = async (req, res) => {
  const { summary, hours_worked, blockers, next_day_plan } = req.body;
  const user_id = req.user.id;
  try {
    const newReport = await pool.query(
      'INSERT INTO daily_reports (user_id, summary, hours_worked, blockers, next_day_plan) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, summary, hours_worked, blockers, next_day_plan]
    );
    res.status(201).json({ message: 'Report submitted successfully', report: newReport.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL REPORTS
const getAllReports = async (req, res) => {
  try {
    const reports = await pool.query(`
      SELECT dr.*, u.name, u.email
      FROM daily_reports dr
      JOIN users u ON dr.user_id = u.id
      ORDER BY dr.date DESC
    `);
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET MY REPORTS
const getMyReports = async (req, res) => {
  const user_id = req.user.id;
  try {
    const reports = await pool.query(
      'SELECT * FROM daily_reports WHERE user_id = $1 ORDER BY date DESC',
      [user_id]
    );
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET REPORTS BY DATE
const getReportsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const reports = await pool.query(`
      SELECT dr.*, u.name, u.email
      FROM daily_reports dr
      JOIN users u ON dr.user_id = u.id
      WHERE dr.date = $1
    `, [date]);
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE REPORT
const updateReport = async (req, res) => {
  const { id } = req.params;
  const { summary, hours_worked, blockers, next_day_plan } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE daily_reports SET summary = $1, hours_worked = $2, blockers = $3, next_day_plan = $4 WHERE id = $5 RETURNING *',
      [summary, hours_worked, blockers, next_day_plan, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report updated successfully', report: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE REPORT
const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pool.query('DELETE FROM daily_reports WHERE id = $1 RETURNING *', [id]);
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitReport, getAllReports, getMyReports, getReportsByDate, updateReport, deleteReport };