const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderRef: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
