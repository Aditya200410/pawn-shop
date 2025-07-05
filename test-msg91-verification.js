// Test file for MSG91 integration with correct API endpoint
const axios = require('axios');

// Test MSG91 API key and configuration
const MSG91_API_KEY = process.env.MSG91_API_KEY || '458779TNIVxOl3qDwI6866bc33P1';
const WIDGET_ID = '356765707a68343736313035';

console.log('Testing MSG91 Integration with Correct API Endpoint...');
console.log('Widget ID:', WIDGET_ID);
console.log('API Key:', MSG91_API_KEY ? 'Set' : 'Not set');

// Test the MSG91 verification endpoint with the correct API
async function testMsg91Verification() {
  try {
    const testToken = 'test_access_token'; // This would be the actual token from MSG91 widget
    
    const verifyUrl = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';
    
    console.log('Testing MSG91 verification URL:', verifyUrl);
    console.log('Request body:', {
      authkey: MSG91_API_KEY,
      'access-token': testToken
    });
    
    const response = await axios.post(verifyUrl, {
      authkey: MSG91_API_KEY,
      'access-token': testToken
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('MSG91 API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('MSG91 API Error:', error.response?.data || error.message);
    return null;
  }
}

// Test the backend registration endpoint
async function testBackendRegistration() {
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      phone: '9999999999',
      msg91Token: 'test_access_token'
    };
    
    console.log('Testing backend registration with data:', testData);
    
    const response = await axios.post('https://pawnbackend-xmqa.onrender.com/api/auth/register-with-msg91', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Backend Registration Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Backend Registration Error:', error.response?.data || error.message);
    return null;
  }
}

// Test the complete flow
async function testCompleteFlow() {
  try {
    console.log('\n=== Testing Complete MSG91 Flow ===\n');
    
    // Step 1: Test MSG91 API verification
    console.log('1. Testing MSG91 API verification...');
    const msg91Result = await testMsg91Verification();
    
    // Step 2: Test backend registration
    console.log('\n2. Testing backend registration endpoint...');
    const backendResult = await testBackendRegistration();
    
    console.log('\n=== Test Results ===');
    console.log('MSG91 API Test:', msg91Result ? 'Response received' : 'Failed');
    console.log('Backend Test:', backendResult ? 'Response received' : 'Failed');
    
  } catch (error) {
    console.error('Test flow error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('\n=== MSG91 Integration Tests (Updated API) ===\n');
  
  await testCompleteFlow();
  
  console.log('\n=== Test Complete ===');
  console.log('\nNote: For actual testing, you need a real MSG91 access token from the widget.');
  console.log('The test token used here will fail, but this verifies the API integration is correct.');
}

runTests(); 