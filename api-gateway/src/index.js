const opentelemetry = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const LokiTransport = require('winston-loki');
const promBundle = require('express-prom-bundle');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Configure OpenTelemetry
const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4317'
    }),
    metricExporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4317'
    }),
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        service: 'api-gateway',
        environment: process.env.NODE_ENV || 'production'
    },
    transports: [
        new winston.transports.Console(),
        new LokiTransport({
            host: 'http://loki:3100',
            json: true,
            labels: { job: 'api-gateway' }
        })
    ]
});

// Initialize Express app
const app = express();

// Configure Prometheus metrics
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: { 
        service: 'api-gateway',
        target_service: 'backend'
    },
    promClient: {
        collectDefaultMetrics: {
            timeout: 5000
        }
    }
});

app.use(metricsMiddleware);

// Basic security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    dynamicMeta: (req, res) => {
        const meta = {};
        const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
        if (span) {
            meta.traceId = span.spanContext().traceId;
        }
        if (req.user) {
            meta.userId = req.user.id;
        }
        meta.ipAddress = req.ip;
        return meta;
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Proxy middleware configuration
const backendProxy = createProxyMiddleware({
    target: process.env.BACKEND_URL || 'http://backend:8000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/': '/'
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add trace context headers
        const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
        if (span) {
            const ctx = span.spanContext();
            proxyReq.setHeader('traceparent', `00-${ctx.traceId}-${ctx.spanId}-0${ctx.traceFlags.toString(16)}`);
        }
    }
});

// API routes
app.use('/api/v1', backendProxy);

// Error handling middleware
app.use(expressWinston.errorLogger({
    winstonInstance: logger
}));

app.use((err, req, res, next) => {
    const span = opentelemetry.trace.getSpan(opentelemetry.context.active());
    logger.error('Error processing request', {
        error: {
            message: err.message,
            stack: err.stack,
            type: err.name,
            code: err.code
        },
        traceId: span ? span.spanContext().traceId : undefined
    });
    
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            type: err.name,
            code: err.code
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`API Gateway listening on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    sdk.shutdown()
        .then(() => process.exit(0))
        .catch((err) => {
            logger.error('Error shutting down SDK', err);
            process.exit(1);
        });
}); 