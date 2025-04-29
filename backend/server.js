const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const promBundle = require('express-prom-bundle');
const logger = require('./utils/logger');

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
app.use(bodyParser.json());
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

// Mock auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Mock authentication - accept any username/password
  if (username && password) {
    // Generate a mock token
    const token = 'mock-jwt-token-' + Date.now();
    
    res.json({
      token,
      user: {
        id: '1',
        username,
        role: 'user'
      }
    });
  } else {
    res.status(400).json({ message: 'Username and password are required' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Mock registration - accept any input
  if (username && email && password) {
    res.status(201).json({ message: 'User registered successfully' });
  } else {
    res.status(400).json({ message: 'Username, email, and password are required' });
  }
});

app.post('/api/auth/refresh-token', (req, res) => {
  // Mock token refresh
  const token = 'mock-refreshed-jwt-token-' + Date.now();
  res.json({ token });
});

app.post('/api/auth/logout', (req, res) => {
  // Mock logout
  res.json({ message: 'Logged out successfully' });
});

// Mock protected route
app.get('/api/auth/me', (req, res) => {
  // Mock user data
  res.json({ 
    user: {
      id: '1',
      username: 'mockuser',
      email: 'mock@example.com',
      role: 'user'
    }
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Backend server listening on port ${port}`);
}); 