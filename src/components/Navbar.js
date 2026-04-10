import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ doctor, onLogout }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const formatDate = (date) => date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }).toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={() => navigate('/dashboard')}>☰</button>
        <div className="navbar-logo">
          <img src={require('../logo.jpeg')} alt="CogniScribe" />
          <span className="navbar-greeting">Hello, {doctor.name}!</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-time-block">
          <span className="navbar-time">{formatTime(time)}</span>
          <span className="navbar-date">{formatDate(time)}</span>
        </div>
        <div className="navbar-divider" />
        <div className="navbar-doctor-block">
          <span className="navbar-doctor-name">{doctor.name}</span>
          <span className="navbar-doctor-ward">{doctor.ward}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;