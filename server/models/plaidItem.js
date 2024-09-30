const mongoose = require('mongoose');

const PlaidItemSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  access_token: {
    type: String,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
  },
  institution_id: {  // Add this field
    type: String,
    required: true,
  },
  institution_name: {
    type: String,
    required: true,
  },
  institution_type: {
    type: String,
  },
  date_connected: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PlaidItem', PlaidItemSchema);