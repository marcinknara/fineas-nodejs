const mongoose = require('mongoose');

const PlaidItemSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true  // Link to the user who owns this Item
  },
  access_token: {
    type: String,
    required: true,
  },
  item_id: {  // Unique ID for the Item from Plaid
    type: String,
    required: true,
    unique: true,
  },
  institution_name: {  // The name of the financial institution (e.g., Bank of America)
    type: String,
    required: true,
  },
  institution_type: {  // The type of institution (e.g., checking, savings)
    type: String,
  },
  date_connected: {  // Date when the Item was connected
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PlaidItem', PlaidItemSchema);