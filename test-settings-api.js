const axios = require('axios');

const baseURL = 'http://localhost:5000';

async function testSettingsAPI() {
  try {
    console.log('🧪 Testing Settings API...\n');

    // 1. Get current upfront amount
    console.log('1. Getting current upfront amount...');
    try {
      const response = await axios.get(`${baseURL}/api/settings/cod-upfront-amount`);
      console.log('✅ Current upfront amount:', response.data.amount);
    } catch (error) {
      console.log('❌ Failed to get upfront amount:', error.response?.data?.message || error.message);
    }

    // 2. Update upfront amount to 39
    console.log('\n2. Updating upfront amount to 39...');
    try {
      const updateResponse = await axios.post(`${baseURL}/api/settings`, {
        key: 'cod_upfront_amount',
        value: 39,
        description: 'Upfront payment amount for Cash on Delivery orders (in rupees)'
      });
      console.log('✅ Updated upfront amount:', updateResponse.data.setting.value);
    } catch (error) {
      console.log('❌ Failed to update upfront amount:', error.response?.data?.message || error.message);
    }

    // 3. Verify the update
    console.log('\n3. Verifying the update...');
    try {
      const verifyResponse = await axios.get(`${baseURL}/api/settings/cod-upfront-amount`);
      console.log('✅ Verified upfront amount:', verifyResponse.data.amount);
    } catch (error) {
      console.log('❌ Failed to verify upfront amount:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Settings API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSettingsAPI(); 