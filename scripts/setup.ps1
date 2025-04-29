# Exit on error
$ErrorActionPreference = "Stop"

Write-Host "Setting up LTAMS application..." -ForegroundColor Green

# Start the Docker containers
Write-Host "Starting Docker containers..." -ForegroundColor Cyan
docker-compose up -d mysql

# Wait for MySQL to be ready
Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Initialize the database
Write-Host "Initializing the database..." -ForegroundColor Cyan
# The database will be automatically initialized by the MySQL container

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location -Path frontend
npm install --legacy-peer-deps
Set-Location -Path ..

# Start the backend and frontend
Write-Host "Starting backend and frontend applications..." -ForegroundColor Cyan
docker-compose up -d backend frontend

Write-Host "Setup complete! The applications are now running." -ForegroundColor Green
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "API Gateway: http://localhost:3000" -ForegroundColor Yellow 