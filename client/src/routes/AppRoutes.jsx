import { Routes, Route, useLocation  } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import { Navigate } from 'react-router-dom';
import PlaidLoginPage from '../pages/PlaidLoginPage';

function AppRoutes() {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={auth ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/signup" element={auth ? <Navigate to="/dashboard" /> : <SignupPage />} />
      <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/profile" element={auth ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/plaidlogin" element={auth ? <PlaidLoginPage /> : <Navigate to="/login" />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default AppRoutes;