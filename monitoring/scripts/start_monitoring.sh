#!/bin/bash

# Start the monitoring stack
echo "Starting monitoring stack..."
docker-compose -f ../../docker-compose.yml up -d prometheus grafana loki alertmanager

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Install dependencies for the test script
echo "Installing test script dependencies..."
cd $(dirname "$0")
npm install

# Start the mock API server and test data generator
echo "Starting mock API server and test data generator..."
npm run all

echo "Monitoring stack is running. Access Grafana at http://localhost:3000"
echo "Username: admin, Password: admin" 