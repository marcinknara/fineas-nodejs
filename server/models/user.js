const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  plaidItems: [{  // Link to Plaid Items associated with the user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaidItem',
  }],
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);