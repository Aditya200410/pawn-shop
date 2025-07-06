const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test the approval system
async function testApprovalSystem() {
  try {
    console.log('🧪 Testing Seller Approval System...\n');

    // 1. Test seller registration (should create seller with approved: false)
    console.log('1. Testing seller registration...');
    const sellerData = {
      businessName: 'Test Business',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      address: 'Test Address',
      businessType: 'Retail'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/seller/register`, sellerData);
    console.log('✅ Seller registered successfully');
    console.log('   - Seller ID:', registerResponse.data.seller.id);
    console.log('   - Approved status:', registerResponse.data.seller.approved);
    console.log('   - Token:', registerResponse.data.token ? 'Present' : 'Missing');

    const sellerId = registerResponse.data.seller.id;
    const sellerToken = registerResponse.data.token;

    // 2. Test admin approval endpoint
    console.log('\n2. Testing admin approval...');
    const approvalResponse = await axios.patch(`${API_BASE_URL}/seller/${sellerId}/approve`, {
      approved: true
    });
    console.log('✅ Seller approved successfully');
    console.log('   - New approved status:', approvalResponse.data.seller.approved);

    // 3. Test withdrawal with approved seller
    console.log('\n3. Testing withdrawal with approved seller...');
    const withdrawalData = {
      bankDetails: {
        accountName: 'Test Account',
        accountNumber: '1234567890',
        ifsc: 'TEST0001234',
        bankName: 'Test Bank',
        upi: 'test@upi'
      },
      amount: 100
    };

    try {
      const withdrawalResponse = await axios.post(`${API_BASE_URL}/seller/withdraw`, withdrawalData, {
        headers: {
          'Authorization': `Bearer ${sellerToken}`
        }
      });
      console.log('✅ Withdrawal request successful');
      console.log('   - Withdrawal ID:', withdrawalResponse.data.withdraw._id);
    } catch (error) {
      console.log('❌ Withdrawal failed:', error.response?.data?.message || error.message);
    }

    // 4. Test disapproval
    console.log('\n4. Testing seller disapproval...');
    const disapprovalResponse = await axios.patch(`${API_BASE_URL}/seller/${sellerId}/approve`, {
      approved: false
    });
    console.log('✅ Seller disapproved successfully');
    console.log('   - New approved status:', disapprovalResponse.data.seller.approved);

    // 5. Test withdrawal with disapproved seller (should fail)
    console.log('\n5. Testing withdrawal with disapproved seller...');
    try {
      await axios.post(`${API_BASE_URL}/seller/withdraw`, withdrawalData, {
        headers: {
          'Authorization': `Bearer ${sellerToken}`
        }
      });
      console.log('❌ Withdrawal should have failed but succeeded');
    } catch (error) {
      console.log('✅ Withdrawal correctly blocked for disapproved seller');
      console.log('   - Error message:', error.response?.data?.message);
    }

    console.log('\n🎉 All approval system tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the test
testApprovalSystem(); 