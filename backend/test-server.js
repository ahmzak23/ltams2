const express = require('express');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = process.env.PORT || 3000;

// Configure Prometheus metrics
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: { 
        service: 'backend',
        target_service: 'mysql'  // Add target_service label
    },
    promClient: {
        collectDefaultMetrics: {
            timeout: 5000
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', database: 'skipped' });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(metricsMiddleware.metrics);
});

// Start server
app.listen(port, () => {
  console.log(`Test server listening on port ${port}`);
}); 