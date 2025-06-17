const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'ordered', 'abandoned'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
cartSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, quantity, price) {
    const existingItem = this.items.find(item => item.product.toString() === productId.toString());
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({
            product: productId,
            quantity,
            price
        });
    }
    
    return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function(productId) {
    this.items = this.items.filter(item => item.product.toString() !== productId.toString());
    return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function(productId, quantity) {
    const item = this.items.find(item => item.product.toString() === productId.toString());
    if (item) {
        item.quantity = quantity;
        return this.save();
    }
    throw new Error('Item not found in cart');
};

// Method to clear cart
cartSchema.methods.clearCart = async function() {
    this.items = [];
    this.totalAmount = 0;
    return this.save();
};

// Static method to find or create cart for user
cartSchema.statics.findOrCreateCart = async function(userId) {
    let cart = await this.findOne({ user: userId, status: 'active' });
    
    if (!cart) {
        cart = new this({
            user: userId,
            items: [],
            totalAmount: 0
        });
        await cart.save();
    }
    
    return cart;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 