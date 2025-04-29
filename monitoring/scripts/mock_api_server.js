const express = require('express');
const client = require('prom-client');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const LokiTransport = require('winston-loki');

// Initialize Prometheus metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'client_id'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'client_id']
});

// Initialize Winston logger with Loki transport
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new LokiTransport({
      host: "http://localhost:3100",
      json: true,
      labels: { job: "api-gateway" },
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error('Loki connection error:', err)
    })
  ]
});

// Create Express app
const app = express();
const port = 3000;
const host = '0.0.0.0';

// Middleware to parse JSON
app.use(express.json());

// Prometheus middleware
app.use((req, res, next) => {
  const start = Date.now();
  const clientId = req.headers.authorization ? req.headers.authorization.split(' ')[1] : 'anonymous';
  
  // Store response object to access status code later
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : req.path;
    
    // Record metrics
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode.toString(), clientId)
      .observe(duration / 1000);
      
    httpRequestsTotal
      .labels(req.method, route, res.statusCode.toString(), clientId)
      .inc();
    
    // Log rate limit violations
    if (clientId === 'client-1' && req.path === '/api/users' && Math.random() > 0.7) {
      logger.warn(`Rate limit exceeded for client ${clientId} on endpoint ${route}`);
    }
      
    return originalSend.call(this, body);
  };
  
  next();
});

// Mock endpoints
app.get('/api/users', (req, res) => {
  res.json({
    id: uuidv4(),
    name: 'Test User',
    email: 'test@example.com'
  });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({
    id: uuidv4(),
    ...req.body,
    created: new Date().toISOString()
  });
});

app.get('/api/products', (req, res) => {
  res.json([
    { id: uuidv4(), name: 'Product 1', price: 99.99 },
    { id: uuidv4(), name: 'Product 2', price: 149.99 }
  ]);
});

app.get('/api/orders', (req, res) => {
  res.json([
    { id: uuidv4(), userId: uuidv4(), total: 199.99, status: 'completed' },
    { id: uuidv4(), userId: uuidv4(), total: 299.99, status: 'pending' }
  ]);
});

app.get('/api/categories', (req, res) => {
  res.json([
    { id: uuidv4(), name: 'Electronics' },
    { id: uuidv4(), name: 'Clothing' },
    { id: uuidv4(), name: 'Books' }
  ]);
});

app.get('/api/reviews', (req, res) => {
  res.json([
    { id: uuidv4(), productId: uuidv4(), rating: 5, comment: 'Great product!' },
    { id: uuidv4(), productId: uuidv4(), rating: 3, comment: 'Average product' }
  ]);
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Start server
app.listen(port, host, () => {
  console.log(`Mock API server running at http://${host}:${port}`);
  console.log(`Metrics available at http://${host}:${port}/metrics`);
}); 