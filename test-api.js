// Simple test to check API response
fetch('https://pawnbackend-xmqa.onrender.com/api/data-page')
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data);
    console.log('Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    if (Array.isArray(data)) {
      console.log('Array length:', data.length);
      data.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
        console.log(`Item ${index} keys:`, Object.keys(item));
      });
    }
  })
  .catch(error => {
    console.error('Error:', error);
  }); 