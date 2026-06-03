import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingApp from './landing/App';
import SampleViewer from './landing/pages/SampleViewer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Dictation from './components/Dictation';
import NoteDisplay from './components/NoteDisplay';
import PatientHistory from './components/PatientHistory';

function getStoredDoctor() {
  try {
    const raw = localStorage.getItem('cogniscribe_auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [doctor, setDoctor] = useState(getStoredDoctor);

  const handleLogout = (switchAccount = false) => {
    if (switchAccount) localStorage.removeItem('cogniscribe_auth');
    setDoctor(null);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Landing page */}
        <Route path="/" element={<LandingApp />} />
        <Route path="/sample/:type" element={<SampleViewer />} />

        {/* Auth */}
        <Route path="/login" element={<Login onLogin={setDoctor} />} />

        {/* App */}
        <Route path="/dashboard" element={<Dashboard doctor={doctor} onLogout={handleLogout} />} />
        <Route path="/dictation" element={<Dictation  doctor={doctor} onLogout={handleLogout} />} />
        <Route path="/dictation/:id" element={<Dictation doctor={doctor} onLogout={handleLogout} />} />
        <Route path="/note"      element={<NoteDisplay doctor={doctor} onLogout={handleLogout} />} />
        <Route path="/history"   element={<PatientHistory doctor={doctor} onLogout={handleLogout} />} />

      </Routes>
    </BrowserRouter>
  );
}
