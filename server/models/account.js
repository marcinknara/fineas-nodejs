const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  plaid_item_id: {  // Link the account to the Plaid item
    type: String,
    required: true,
  },
  account_id: {  // The Plaid account ID
    type: String,
    required: true,
    unique: true,  // Ensure no duplicates
  },
  name: String,
  official_name: String,
  subtype: String,
  type: String,
  mask: String,
  available_balance: Number,
  current_balance: Number,
  iso_currency_code: String,
  routing: String,  // ACH routing
  wire_routing: String,
  date_added: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Account', AccountSchema);