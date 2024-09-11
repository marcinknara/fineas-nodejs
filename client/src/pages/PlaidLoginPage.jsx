import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import {usePlaidLink} from 'react-plaid-link';
import FinancialDataTable from '../components/FinancialDataTable'; // Adjust the path as necessary

axios.defaults.baseURL = 'http://localhost:8000';

function PlaidAuth({publicToken}){
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, please log in again');
      }

      try {
        // Exchange public token for access token
        const accessTokenResponse = await axios.post(
          '/plaid/exchange_public_token',
          { public_token: publicToken },
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Attach JWT token to request
            },
          }
        );

        const accessToken = accessTokenResponse.data.accessToken;
        console.log("Access Token: ", accessToken);

      

        // Call /plaid/auth to retrieve account data using the access token
        const authResponse = await axios.post(
          '/plaid/auth',
          { access_token: accessToken },
          {
            headers: {
              'Authorization': `Bearer ${token}`,  // Attach JWT token
            },
          }
        );


        console.log("Auth Response: ", authResponse.data);
        setAccount({ accounts: authResponse.data.accounts });
      } catch (error) {
        console.error('Error during fetching data:', error);
      }
    }
    fetchData();
  }, [publicToken]);

  const handleSignOut = () => {
    setAuth(false);
    setToken(null);
    navigate('/login');
  };

  return account && (
    <>
      <h1>Plaid Dashboard</h1>
      <p>Account number: {account.account}</p>
      <p>Routing number: {account.routing}</p>
      <p>Authenticated: {auth ? 'Yes' : 'No'}</p>
      <FinancialDataTable account={account} />
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
    const fetchData = async () => {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, please log in again');
      }

      const response = await axios.post('/plaid/create_link_token', {}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Attach JWT token to request
        }
      } );
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