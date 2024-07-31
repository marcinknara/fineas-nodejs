import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import {usePlaidLink} from 'react-plaid-link';

axios.defaults.baseURL = 'http://localhost:8000';

function PlaidAuth({publicToken}){
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let accessToken = await axios.post('/plaid/exchange_public_token', {public_token: publicToken});
      console.log("accessToken: " + JSON.stringify(accessToken.data));

      const authResponse = await axios.post('/plaid/auth', {access_token: accessToken.data.accessToken});
      console.log("authResponse: " + JSON.stringify(authResponse.data));
      setAccount(authResponse.data.numbers.ach[0]);
    }
    fetchData();
  }, [auth]);

  const handleSignOut = () => {
    setAuth(false);
    setToken(null);
    navigate('/login');
  };

  return account && (
    <>
      <h1>PlaidPage</h1>
      <p>Account number: {account.account}</p>
      <p>Routing number: {account.routing}</p>
      <p>Authenticated: {auth ? 'Yes' : 'No'}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  );

  
}

function PlaidLoginPage() {
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [linkToken, setLinkToken] = useState(null);
  const [publicToken, setPublicToken] = useState();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.post('/plaid/create_link_token');
      setLinkToken(response.data.link_token);
    }

    if (auth) {
      fetchData();
    }
  }, [auth]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log('public_token: ', public_token);
      console.log('metadata: ', metadata);
      setPublicToken(public_token);
    },
  })

  return publicToken ? (<PlaidAuth publicToken={publicToken}/>) : (
    <button onClick={() => open()} disabled={!ready}>Connect a bank account</button>
  );
}

export default PlaidLoginPage;