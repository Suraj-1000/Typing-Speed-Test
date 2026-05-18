const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const scoreRoutes = require('./routes/score.routes');

/**
 * Express application instance
 */
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/score', scoreRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Typing Speed Test API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
