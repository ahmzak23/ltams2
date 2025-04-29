const express = require('express');
const cors = require('cors');
const { logger } = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API routes
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/events', require('./routes/events'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Backend server listening on port ${port}`);
}); 