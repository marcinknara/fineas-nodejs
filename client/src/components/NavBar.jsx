// NavBar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './NavBar.css'; // Import the CSS file for styling

const NavBar = () => {
  const { auth } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Hamburger menu for authenticated users */}
        {auth && (
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
          </div>
        )}
        {/* Login/Signup for unauthenticated users */}
        {!auth && (
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;