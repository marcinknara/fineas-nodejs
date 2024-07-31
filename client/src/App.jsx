import React, { createContext, useState } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
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