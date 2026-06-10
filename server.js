const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const departmentRoutes = require('./routes/department.routes');
const employeeRoutes = require('./routes/employee.routes');
const taskRoutes = require('./routes/task.routes');
const reportRoutes = require('./routes/report.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const notificationRoutes = require('./routes/notification.routes');
const searchRoutes = require('./routes/search.routes');
const { verifyToken } = require('./middleware/auth.middleware');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Database connection FAILED ❌', err.message);
  } else {
    console.log('Database connected ✅', res.rows[0].now);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have access!', user: req.user });
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});