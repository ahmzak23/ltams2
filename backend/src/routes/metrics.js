const express = require('express');
const router = express.Router();
const { logger } = require('../logger');

// Store custom metrics in memory
let customMetrics = {
  requestCount: 0,
  errorCount: 0,
  lastRequestTime: null
};

// Test endpoint to generate sample logs
router.post('/test-logs', (req, res) => {
  try {
    // Generate different types of logs
    logger.debug('Debug message: Testing system configuration');
    logger.info('Info message: User action completed successfully');
    logger.warn('Warning message: System resources running low');
    
    // Simulate an error
    try {
      throw new Error('Simulated error for testing');
    } catch (error) {
      logger.error('Error message: Operation failed', error);
    }

    // Update metrics
    customMetrics.requestCount++;
    customMetrics.lastRequestTime = Date.now();

    res.json({ message: 'Test logs generated successfully' });
  } catch (error) {
    customMetrics.errorCount++;
    logger.error('Error generating test logs:', error);
    res.status(500).json({ error: 'Failed to generate test logs' });
  }
});

// Get raw metrics
router.get('/', (req, res) => {
  try {
    res.json(customMetrics);
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Update metrics
router.post('/', (req, res) => {
  try {
    const update = req.body;
    customMetrics = {
      ...customMetrics,
      ...update,
      lastRequestTime: Date.now()
    };
    res.json(customMetrics);
  } catch (error) {
    logger.error('Error updating metrics:', error);
    res.status(500).json({ error: 'Failed to update metrics' });
  }
});

module.exports = router; 