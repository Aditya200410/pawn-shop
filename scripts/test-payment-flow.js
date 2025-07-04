const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function testPaymentFlow() {
  console.log('🧪 Testing PhonePe Payment Flow...\n');

  try {
    // Test 1: Check if payment endpoint is accessible
    console.log('1. Testing payment endpoint accessibility...');
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

    console.log('Sending test order data:', {
      ...testOrderData,
      items: testOrderData.items.length + ' items'
    });

    const response = await axios.post(`${API_BASE_URL}/api/payment/phonepe`, testOrderData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Payment endpoint response:', {
      success: response.data.success,
      hasRedirectUrl: !!response.data.redirectUrl,
      hasTransactionId: !!response.data.transactionId,
      message: response.data.message
    });

    if (response.data.success && response.data.redirectUrl) {
      console.log('✅ Payment initiation successful!');
      console.log('Transaction ID:', response.data.transactionId);
      console.log('Redirect URL:', response.data.redirectUrl.substring(0, 100) + '...');
    } else {
      console.log('❌ Payment initiation failed:', response.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the backend server is running on port 5000');
    }
    
    if (error.response?.status === 500) {
      console.error('💡 Check your environment variables:');
      console.error('   - PHONEPE_MERCHANT_ID');
      console.error('   - PHONEPE_CLIENT_SECRET');
      console.error('   - FRONTEND_URL');
      console.error('   - BACKEND_URL');
    }
  }

  // Test 2: Check environment variables
  console.log('\n2. Checking environment variables...');
  const requiredEnvVars = [
    'PHONEPE_MERCHANT_ID',
    'PHONEPE_CLIENT_SECRET',
    'FRONTEND_URL',
    'BACKEND_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are set');
  } else {
    console.log('❌ Missing environment variables:', missingVars);
    console.log('💡 Please set these variables in your .env file');
  }

  // Test 3: Check if order creation endpoint works
  console.log('\n3. Testing order creation endpoint...');
  try {
    const testOrder = {
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
      paymentMethod: 'phonepe',
      paymentStatus: 'completed',
      sellerToken: 'test-seller-token',
      transactionId: 'test-transaction-id',
      couponCode: null
    };

    const orderResponse = await axios.post(`${API_BASE_URL}/api/orders`, testOrder, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Order creation successful:', {
      success: orderResponse.data.success,
      orderId: orderResponse.data.order?._id
    });

  } catch (orderError) {
    console.log('❌ Order creation failed:', orderError.message);
    if (orderError.response?.data) {
      console.log('Error details:', orderError.response.data);
    }
  }

  console.log('\n🎉 Payment flow test completed!');
}

// Run the test
testPaymentFlow().catch(console.error); 