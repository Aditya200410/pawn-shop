// Simple test to verify review system
console.log('Testing Review System...');

// Test 1: Check if server is running
fetch('http://localhost:5000/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Server is running:', data);
  })
  .catch(error => {
    console.log('❌ Server not running:', error.message);
  });

// Test 2: Check reviews endpoint
fetch('http://localhost:5000/api/reviews/product/507f1f77bcf86cd799439011')
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