import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Profile() {
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setAuth(false);
    setToken(null);
    navigate('/login');
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {auth.email}</p>
      <p>Authenticated: {auth ? 'Yes' : 'No'}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default Profile;