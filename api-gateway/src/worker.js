const opentelemetry = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const winston = require('winston');
const LokiTransport = require('winston-loki');
const { Counter, Gauge } = require('prom-client');
const express = require('express');

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
        service: 'node-worker',
        environment: process.env.NODE_ENV || 'production'
    },
    transports: [
        new winston.transports.Console(),
        new LokiTransport({
            host: 'http://loki:3100',
            json: true,
            labels: { job: 'node-worker' }
        })
    ]
});

// Initialize Prometheus metrics
const tasksProcessed = new Counter({
    name: 'worker_tasks_processed_total',
    help: 'Total number of tasks processed',
    labelNames: ['task_type']
});

const tasksInProgress = new Gauge({
    name: 'worker_tasks_in_progress',
    help: 'Number of tasks currently being processed',
    labelNames: ['task_type']
});

class Worker {
    constructor() {
        this.tracer = opentelemetry.trace.getTracer('node-worker');
    }

    async processTask(taskType) {
        const span = this.tracer.startSpan(`process_${taskType}`);
        span.setAttribute('task.type', taskType);

        tasksInProgress.labels(taskType).inc();

        try {
            // Log task start
            logger.info('Processing task', {
                taskType,
                traceId: span.spanContext().traceId
            });

            // Simulate task processing
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Update success metrics
            tasksProcessed.labels(taskType).inc();

            // Log success
            logger.info('Task completed successfully', {
                taskType,
                traceId: span.spanContext().traceId
            });

        } catch (error) {
            // Log error
            logger.error('Error processing task', {
                taskType,
                error: {
                    message: error.message,
                    stack: error.stack,
                    type: error.name
                },
                traceId: span.spanContext().traceId
            });
            throw error;

        } finally {
            tasksInProgress.labels(taskType).dec();
            span.end();
        }
    }

    async run() {
        // Create Express app for metrics endpoint
        const app = express();
        
        // Metrics endpoint
        app.get('/metrics', async (req, res) => {
            try {
                res.set('Content-Type', 'text/plain');
                res.send(await require('prom-client').register.metrics());
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        // Start metrics server
        app.listen(3000, () => {
            logger.info('Metrics server started on port 3000');
        });

        // Main worker loop
        while (true) {
            try {
                // Process different types of tasks
                await Promise.all([
                    this.processTask('notification'),
                    this.processTask('email'),
                    this.processTask('report_generation')
                ]);

                // Wait before next batch
                await new Promise(resolve => setTimeout(resolve, 60000));

            } catch (error) {
                logger.error('Error in worker loop', {
                    error: {
                        message: error.message,
                        stack: error.stack,
                        type: error.name
                    }
                });
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
}

// Start worker
const worker = new Worker();
worker.run().catch(error => {
    logger.error('Fatal worker error', {
        error: {
            message: error.message,
            stack: error.stack,
            type: error.name
        }
    });
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    sdk.shutdown()
        .then(() => process.exit(0))
        .catch((error) => {
            logger.error('Error shutting down SDK', {
                error: {
                    message: error.message,
                    stack: error.stack,
                    type: error.name
                }
            });
            process.exit(1);
        });
}); 