const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  action: String, 
  accessedBy: String, 
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
