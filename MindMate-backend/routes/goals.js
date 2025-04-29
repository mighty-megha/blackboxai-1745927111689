const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory goals store (replace with DB in production)
const goals = [];

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

// Add goal
router.post('/', verifyUser, (req, res) => {
  const { title, description, frequency } = req.body;
  if (!title || !frequency) {
    return res.status(400).json({ message: 'Title and frequency are required' });
  }
  const goal = {
    id: goals.length + 1,
    userId: req.user.id,
    title,
    description: description || '',
    frequency, // daily, weekly, monthly
    progress: 0,
  };
  goals.push(goal);
  res.status(201).json({ message: 'Goal added', goal });
});

// Get goals for user
router.get('/', verifyUser, (req, res) => {
  const userGoals = goals.filter(goal => goal.userId === req.user.id);
  res.json(userGoals);
});

// Update goal progress
router.put('/:id/progress', verifyUser, (req, res) => {
  const goalId = parseInt(req.params.id);
  const { progress } = req.body;
  const goal = goals.find(g => g.id === goalId && g.userId === req.user.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    return res.status(400).json({ message: 'Progress must be a number between 0 and 100' });
  }
  goal.progress = progress;
  res.json({ message: 'Goal progress updated', goal });
});

module.exports = router;
