const mongoose = require('mongoose');

// models/account.js

const AccountSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  plaid_item_id: {
    type: String,
    required: true,
  },
  account_id: {
    type: String,
    required: true,
  },
  account_number: String, // Add this field
  name: String,
  official_name: String,
  subtype: String,
  type: String,
  mask: String,
  available_balance: Number,
  current_balance: Number,
  iso_currency_code: String,
  routing: String,
  wire_routing: String,
  date_added: {
    type: Date,
    default: Date.now,
  },
});

// Create a unique index on user, account_number, and routing
AccountSchema.index({ user: 1, account_number: 1, routing: 1 }, { unique: true });

module.exports = mongoose.model('Account', AccountSchema);