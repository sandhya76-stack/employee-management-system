const pool = require('../config/db');

// CREATE NOTIFICATION (internal function)
const createNotification = async (user_id, title, message) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)',
      [user_id, title, message]
    );
  } catch (err) {
    console.log('Notification error:', err.message);
  }
};

// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res) => {
  const user_id = req.user.id;
  try {
    const notifications = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json(notifications.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET UNREAD NOTIFICATIONS
const getUnreadNotifications = async (req, res) => {
  const user_id = req.user.id;
  try {
    const notifications = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 AND is_read = FALSE ORDER BY created_at DESC',
      [user_id]
    );
    res.json(notifications.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// MARK AS READ
const markAsRead = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const updated = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification marked as read', notification: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// MARK ALL AS READ
const markAllAsRead = async (req, res) => {
  const user_id = req.user.id;
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
      [user_id]
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const deleted = await pool.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createNotification, getMyNotifications, getUnreadNotifications, markAsRead, markAllAsRead, deleteNotification };