import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';
import { getClientId } from '../utils/auth';

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

// Prometheus middleware
export const prometheusMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const clientId = getClientId(req) || 'anonymous';
  
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
      
    return originalSend.call(this, body);
  };
  
  next();
};

// Metrics endpoint handler
export const metricsHandler = async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
}; 