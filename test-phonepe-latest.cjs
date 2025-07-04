require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

// Simple test for latest PhonePe API (2024)
async function testLatestPhonePe() {
  console.log('=== Latest PhonePe API Test (2024) ===\n');
  
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const merchantSecret = process.env.PHONEPE_CLIENT_SECRET;
  const env = process.env.PHONEPE_ENV || 'production';
  
  console.log('Environment Variables:');
  console.log('- PHONEPE_MERCHANT_ID:', merchantId ? 'Set' : 'NOT SET');
  console.log('- PHONEPE_CLIENT_SECRET:', merchantSecret ? 'Set' : 'NOT SET');
  console.log('- PHONEPE_ENV:', env);
  console.log('');
  
  if (!merchantId || !merchantSecret) {
    console.error('❌ PhonePe credentials not configured!');
    return;
  }
  
  // Test the latest PhonePe API endpoint
  const baseUrl = env === 'production' 
    ? 'https://api.phonepe.com/apis/hermes' 
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  const endpoint = '/pg/v1/pay';
  
  console.log(`Testing ${env} environment...`);
  console.log(`URL: ${baseUrl}${endpoint}`);
  
  try {
    // Latest PhonePe payload structure (2024)
    const testPayload = {
      merchantId: merchantId,
      merchantTransactionId: `TEST_${Date.now()}`,
      merchantUserId: 'test@example.com',
      amount: 10000, // 100 rupees in paise
      redirectUrl: 'https://example.com/success',
      redirectMode: 'POST',
      callbackUrl: 'https://example.com/callback',
      paymentInstrument: {
        type: 'PAY_PAGE'
      },
      merchantOrderId: `TEST_${Date.now()}`,
      message: 'Test payment',
      mobileNumber: '9876543210',
      email: 'test@example.com',
      shortName: 'Test User',
      name: 'Test User',
      upiIntent: true,
      enablePayMode: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true
      }
    };
    
    // Generate X-VERIFY
    const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
    const stringToHash = base64Payload + endpoint + merchantSecret;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = sha256 + '###1';
    
    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    console.log('X-VERIFY:', xVerify);
    
    const response = await axios.post(
      baseUrl + endpoint,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': merchantId,
        },
        timeout: 10000,
      }
    );
    
    console.log(`✅ Success (${response.status})`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log(`❌ Failed (${error.response?.status || 'Network Error'})`);
    if (error.response?.data) {
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Run the test
testLatestPhonePe().catch(console.error); 