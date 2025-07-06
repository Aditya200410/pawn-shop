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

// Simple test to verify backend is working
console.log('Testing Backend Connection...');

// Test 1: Check if server is running
fetch('http://localhost:5000/health')
  .then(response => {
    console.log('Health endpoint status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Backend is running:', data);
  })
  .catch(error => {
    console.log('❌ Backend not running:', error.message);
  });

// Test 2: Check if reviews endpoint exists
fetch('http://localhost:5000/api/reviews/product/test')
  .then(response => {
    console.log('Reviews endpoint status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Reviews endpoint working:', data);
  })
  .catch(error => {
    console.log('❌ Reviews endpoint error:', error.message);
  }); 