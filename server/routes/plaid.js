const express = require('express');
const router = express.Router();
const plaidClient = require('../config/plaidConfig');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');
const PlaidItem = require('../models/plaidItem');
const Account = require('../models/account');  // Import the Account model

router.post('/create_link_token', authenticateToken, async function (request, response) {
  // Get the client_user_id by searching for the current user
  // const user = await User.find(...);
  // const clientUserId = user.id;
  try{
    const plaidRequest = {
      user: {
        client_user_id: request.user._id.toString(),
      },
      client_name: 'Fineas',
      products: ['auth'],
      language: 'en',
      redirect_uri: 'http://localhost:5173/',
      country_codes: ['US'],
    };
  
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    response.status(500).send('Server Error');
  }
});

router.post('/exchange_public_token', authenticateToken, async function (request, response) {
  const { public_token, institution_name, institution_type } = request.body;

  console.log("Received public_token: ", public_token);
  console.log("Received institution_name: ", institution_name);
  console.log("Received institution_type: ", institution_type);

  if (!public_token || !institution_name || !institution_type) {
    return response.status(400).json({ message: 'Public token, institution name, and institution type are required' });
  }

  try {
    // Exchange public token for an access token and item_id
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token
    });

    const accessToken = plaidResponse.data.access_token;
    const itemId = plaidResponse.data.item_id;

    // Check if this user already has a PlaidItem with the same institution name or item_id
    let plaidItem = await PlaidItem.findOne({ 
      user: request.user._id, 
      $or: [
        { item_id: itemId }, 
        { institution_name: institution_name }
      ] 
    });

    if (plaidItem) {
      // Update the existing item if it already exists
      plaidItem.access_token = accessToken;
      plaidItem.institution_type = institution_type;
      await plaidItem.save();  // Save updated item

      return response.json({ message: "Item updated successfully", accessToken });
    } else {
      // If no matching item found, create a new one
      plaidItem = new PlaidItem({
        user: request.user._id,
        access_token: accessToken,
        item_id: itemId,
        institution_name: institution_name,
        institution_type: institution_type,
      });

      await plaidItem.save();  // Save the new item

      // Add the new PlaidItem to the User's plaidItems array if it's not already there
      await User.findByIdAndUpdate(
        request.user._id,
        { $addToSet: { plaidItems: plaidItem._id } },  // $addToSet ensures no duplicates
      );

      return response.json({ message: "Item connected successfully", accessToken });
    }
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return response.status(500).send('Server Error');
  }
});


router.post('/auth', authenticateToken, async function (request, response) {
  try {
    // Fetch the user's Plaid items
    const plaidItems = await PlaidItem.find({ user: request.user._id });

    if (plaidItems.length === 0) {
      return response.status(400).json({ message: "No Plaid access tokens found for user" });
    }

    const allAccountsData = [];

    // Loop through each Plaid item and fetch account data
    for (const item of plaidItems) {
      const plaidRequest = { access_token: item.access_token };
      const plaidResponse = await plaidClient.authGet(plaidRequest);
      const accounts = plaidResponse.data.accounts;
      
      // Save each account in the database
      for (const account of accounts) {
        const achDetails = plaidResponse.data.numbers.ach.find(n => n.account_id === account.account_id);

        const accountData = {
          user: request.user._id,
          plaid_item_id: item.item_id,
          account_id: account.account_id,
          name: account.name,
          official_name: account.official_name,
          subtype: account.subtype,
          type: account.type,
          mask: account.mask,
          available_balance: account.balances.available,
          current_balance: account.balances.current,
          iso_currency_code: account.balances.iso_currency_code,
          routing: achDetails?.routing,
          wire_routing: achDetails?.wire_routing,
        };

        // Upsert the account in the database (update if exists, insert if not)
        await Account.findOneAndUpdate(
          { account_id: account.account_id },
          accountData,
          { upsert: true, new: true }
        );
      }

      allAccountsData.push(...accounts);
    }

    response.json({ accounts: allAccountsData });
  } catch (error) {
    console.error('Error fetching auth data from Plaid:', error);
    response.status(500).send('Server Error');
  }
});

module.exports = router;