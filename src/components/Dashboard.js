import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const BACKEND = 'https://aims-production-3ac3.up.railway.app';

function Dashboard({ doctor, onLogout }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('cogniscribe_token');

  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', reason: '' });
  const [modalSearch, setModalSearch] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchGender, setSearchGender] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load patients');
      setAllPatients(await res.json());
    } catch (err) {
      setError('Could not load patients. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.reason) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    try {
      const res = await fetch(`${BACKEND}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newPatient.name,
          age: newPatient.age ? parseInt(newPatient.age, 10) : null,
          gender: newPatient.gender,
          contact: newPatient.reason
        })
      });
      if (!res.ok) throw new Error('Failed to add patient');
      await fetchPatients();
    } catch (err) {
      setError('Could not register patient. Please try again.');
    }
    setNewPatient({ name: '', age: '', gender: 'Male', reason: '' });
    setModalSearch('');
    setShowModal(false);
    setShowValidation(false);
  };

  const deletePatient = async (patientId) => {
    try {
      const res = await fetch(`${BACKEND}/patients/${patientId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete patient');
      await fetchPatients();
    } catch (err) {
      setError('Could not delete patient. Please try again.');
    }
  };

  const fillFromExisting = (patient) => {
    setNewPatient({ ...patient, reason: '' });
    setModalSearch('');
  };

  const dateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const rightSidebarResults = allPatients.filter(p => {
    const nameMatch = searchName.trim() === '' || p.name.toLowerCase().includes(searchName.toLowerCase());
    const ageMatch = searchAge.trim() === '' || String(p.age).includes(searchAge.trim());
    const genderMatch = searchGender === '' || p.gender?.toLowerCase() === searchGender.toLowerCase();
    return nameMatch && ageMatch && genderMatch;
  });

  const modalSearchResults = modalSearch.trim().length > 0
    ? allPatients.filter(p => p.name.toLowerCase().includes(modalSearch.toLowerCase()))
    : [];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const today = new Date();

  const genderColor = (gender) => {
    if (gender?.toLowerCase() === 'male') return { bg: '#eff6ff', color: '#2563eb' };
    if (gender?.toLowerCase() === 'female') return { bg: '#fdf2f8', color: '#db2777' };
    return { bg: '#f0fdf4', color: '#16a34a' };
  };

  return (
    <div onClick={() => setActiveMenu(null)}>
      <Navbar doctor={doctor} onLogout={onLogout} />
      <div style={{display:'flex', height:'calc(100vh - 57px)'}}>
        <div className="sidebar" style={{overflowY:'auto'}}>
          <div className="sidebar-header">
            <div className="sidebar-title">Patient Appointments</div>
            <button className="register-btn" onClick={() => setShowModal(true)}>+ Register Patient</button>
          </div>
          {error && <div style={{padding:'10px 16px', color:'#dc2626', fontSize:'13px'}}>{error}</div>}
          <div className="patient-list">
            {loading ? (
              <div className="no-patients"><p>Loading patients...</p></div>
            ) : allPatients.length === 0 ? (
              <div className="no-patients"><p>No patients yet.</p></div>
            ) : (
              allPatients.map(patient => (
                <div key={patient.id} className="patient-item"
                  onClick={() => navigate(`/dictation/${patient.id}`, { state: { patient, dateKey: dateKey(selectedDate) } })}>
                  <div className="patient-avatar">{patient.name.charAt(0).toUpperCase()}</div>
                  <div className="patient-info"><h4>{patient.name}</h4><p>{patient.contact}</p></div>
                  <div className="patient-menu-trigger" onClick={e => { e.stopPropagation(); setActiveMenu(activeMenu === patient.id ? null : patient.id); }}>
                    ⋯
                    {activeMenu === patient.id && (
                      <div className="patient-menu" onClick={e => e.stopPropagation()}>
                        <div className="patient-menu-item" onClick={e => { e.stopPropagation(); setEditingPatient(JSON.parse(JSON.stringify(patient))); setActiveMenu(null); }}>Edit details</div>
                        <div className="patient-menu-item danger" onClick={e => { e.stopPropagation(); deletePatient(patient.id); setActiveMenu(null); }}>Delete patient</div>
                        <div className="patient-menu-item" onClick={e => { e.stopPropagation(); navigate(`/history/${patient.id}`, { state: { patient, dateKey: dateKey(selectedDate) } }); setActiveMenu(null); }}>View past notes</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="calendar-section">
            <div className="calendar-title">Appointment Calendar</div>
            <div className="calendar-nav">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>{'<'}</button>
              <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>{'>'}</button>
            </div>
            <div className="calendar-grid">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
              {getDaysInMonth(currentMonth).map((day, i) => {
                if (!day) return <div key={i} />;
                const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isToday = d.toDateString() === today.toDateString();
                const isSelected = d.toDateString() === selectedDate.toDateString();
                let dayClass = 'calendar-day';
                if (isSelected) dayClass += ' selected';
                else if (isToday) dayClass += ' today-unselected';
                return <div key={i} className={dayClass} onClick={() => setSelectedDate(d)}>{day}</div>;
              })}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#aaa', borderTop: '1px solid #f0f0f0', marginTop: '12px' }}>
            <a href="mailto:anusha19murthy@gmail.com?subject=CogniScribe Issue Report&body=Describe what happened:%0A%0A" style={{ color: '#aaa', textDecoration: 'none' }}>
              Report an Issue
            </a>
          </div>
        </div>
        <div className="main-content" style={{flex:1, overflowY:'auto'}}>
          <div className="no-patient-selected"><h2>No patient selected.</h2><p>Select a patient from the list to begin.</p></div>
        </div>
        <div style={{ width:'280px', minWidth:'280px', background:'white', borderLeft:'1px solid #e0e0e0', overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ fontSize:'12px', fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:'0.5px' }}>Patient Search</div>
          <input type="text" placeholder="Search by name..." value={searchName} onChange={e => setSearchName(e.target.value)}
            style={{ width:'100%', padding:'8px', border:'1px solid #e0e0e0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box', background:'#f8f9fc' }} />
          <input type="number" placeholder="Filter by age..." value={searchAge} onChange={e => setSearchAge(e.target.value)}
            style={{ width:'100%', padding:'8px 10px', border:'1px solid #e0e0e0', borderRadius:'8px', fontSize:'13px', outline:'none', boxSizing:'border-box', background:'#f8f9fc' }} />
          <select value={searchGender} onChange={e => setSearchGender(e.target.value)}
            style={{ width:'100%', padding:'8px 10px', border:'1px solid #e0e0e0', borderRadius:'8px', fontSize:'13px', outline:'none', background:'#f8f9fc', color: searchGender ? '#1a1a2e' : '#aaa' }}>
            <option value=''>All genders</option><option value='Male'>Male</option><option value='Female'>Female</option><option value='Other'>Other</option>
          </select>
          {(searchName || searchAge || searchGender) && (
            <button onClick={() => { setSearchName(''); setSearchAge(''); setSearchGender(''); }}
              style={{ background:'none', border:'1px solid #e0e0e0', borderRadius:'6px', padding:'6px', fontSize:'12px', color:'#888', cursor:'pointer' }}>Clear filters</button>
          )}
          <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:'8px', fontSize:'11px', color:'#aaa' }}>
            {rightSidebarResults.length} patient{rightSidebarResults.length !== 1 ? 's' : ''} found
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
            {rightSidebarResults.length === 0 ? (
              <div style={{ textAlign:'center', padding:'24px 0', color:'#ccc', fontSize:'13px' }}>No patients found</div>
            ) : (
              rightSidebarResults.map(p => {
                const gc = genderColor(p.gender);
                return (
                  <div key={p.id} onClick={() => navigate(`/history/${p.id}`, { state: { patient: p, dateKey: dateKey(selectedDate) } })}
                    style={{ padding:'10px 12px', borderRadius:'10px', border:'1px solid #e8eef8', background:'white', cursor:'pointer' }}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#2563eb', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'600', flexShrink:0 }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{ fontSize:'13px', fontWeight:'600', color:'#1a1a2e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'3px' }}>
                          <span style={{fontSize:'11px', color:'#888'}}>{p.age}yr</span>
                          <span style={{ fontSize:'10px', padding:'1px 6px', borderRadius:'10px', background:gc.bg, color:gc.color, fontWeight:'500' }}>{p.gender}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {editingPatient && (
        <div className="modal-overlay" onClick={() => setEditingPatient(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Patient Details</h3>
            <div className="form-group"><label>Patient Name</label>
              <input value={editingPatient.name} onChange={e => setEditingPatient({...editingPatient, name: e.target.value})} placeholder="Full name" />
            </div>
            <div className="form-group"><label>Age</label>
              <input type="number" value={editingPatient.age || ''} onChange={e => setEditingPatient({...editingPatient, age: e.target.value})} placeholder="Age" />
            </div>
            <div className="form-group"><label>Gender</label>
              <select value={editingPatient.gender} onChange={e => setEditingPatient({...editingPatient, gender: e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px'}}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="form-group"><label>Reason for Visit</label>
              <input value={editingPatient.contact || ''} onChange={e => setEditingPatient({...editingPatient, contact: e.target.value})} placeholder="e.g. Fever and cold" />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditingPatient(null)}>Cancel</button>
              <button className="modal-submit" onClick={async () => {
                try {
                  const res = await fetch(`${BACKEND}/patients/${editingPatient.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                      name: editingPatient.name,
                      age: editingPatient.age ? parseInt(editingPatient.age, 10) : null,
                      gender: editingPatient.gender,
                      contact: editingPatient.contact
                    })
                  });
                  if (!res.ok) throw new Error('Failed to update patient');
                  await fetchPatients();
                } catch (err) {
                  setError('Could not save changes. Please try again.');
                } finally {
                  setEditingPatient(null);
                }
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setModalSearch(''); setNewPatient({ name: '', age: '', gender: 'Male', reason: '' }); setShowValidation(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Register New Patient</h3>

            <div style={{marginBottom:'16px', position:'relative'}}>
              <input type="text" placeholder="Search existing patients..." value={modalSearch} onChange={e => setModalSearch(e.target.value)}
                style={{width:'100%', padding:'9px 10px', border:'1px solid #e0e0e0', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box', background:'#f8f9fc'}} />
              {modalSearchResults.length > 0 && (
                <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e0e0e0', borderRadius:'8px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', zIndex:200, maxHeight:'180px', overflowY:'auto'}}>
                  {modalSearchResults.map(p => (
                    <div key={p.id} onClick={() => fillFromExisting(p)} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', cursor:'pointer', borderBottom:'1px solid #f5f5f5'}}>
                      <div style={{width:'28px', height:'28px', borderRadius:'50%', background:'#2563eb', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'600', flexShrink:0}}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'13px', fontWeight:'500', color:'#1a1a2e'}}>{p.name}</div>
                        <div style={{fontSize:'11px', color:'#888'}}>{p.age}yr {p.gender}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Patient Name</label>
              <input
                value={newPatient.name}
                onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                placeholder="Full name"
                style={{border: showValidation && !newPatient.name ? '1px solid #ef4444' : '1px solid #e0e0e0'}}
              />
              {showValidation && !newPatient.name && (
                <div style={{fontSize:'11px', color:'#ef4444', marginTop:'4px'}}>Patient name is required</div>
              )}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={newPatient.age}
                onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                placeholder="Age"
                style={{border: showValidation && !newPatient.age ? '1px solid #ef4444' : '1px solid #e0e0e0'}}
              />
              {showValidation && !newPatient.age && (
                <div style={{fontSize:'11px', color:'#ef4444', marginTop:'4px'}}>Age is required</div>
              )}
            </div>

            <div className="form-group"><label>Gender</label>
              <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px'}}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reason for Visit</label>
              <input
                value={newPatient.reason}
                onChange={e => setNewPatient({...newPatient, reason: e.target.value})}
                placeholder="e.g. Fever and cold"
                style={{border: showValidation && !newPatient.reason ? '1px solid #ef4444' : '1px solid #e0e0e0'}}
              />
              {showValidation && !newPatient.reason && (
                <div style={{fontSize:'11px', color:'#ef4444', marginTop:'4px'}}>Reason for visit is required</div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setModalSearch(''); setNewPatient({ name: '', age: '', gender: 'Male', reason: '' }); setShowValidation(false); }}>Cancel</button>
              <button className="modal-submit" onClick={addPatient}>Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;