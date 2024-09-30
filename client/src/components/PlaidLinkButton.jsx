import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePlaidLink } from 'react-plaid-link';

function PlaidLinkButton({ onSuccess }) {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in again');
      }

      try {
        // Fetch link token
        const linkTokenResponse = await axios.post('/plaid/create_link_token', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setLinkToken(linkTokenResponse.data.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };

    fetchLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      console.log('public_token:', public_token);
      console.log('metadata:', metadata);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in again');
      }

      try {
        // Exchange public token
        const exchangeResponse = await await axios.post('/plaid/exchange_public_token', {
          public_token,
          institution_name: metadata.institution.name,
          institution_type: metadata.accounts[0]?.subtype || 'Unknown',
          institution_id: metadata.institution.institution_id,  // Include institution_id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Check for a message indicating the institution is already linked
        if (exchangeResponse.data.message === "This institution is already linked to your account.") {
          alert("This institution is already linked to your account.");
          return;
        }

        // Fetch auth data to save accounts
        await axios.post('/plaid/auth', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // Notify parent component to refresh accounts data
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error during Plaid link process:', error);
      }
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>Connect a bank account</button>
  );
}

export default PlaidLinkButton;