import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Dictation from './components/Dictation';
import NoteDisplay from './components/NoteDisplay';

function App() {
  const [doctor, setDoctor] = useState(() => {
    const saved = localStorage.getItem('cogniscribe_doctor');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (doctorData) => {
    localStorage.setItem('cogniscribe_doctor', JSON.stringify(doctorData));
    setDoctor(doctorData);
  };

  const handleLogout = () => {
    localStorage.removeItem('cogniscribe_doctor');
    setDoctor(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          doctor ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          doctor ? <Dashboard doctor={doctor} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/dictation/:patientId" element={
          doctor ? <Dictation doctor={doctor} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/note" element={
          doctor ? <NoteDisplay doctor={doctor} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
}

export default App;