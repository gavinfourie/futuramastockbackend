const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    unique: false,
    required: false,
  },
  quantity: {
    type: String,
    unique: false,
    required: true,
  },
  price: {
    type: String,
    unique: false,
    required: false,
  },
  lastupdate: {
    type: Date,
    unique: false,
    required: true,
  },
  eta: {
    type: String,
    unique: false,
    required: false,
  },
  alt: {
    type: String,
    unique: false,
    required: false,
  }
});

const product = mongoose.model('product', stockSchema);

module.exports = product;
