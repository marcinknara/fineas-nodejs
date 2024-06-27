import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import Dashboard from '../pages/Dashboard';
import { Navigate } from 'react-router-dom';

function AppRoutes() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default AppRoutes;