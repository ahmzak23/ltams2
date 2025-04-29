#!/bin/bash

# Create necessary directories
mkdir -p \
    frontend/src \
    api-gateway/src \
    backend/app \
    monitoring/{grafana,prometheus,loki,tempo,thanos,otel,vector,promtail}/config \
    scripts

# Make scripts executable
chmod +x scripts/*.sh

# Create data directories
mkdir -p \
    data/prometheus \
    data/grafana \
    data/loki \
    data/tempo \
    data/thanos \
    data/postgres \
    data/sqlserver

# Initialize backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# Initialize API Gateway
cd api-gateway
npm install
cd ..

# Initialize frontend
cd frontend
npm install
cd ..

# Pull Docker images
docker-compose pull

# Create Docker networks
docker network create ltams-network || true

# Initialize databases
docker-compose up -d postgres sqlserver
sleep 10  # Wait for databases to be ready

# Initialize PostgreSQL
PGPASSWORD=ltamspass psql -h localhost -U ltams -d ltamsdb -f backend/db/init.sql

# Initialize SQL Server
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'LtamsStr0ngP@ss' -i backend/db/init.sql

# Start monitoring stack
docker-compose up -d prometheus grafana loki tempo thanos vector promtail otel-collector

echo "Setup completed successfully!"
echo "You can now start the application with: docker-compose up -d" 