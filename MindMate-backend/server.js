const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('MindMate Backend API is running');
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Mood routes
const moodRoutes = require('./routes/mood');
app.use('/api/mood', moodRoutes);

// Journal routes
const journalRoutes = require('./routes/journal');
app.use('/api/journal', journalRoutes);

// Quotes routes
const quotesRoutes = require('./routes/quotes');
app.use('/api/quotes', quotesRoutes);

// Meditation routes
const meditationRoutes = require('./routes/meditation');
app.use('/api/meditation', meditationRoutes);

// Goals routes
const goalsRoutes = require('./routes/goals');
app.use('/api/goals', goalsRoutes);

// Analytics routes
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

// Start server
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
