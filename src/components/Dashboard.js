import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

function Dashboard({ doctor, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('cogniscribe_patients');
    return saved ? JSON.parse(saved) : {};
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (location.state?.selectedDate) {
      const parts = location.state.selectedDate.split('-');
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (location.state?.selectedDate) {
      const parts = location.state.selectedDate.split('-');
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  });
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', reason: '' });
  const [modalSearch, setModalSearch] = useState('');

  // Right sidebar search state
  const [searchName, setSearchName] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchGender, setSearchGender] = useState('');

  const dateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayPatients = patients[dateKey(selectedDate)] || [];

  // All unique patients
  const allPatients = Object.values(patients).flat().filter((p, index, self) =>
    index === self.findIndex(t => t.id === p.id)
  );

  // Right sidebar search results — auto search
  const rightSidebarResults = allPatients.filter(p => {
    const nameMatch = searchName.trim() === '' || p.name.toLowerCase().includes(searchName.toLowerCase());
    const ageMatch = searchAge.trim() === '' || String(p.age).includes(searchAge.trim());
    const genderMatch = searchGender === '' || p.gender?.toLowerCase() === searchGender.toLowerCase();
    return nameMatch && ageMatch && genderMatch;
  });

  // Modal search
  const modalSearchResults = modalSearch.trim().length > 0
    ? allPatients.filter(p => p.name.toLowerCase().includes(modalSearch.toLowerCase()))
    : [];

  const savePatients = (updated) => {
    setPatients(updated);
    localStorage.setItem('cogniscribe_patients', JSON.stringify(updated));
  };

  const addPatient = () => {
    if (!newPatient.name || !newPatient.reason) return;
    const key = dateKey(selectedDate);
    const updated = { ...patients };
    if (!updated[key]) updated[key] = [];
    const alreadyExists = updated[key].find(p =>
      p.name.toLowerCase() === newPatient.name.toLowerCase()
    );
    if (!alreadyExists) {
      updated[key] = [...updated[key], {
        ...newPatient,
        id: newPatient.id || Date.now().toString(),
        notes: []
      }];
      savePatients(updated);
    }
    setNewPatient({ name: '', age: '', gender: 'Male', reason: '' });
    setModalSearch('');
    setShowModal(false);
  };

  const fillFromExisting = (patient) => {
    setNewPatient({ ...patient, reason: '' });
    setModalSearch('');
  };

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

        {/* LEFT SIDEBAR */}
        <div className="sidebar" style={{overflowY:'auto'}}>
          <div className="sidebar-header">
            <div className="sidebar-title">Patient Appointments</div>
            <button className="register-btn" onClick={() => setShowModal(true)}>
              + Register Patient
            </button>
          </div>

          <div className="patient-list">
            {todayPatients.length === 0 ? (
              <div className="no-patients">
                <p>No appointments for this day.</p>
              </div>
            ) : (
              todayPatients.map(patient => (
                <div
                  key={patient.id}
                  className="patient-item"
                  onClick={() => navigate(`/dictation/${patient.id}`, {
                    state: { patient, dateKey: dateKey(selectedDate) }
                  })}
                >
                  <div className="patient-avatar">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <p>{patient.reason}</p>
                  </div>
                  <div
                    className="patient-menu-trigger"
                    onClick={e => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === patient.id ? null : patient.id);
                    }}
                  >
                    ⋯
                    {activeMenu === patient.id && (
                      <div className="patient-menu" onClick={e => e.stopPropagation()}>
                        <div
                          className="patient-menu-item"
                          onClick={e => {
                            e.stopPropagation();
                            setEditingPatient(JSON.parse(JSON.stringify(patient)));
                            setActiveMenu(null);
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit details
                        </div>
                        <div
                          className="patient-menu-item danger"
                          onClick={e => {
                            e.stopPropagation();
                            const key = dateKey(selectedDate);
                            const updated = { ...patients };
                            updated[key] = updated[key].filter(p => p.id !== patient.id);
                            savePatients(updated);
                            setActiveMenu(null);
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Delete patient
                        </div>
                        <div
                          className="patient-menu-item"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/history/${patient.id}`, {
                              state: { patient, dateKey: dateKey(selectedDate) }
                            });
                            setActiveMenu(null);
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          View past notes
                        </div>
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
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="calendar-day-header">{d}</div>
              ))}
              {getDaysInMonth(currentMonth).map((day, i) => {
                if (!day) return <div key={i} />;
                const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const key = dateKey(d);
                const count = (patients[key] || []).length;
                const isToday = d.toDateString() === today.toDateString();
                const isSelected = d.toDateString() === selectedDate.toDateString();
                let dayClass = 'calendar-day';
                if (isSelected) dayClass += ' selected';
                else if (isToday) dayClass += ' today-unselected';
                return (
                  <div key={i} className={dayClass} onClick={() => setSelectedDate(d)}>
                    {day}
                    {count > 0 && <span className="patient-count-badge">{count}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content" style={{flex:1, overflowY:'auto'}}>
          <div className="no-patient-selected">
            <h2>No patient selected.</h2>
            <p>Select a date from the calendar to see appointments.</p>
          </div>
        </div>

        {/* RIGHT SIDEBAR — Patient Search */}
        <div style={{
          width:'280px', minWidth:'280px', background:'white',
          borderLeft:'1px solid #e0e0e0', overflowY:'auto',
          padding:'16px', display:'flex', flexDirection:'column', gap:'12px'
        }}>
          <div style={{
            fontSize:'12px', fontWeight:'700', color:'#888',
            textTransform:'uppercase', letterSpacing:'0.5px'
          }}>
            Patient Search
          </div>

          {/* Name search */}
          <div style={{position:'relative'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{position:'absolute', left:'9px', top:'50%', transform:'translateY(-50%)'}}>
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              style={{
                width:'100%', padding:'8px 8px 8px 28px',
                border:'1px solid #e0e0e0', borderRadius:'8px',
                fontSize:'13px', outline:'none', boxSizing:'border-box',
                background:'#f8f9fc'
              }}
            />
          </div>

          {/* Age search */}
          <input
            type="number"
            placeholder="Filter by age..."
            value={searchAge}
            onChange={e => setSearchAge(e.target.value)}
            style={{
              width:'100%', padding:'8px 10px',
              border:'1px solid #e0e0e0', borderRadius:'8px',
              fontSize:'13px', outline:'none', boxSizing:'border-box',
              background:'#f8f9fc'
            }}
          />

          {/* Gender filter */}
          <select
            value={searchGender}
            onChange={e => setSearchGender(e.target.value)}
            style={{
              width:'100%', padding:'8px 10px',
              border:'1px solid #e0e0e0', borderRadius:'8px',
              fontSize:'13px', outline:'none', background:'#f8f9fc',
              color: searchGender ? '#1a1a2e' : '#aaa'
            }}
          >
            <option value=''>All genders</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Other'>Other</option>
          </select>

          {/* Clear filters */}
          {(searchName || searchAge || searchGender) && (
            <button
              onClick={() => { setSearchName(''); setSearchAge(''); setSearchGender(''); }}
              style={{
                background:'none', border:'1px solid #e0e0e0',
                borderRadius:'6px', padding:'6px', fontSize:'12px',
                color:'#888', cursor:'pointer'
              }}
            >
              Clear filters
            </button>
          )}

          <div style={{
            borderTop:'1px solid #f0f0f0', paddingTop:'8px',
            fontSize:'11px', color:'#aaa'
          }}>
            {rightSidebarResults.length} patient{rightSidebarResults.length !== 1 ? 's' : ''} found
          </div>

          {/* Results */}
          <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
            {rightSidebarResults.length === 0 ? (
              <div style={{
                textAlign:'center', padding:'24px 0',
                color:'#ccc', fontSize:'13px'
              }}>
                No patients found
              </div>
            ) : (
              rightSidebarResults.map(p => {
                const gc = genderColor(p.gender);
                const patientNotes = JSON.parse(localStorage.getItem('cogniscribe_notes') || '{}')[p.id] || [];
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/history/${p.id}`, {
                      state: { patient: p, dateKey: dateKey(selectedDate) }
                    })}
                    style={{
                      padding:'10px 12px', borderRadius:'10px',
                      border:'1px solid #e8eef8', background:'white',
                      cursor:'pointer', transition:'all 0.15s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f0f4ff';
                      e.currentTarget.style.borderColor = '#2563eb';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e8eef8';
                    }}
                  >
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      <div style={{
                        width:'32px', height:'32px', borderRadius:'50%',
                        background:'#2563eb', color:'white',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'14px', fontWeight:'600', flexShrink:0
                      }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{
                          fontSize:'13px', fontWeight:'600', color:'#1a1a2e',
                          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'
                        }}>
                          {p.name}
                        </div>
                        <div style={{
                          display:'flex', alignItems:'center',
                          gap:'6px', marginTop:'3px'
                        }}>
                          <span style={{fontSize:'11px', color:'#888'}}>{p.age}yr</span>
                          <span style={{
                            fontSize:'10px', padding:'1px 6px',
                            borderRadius:'10px', background:gc.bg, color:gc.color,
                            fontWeight:'500'
                          }}>
                            {p.gender}
                          </span>
                          {patientNotes.length > 0 && (
                            <span style={{
                              fontSize:'10px', padding:'1px 6px',
                              borderRadius:'10px', background:'#f0f4ff',
                              color:'#2563eb', fontWeight:'500'
                            }}>
                              {patientNotes.length} note{patientNotes.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
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
            <div className="form-group">
              <label>Patient Name</label>
              <input value={editingPatient.name} onChange={e => setEditingPatient({...editingPatient, name: e.target.value})} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" value={editingPatient.age} onChange={e => setEditingPatient({...editingPatient, age: e.target.value})} placeholder="Age" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={editingPatient.gender} onChange={e => setEditingPatient({...editingPatient, gender: e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px'}}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason for Visit</label>
              <input value={editingPatient.reason} onChange={e => setEditingPatient({...editingPatient, reason: e.target.value})} placeholder="e.g. Fever and cold" />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditingPatient(null)}>Cancel</button>
              <button className="modal-submit" onClick={() => {
                const key = dateKey(selectedDate);
                const updated = { ...patients };
                updated[key] = updated[key].map(p => p.id === editingPatient.id ? editingPatient : p);
                savePatients(updated);
                setEditingPatient(null);
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setModalSearch(''); setNewPatient({ name: '', age: '', gender: 'Male', reason: '' }); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Register New Patient</h3>

            <div style={{marginBottom:'16px', position:'relative'}}>
              <div style={{position:'relative'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)'}}>
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search existing patients..."
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  style={{width:'100%', padding:'9px 10px 9px 32px', border:'1px solid #e0e0e0', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box', background:'#f8f9fc'}}
                />
                {modalSearch && (
                  <span onClick={() => setModalSearch('')} style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', cursor:'pointer', color:'#aaa', fontSize:'16px'}}>✕</span>
                )}
              </div>
              {modalSearchResults.length > 0 && (
                <div style={{position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e0e0e0', borderRadius:'8px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', zIndex:200, maxHeight:'180px', overflowY:'auto'}}>
                  {modalSearchResults.map(p => (
                    <div key={p.id} onClick={() => fillFromExisting(p)}
                      style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', cursor:'pointer', borderBottom:'1px solid #f5f5f5'}}
                      onMouseEnter={e => e.currentTarget.style.background='#f0f4ff'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}
                    >
                      <div style={{width:'28px', height:'28px', borderRadius:'50%', background:'#2563eb', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'600', flexShrink:0}}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'13px', fontWeight:'500', color:'#1a1a2e'}}>{p.name}</div>
                        <div style={{fontSize:'11px', color:'#888'}}>{p.age}yr {p.gender}</div>
                      </div>
                      <div style={{fontSize:'11px', color:'#2563eb', fontWeight:'500'}}>Fill details</div>
                    </div>
                  ))}
                </div>
              )}
              {modalSearch.trim().length > 0 && modalSearchResults.length === 0 && (
                <div style={{marginTop:'6px', fontSize:'12px', color:'#888', textAlign:'center', padding:'6px'}}>
                  No existing patients — fill details below
                </div>
              )}
            </div>

            <div style={{borderTop:'1px solid #f0f0f0', paddingTop:'14px', fontSize:'11px', color:'#aaa', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px'}}>
              Patient Details
            </div>

            <div className="form-group">
              <label>Patient Name</label>
              <input value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} placeholder="Age" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px'}}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason for Visit</label>
              <input
                value={newPatient.reason}
                onChange={e => setNewPatient({...newPatient, reason: e.target.value})}
                placeholder="e.g. Fever and cold"
                style={{border: newPatient.name && !newPatient.reason ? '1px solid #f59e0b' : '1px solid #e0e0e0'}}
              />
              {newPatient.name && !newPatient.reason && (
                <div style={{fontSize:'11px', color:'#f59e0b', marginTop:'4px'}}>Please enter reason for today's visit</div>
              )}
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setModalSearch(''); setNewPatient({ name: '', age: '', gender: 'Male', reason: '' }); }}>Cancel</button>
              <button className="modal-submit" onClick={addPatient}>Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;