// File: admin/backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

module.exports = mongoose.model('BestSeller', bestSellerSchema);

