import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
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

function hasValidToken() {
  return !!localStorage.getItem('cogniscribe_token');
}

function AppRoutes() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(getStoredDoctor);

  const handleLogout = () => {
    localStorage.removeItem('cogniscribe_auth');
    localStorage.removeItem('cogniscribe_token');
    setDoctor(null);
    navigate('/login');
  };

  function ProtectedRoute({ children }) {
    if (!hasValidToken()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login onLogin={setDoctor} />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard doctor={doctor} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/dictation" element={
        <ProtectedRoute>
          <Dictation doctor={doctor} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/dictation/:id" element={
        <ProtectedRoute>
          <Dictation doctor={doctor} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/note" element={
        <ProtectedRoute>
          <NoteDisplay doctor={doctor} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <PatientHistory doctor={doctor} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/history/:id" element={
        <ProtectedRoute>
          <PatientHistory doctor={doctor} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}