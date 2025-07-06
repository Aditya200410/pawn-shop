const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

async function testReviewAPI() {
  console.log('Testing Review API endpoints...\n');

  try {
    // Test 1: Test server health
    console.log('1. Testing server health');
    const healthResponse = await fetch('http://localhost:5000/health');
    console.log('Health Status:', healthResponse.status);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health Response:', JSON.stringify(healthData, null, 2));
    } else {
      console.log('Error:', await healthResponse.text());
    }
    console.log('');

    // Test 2: Get reviews for a product (public endpoint)
    console.log('2. Testing GET /api/reviews/product/:productId');
    const response1 = await fetch(`${BASE_URL}/reviews/product/507f1f77bcf86cd799439011`);
    console.log('Status:', response1.status);
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('Response:', JSON.stringify(data1, null, 2));
    } else {
      console.log('Error:', await response1.text());
    }
    console.log('');

    console.log('Review API tests completed!');
  } catch (error) {
    console.error('Error testing Review API:', error.message);
  }
}

testReviewAPI(); 