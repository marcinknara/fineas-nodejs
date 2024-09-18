import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import {usePlaidLink} from 'react-plaid-link';
import FinancialDataTable from '../components/FinancialDataTable'; // Adjust the path as necessary

axios.defaults.baseURL = 'http://localhost:8000';

function PlaidAuth({ publicToken, institutionName, institutionType }) {
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function fetchData() {
      console.log('Fetching data in PlaidAuth useEffect...');
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, please log in again');
      }

      try {
        // Exchange public token for access token
        const accessTokenResponse = await axios.post(
          '/plaid/exchange_public_token',
          { public_token: publicToken, institution_name: institutionName, institution_type: institutionType },
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
  }, [publicToken, institutionName, institutionType]);

  const handleSignOut = () => {
    setAuth(false);
    setToken(null);
    navigate('/login');
  };

  return account && (
    <>
      <h1>Plaid Dashboard</h1>
      <p>Authenticated: {auth ? 'Yes' : 'No'}</p>
      <FinancialDataTable account={account} />
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  );
}

function PlaidLoginPage() {
  const { auth } = useContext(AuthContext);
  const [linkToken, setLinkToken] = useState(null);
  const [publicToken, setPublicToken] = useState(null);
  const [institutionName, setInstitutionName] = useState(null);
  const [institutionType, setInstitutionType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data in PlaidLoginPage useEffect...');

      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, please log in again');
      }

      const response = await axios.post('/plaid/create_link_token', {}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Attach JWT token to request
        }
      });
      setLinkToken(response.data.link_token);
    };

    if (auth) {
      fetchData();
    }
  }, [auth]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log('public_token: ', public_token);
      console.log('metadata: ', metadata);

      const institution_name = metadata.institution.name;  // Extract institution name
      const institution_type = metadata.accounts[0]?.subtype || "Unknown";  // Extract account subtype (e.g., checking, savings)

      // Set the public token and related metadata
      setPublicToken(public_token);
      setInstitutionName(institution_name);
      setInstitutionType(institution_type);
    },
  });

  return publicToken ? (
    <PlaidAuth 
      publicToken={publicToken} 
      institutionName={institutionName} 
      institutionType={institutionType} 
    />
  ) : (
    <button onClick={() => open()} disabled={!ready}>Connect a bank account</button>
  );
}


export default PlaidLoginPage;