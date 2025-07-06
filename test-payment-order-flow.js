import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL || 'https://pawnbackend-xmqa.onrender.com';

async function testPaymentOrderFlow() {
  console.log('🧪 Testing Payment and Order Creation Flow...\n');

  try {
    // Test 1: Create a test order directly
    console.log('1. Testing direct order creation...');
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
      transactionId: 'test-transaction-' + Date.now(),
      couponCode: null
    };

    const orderResponse = await axios.post(`${API_BASE_URL}/api/orders`, testOrder, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Direct order creation successful:', {
      success: orderResponse.data.success,
      orderId: orderResponse.data.order?._id,
      message: orderResponse.data.message
    });

  } catch (orderError) {
    console.log('❌ Direct order creation failed:', orderError.message);
    if (orderError.response?.data) {
      console.log('Error details:', orderError.response.data);
    }
  }

  // Test 2: Test PhonePe status endpoint
  console.log('\n2. Testing PhonePe status endpoint...');
  try {
    const testOrderId = 'OMO2403282020198641071317'; // Example order ID
    const statusResponse = await axios.get(`${API_BASE_URL}/api/payment/phonepe/status/${testOrderId}`, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ PhonePe status endpoint response:', {
      success: statusResponse.data.success,
      hasState: !!statusResponse.data.data?.state,
      state: statusResponse.data.data?.state
    });

  } catch (error) {
    console.log('❌ PhonePe status test failed:', error.response?.data?.message || error.message);
  }

  // Test 3: Test payment service completePaymentFlow logic
  console.log('\n3. Testing payment service logic...');
  try {
    // Simulate the payment service logic
    const mockPaymentStatus = {
      success: true,
      data: {
        state: 'COMPLETED',
        orderId: 'test-order-id',
        amount: 1000
      }
    };

    const mockOrderData = {
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
      transactionId: 'test-transaction-' + Date.now()
    };

    // Test the logic flow
    if (mockPaymentStatus.success && mockPaymentStatus.data?.state === 'COMPLETED') {
      console.log('✅ Payment status is COMPLETED, should create order');
      
      // Try to create order
      const orderResponse = await axios.post(`${API_BASE_URL}/api/orders`, mockOrderData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (orderResponse.data.success) {
        console.log('✅ Order created successfully after payment verification');
        console.log('Order ID:', orderResponse.data.order?._id);
      } else {
        console.log('❌ Order creation failed after payment verification');
      }
    } else {
      console.log('❌ Payment status is not COMPLETED');
    }

  } catch (error) {
    console.log('❌ Payment service logic test failed:', error.message);
  }

  console.log('\n🎉 Payment and Order Flow Test Completed!');
}

// Run the test
testPaymentOrderFlow().catch(console.error); 