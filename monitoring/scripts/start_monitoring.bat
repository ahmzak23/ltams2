@echo off

REM Start the monitoring stack
echo Starting monitoring stack...
docker-compose -f ..\..\docker-compose.yml up -d prometheus grafana loki alertmanager

REM Wait for services to start
echo Waiting for services to start...
timeout /t 10 /nobreak

REM Install dependencies for the test script
echo Installing test script dependencies...
cd %~dp0
call npm install

REM Start the mock API server and test data generator
echo Starting mock API server and test data generator...
call npm run all

echo Monitoring stack is running. Access Grafana at http://localhost:3000
echo Username: admin, Password: admin 