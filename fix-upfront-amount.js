const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pawnshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Settings = require('./pawnbackend/models/Settings');

async function fixUpfrontAmount() {
  try {
    console.log('🔧 Fixing upfront amount in database...\n');

    // Find the existing setting
    let setting = await Settings.findOne({ key: 'cod_upfront_amount' });
    
    if (setting) {
      console.log('📋 Current setting found:');
      console.log('   Key:', setting.key);
      console.log('   Value:', setting.value, '(type:', typeof setting.value, ')');
      console.log('   Description:', setting.description);
      
      // Update the value to 39 as a number
      setting.value = 39;
      setting.description = 'Upfront payment amount for Cash on Delivery orders (in rupees)';
      setting.updatedAt = new Date();
      
      await setting.save();
      console.log('\n✅ Updated setting:');
      console.log('   New Value:', setting.value, '(type:', typeof setting.value, ')');
    } else {
      console.log('📋 No existing setting found, creating new one...');
      
      // Create new setting
      const newSetting = new Settings({
        key: 'cod_upfront_amount',
        value: 39,
        description: 'Upfront payment amount for Cash on Delivery orders (in rupees)'
      });
      
      await newSetting.save();
      console.log('✅ Created new setting:');
      console.log('   Key:', newSetting.key);
      console.log('   Value:', newSetting.value, '(type:', typeof newSetting.value, ')');
    }

    // Verify the setting
    const verifySetting = await Settings.findOne({ key: 'cod_upfront_amount' });
    console.log('\n🔍 Verification:');
    console.log('   Key:', verifySetting.key);
    console.log('   Value:', verifySetting.value, '(type:', typeof verifySetting.value, ')');
    console.log('   Description:', verifySetting.description);

    console.log('\n🎉 Upfront amount fixed successfully!');
    console.log('   The value is now stored as:', typeof verifySetting.value);
    console.log('   Frontend should now show ₹39 instead of ₹1');

  } catch (error) {
    console.error('❌ Error fixing upfront amount:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the fix
fixUpfrontAmount(); 