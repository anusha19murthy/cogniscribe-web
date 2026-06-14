
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
const BACKEND = 'https://cogniscribe-backend.onrender.com';

const WARDS = [
  'General OPD','General Ward','ICU','Emergency','Paediatrics',
  'Gynaecology','Surgery','Orthopaedics','Cardiology','Neurology',
  'Radiology','Psychiatry','ENT','Dermatology','Oncology',
  'Nephrology','Urology','Gastroenterology','Pulmonology',
  'Endocrinology','Other'
];

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', clinic: '', ward: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [wardSearch, setWardSearch] = useState('');
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [customWard, setCustomWard] = useState('');
  const [isOther, setIsOther] = useState(false);

  // Wake up Render backend on page load
useEffect(() => {
  fetch(`${BACKEND}/health`).catch(() => {});
}, []);

  const storedAuth = localStorage.getItem('cogniscribe_auth');
  const isReturning = !!storedAuth;
  const returnAuth = storedAuth ? JSON.parse(storedAuth) : null;

  const filteredWards = WARDS.filter(w =>
    w.toLowerCase().includes(wardSearch.toLowerCase())
  );

  const handleWardSelect = (ward) => {
    if (ward === 'Other') {
      setIsOther(true);
      setForm({ ...form, ward: '' });
    } else {
      setIsOther(false);
      setForm({ ...form, ward });
    }
    setShowWardDropdown(false);
    setWardSearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const finalWard = isOther ? customWard : form.ward;

    try {
      if (mode === 'register') {
        if (!form.name || !form.clinic || !finalWard || !form.email || !form.password) {
          setError('Please fill all fields');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const registerRes = await fetch(`${BACKEND}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            full_name: form.name,
          }),
        });

        if (!registerRes.ok) {
          const err = await registerRes.json();
          setError(err.detail || 'Registration failed');
          setLoading(false);
          return;
        }
      }

      if (!form.email || !form.password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      const loginRes = await fetch(`${BACKEND}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!loginRes.ok) {
        const err = await loginRes.json();
        setError(err.detail || 'Incorrect email or password');
        setLoading(false);
        return;
      }

      const data = await loginRes.json();

      localStorage.setItem('cogniscribe_token', data.access_token);
      localStorage.setItem('cogniscribe_auth', JSON.stringify({
        name: form.name || data.user.full_name,
        clinic: form.clinic || returnAuth?.clinic || '',
        ward: finalWard || returnAuth?.ward || '',
        email: data.user.email,
        id: data.user.id,
      }));

      if (onLogin) onLogin({
        name: form.name || data.user.full_name,
        clinic: form.clinic || returnAuth?.clinic || '',
        ward: finalWard || returnAuth?.ward || '',
        email: data.user.email,
      });

      navigate('/dashboard');

    } catch (err) {
      setError('Cannot reach server. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  // ── RETURNING USER VIEW ──
  if (isReturning && mode === 'login') {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img src={require('../logo.jpeg')} alt="CogniScribe" />
            <p>AI Medical Scribe — Doctor First</p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#2563eb', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: 700,
              margin: '0 auto 12px',
            }}>
              {returnAuth?.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
              Welcome back, {returnAuth?.name}!
            </p>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
              {returnAuth?.clinic} {returnAuth?.ward ? `— ${returnAuth.ward}` : ''}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder={returnAuth?.email || 'doctor@hospital.com'}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '52px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#2563eb',
                    fontSize: '13px', fontWeight: '500'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('cogniscribe_auth');
                localStorage.removeItem('cogniscribe_token');
                setMode('login');
                window.location.reload();
              }}
              style={{
                width: '100%', marginTop: '8px', background: 'none',
                border: 'none', color: '#888', fontSize: '13px',
                cursor: 'pointer', padding: '8px'
              }}
            >
              Not you? Sign in with a different account
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── NEW USER VIEW ──
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={require('../logo.jpeg')} alt="CogniScribe" />
          <p>AI Medical Scribe — Doctor First</p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: '#f0f4ff',
          borderRadius: 8, padding: 4, marginBottom: 24,
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: 6,
              fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              background: mode === 'login' ? 'white' : 'transparent',
              color: mode === 'login' ? '#2563eb' : '#888',
              boxShadow: mode === 'login' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: 6,
              fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              background: mode === 'register' ? 'white' : 'transparent',
              color: mode === 'register' ? '#2563eb' : '#888',
              boxShadow: mode === 'register' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Register
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Doctor Name</label>
                <input
                  type="text"
                  placeholder="Dr. Sharma"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Clinic / Hospital Name</label>
                <input
                  type="text"
                  placeholder="City Medical Clinic"
                  value={form.clinic}
                  onChange={e => setForm({ ...form, clinic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Ward / Department</label>
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowWardDropdown(!showWardDropdown)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1px solid #e0e0e0', borderRadius: '8px',
                      fontSize: '15px', cursor: 'pointer', background: 'white',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', color: form.ward ? '#1a1a2e' : '#aaa'
                    }}
                  >
                    <span>{isOther ? 'Other' : (form.ward || 'Select ward / department')}</span>
                    <span style={{ fontSize: '11px', color: '#888' }}>▼</span>
                  </div>
                  {showWardDropdown && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'white', border: '1px solid #e0e0e0',
                      borderRadius: '8px', zIndex: 100,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      maxHeight: '220px', overflow: 'hidden',
                      display: 'flex', flexDirection: 'column'
                    }}>
                      <div style={{ padding: '8px' }}>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={wardSearch}
                          onChange={e => setWardSearch(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          autoFocus
                          style={{
                            width: '100%', padding: '7px 10px',
                            border: '1px solid #e0e0e0', borderRadius: '6px',
                            fontSize: '14px', outline: 'none'
                          }}
                        />
                      </div>
                      <div style={{ overflowY: 'auto', maxHeight: '160px' }}>
                        {filteredWards.map(w => (
                          <div
                            key={w}
                            onClick={() => handleWardSelect(w)}
                            style={{
                              padding: '10px 16px', cursor: 'pointer',
                              fontSize: '14px', color: '#1a1a2e',
                              background: form.ward === w ? '#f0f4ff' : 'white'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                            onMouseLeave={e => e.currentTarget.style.background = form.ward === w ? '#f0f4ff' : 'white'}
                          >
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {isOther && (
                  <input
                    type="text"
                    placeholder="Type your ward / department"
                    value={customWard}
                    onChange={e => setCustomWard(e.target.value)}
                    style={{
                      marginTop: '8px', width: '100%', padding: '10px 14px',
                      border: '1px solid #e0e0e0', borderRadius: '8px',
                      fontSize: '15px', outline: 'none'
                    }}
                  />
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="doctor@hospital.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: '52px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: '#2563eb',
                  fontSize: '13px', fontWeight: '500'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;