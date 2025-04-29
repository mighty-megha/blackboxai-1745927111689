const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory meditation sessions store (replace with DB or external content in production)
const meditationSessions = [
  { id: 1, title: 'Focus Meditation', description: 'Guided meditation to improve focus.', duration: 10 },
  { id: 2, title: 'Anxiety Reduction', description: 'Meditation to reduce anxiety and stress.', duration: 15 },
  { id: 3, title: 'Relaxation', description: 'Relaxing meditation for calmness.', duration: 12 },
  { id: 4, title: 'Quick Breathing Exercise', description: 'Short breathing exercise for stress moments.', duration: 5 },
];

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

// Get all meditation sessions
router.get('/', verifyUser, (req, res) => {
  res.json(meditationSessions);
});

module.exports = router;
