#!/bin/bash

# Function to generate random HTTP status codes with a bias towards success
generate_status() {
    rand=$((RANDOM % 100))
    if [ $rand -lt 80 ]; then
        echo "200"
    elif [ $rand -lt 90 ]; then
        echo "400"
    elif [ $rand -lt 95 ]; then
        echo "401"
    else
        echo "500"
    fi
}

# Function to generate random endpoints
generate_endpoint() {
    endpoints=("/api/v1/users" "/api/v1/surveys" "/api/v1/content" "/api/v1/subscriptions")
    methods=("GET" "POST" "PUT" "DELETE")
    echo "${methods[$((RANDOM % 4))]} ${endpoints[$((RANDOM % 4))]}"
}

# Function to generate random user IDs
generate_user_id() {
    echo "user_$((RANDOM % 1000 + 1))"
}

# Function to generate random IP addresses
generate_ip() {
    echo "$((RANDOM % 256)).$((RANDOM % 256)).$((RANDOM % 256)).$((RANDOM % 256))"
}

# Generate API requests
generate_api_requests() {
    while true; do
        endpoint=$(generate_endpoint)
        status=$(generate_status)
        user_id=$(generate_user_id)
        ip=$(generate_ip)
        duration=$((RANDOM % 2000))  # Duration in milliseconds
        
        # Send request to API Gateway
        curl -s -X ${endpoint%% *} \
             -H "X-User-ID: $user_id" \
             -H "X-Real-IP: $ip" \
             "http://localhost:3000${endpoint#* }" \
             > /dev/null 2>&1
        
        # Simulate varying load
        sleep 0.$((RANDOM % 5))
    done
}

# Generate database load
generate_db_load() {
    while true; do
        # Simulate database queries
        psql "postgresql://ltams:ltamspass@localhost:5432/ltamsdb" \
             -c "SELECT pg_sleep($((RANDOM % 5)));" \
             > /dev/null 2>&1
        
        # Simulate varying load
        sleep $((RANDOM % 3))
    done
}

# Generate business events
generate_business_events() {
    event_types=("user_registration" "survey_submission" "content_creation" "subscription_renewal")
    
    while true; do
        event_type=${event_types[$((RANDOM % 4))]}
        user_id=$(generate_user_id)
        
        # Send event to backend
        curl -s -X POST \
             -H "Content-Type: application/json" \
             -d "{\"event_type\":\"$event_type\",\"user_id\":\"$user_id\"}" \
             "http://localhost:8000/events" \
             > /dev/null 2>&1
        
        sleep $((RANDOM % 3))
    done
}

# Generate errors
generate_errors() {
    error_types=("database_connection" "authentication_failure" "validation_error" "system_error")
    
    while true; do
        error_type=${error_types[$((RANDOM % 4))]}
        
        # Send request that will generate an error
        curl -s -X POST \
             -H "Content-Type: application/json" \
             -d "{\"error_type\":\"$error_type\"}" \
             "http://localhost:8000/test/error" \
             > /dev/null 2>&1
        
        sleep $((RANDOM % 10))
    done
}

# Start data generation in parallel
echo "Starting test data generation..."
generate_api_requests &
generate_db_load &
generate_business_events &
generate_errors &

# Wait for user interrupt
echo "Press Ctrl+C to stop data generation"
wait 