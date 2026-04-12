import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ doctor, onLogout, onHamburger }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

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
        <button className="hamburger" onClick={onHamburger || (() => navigate('/dashboard'))}>☰</button>
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
        <div style={{position:'relative'}}>
          <button className="logout-btn" onClick={() => setShowLogoutMenu(!showLogoutMenu)}>
            Sign Out ▾
          </button>
          {showLogoutMenu && (
            <div style={{
              position:'absolute', top:'100%', right:0,
              background:'white', border:'1px solid #e0e0e0',
              borderRadius:'8px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)',
              minWidth:'200px', zIndex:200, overflow:'hidden',
              marginTop:'4px'
            }}>
              <div
                onClick={() => { setShowLogoutMenu(false); onLogout(false); }}
                style={{padding:'12px 16px', cursor:'pointer', fontSize:'14px', color:'#1a1a2e', borderBottom:'1px solid #f0f0f0'}}
                onMouseEnter={e => e.currentTarget.style.background='#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.background='white'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </div>
              <div
                onClick={() => { setShowLogoutMenu(false); onLogout(true); }}
                style={{padding:'12px 16px', cursor:'pointer', fontSize:'14px', color:'#666'}}
                onMouseEnter={e => e.currentTarget.style.background='#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.background='white'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Sign in with different account
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;