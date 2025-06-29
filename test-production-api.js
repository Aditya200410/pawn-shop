import http from 'http';

const options = {
  hostname: 'pawnbackend-xmqa.onrender.com',
  port: 443,
  path: '/health',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js Test'
  }
};

const req = http.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Health check response:', JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end(); 