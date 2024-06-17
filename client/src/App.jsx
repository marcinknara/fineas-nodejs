// import './App.css'

import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from 'react-plaid-link';

axios.defaults.baseURL = 'http://localhost:8000';

function PlaidAuth({publicToken}){

  const [account, setAccount] = useState(null);

  useEffect(() => {

    async function fetchData() {
      let accessToken = await axios.post('/exchange_public_token', {public_token: publicToken});
      console.log("accessToken: " + JSON.stringify(accessToken.data));

      const auth = await axios.post('/auth', {access_token: accessToken.data.accessToken});
      console.log("auth: " + JSON.stringify(auth.data));
      setAccount(auth.data.numbers.ach[0]);
    }
    fetchData();
  }, []);


  return account && (<><p>Account number: {account.account}</p><p>Routing number: {account.routing}</p></>)
}

function App() {

  const [linkToken, setLinkToken] = useState(null);
  const [publicToken, setPublicToken] = useState(null);


  useEffect(() => {
    async function fetchData() {
      const response = await axios.post('/create_link_token');
      setLinkToken(response.data.link_token);
      console.log("response: " + JSON.stringify(response.data));
    }
    fetchData();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
      console.log("succes: " + public_token, metadata);
      // send public_token to server
    },
  });
  
  return publicToken ? (<PlaidAuth publicToken={publicToken}/>) : (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );

}

export default App
