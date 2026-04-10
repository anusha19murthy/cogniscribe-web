import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Dashboard({ doctor, onLogout }) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('cogniscribe_patients');
    return saved ? JSON.parse(saved) : {};
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', reason: '' });

  const dateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayPatients = patients[dateKey(selectedDate)] || [];

  const savePatients = (updated) => {
    setPatients(updated);
    localStorage.setItem('cogniscribe_patients', JSON.stringify(updated));
  };

  const addPatient = () => {
    if (!newPatient.name || !newPatient.reason) return;
    const key = dateKey(selectedDate);
    const updated = { ...patients };
    if (!updated[key]) updated[key] = [];
    updated[key] = [...updated[key], {
      ...newPatient,
      id: Date.now().toString(),
      notes: []
    }];
    savePatients(updated);
    setNewPatient({ name: '', age: '', gender: 'Male', reason: '' });
    setShowModal(false);
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

  return (
    <div onClick={() => setActiveMenu(null)}>
      <Navbar doctor={doctor} onLogout={onLogout} />

      <div className="app-layout">
        <div className="sidebar">
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
                            const patientCopy = JSON.parse(JSON.stringify(patient));
                            setEditingPatient(patientCopy);
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
                            const notes = JSON.parse(localStorage.getItem('cogniscribe_notes') || '{}');
                            const patientNotes = notes[patient.id] || [];
                            alert(patientNotes.length > 0
                              ? `${patient.name} has ${patientNotes.length} saved note(s).`
                              : `No saved notes for ${patient.name} yet.`
                            );
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

        <div className="main-content">
          <div className="no-patient-selected">
            <h2>No patient selected.</h2>
            <p>Select a date from the calendar to see appointments.</p>
          </div>
        </div>
      </div>

      {/* EDIT PATIENT MODAL */}
      {editingPatient && (
        <div className="modal-overlay" onClick={() => setEditingPatient(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Patient Details</h3>
            <div className="form-group">
              <label>Patient Name</label>
              <input
                value={editingPatient.name}
                onChange={e => setEditingPatient({...editingPatient, name: e.target.value})}
                placeholder="Full name"
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={editingPatient.age}
                onChange={e => setEditingPatient({...editingPatient, age: e.target.value})}
                placeholder="Age"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                value={editingPatient.gender}
                onChange={e => setEditingPatient({...editingPatient, gender: e.target.value})}
                style={{width:'100%',padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px'}}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason for Visit</label>
              <input
                value={editingPatient.reason}
                onChange={e => setEditingPatient({...editingPatient, reason: e.target.value})}
                placeholder="e.g. Fever and cold"
              />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditingPatient(null)}>Cancel</button>
              <button className="modal-submit" onClick={() => {
                const key = dateKey(selectedDate);
                const updated = { ...patients };
                updated[key] = updated[key].map(p =>
                  p.id === editingPatient.id ? editingPatient : p
                );
                savePatients(updated);
                setEditingPatient(null);
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER PATIENT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Register New Patient</h3>
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
              <input value={newPatient.reason} onChange={e => setNewPatient({...newPatient, reason: e.target.value})} placeholder="e.g. Fever and cold" />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-submit" onClick={addPatient}>Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;