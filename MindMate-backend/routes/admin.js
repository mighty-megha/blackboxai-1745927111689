const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Dummy in-memory user data store (replace with DB in production)
const users = [
  { id: 1, username: 'admin', role: 'admin' },
  // other users...
];

// Middleware to verify admin token
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'mindmate_secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
    req.user = decoded;
    next();
  });
}

// Get all users (admin only)
router.get('/users', verifyAdmin, (req, res) => {
  res.json(users);
});

// Delete user by id (admin only)
router.delete('/users/:id', verifyAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(index, 1);
  res.json({ message: 'User deleted' });
});

// Update user by id (admin only)
router.put('/users/:id', verifyAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { username, role } = req.body;
  if (username) user.username = username;
  if (role) user.role = role;
  res.json({ message: 'User updated', user });
});

module.exports = router;
