$apiGatewayUrl = "http://localhost:3000"
$backendUrl = "http://localhost:3002"

Write-Host "Generating traffic between services..."

# Function to make HTTP requests
function Make-Request {
    param (
        [string]$Url,
        [string]$Method = "GET"
    )
    try {
        $response = Invoke-WebRequest -Uri $Url -Method $Method
        Write-Host "Request to $Url successful"
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-Host ("Error making request to " + $Url + ": " + $errorMsg)
    }
}

# Generate some traffic
for ($i = 0; $i -lt 10; $i++) {
    # API Gateway requests
    Make-Request -Url "$apiGatewayUrl/api/health"
    Make-Request -Url "$apiGatewayUrl/api/metrics"
    
    # Backend requests
    Make-Request -Url "$backendUrl/health"
    Make-Request -Url "$backendUrl/metrics"
    
    Start-Sleep -Seconds 1
}

Write-Host "Traffic generation complete" 