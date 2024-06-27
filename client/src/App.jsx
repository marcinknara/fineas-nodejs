import React, { createContext, useState } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

import { usePlaidLink } from 'react-plaid-link';

axios.defaults.baseURL = 'http://localhost:8000';

// function PlaidAuth({publicToken}){

//   const [account, setAccount] = useState(null);

//   useEffect(() => {

//     async function fetchData() {
//       let accessToken = await axios.post('/plaid/exchange_public_token', {public_token: publicToken});
//       console.log("accessToken: " + JSON.stringify(accessToken.data));

//       const auth = await axios.post('/plaid/auth', {access_token: accessToken.data.accessToken});
//       console.log("auth: " + JSON.stringify(auth.data));
//       setAccount(auth.data.numbers.ach[0]);
//     }
//     fetchData();
//   }, []);


//   return account && (<><p>Account number: {account.account}</p><p>Routing number: {account.routing}</p></>)
// }

function App() {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth, token, setToken }}>
      <Router>
        <AppRoutes />
      </Router>
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children, ...rest }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    navigate('/login');
    return null;
  }

  return (
    <Route {...rest}>
      {children}
    </Route>
  );
}

export default App;