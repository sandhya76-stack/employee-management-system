const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied, Admins only' });
  }
  next();
};

const isManager = (req, res, next) => {
  if (req.user.role !== 'manager' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied, Managers only' });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isManager };