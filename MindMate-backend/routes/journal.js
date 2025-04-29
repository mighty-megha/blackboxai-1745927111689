const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory journal entries store (replace with DB in production)
const journalEntries = [];

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

// Add journal entry
router.post('/', verifyUser, (req, res) => {
  const { content, moodTags, date } = req.body;
  if (!content || !date) {
    return res.status(400).json({ message: 'Content and date are required' });
  }
  const entry = {
    id: journalEntries.length + 1,
    userId: req.user.id,
    content,
    moodTags: moodTags || [],
    date,
  };
  journalEntries.push(entry);
  res.status(201).json({ message: 'Journal entry added', entry });
});

// Get journal entries for user
router.get('/', verifyUser, (req, res) => {
  const userEntries = journalEntries.filter(entry => entry.userId === req.user.id);
  res.json(userEntries);
});

module.exports = router;
