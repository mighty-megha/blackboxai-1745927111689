const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory mood logs store (replace with DB in production)
const moodLogs = [];

// Middleware to verify user token
function verifyUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'mindmate_secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Add mood log
router.post('/', verifyUser, (req, res) => {
  const { emotion, note, date } = req.body;
  if (!emotion || !date) {
    return res.status(400).json({ message: 'Emotion and date are required' });
  }
  const log = {
    id: moodLogs.length + 1,
    userId: req.user.id,
    emotion,
    note: note || '',
    date,
  };
  moodLogs.push(log);
  res.status(201).json({ message: 'Mood log added', log });
});

// Get mood logs for user
router.get('/', verifyUser, (req, res) => {
  const userLogs = moodLogs.filter(log => log.userId === req.user.id);
  res.json(userLogs);
});

module.exports = router;
