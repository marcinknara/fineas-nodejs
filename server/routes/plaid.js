const express = require('express');
const router = express.Router();
const plaidClient = require('../config/plaidConfig');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');

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

router.post('/exchange_public_token', authenticateToken, async function (
  request,
  response
) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = plaidResponse.data.access_token;
    // const itemID = response.data.item_id;

    await User.findByIdAndUpdate(request.user._id, {
      plaidAccessToken: accessToken
    });

    // res.json({ public_token_exchange: 'complete' });
    response.json({ accessToken });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    response.status(500).send('Server Error');
  }
});

router.post('/auth', authenticateToken, async function (request, response) {

  try {
    // Fetch the user's Plaid access token from the database
    const user = await User.findById(request.user._id);

    if (!user.plaidAccessToken) {
      return response.status(400).json({ message: "Plaid access token not found" });
    }

    const plaidRequest = {
      access_token: user.plaidAccessToken
    };
    const plaidResponse = await plaidClient.authGet(plaidRequest);
    response.json(plaidResponse.data);
  } catch (error) {
    console.error('Error fetching auth data from Plaid:', error);
    response.status(500).send('Server Error');
  }
});

module.exports = router;