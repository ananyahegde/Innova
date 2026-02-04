const mongoose = require('mongoose');

const consentItemSchema = new mongoose.Schema({
  purpose: {
    type: String,
    enum: [
      'email_tracking',
      'location_data',
      'device_info',
      'targeted_ads',
      'product_suggestions',
      'service_improvements',
      'email_updates'
    ]
  },
  granted: Boolean
}, { _id: false });

const consentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  consents: [consentItemSchema],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consent', consentSchema);
