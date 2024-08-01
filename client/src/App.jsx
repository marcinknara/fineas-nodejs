import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="556616736329-346n974q14mhke2lkseq0id50k3lumpk.apps.googleusercontent.com">
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
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