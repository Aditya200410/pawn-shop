// File: admin/backend/models/Product.js
const mongoose = require("mongoose");

const lovedSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

module.exports = mongoose.model('loved', lovedSchema);

