import axios from 'axios';

// Configuration
const API_BASE_URL = 'https://pawnbackend-xmqa.onrender.com';
const TEST_ORDER_DATA = {
  amount: 100,
  customerName: 'Test Customer',
  email: 'test@example.com',
  phone: '9876543210',
  items: [
    {
      productId: 'test_product_1',
      name: 'Test Product 1',
      quantity: 1,
      price: 50,
      image: 'test_image_1.jpg'
    },
    {
      productId: 'test_product_2',
      name: 'Test Product 2',
      quantity: 1,
      price: 50,
      image: 'test_image_2.jpg'
    }
  ],
  totalAmount: 100,
  shippingCost: 0,
  codExtraCharge: 0,
  finalTotal: 100,
  paymentMethod: 'phonepe',
  sellerToken: 'test_seller_token'
};

async function testPhonePeIntegration() {
  console.log('🧪 Testing PhonePe Integration...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: CORS Test
  console.log('\n2. Testing CORS...');
  try {
    const corsResponse = await axios.get(`${API_BASE_URL}/test-cors`);
    console.log('✅ CORS test passed:', corsResponse.data);
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }

  // Test 3: PhonePe Order Creation
  console.log('\n3. Testing PhonePe Order Creation...');
  try {
    const orderResponse = await axios.post(`${API_BASE_URL}/api/payment/phonepe`, TEST_ORDER_DATA, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ PhonePe order creation response:', {
      success: orderResponse.data.success,
      hasRedirectUrl: !!orderResponse.data.redirectUrl,
      transactionId: orderResponse.data.transactionId,
      message: orderResponse.data.message
    });

    if (orderResponse.data.success && orderResponse.data.transactionId) {
      // Test 4: PhonePe Status Check
      console.log('\n4. Testing PhonePe Status Check...');
      try {
        const statusResponse = await axios.get(`${API_BASE_URL}/api/payment/phonepe/status/${orderResponse.data.transactionId}`, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ PhonePe status check response:', {
          success: statusResponse.data.success,
          code: statusResponse.data.code,
          message: statusResponse.data.message
        });
      } catch (error) {
        console.log('❌ PhonePe status check failed:', error.response?.data?.message || error.message);
      }
    }
  } catch (error) {
    console.log('❌ PhonePe order creation failed:', error.response?.data?.message || error.message);
    
    if (error.response?.status === 404) {
      console.log('💡 This might be a routing issue. Check if payment routes are properly mounted.');
    } else if (error.response?.status === 500) {
      console.log('💡 This might be a configuration issue. Check PhonePe credentials and environment variables.');
    }
  }

  // Test 5: Invalid Transaction ID
  console.log('\n5. Testing Invalid Transaction ID...');
  try {
    const invalidResponse = await axios.get(`${API_BASE_URL}/api/payment/phonepe/status/invalid_transaction_id`, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Invalid transaction ID handled properly:', invalidResponse.data);
  } catch (error) {
    console.log('✅ Invalid transaction ID properly rejected:', error.response?.data?.message || error.message);
  }

  console.log('\n🎯 PhonePe Integration Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Set up PhonePe merchant account');
  console.log('2. Configure environment variables');
  console.log('3. Test with real PhonePe credentials');
  console.log('4. Monitor logs for any issues');
}

// Run the test
testPhonePeIntegration().catch(console.error); 