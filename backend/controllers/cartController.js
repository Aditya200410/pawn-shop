const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id, status: 'active' })
            .populate('items.product', 'name price image');

        if (!cart) {
            return res.status(200).json({
                items: [],
                totalAmount: 0
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: req.user._id, status: 'active' });
        if (!cart) {
            cart = new Cart({ user: req.user._id });
        }

        // Add item to cart
        await cart.addItem(productId, quantity, product.price);

        // Populate product details
        await cart.populate('items.product', 'name price image');

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

// Update cart item quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id, status: 'active' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check product stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        await cart.updateQuantity(productId, quantity);
        await cart.populate('items.product', 'name price image');

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id, status: 'active' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        await cart.removeItem(productId);
        await cart.populate('items.product', 'name price image');

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id, status: 'active' });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        await cart.clearCart();
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
}; 