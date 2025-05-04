# LTAMS Demonstration Application

This repository contains a complete demonstration of a Logging, Tracking, Alerting & Monitoring Systems (LTAMS) implementation. The application showcases proper integration of structured logging, metrics collection, distributed tracing, alerting configuration, and business event tracking in a microservices architecture.

## Architecture Overview

The application consists of the following components:

### Core Services
- Angular SPA Frontend
- Node.js API Gateway
- Python Backend Services
- Background Processing Services (Python & Node.js)
- SQL Server & PostgreSQL Databases

### Monitoring Stack
- Grafana - Visualization and Alerting
- Prometheus - Metrics Collection
- Loki - Log Aggregation
- Tempo - Distributed Tracing
- Thanos - Long-term Metrics Storage
- Vector - Advanced Log Processing
- OpenTelemetry Collectors - Telemetry Pipeline
- Promtail - Log Collection

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.9+
- Angular CLI

## Quick Start

1. Clone the repository
2. Run the setup script:
   ```bash
   ./scripts/setup.sh
   ```
3. Start the stack:
   ```bash
   docker-compose up -d
   ```
4. Access the services:
   - Frontend: http://localhost:4200
   - API Gateway: http://localhost:3000
   - Backend API: http://localhost:8000
   - Grafana: http://localhost:3000
   - Prometheus: http://localhost:9090

## Directory Structure

```
├── frontend/                 # Angular SPA
├── api-gateway/             # Node.js API Gateway
├── backend/                 # Python Backend Services
├── monitoring/             # Monitoring Configuration
│   ├── grafana/           # Grafana Dashboards & Config
│   ├── prometheus/        # Prometheus Config
│   ├── loki/             # Loki Config
│   ├── tempo/            # Tempo Config
│   ├── thanos/           # Thanos Config
│   └── otel/             # OpenTelemetry Config
├── scripts/               # Utility Scripts
└── docker/               # Docker Configurations
```

## Monitoring Features

### Logging System
- Structured JSON logging
- Standard log levels (CRITICAL, ERROR, WARNING, INFO, DEBUG, TRACE)
- Correlation with traces and metrics
- Business event tracking

### Metrics Collection
- Application metrics
- Infrastructure metrics
- Business KPIs
- Custom metrics

### Alerting
- Team-specific alert configurations
- Multi-channel notifications
- Alert severity levels
- Runbook integration

### Dashboards
- Database Team dashboards
- Application Team dashboards
- DevOps Team dashboards
- Business Team dashboards

## Development

### Adding New Services
1. Create service directory
2. Implement OpenTelemetry instrumentation
3. Add service to docker-compose.yml
4. Configure monitoring

### Testing
```bash
# Run unit tests
./scripts/test.sh

# Run integration tests
./scripts/integration-test.sh

# Generate test data
./scripts/generate-test-data.sh
```

## Documentation

- [Setup Guide](./docs/setup.md)
- [Architecture Details](./docs/architecture.md)
- [Monitoring Guide](./docs/monitoring.md)
- [Alert Configuration](./docs/alerting.md)
- [Dashboard Guide](./docs/dashboards.md)
- [Runbooks](./docs/runbooks.md)



## To obtain a Telegram bot token,
1.	Open the Telegram app and search for the "BotFather" bot.
2.	Start a chat with the BotFather and use the '/newbot' command to create a new bot.
3.	Follow the instructions provided by the BotFather to choose a name and username for your bot. 
4.	The BotFather will provide you with a bot token. 

## To Get Chat ID:
1.	Search for '@userinfobot' in the Telegram app and start a chat with it.
2.	Send any message to '@userinfobot'. It can be any text message; it doesn't matter.
3.	The '@userinfobot' will reply with information about your chat, including your chat ID.




## License

MIT License 