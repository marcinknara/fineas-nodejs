import{ useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import {usePlaidLink} from 'react-plaid-link';
import FinancialDataTable from '../components/FinancialDataTable'; // Adjust the path as necessary

axios.defaults.baseURL = 'http://localhost:8000';

function PlaidAuth({publicToken}){
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let accessToken = await axios.post('/plaid/exchange_public_token', {public_token: publicToken});
      console.log("accessToken: " + JSON.stringify(accessToken.data));

      const authResponse = await axios.post('/plaid/auth', {access_token: accessToken.data.accessToken});
      console.log("authResponse: " + JSON.stringify(authResponse.data));
      setAccounts({accounts: authResponse.data.accounts});    }
    fetchData();
  }, [publicToken]);

  const handleSignOut = () => {
    setAuth(false);
    setToken(null);
    navigate('/login');
  };

  return accounts && (
    <>
      <h1>Plaid Dashboard</h1>
      <p>Account number: {accounts.account}</p>
      <p>Routing number: {accounts.routing}</p>
      <p>Authenticated: {auth ? 'Yes' : 'No'}</p>
      <FinancialDataTable accounts={accounts} />
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