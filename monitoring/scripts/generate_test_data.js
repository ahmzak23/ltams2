const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_BASE_URL = 'http://localhost:3000'; // Adjust to your API gateway URL
const ENDPOINTS = [
  '/api/users',
  '/api/products',
  '/api/orders',
  '/api/categories',
  '/api/reviews'
];
const CLIENT_IDS = [
  'client-1',
  'client-2',
  'client-3',
  'client-4',
  'client-5'
];

// Function to generate a random request
async function generateRequest() {
  const clientId = CLIENT_IDS[Math.floor(Math.random() * CLIENT_IDS.length)];
  const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
  const method = Math.random() > 0.7 ? 'POST' : 'GET';
  
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${clientId}`,
        'X-Request-ID': uuidv4()
      },
      data: method === 'POST' ? { test: 'data' } : undefined
    });
    
    console.log(`Request: ${method} ${endpoint} (Client: ${clientId}) - Status: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`Error: ${method} ${endpoint} (Client: ${clientId}) - ${error.message}`);
    return null;
  }
}

// Function to generate requests at a specific rate
async function generateRequestsAtRate(ratePerMinute, durationMinutes) {
  const intervalMs = (60 * 1000) / ratePerMinute;
  const endTime = Date.now() + (durationMinutes * 60 * 1000);
  
  console.log(`Generating ${ratePerMinute} requests per minute for ${durationMinutes} minutes`);
  
  while (Date.now() < endTime) {
    await generateRequest();
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  console.log('Finished generating requests');
}

// Main function to run the test
async function runTest() {
  // Generate normal traffic (1 request per minute per client)
  console.log('Phase 1: Normal traffic');
  await generateRequestsAtRate(5, 2);
  
  // Generate traffic exceeding rate limit (3 requests per minute per client)
  console.log('Phase 2: Exceeding rate limit');
  await generateRequestsAtRate(15, 2);
  
  // Generate normal traffic again
  console.log('Phase 3: Back to normal traffic');
  await generateRequestsAtRate(5, 2);
  
  // Generate traffic exceeding rate limit again
  console.log('Phase 4: Exceeding rate limit again');
  await generateRequestsAtRate(15, 2);
  
  console.log('Test completed');
}

// Run the test
runTest().catch(console.error); 