# API Monitoring Test Scripts

This directory contains scripts to generate test data for the API monitoring dashboard.

## Prerequisites

- Docker and Docker Compose installed
- Node.js (v14 or later) installed
- The main monitoring stack configured in the parent directory

## Quick Start

### On Linux/macOS:

```bash
# Make the script executable
chmod +x start_monitoring.sh

# Run the script
./start_monitoring.sh
```

### On Windows:

```bash
# Run the batch file
start_monitoring.bat
```

## What These Scripts Do

1. **start_monitoring.sh/bat**: 
   - Starts the Prometheus, Grafana, Loki, and AlertManager containers
   - Installs dependencies for the test scripts
   - Starts the mock API server and test data generator

2. **mock_api_server.js**:
   - Creates a simple Express server that responds to API requests
   - Exposes Prometheus metrics at `/metrics`
   - Logs rate limit violations to Loki
   - Implements mock endpoints for testing

3. **generate_test_data.js**:
   - Generates API requests at varying rates
   - Simulates normal traffic and traffic exceeding rate limits
   - Uses different client IDs and endpoints

## Manual Usage

If you want to run the components separately:

```bash
# Install dependencies
npm install

# Start just the mock API server
npm run server

# Start just the test data generator
npm run start

# Start both the server and test data generator
npm run all
```

## Accessing the Dashboard

After running the scripts, you can access the Grafana dashboard at:

- URL: http://localhost:3000
- Username: admin
- Password: admin

The dashboard will show real-time data as the test script generates API requests. 