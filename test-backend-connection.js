const axios = require('axios');

const BACKEND_URL = 'https://pawnbackend-1.onrender.com';

async function testBackendConnection() {
  console.log('Testing backend connection...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test CORS endpoint
    console.log('\n2. Testing CORS endpoint...');
    const corsResponse = await axios.get(`${BACKEND_URL}/test-cors`);
    console.log('✅ CORS test passed:', corsResponse.data);
    
    // Test products endpoint
    console.log('\n3. Testing products endpoint...');
    const productsResponse = await axios.get(`${BACKEND_URL}/api/products`);
    console.log('✅ Products endpoint working, found', productsResponse.data.length, 'products');
    
    // Test categories endpoint
    console.log('\n4. Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${BACKEND_URL}/api/categories`);
    console.log('✅ Categories endpoint working, found', categoriesResponse.data.length, 'categories');
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Backend connection failed!');
    console.error('Error details:');
    console.error('- Message:', error.message);
    console.error('- Status:', error.response?.status);
    console.error('- Status Text:', error.response?.statusText);
    console.error('- URL:', error.config?.url);
    console.error('- Method:', error.config?.method);
    
    if (error.response?.data) {
      console.error('- Response Data:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if the backend is deployed and running on Render');
    console.log('2. Verify the backend URL is correct');
    console.log('3. Check if there are any CORS issues');
    console.log('4. Look at the backend logs on Render for errors');
  }
}

// Run the test
testBackendConnection(); 