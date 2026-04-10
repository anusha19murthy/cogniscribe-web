import React, { useState } from 'react';

const WARDS = [
  'General OPD','General Ward','ICU','Emergency','Paediatrics',
  'Gynaecology','Surgery','Orthopaedics','Cardiology','Neurology',
  'Radiology','Psychiatry','ENT','Dermatology','Oncology',
  'Nephrology','Urology','Gastroenterology','Pulmonology',
  'Endocrinology','Other'
];

function Login({ onLogin }) {
  const [form, setForm] = useState({ name: '', clinic: '', ward: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [wardSearch, setWardSearch] = useState('');
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [customWard, setCustomWard] = useState('');
  const [isOther, setIsOther] = useState(false);
  const [isReturning] = useState(() => !!localStorage.getItem('cogniscribe_auth'));

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalWard = isOther ? customWard : form.ward;
    const savedAuth = localStorage.getItem('cogniscribe_auth');

    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      if (form.password !== auth.password) {
        setError('Incorrect password');
        return;
      }
      onLogin({ name: auth.name, clinic: auth.clinic, ward: auth.ward });
      return;
    }

    if (!form.name || !form.clinic || !finalWard || !form.password) {
      setError('Please fill all fields');
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    localStorage.setItem('cogniscribe_auth', JSON.stringify({
      name: form.name,
      clinic: form.clinic,
      ward: finalWard,
      password: form.password
    }));
    onLogin({ name: form.name, clinic: form.clinic, ward: finalWard });
  };

  // Returning user — only password needed
  if (isReturning) {
    const auth = JSON.parse(localStorage.getItem('cogniscribe_auth') || '{}');
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img src={require('../logo.jpeg')} alt="CogniScribe" />
            <p>AI Medical Scribe — Doctor First</p>
          </div>
          {error && <div className="error-banner">{error}</div>}
          <div style={{textAlign:'center', marginBottom:'20px'}}>
            <p style={{fontSize:'16px', fontWeight:'600', color:'#1a1a2e'}}>Welcome back, {auth.name}!</p>
            <p style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>{auth.clinic} — {auth.ward}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Password</label>
              <div style={{position:'relative'}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  style={{paddingRight:'52px'}}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#2563eb',fontSize:'13px',fontWeight:'500'}}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn">Sign In</button>
            <button
              type="button"
              onClick={() => { localStorage.removeItem('cogniscribe_auth'); window.location.reload(); }}
              style={{width:'100%',marginTop:'8px',background:'none',border:'none',color:'#888',fontSize:'13px',cursor:'pointer',padding:'8px'}}
            >
              Not you? Sign in with a different account
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={require('../logo.jpeg')} alt="CogniScribe" />
          <p>AI Medical Scribe — Doctor First</p>
        </div>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor Name</label>
            <input
              type="text"
              placeholder="Dr. Sharma"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Clinic / Hospital Name</label>
            <input
              type="text"
              placeholder="City Medical Clinic"
              value={form.clinic}
              onChange={e => setForm({...form, clinic: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Ward / Department</label>
            <div style={{position:'relative'}}>
              <div
                onClick={() => setShowWardDropdown(!showWardDropdown)}
                style={{width:'100%',padding:'10px 14px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px',cursor:'pointer',background:'white',display:'flex',justifyContent:'space-between',alignItems:'center',color:form.ward?'#1a1a2e':'#aaa'}}
              >
                <span>{isOther ? 'Other' : (form.ward || 'Select ward / department')}</span>
                <span style={{fontSize:'11px',color:'#888'}}>▼</span>
              </div>
              {showWardDropdown && (
                <div style={{position:'absolute',top:'100%',left:0,right:0,background:'white',border:'1px solid #e0e0e0',borderRadius:'8px',zIndex:100,boxShadow:'0 4px 20px rgba(0,0,0,0.1)',maxHeight:'220px',overflow:'hidden',display:'flex',flexDirection:'column'}}>
                  <div style={{padding:'8px'}}>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={wardSearch}
                      onChange={e => setWardSearch(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      autoFocus
                      style={{width:'100%',padding:'7px 10px',border:'1px solid #e0e0e0',borderRadius:'6px',fontSize:'14px',outline:'none'}}
                    />
                  </div>
                  <div style={{overflowY:'auto',maxHeight:'160px'}}>
                    {filteredWards.length === 0 ? (
                      <div style={{padding:'12px 16px',color:'#888',fontSize:'14px'}}>No results</div>
                    ) : (
                      filteredWards.map(w => (
                        <div
                          key={w}
                          onClick={() => handleWardSelect(w)}
                          style={{padding:'10px 16px',cursor:'pointer',fontSize:'14px',color:'#1a1a2e',background:(isOther?'Other':form.ward)===w?'#f0f4ff':'white'}}
                          onMouseEnter={e => e.currentTarget.style.background='#f0f4ff'}
                          onMouseLeave={e => e.currentTarget.style.background=(isOther?'Other':form.ward)===w?'#f0f4ff':'white'}
                        >
                          {w}
                        </div>
                      ))
                    )}
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
                style={{marginTop:'8px',width:'100%',padding:'10px 14px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px',outline:'none'}}
              />
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{position:'relative'}}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                style={{paddingRight:'52px'}}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#2563eb',fontSize:'13px',fontWeight:'500'}}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;