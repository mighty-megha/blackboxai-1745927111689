const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory quotes store (replace with DB or external API in production)
const quotes = [
  { id: 1, text: "The only way to do great work is to love what you do. – Steve Jobs" },
  { id: 2, text: "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman" },
  { id: 3, text: "You are never too old to set another goal or to dream a new dream. – C.S. Lewis" },
  { id: 4, text: "Believe you can and you're halfway there. – Theodore Roosevelt" },
  { id: 5, text: "Act as if what you do makes a difference. It does. – William James" },
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

// Get daily quote (random for demo)
router.get('/daily', verifyUser, (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  res.json(quotes[randomIndex]);
});

module.exports = router;
