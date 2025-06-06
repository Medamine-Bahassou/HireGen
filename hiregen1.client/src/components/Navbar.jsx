import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png'; // Import the logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo HireGen" className="navbar-logo" />
        <span className="app-title">HireGen</span>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Générer une Mission</Link>
        <Link to="/history" className="nav-link">Historique des Missions</Link>
      </div>
    </nav>
  );
};

export default Navbar;
