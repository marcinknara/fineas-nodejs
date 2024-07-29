import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function PlaidLoginPage() {
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const publicToken = "your_public_token_here"; // Replace with actual token retrieval logic
    async function fetchPlaidData() {
      let accessToken = await axios.post('/plaid/exchange_public_token', { public_token: publicToken });
      console.log("accessToken: " + JSON.stringify(accessToken.data));

      const authResponse = await axios.post('/plaid/auth', { access_token: accessToken.data.accessToken });
      console.log("auth: " + JSON.stringify(authResponse.data));
      setAccount(authResponse.data.numbers.ach[0]);
    }

    if (auth) {
      fetchPlaidData();
    }
  }, [auth]);

  const handleSignOut = () => {
    setAuth(false);
    setToken(null);
    navigate('/login');
  };

  return (
    <div>
      <h1>PlaidLoginPage</h1>
      {account ? (
        <>
          <p>Account number: {account.account}</p>
          <p>Routing number: {account.routing}</p>
        </>
      ) : (
        <p>Loading account information...</p>
      )}
      <p>Authenticated: {auth ? 'Yes' : 'No'}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default PlaidLoginPage;