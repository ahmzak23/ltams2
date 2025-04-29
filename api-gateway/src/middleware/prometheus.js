const promClient = require('prom-client');
const { RequestCounter, RequestDuration } = require('../metrics');

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Create a middleware to track request metrics
const prometheusMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Get client ID from headers or IP
  const clientId = req.headers['x-client-id'] || req.ip;
  
  // Get the path, handling both route paths and raw paths
  const path = req.route ? req.route.path : req.path;
  
  // Increment request counter
  RequestCounter.inc({
    method: req.method,
    path: path,
    status: res.statusCode,
    client_id: clientId
  });

  // Record request duration when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    RequestDuration.observe({
      method: req.method,
      path: path,
      status: res.statusCode,
      client_id: clientId
    }, duration / 1000); // Convert to seconds
  });

  next();
};

module.exports = prometheusMiddleware; 