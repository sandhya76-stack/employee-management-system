const pool = require('../config/db');

// ADMIN DASHBOARD
const getAdminDashboard = async (req, res) => {
  try {
    // Total employees
    const totalEmployees = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['employee']);
    
    // Total departments
    const totalDepartments = await pool.query('SELECT COUNT(*) FROM departments');
    
    // Total tasks
    const totalTasks = await pool.query('SELECT COUNT(*) FROM tasks');
    
    // Tasks by status
    const tasksByStatus = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM tasks
      GROUP BY status
    `);

    // Overdue tasks
    const overdueTasks = await pool.query(`
      SELECT COUNT(*) FROM tasks
      WHERE due_date < CURRENT_DATE
      AND status != 'completed'
    `);

    // Total reports today
    const todayReports = await pool.query(`
      SELECT COUNT(*) FROM daily_reports
      WHERE date = CURRENT_DATE
    `);

    // Attendance today
    const todayAttendance = await pool.query(`
      SELECT COUNT(*) FROM attendance
      WHERE date = CURRENT_DATE
    `);

    res.json({
      total_employees: totalEmployees.rows[0].count,
      total_departments: totalDepartments.rows[0].count,
      total_tasks: totalTasks.rows[0].count,
      tasks_by_status: tasksByStatus.rows,
      overdue_tasks: overdueTasks.rows[0].count,
      today_reports: todayReports.rows[0].count,
      today_attendance: todayAttendance.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// MANAGER DASHBOARD
const getManagerDashboard = async (req, res) => {
  try {
    // Total tasks assigned by this manager
    const totalTasks = await pool.query(
      'SELECT COUNT(*) FROM tasks WHERE assigned_by = $1',
      [req.user.id]
    );

    // Tasks by status
    const tasksByStatus = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM tasks
      WHERE assigned_by = $1
      GROUP BY status
    `, [req.user.id]);

    // Overdue tasks
    const overdueTasks = await pool.query(`
      SELECT COUNT(*) FROM tasks
      WHERE assigned_by = $1
      AND due_date < CURRENT_DATE
      AND status != 'completed'
    `, [req.user.id]);

    // Today's reports
    const todayReports = await pool.query(`
      SELECT COUNT(*) FROM daily_reports
      WHERE date = CURRENT_DATE
    `);

    // Today's attendance
    const todayAttendance = await pool.query(`
      SELECT COUNT(*) FROM attendance
      WHERE date = CURRENT_DATE
    `);

    res.json({
      total_tasks: totalTasks.rows[0].count,
      tasks_by_status: tasksByStatus.rows,
      overdue_tasks: overdueTasks.rows[0].count,
      today_reports: todayReports.rows[0].count,
      today_attendance: todayAttendance.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// EMPLOYEE DASHBOARD
const getEmployeeDashboard = async (req, res) => {
  try {
    const user_id = req.user.id;

    // My tasks
    const myTasks = await pool.query(
      'SELECT COUNT(*) FROM tasks WHERE assigned_to = $1',
      [user_id]
    );

    // My tasks by status
    const myTasksByStatus = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM tasks
      WHERE assigned_to = $1
      GROUP BY status
    `, [user_id]);

    // My overdue tasks
    const myOverdueTasks = await pool.query(`
      SELECT COUNT(*) FROM tasks
      WHERE assigned_to = $1
      AND due_date < CURRENT_DATE
      AND status != 'completed'
    `, [user_id]);

    // My attendance this month
    const myAttendance = await pool.query(`
      SELECT COUNT(*) FROM attendance
      WHERE user_id = $1
      AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
    `, [user_id]);

    // My reports this month
    const myReports = await pool.query(`
      SELECT COUNT(*) FROM daily_reports
      WHERE user_id = $1
      AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
    `, [user_id]);

    // Today checked in?
    const todayAttendance = await pool.query(`
      SELECT * FROM attendance
      WHERE user_id = $1
      AND date = CURRENT_DATE
    `, [user_id]);

    res.json({
      my_total_tasks: myTasks.rows[0].count,
      my_tasks_by_status: myTasksByStatus.rows,
      my_overdue_tasks: myOverdueTasks.rows[0].count,
      my_attendance_this_month: myAttendance.rows[0].count,
      my_reports_this_month: myReports.rows[0].count,
      checked_in_today: todayAttendance.rows.length > 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PRODUCTIVITY TRACKING
const getProductivity = async (req, res) => {
  try {
    // Completion rate per employee
    const completionRate = await pool.query(`
      SELECT
        u.name,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        ROUND(
          SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(t.id), 0), 2
        ) as completion_rate
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_to
      GROUP BY u.id, u.name
    `);

    res.json({ productivity: completionRate.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAdminDashboard, getManagerDashboard, getEmployeeDashboard, getProductivity };