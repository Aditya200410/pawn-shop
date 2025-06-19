// File: admin/backend/routes/orders.js
const express = require("express");
const Order = require("../models/Order");
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../data/orders.json');

// Helper function to read orders from JSON file
const readOrders = () => {
  try {
    if (fs.existsSync(ordersFilePath)) {
      const data = fs.readFileSync(ordersFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
};

// Helper function to write orders to JSON file
const writeOrders = (orders) => {
  try {
    const dirPath = path.dirname(ordersFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error writing orders file:', error);
    throw new Error('Failed to save order to JSON file');
  }
};

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
});

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order',
      error: error.message 
    });
  }
});

// Create order
router.post("/", async (req, res) => {
  try {
    // Create new order
    const newOrder = new Order(req.body);

    // Validate order data
    await newOrder.validate();

    // Save to MongoDB
    const savedOrder = await newOrder.save();

    // Save to JSON file
    const orders = readOrders();
    orders.push(savedOrder.toObject({ virtuals: true }));
    writeOrders(orders);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid order data',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Failed to create order',
      error: error.message 
    });
  }
});

// Update order status
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate status
    if (!['processing', 'confirmed', 'manufacturing', 'shipped', 'delivered'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    // Update in MongoDB
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update in JSON file
    const orders = readOrders();
    const orderIndex = orders.findIndex(order => order._id.toString() === id);
    if (orderIndex !== -1) {
      orders[orderIndex] = updatedOrder.toObject({ virtuals: true });
      writeOrders(orders);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid order status',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Failed to update order status',
      error: error.message 
    });
  }
});

// Update payment status
router.put("/:id/payment", async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    // Validate payment status
    if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    // Update in MongoDB
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update in JSON file
    const orders = readOrders();
    const orderIndex = orders.findIndex(order => order._id.toString() === id);
    if (orderIndex !== -1) {
      orders[orderIndex] = updatedOrder.toObject({ virtuals: true });
      writeOrders(orders);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating payment status:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid payment status',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Failed to update payment status',
      error: error.message 
    });
  }
});

module.exports = router;
