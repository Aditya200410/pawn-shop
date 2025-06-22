const mongoose = require('mongoose');
const Cart = require('./models/Cart');
const fs = require('fs');
const path = require('path');

// Test connection
mongoose.connect('mongodb://127.0.0.1:27017/pawn', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  testCart();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function testCart() {
  try {
    // Test creating a cart
    const testUserId = new mongoose.Types.ObjectId();
    const testCart = new Cart({
      userId: testUserId,
      items: []
    });
    
    await testCart.save();
    console.log('✅ Cart created successfully');
    
    // Test adding an item
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shop.json'), 'utf8'));
    const testProduct = products[0]; // First product
    
    testCart.items.push({
      productId: testProduct.id.toString(),
      quantity: 2,
      price: testProduct.price,
      name: testProduct.name,
      image: testProduct.image
    });
    
    await testCart.save();
    console.log('✅ Item added to cart successfully');
    console.log('Cart items:', testCart.items);
    
    // Clean up
    await Cart.findByIdAndDelete(testCart._id);
    console.log('✅ Test cart cleaned up');
    
    console.log('\n🎉 All cart tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
} 