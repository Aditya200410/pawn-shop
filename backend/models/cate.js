// File: admin/backend/models/Product.js
const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

module.exports = mongoose.model('cat', catSchema);

