const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: String,
  type: String,
  text: String,
  font: String,
  color: String,
  size: String,
  shape: String,
  usage: String,
  addOns: [String],
  dimmer: Boolean,
  price: Number,
  preview: String,
});

const orderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  items: [itemSchema], // ✅ this must be array of objects, not strings
  totalAmount: Number,
  paymentMethod: String,
  orderStatus: String,
  paymentStatus: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
