const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Dummy in-memory data for analytics (replace with real aggregated data in production)
const moodAnalytics = {
  happy: 40,
  sad: 15,
  angry: 10,
  anxious: 10,
  calm: 15,
  excited: 5,
  tired: 5,
  stressed: 0,
};

const progressAnalytics = {
  goalsCompleted: 5,
  totalGoals: 7,
  journalEntries: 20,
  meditationSessions: 12,
};

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

// Get mood analytics for user (dummy data)
router.get('/mood', verifyUser, (req, res) => {
  res.json(moodAnalytics);
});

// Get progress analytics for user (dummy data)
router.get('/progress', verifyUser, (req, res) => {
  res.json(progressAnalytics);
});

module.exports = router;
