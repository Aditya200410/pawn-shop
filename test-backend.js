import axios from 'axios';

const config = {
  API_BASE_URL: 'https://pawnbackend-xmqa.onrender.com',
  API_ENDPOINTS: {
    CART: '/api/cart',
    AUTH: '/api/auth',
  },
  get API_URLS() {
    return {
      CART: `${this.API_BASE_URL}${this.API_ENDPOINTS.CART}`,
      AUTH: `${this.API_BASE_URL}${this.API_ENDPOINTS.AUTH}`,
    };
  },
};

async function testBackend() {
  console.log('Testing backend connectivity...');
  
  try {
    // Test 1: Check if backend is accessible
    console.log('\n1. Testing backend accessibility...');
    const response = await axios.get(config.API_URLS.CART, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Backend is accessible');
    console.log('Response status:', response.status);
  } catch (error) {
    console.log('❌ Backend test failed');
    console.log('Error status:', error.response?.status);
    console.log('Error message:', error.response?.data);
  }
  
  try {
    // Test 2: Check auth endpoint
    console.log('\n2. Testing auth endpoint...');
    const authResponse = await axios.get(config.API_URLS.AUTH + '/me', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Auth endpoint is accessible');
  } catch (error) {
    console.log('❌ Auth endpoint test failed');
    console.log('Error status:', error.response?.status);
    console.log('Error message:', error.response?.data);
  }
}

testBackend().catch(console.error); 