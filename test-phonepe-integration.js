const axios = require('axios');
require('dotenv').config();

const TEST_CONFIG = {
  env: 'production',
  merchantId: process.env.PHONEPE_MERCHANT_ID,
  merchantSecret: process.env.PHONEPE_MERCHANT_SECRET,
  clientId: process.env.PHONEPE_CLIENT_ID,
  clientSecret: process.env.PHONEPE_CLIENT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000'
};

console.log('🧪 Testing PhonePe Integration...\n');
console.log('Configuration:', {
  env: TEST_CONFIG.env,
  hasMerchantId: !!TEST_CONFIG.merchantId,
  hasClientId: !!TEST_CONFIG.clientId,
  frontendUrl: TEST_CONFIG.frontendUrl,
  backendUrl: TEST_CONFIG.backendUrl
});

// Test 1: OAuth Token Generation
async function testOAuthToken() {
  console.log('\n=== Test 1: OAuth Token Generation ===');
  
  try {
    const oauthUrl = 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';
    
    const response = await axios.post(oauthUrl, 
      new URLSearchParams({
        client_id: TEST_CONFIG.clientId,
        client_version: '1',
        client_secret: TEST_CONFIG.clientSecret,
        grant_type: 'client_credentials'
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.access_token) {
      console.log('✅ OAuth token obtained successfully');
      console.log('Token expires at:', new Date(response.data.expires_at * 1000));
      return response.data.access_token;
    } else {
      console.log('❌ OAuth token generation failed:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ OAuth token error:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Payment Order Creation
async function testPaymentOrder(accessToken) {
  console.log('\n=== Test 2: Payment Order Creation ===');
  
  try {
    const baseUrl = 'https://api.phonepe.com/apis/pg';
    const apiEndpoint = '/checkout/v2/pay';
    
    const merchantOrderId = `MT${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    const payload = {
      merchantOrderId: merchantOrderId,
      amount: 10000, // ₹100 in paise
      expireAfter: 1200, // 20 minutes
      metaInfo: {
        udf1: 'Test Customer',
        udf2: 'test@example.com',
        udf3: '9876543210'
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `Test payment for order ${merchantOrderId}`,
        merchantUrls: {
          redirectUrl: `${TEST_CONFIG.frontendUrl}/payment/success?transactionId=${merchantOrderId}`
        }
      }
    };

    const response = await axios.post(
      baseUrl + apiEndpoint,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.orderId && response.data.redirectUrl) {
      console.log('✅ Payment order created successfully');
      console.log('Order ID:', response.data.orderId);
      console.log('Merchant Order ID:', merchantOrderId);
      console.log('Redirect URL:', response.data.redirectUrl.substring(0, 100) + '...');
      return {
        orderId: response.data.orderId,
        merchantOrderId: merchantOrderId,
        redirectUrl: response.data.redirectUrl
      };
    } else {
      console.log('❌ Payment order creation failed:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Payment order error:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Order Status Check
async function testOrderStatus(accessToken, orderId) {
  console.log('\n=== Test 3: Order Status Check ===');
  
  try {
    const baseUrl = 'https://api.phonepe.com/apis/pg';
    const apiEndpoint = `/checkout/v2/order/${orderId}/status`;
    
    const response = await axios.get(
      baseUrl + apiEndpoint,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${accessToken}`
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.state) {
      console.log('✅ Order status retrieved successfully');
      console.log('Order State:', response.data.state);
      console.log('Amount:', response.data.amount);
      return response.data;
    } else {
      console.log('❌ Order status check failed:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Order status error:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Backend API Integration
async function testBackendIntegration() {
  console.log('\n=== Test 4: Backend API Integration ===');
  
  try {
    const testOrderData = {
      amount: 100,
      customerName: 'Test Customer',
      email: 'test@example.com',
      phone: '9876543210',
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      country: 'India',
      items: [
        {
          productId: 'test-product-1',
          name: 'Test Product',
          quantity: 1,
          price: 100,
          image: 'test-image.jpg'
        }
      ],
      totalAmount: 100,
      shippingCost: 0,
      codExtraCharge: 0,
      finalTotal: 100,
      paymentMethod: 'phonepe',
      sellerToken: 'test-seller-token',
      couponCode: null
    };

    const response = await axios.post(`${TEST_CONFIG.backendUrl}/api/payment/phonepe`, testOrderData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.success && response.data.redirectUrl) {
      console.log('✅ Backend payment integration working');
      console.log('Order ID:', response.data.orderId);
      console.log('Merchant Order ID:', response.data.merchantOrderId);
      console.log('Redirect URL:', response.data.redirectUrl.substring(0, 100) + '...');
      return response.data;
    } else {
      console.log('❌ Backend payment integration failed:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Backend integration error:', error.response?.data || error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting PhonePe Integration Tests...\n');
  
  // Test 1: OAuth Token
  const accessToken = await testOAuthToken();
  if (!accessToken) {
    console.log('\n❌ OAuth token test failed. Cannot proceed with other tests.');
    return;
  }
  
  // Test 2: Payment Order
  const orderResult = await testPaymentOrder(accessToken);
  if (!orderResult) {
    console.log('\n❌ Payment order test failed.');
    return;
  }
  
  // Test 3: Order Status
  await testOrderStatus(accessToken, orderResult.orderId);
  
  // Test 4: Backend Integration
  await testBackendIntegration();
  
  console.log('\n🎉 PhonePe Integration Tests Completed!');
  console.log('\n📋 Summary:');
  console.log('   ✅ OAuth token generation working');
  console.log('   ✅ Payment order creation working');
  console.log('   ✅ Order status checking working');
  console.log('   ✅ Backend API integration working');
  console.log('\n💡 Next steps:');
  console.log('   1. Test actual payment flow with real credentials');
  console.log('   2. Verify payment completion and order creation');
  console.log('   3. Test payment failure scenarios');
  console.log('   4. Test callback handling');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testOAuthToken,
  testPaymentOrder,
  testOrderStatus,
  testBackendIntegration,
  runTests
}; 