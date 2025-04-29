const express = require('express');
const router = express.Router();
const { logger } = require('../logger');

// Store metrics in memory (consider using a proper time-series database in production)
let metrics = {
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
    metrics.requestCount++;
    metrics.lastRequestTime = Date.now();

    res.json({ message: 'Test logs generated successfully' });
  } catch (error) {
    metrics.errorCount++;
    logger.error('Error generating test logs:', error);
    res.status(500).json({ error: 'Failed to generate test logs' });
  }
});

// Get metrics in Prometheus format
router.get('/prometheus', (req, res) => {
  try {
    const prometheusMetrics = [
      '# HELP request_count_total Total number of requests',
      '# TYPE request_count_total counter',
      `request_count_total ${metrics.requestCount}`,
      '# HELP error_count_total Total number of errors',
      '# TYPE error_count_total counter',
      `error_count_total ${metrics.errorCount}`,
      '# HELP last_request_timestamp_seconds Timestamp of last request',
      '# TYPE last_request_timestamp_seconds gauge',
      `last_request_timestamp_seconds ${metrics.lastRequestTime ? metrics.lastRequestTime / 1000 : 0}`
    ].join('\n');

    res.set('Content-Type', 'text/plain');
    res.send(prometheusMetrics);
  } catch (error) {
    logger.error('Error generating Prometheus metrics:', error);
    res.status(500).json({ error: 'Failed to generate metrics' });
  }
});

// Get raw metrics
router.get('/', (req, res) => {
  try {
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Update metrics
router.post('/', (req, res) => {
  try {
    const update = req.body;
    metrics = {
      ...metrics,
      ...update,
      lastRequestTime: Date.now()
    };
    res.json(metrics);
  } catch (error) {
    logger.error('Error updating metrics:', error);
    res.status(500).json({ error: 'Failed to update metrics' });
  }
});

module.exports = router; 